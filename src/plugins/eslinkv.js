(function (global, factory) {
	typeof exports === 'object' && typeof module !== 'undefined' ? module.exports = factory() :
		typeof define === 'function' && define.amd ? define(factory) :
			(global = global || self, global.eslinkV = factory())
}(this, function () {
	function eslinkV(options) {
		if (!(this instanceof eslinkV)) {
			warn('eslinkV is a constructor and should be called with the `new` keyword')
		}
		this._init(options)
	}

	eslinkV.prototype._init = function (options) {
		
	}

	return eslinkV
})
