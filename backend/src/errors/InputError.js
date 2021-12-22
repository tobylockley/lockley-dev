import AppError from "./AppError.js"

class InputError extends AppError {
  constructor(message) {
    super()
    this.name = "InputError"
    this.message = `Invalid Input${message ? `: ${message}` : ""}`
  }
}

export default InputError
