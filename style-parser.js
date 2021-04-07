const getUnit = (unit = '') => {
	if (unit.indexOf('/') === -1) return [unit, unit]
	return unit.split('/')
}

const styleParser = function (layout) {
	const style = []
	const { size, position, background, zIndex } = layout || {}

	if (size) {
		const { width, height, widthUnit, heightUnit, unit = 'px' } = size
		const units = getUnit(unit)
		width && style.push(`width:${width}${widthUnit || units[0]}`)
		height && style.push(`height:${height}${heightUnit || units[1]}`)
	}

	if (background) {
		const {
			url,
			size,
			position,
			repeat,
			blendMode,
			contentBlendMode,
			color,
		} = background
		url && style.push(`background-image:url(${url})`)
		size && style.push(`background-size:${size}`)
		position && style.push(`background-position:${position}`)
		repeat && style.push(`background-repeat:${repeat}`)
		blendMode && style.push(`background-blend-mode:${blendMode}`)
		contentBlendMode && style.push(`mix-blend-mode:${contentBlendMode}`)
		color && style.push(`background-color:${color}`)
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

	zIndex && style.push(`z-index:${zIndex}`)

	return style.join(';')
}
export default styleParser
