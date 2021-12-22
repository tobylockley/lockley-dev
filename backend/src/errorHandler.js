import AppError from "./errors/AppError.js"
import AuthError from "./errors/AuthError.js"
import ConflictError from "./errors/ConflictError.js"
import ForbiddenError from "./errors/ForbiddenError.js"
import NotFoundError from "./errors/NotFoundError.js"

function errorHandler(err, req, res, next) {
  switch (true) {
    case err instanceof AppError:
      return res.status(400).send(err.message)

    case err instanceof AuthError:
      return res.status(401).send(err.message)

    case err instanceof ForbiddenError:
      return res.status(403).send(err.message)

    case err instanceof NotFoundError:
      return res.status(404).send(err.message)

    case err instanceof ConflictError:
      return res.status(409).send(err.message)

    default:
      console.error(err.message)
      return res.sendStatus(500)
  }
}

export default errorHandler
