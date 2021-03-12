const express = require("express");
const bodyParser = require("body-parser");
const cors = require("cors");
const axios = require("axios");
const qs = require("qs");


require('dotenv').config()




const app = express();
app.use(cors({ origin: "*" }));

const API_PORT = 3001;


// bodyParser, parses the request body to be a readable json format
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

const getAuth = async () => {
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
  
    try {
      const response = await axios
        .post(
          "https://accounts.spotify.com/api/token",
          qs.stringify(data),
          headers
        )
        .then(res => {
          console.log(res.data.access_token);
          axios
            .get("https://api.spotify.com/v1/playlists/37i9dQZF1DXcBWIGoYBM5M", {
              headers: {
                Authorization: "Bearer " + res.data.access_token
              }
            })
            .then(res => {
            console.log(res.data.tracks.items[1].track)
          });
        });
  
      //console.log(response.data.access_token);
      //return response.data.access_token;
    } catch (error) {
      console.log(error);
    }
  };

  getAuth();


// launch our backend into a port
app.listen(API_PORT, () => console.log(`LISTENING ON PORT ${API_PORT}`));