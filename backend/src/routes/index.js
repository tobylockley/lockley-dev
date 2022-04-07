import express from "express";
import spotify from "./spotify.js";

const router = express.Router();

router.get("/", (req, res) => {
  res.send("lockley.dev API"); // Just to confirm that the server is running
});

router.use("/spotify", spotify);

export default router;
