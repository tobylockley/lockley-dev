// import cors from "cors"
import express from "express"
import "express-async-errors"
import routes from "./routes/index.js"
import errorHandler from "./errors/errorHandler.js"

const app = express()
const port = process.env.PORT || 3000

// app.use(cors)
app.use(express.json())
app.use(routes)
app.use(errorHandler)

app.listen(port, () => {
  console.log(`App listening at http://localhost:${port}`)
})
