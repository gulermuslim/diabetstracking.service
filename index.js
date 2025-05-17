
const express = require('express');
const axios = require('axios');
const bodyParser = require('body-parser');
const cors = require('cors');


const fs = require("fs");
const _ = require("lodash");
require("dotenv").config();
axios.defaults.httpsAgent = new (require("https").Agent)({ rejectUnauthorized: false });
process.env.NODE_TLS_REJECT_UNAUTHORIZED = '0';

const path = require('path')
const swaggerUi = require("swagger-ui-express");
const swaggerFile = require("./swagger_output.json");
const logger = require("./logger");
const userController = require("./controller/usercontroller");

const server = express();

server.use(cors())
server.use(bodyParser.json({ limit: "200mb", extended: true }));
server.use(bodyParser.urlencoded({ limit: "200mb", extended: true }));
server.use(bodyParser.text({ limit: "200mb" }));

server.use("/user", userController);
server.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerFile))

server.listen(process.env.PORT, () => {
    console.log('Server running on port ' + process.env.PORT);
  });

  module.exports = server;