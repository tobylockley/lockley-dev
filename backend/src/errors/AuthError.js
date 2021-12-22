import AppError from "./AppError.js"

class AuthError extends AppError {
  constructor(message) {
    super()
    this.name = "AuthError"
    this.message = `Authentication Error${message ? `: ${message}` : ""}`
  }
}

export default AuthError
