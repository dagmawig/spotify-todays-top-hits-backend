const express = require("express");
const bodyParser = require("body-parser");
const cors = require("cors");
const axios = require("axios");
const qs = require("qs");

require('dotenv').config()

const app = express();
app.use(cors({ origin: "*" }));

const API_PORT = 3001;

const router = express.Router();

// bodyParser, parses the request body to be a readable json format
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());


// function use to get spotify token
const getToken = async () => {
  const clientID = process.env.clientID;
  const clientSecret = process.env.clientSecret;

  const headers = {
    headers: {
      Accept: "application/json",
      "Content-Type": "application/x-www-form-urlencoded"
    },
    auth: {
      username: clientID,
      password: clientSecret
    }
  };
  const data = {
    grant_type: "client_credentials"
  };

  const response = await axios
    .post(
      "https://accounts.spotify.com/api/token",
      qs.stringify(data),
      headers
    )
  let token = response.data.access_token
  console.log(token)
  return token;
};

// router used to get spotify today's top hits playlist.
router.get("/todaysTop", (req, resp) => {
  getToken()
    .then(res => {
      axios.get("https://api.spotify.com/v1/playlists/37i9dQZF1DXcBWIGoYBM5M", {
        headers: {
          Authorization: "Bearer " + res
        }
      }).then(data => {
        return resp.json({ success: true, data: data.data });
      })

    });
})

// router used to get song features for a given list of track IDs.
router.post("/trackFeature", (req, resp) => {
  console.log("it gets to feature router");
  const { trackID } = req.body;
  let url = "https://api.spotify.com/v1/audio-features?ids=" + trackID.join("%2C");
  console.log(url);
  getToken()
    .then(res => {
      axios.get(url, {
        headers: {
          Authorization: "Bearer " + res
        }
      }).then(data => {
        return resp.json({ success: true, data: data.data });
      }).catch((e) => {
        console.log(e);
      })
    })
})

// append /api for our http requests
app.use("/", router);

// launch our backend into a port
app.listen(API_PORT, () => console.log(`LISTENING ON PORT ${API_PORT}`));