/* eslint-disable */

'use strict'
// 数字 prototype 开始--------------
const getPrecision = (a = 0) => ((a.toString().split('.')[1] || []).length)

// 乘
Number.prototype.mul = function (b) {
  var snReg = /[eE]+/
  var d = this.toString()
  var e = b.toString()
  if (snReg.test(d) || snReg.test(e)) {
    return this * b
  }

  var c = 0
  c += getPrecision(d)
  c += getPrecision(e)
  return Number(d.replace('.', '')) * Number(e.replace('.', '')) / Math.pow(10, c)
}

// 除
Number.prototype.div = function (arg) {
  var l1 = this.toString().indexOf('.') > 0 ? this.toString().split(".")[1].length : 0
  var l2 = arg.toString().indexOf('.') > 0 ? arg.toString().split(".")[1].length : 0

  var r1 = Number(this.toString().replace(".", ""))
  var r2 = Number(arg.toString().replace(".", ""))
  return (r1 / r2) * window.Math.pow(10, l2 - l1)
}

// 加
Number.prototype.add = function (b) {
  var c, d, e
  c =getPrecision(this)
  d = getPrecision(b)
  return e = Math.pow(10, Math.max(c, d)), (this.mul(e) + b.mul(e)) / e
}

// 减
Number.prototype.sub = function (b) {
  var c = getPrecision(this)
  var d = getPrecision(b)
  var e = Math.pow(10, Math.max(c, d))
  return (this.mul(e) - Number(b).mul(e)) / e
}

// 向下保留几位小数
Number.prototype.toDecimal = function (digit) {
  if (window.parseFloat(this).toString() === 'NaN') {
    return ''
  }

  if (!digit) {
    if (this.toString().indexOf('.') > 0) {
      const numArr = this.toString().split('.')
      return numArr[0]
    }
    return this
  }

  if (this.toString().indexOf('.') > 0) {
    const numArr = this.toString().split('.')

    if (numArr[1].length > digit) {
      return `${numArr[0]}.${numArr[1].slice(0, digit)}`
    }

    if (numArr[1].length === digit) {
      return this
    }

    const floating = '0'.repeat(digit - numArr[1].length)
    return `${numArr[0]}.${numArr[1]}${floating}`
  }

  return `${this}.${'0'.repeat(digit)}`
}

// 数字 prototype 结束----------------
