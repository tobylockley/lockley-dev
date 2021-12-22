import AppError from "./AppError.js"

class ForbiddenError extends AppError {
  constructor(message) {
    super()
    this.name = "ForbiddenError"
    this.message = `Access Denied${message ? `: ${message}` : ""}`
  }
}

export default ForbiddenError
