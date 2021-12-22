import express from "express"
import fetch from "node-fetch"
import AppError from "../errors/AppError.js"
import AuthError from "../errors/AuthError.js"

const router = express.Router()
const client_id = "9f887dea083e483190d116bb292a8c91"
const client_secret = "8d1ae03358a748269d4788e69238d2fd"
// const client_id = "04e73081ac8b4a8d8dbf8c382f7a95c6"
// const client_secret = "230ab7aebb37416aac927669376c7bd7"
const creds = Buffer.from(`${client_id}:${client_secret}`).toString("base64")
const apiUrl = "https://api.spotify.com/v1"

let accessToken
let accessTokenExpiry

router.get("/authorize", (req, res) => {
  const scope = "user-read-playback-state playlist-modify-private playlist-modify-public"
  const redirect_uri = "https://tobylockley.github.io/spotiauth/"
  const url = new URL("https://accounts.spotify.com/authorize")
  url.searchParams.append("client_id", client_id)
  url.searchParams.append("response_type", "code")
  url.searchParams.append("scope", scope)
  url.searchParams.append("redirect_uri", redirect_uri)
  res.redirect(url.href)
})

router.get("/access", async (req, res) => {
  const json = await getRefreshToken()
  res.json(json)
})

// Flow = 7hbsQklMmnLoJW42gfmkab
router.get("/save-song", async (req, res) => {
  const playlistId = req.query.playlist
  if (!playlistId) return res.send("Please supply playlist query param")

  // Ensure accessToken is valid
  await getAccessToken()

  // Get currently playing song
  const currentSong = await getCurrentSong()
  if (!currentSong) return res.send("No song playing")

  // Check it doesn't already exists in the playlist
  const inPlaylist = await isSongInPlaylist(currentSong, playlistId)
  if (inPlaylist) return res.send("Already saved")

  // Add song to playlist
  await addSongToPlaylist(currentSong, playlistId)
  res.send("Done")
})

export default router

async function getCurrentSong() {
  const response = await fetch(`${apiUrl}/me/player/currently-playing`, {
    headers: { Authorization: `Bearer ${accessToken}` },
  })
  if (response.status === 204) return null
  const json = await response.json()
  return json.item
}

async function isSongInPlaylist(song, playlistId) {
  let next = null
  while (true) {
    const url = next || `${apiUrl}/playlists/${playlistId}/tracks`
    const response = await fetch(url, {
      headers: { Authorization: `Bearer ${accessToken}` },
    })
    const json = await response.json()
    if (json.next) console.log(json)
    for (const item of json.items) {
      if (item.track.id === song.id) {
        return true
      }
    }
    if (json.next) next = json.next
    else return false
  }
}

async function addSongToPlaylist(song, playlistId) {
  const url = new URL(`${apiUrl}/playlists/${playlistId}/tracks`)
  url.searchParams.append("uris", song.uri)
  const response = await fetch(url.href, {
    method: "POST",
    headers: { Authorization: `Bearer ${accessToken}` },
  })
  if (response.status !== 201) {
    throw new AppError(response.statusText)
  }
}

async function getRefreshToken() {
  const code =
    "AQDDMvtebe1djMdEZdOtGuUor2XRUPWAr8Kbk9ZF44Y4W7W7oXbzvIhmRrX0GkYR2lUWLz9J_qKeS02ZsYhKuE7y_pKZTuOZBS41fAU8FZJukb1Z4IzJ_7u_Rt-il3wAULIJixWYkGPzWJpcE_ugfgt_GCv22wFqvoVJcSKBVB5LK8LPefNYVE_h8C_4PX6cHXczAqxwfd-Uh-U1CikoG9np_6OvjkjkM2jJVMMq7IKq2XfngaUMESX1lb1w2VbVn2YCmj8SWwWIAQNvYbVXtMARHL8SxiY"

  const params = new URLSearchParams()
  params.append("grant_type", "authorization_code")
  params.append("code", code)
  params.append("redirect_uri", "https://tobylockley.github.io/spotiauth/")

  const response = await fetch("https://accounts.spotify.com/api/token", {
    method: "POST",
    headers: { Authorization: `Basic ${creds}` },
    body: params,
  })
  const json = await response.json()
  return json
}

async function getAccessToken() {
  const refreshToken =
    "AQBwai-jBnYfeysX9DIpzkVV5JNPqoomhYUyuvniP-XIzwpzyxVm1zFlCQIXyHdb-gWYMLE4kkkBxAyZlKsBr2AOgPWP3sTkRn-4QeWfg2Ku3ErEBqKFhek1nERI4IySfKA"

  // Check if accessToken is still valid. Subtract 60 secs for safety.
  if (accessTokenExpiry && new Date().getTime() < accessTokenExpiry - 60000) {
    return
  }

  const params = new URLSearchParams()
  params.append("grant_type", "refresh_token")
  params.append("refresh_token", refreshToken)

  const response = await fetch("https://accounts.spotify.com/api/token", {
    method: "POST",
    headers: { Authorization: `Basic ${creds}` },
    body: params,
  })
  const json = await response.json()
  if (json.error) throw new AuthError(json.error_description)
  accessToken = json.access_token
  accessTokenExpiry = new Date().getTime() + 1000 * json.expires_in
}
