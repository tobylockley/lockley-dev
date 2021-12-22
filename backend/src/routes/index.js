import express from "express"

const router = express.Router()

router.get("/", (req, res) => {
  res.send("lockley.dev API") // Just to confirm that the server is running
})

router.get("/test", async (req, res) => {
  // await services.user.login(body)
  res.sendStatus(200)
})

router.get("/sync-error", (req, res) => {
  throw new Error("Error from synchronous code!")
})

router.get("/async-error", async (req, res) => {
  const asyncFn = () => {
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        reject(new Error("Async function error!"))
      }, 1000)
    })
  }
  await asyncFn()
  res.json({ msg: "should not see this" })
})

export default router
