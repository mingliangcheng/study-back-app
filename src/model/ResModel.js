/**
 * @description 定义响应成功和错误的模型
 */
class baseModel {
  constructor({ data, message, code }) {
    this.code = code
    if (data) {
      this.data = data
    }
    if (message) {
      this.message = message
    }
  }
}

class SuccessModel extends baseModel {
  constructor(data = {}) {
    super({
      code: 200,
      data
    })
  }
}
class ErrorModel extends baseModel {
  constructor({ code, message }) {
    super({
      code,
      message
    })
  }
}

module.exports = {
  SuccessModel,
  ErrorModel
}