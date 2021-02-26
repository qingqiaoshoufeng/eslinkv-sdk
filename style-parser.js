const getUnit = (unit = '') => {
    if (unit.indexOf('/') === -1) return [unit, unit]
    return unit.split('/')
}

// todo 改造
const styleParser = function (layout, updateTime = Date.now()) {
    const style = []
    const {
        size,
        position,
        zIndex,
        font,
        background,
        border,
        padding,
        margin,
        opacity,
        shadow,
        // transform
        // transition
        // cursor
        // outline
        // …
        custom
    } = layout || {}

    if (size) {
        const { width, height, widthUnit, heightUnit, unit = 'px', range } = size
        const units = getUnit(unit)
        width && style.push(`width:${width}${widthUnit || units[0]}`)
        height && style.push(`height:${height}${heightUnit || units[1]}`)
        if (range) {
            const { maxWidth, maxHeight, minWidth, minHeight, rangeUnit } = range
            const rangeUnits = getUnit(rangeUnit)
            maxWidth && style.push(`max-width:${maxWidth}${widthUnit || rangeUnits[0] || units[0]}`)
            minWidth && style.push(`min-width:${minWidth}${widthUnit || rangeUnits[0] || units[0]}`)
            maxHeight && style.push(`max-height:${maxHeight}${heightUnit || rangeUnits[1] || units[1]}`)
            minHeight && style.push(`min-height:${minHeight}${heightUnit || rangeUnits[1] || units[1]}`)
        }
    }

    if (position) {
        const { value, unit = 'px', left, top, right, bottom } = position
        const units = getUnit(unit)
        value && style.push(`position:${value}`)
        left && style.push(`left:${left}${units[0]}`)
        top && style.push(`top:${top}${units[1]}`)
        right && style.push(`right:${right}${units[0]}`)
        bottom && style.push(`bottom:${bottom}${units[1]}`)
    }

    if (font) {
        const { family, size, unit = 'px', color, lineHeight, lineHeightUnit = '', indent, indentUnit = '', align, weight, letterSpacing, letterSpacingUnit = '', whiteSpace, decorationLine, decorationColor, decorationStyle } = font
        family && style.push(`font-family:${family}`)
        size && style.push(`font-size:${size}${unit}`)
        color && style.push(`color:${color}`)
        lineHeight && style.push(`line-height:${lineHeight}${lineHeightUnit || unit}`)
        indent && style.push(`text-indent:${indent}${indentUnit || unit}`)
        align && style.push(`text-align:${align}`)
        weight && style.push(`font-weight:${weight}`)
        letterSpacing && style.push(`letter-spacing:${letterSpacing}${letterSpacingUnit || unit}`)
        whiteSpace && style.push(`white-space:${whiteSpace}`)
        decorationLine && style.push(`text-decoration-line:${decorationLine}`)
        decorationColor && style.push(`text-decoration-color:${decorationColor}`)
        decorationStyle && style.push(`text-decoration-style:${decorationStyle}`)
    }

    if (background) {
        const { url, size, position, repeat, blendMode, contentBlendMode, color } = background
        url && style.push(`background-image:url(${url}?t=${updateTime})`)
        size && style.push(`background-size:${size}`)
        position && style.push(`background-position:${position}`)
        repeat && style.push(`background-repeat:${repeat}`)
        blendMode && style.push(`background-blend-mode:${blendMode}`)
        contentBlendMode && style.push(`mix-blend-mode:${contentBlendMode}`)
        color && style.push(`background-color:${color}`)
    }

    if (border) {
        const { width, unit = 'px', color, style: borderStyle, topLeftRadius, topRightRadius, bottomRightRadius, bottomLeftRadius, radiusUnit, detail } = border
        if (width) {
            style.push(`border-width:${width}${unit}`)
            color && style.push(`border-color:${color}`)
            borderStyle && style.push(`border-style:${borderStyle}`)
        }
        topLeftRadius && style.push(`border-top-left-radius:${topLeftRadius}${radiusUnit}`)
        topRightRadius && style.push(`border-top-right-radius:${topRightRadius}${radiusUnit}`)
        bottomRightRadius && style.push(`border-bottom-right-radius:${bottomRightRadius}${radiusUnit}`)
        bottomLeftRadius && style.push(`border-bottom-left-radius:${bottomLeftRadius}${radiusUnit}`)
        if (detail) {
            const { leftWidth, leftUnit = '', leftColor, leftStyle, rightWidth, rightUnit = '', rightColor, rightStyle, topWidth, topUnit = '', topColor, topStyle, bottomWidth, bottomUnit = '', bottomColor, bottomStyle } = detail
            leftWidth && style.push(`border-left-width:${leftWidth}${leftUnit || unit}`)
            leftColor && style.push(`border-left-color:${leftColor}`)
            leftStyle && style.push(`border-left-style:${leftStyle}`)
            rightWidth && style.push(`border-right-width:${rightWidth}${rightUnit || unit}`)
            rightColor && style.push(`border-right-color:${rightColor}`)
            rightStyle && style.push(`border-right-style:${rightStyle}`)
            topWidth && style.push(`border-top-width:${topWidth}${topUnit || unit}`)
            topColor && style.push(`border-top-color:${topColor}`)
            topStyle && style.push(`border-top-style:${topStyle}`)
            bottomWidth && style.push(`border-bottom-width:${bottomWidth}${bottomUnit || unit}`)
            bottomColor && style.push(`border-bottom-color:${bottomColor}`)
            bottomStyle && style.push(`border-bottom-style:${bottomStyle}`)
        }
    }

    if (padding) {
        const { value, unit = 'px', detail } = padding
        value && style.push(`padding:${value}${unit}`)
        if (detail) {
            const { left, leftUnit = '', right, rightUnit = '', top, topUnit = '', bottom, bottomUnit = '' } = detail
            left && style.push(`padding-left:${left}${leftUnit || unit}`)
            top && style.push(`padding-top:${top}${rightUnit || unit}`)
            right && style.push(`padding-right:${right}${topUnit || unit}`)
            bottom && style.push(`padding-bottom:${bottom}${bottomUnit || unit}`)
        }
    }

    if (margin) {
        const { value, unit = 'px', detail } = margin
        value && style.push(`margin:${value}${unit}`)
        if (detail) {
            const { left, leftUnit = '', right, rightUnit = '', top, topUnit = '', bottom, bottomUnit = '' } = detail
            left && style.push(`margin-left:${left}${leftUnit || unit}`)
            top && style.push(`margin-top:${top}${rightUnit || unit}`)
            right && style.push(`margin-right:${right}${topUnit || unit}`)
            bottom && style.push(`margin-bottom:${bottom}${bottomUnit || unit}`)
        }
    }

    if (shadow) {
        const { color, offsetX = 0, offsetY = 0, unit = 'px', blurRadius = 5, blurUnit = '', spreadRadius = 0, spreadUnit = '', inset } = shadow
        color && style.push(`box-shadow:${color} ${offsetX}${unit} ${offsetY}${unit} ${blurRadius}${blurUnit || unit} ${spreadRadius}${spreadUnit || unit}${inset ? ' inset' : ''}`)
    }

    zIndex && style.push(`z-index:${zIndex}`)
    opacity < 1 && style.push(`opacity:${opacity}`)

    custom && style.push(custom)

    return style.join(';')
}
export default styleParser
