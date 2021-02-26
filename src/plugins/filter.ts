export const toThousand = value => {
	if (!value) {
		if(typeof value === 'number') return 0
		return ''
	} else {
		return Number(Math.ceil(value)).toLocaleString()
	}
}