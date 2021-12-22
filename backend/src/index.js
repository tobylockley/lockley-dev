// import cors from "cors"
import express from "express"
import router from "./routes.js"
import errorHandler from "./errorHandler.js"

const app = express()
const port = process.env.PORT || 3000

// app.use(cors)
app.use(express.json())
app.use("/", router)
app.use(errorHandler)

app.listen(port, () => {
  console.log(`App listening at http://localhost:${port}`)
})
