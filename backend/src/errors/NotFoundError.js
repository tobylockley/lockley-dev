import AppError from "./AppError.js"

class NotFoundError extends AppError {
  constructor(message) {
    super()
    this.name = "NotFoundError"
    this.message = `Not Found${message ? `: ${message}` : ""}`
  }
}

export default NotFoundError
