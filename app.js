const express = require("express");


const app = express();
const API_PORT = 3001;





// launch our backend into a port
app.listen(API_PORT, () => console.log(`LISTENING ON PORT ${API_PORT}`));