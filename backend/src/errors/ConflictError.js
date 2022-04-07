import AppError from "./AppError.js";

class ConflictError extends AppError {
  constructor(message) {
    super();
    this.name = "ConflictError";
    this.message = `Conflict Error${message ? `: ${message}` : ""}`;
  }
}

export default ConflictError;
