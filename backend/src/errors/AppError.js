/**
 * Base error which all other errors should extend
 */
class AppError extends Error {
  constructor(message) {
    super();
    this.name = "AppError";
    this.message = `Application Error${message ? `: ${message}` : ""}`;
  }
}

export default AppError;
