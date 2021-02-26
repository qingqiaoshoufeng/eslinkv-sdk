const acorn = require("acorn")
const ASTQ = require("astq")
var MD5 = require('md5.js')
const astq = new ASTQ()
astq.adapter('mozast')

const sandboxCache = Object.create(null)

const defaultDisabledKeywords = [
  'eval', 'window', 'top', 'global', 'self',
  '__proto__', 'prototype', 'constructor',
  'alert', 'with', 'cookie', 'sessionStorage',
  'Function'
]

const defaultInjectObjects = {
  isFinite,
  isNaN,
  parseInt,
  parseFloat,
  Date,
  JSON,
  console,
  Math
}

const getCleanKeywords = (input, exclude) => {
  return input.filter(keyword => !exclude.includes(keyword))
}

const getMergedKeywords = (input) => {
  const output = [...defaultDisabledKeywords]
  input.forEach(item => {
    !output.includes(item) && output.push(item)
  })
  return output
}

const generateAdapter = (key, childProp, keywords, checkProp = 'name', logical = '||') => {
  return keywords.map(keyword => `${key} ${childProp} [@${checkProp} == '${keyword}']`).join(`\n      ${logical} `)
}

const queryKeywords = (sourceAst, keywords) => {
  // Documentation: https://github.com/rse/astq
  const adapter = `
    // Identifier [
      ${generateAdapter('./', '*', keywords)}
    ],
    // Literal [
      ${generateAdapter('./', '*', keywords, 'value')}
    ]
  `
  // console.info(adapter)
  const usedKeywords = Object.create(null)
  astq.query(sourceAst, adapter).forEach(node => {
    // console.info(node)
    const { name, id, value, start } = node
    const key = name || id || value
    if (!key) return
    if (usedKeywords[key]) {
      if (usedKeywords[key].start !== start) usedKeywords[key].count++
    } else {
      usedKeywords[key] = { start, key, count: 1 }
    }
  })
  return Object.values(usedKeywords).map(({ key, count }) => {
    const state = Object.create(null)
    state.name = key
    state.count = count
    return state
  })
}

// todo 处理通过运算符构造对象属性引用的漏洞，例如 []['__' + 'proto__']
function validateSource (source, disabledObjects) {
  const sourceForParse = new Function(source).toString()
  const sourceAst = acorn.parse(sourceForParse, { ecmaVersion: 10 })
  const disabledWords = queryKeywords(sourceAst, disabledObjects, 'object')
  const wordsState = disabledWords.reduce((acc, curr) => {
    const { name, count } = curr
    acc[name] = count
    return acc
  }, Object.create(null))
  // console.info(sourceAst)
  const validate = Object.create(null)
  validate.ok = !disabledWords.length
  validate.wordsState = wordsState
  return validate
}

function buildWall (source) {
  source = `with (wall) { ${source} }`
  return new Function('wall', source)
}

function createWall (boxObject) {
  return new Proxy(boxObject, {
    has: (target, key) => {
      if (!target.hasOwnProperty(key)) {
        throw new Error(`脚本引用了未插入的关键字：${key}，如需使用请通过 options.inject 配置插入。`)
      }
      return target[key]
    }
  })
}

function createSandbox (source, options = {}) {
  try {
    const key = new MD5().update(source).digest('hex')
    if (sandboxCache[key]) return sandboxCache[key]
    const { inject = {}, refused = [] } = options
    let disabledKeywords = getMergedKeywords(refused)
    disabledKeywords = getCleanKeywords(disabledKeywords, Object.keys(inject))
    const validate = validateSource(source, disabledKeywords)
    if (!validate.ok) {
      console.warn('脚本包含不被允许的关键字引用: ', Object.keys(validate.wordsState))
      return
    }
    const injectObjects = { ...inject, ...defaultInjectObjects }
    const func = function () {
      const wall = createWall({ ...injectObjects, ...arguments[0] })
      return buildWall(source).call(wall, wall)
    }
    sandboxCache[key] = func
    return func
  } catch (e) {
    console.info(e.message)
  }
}

export default createSandbox
