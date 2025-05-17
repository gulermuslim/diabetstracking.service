const swaggerAutogen = require('swagger-autogen');
const dotenv = require('dotenv');

dotenv.config();

const doc = {
    info: {
        title: 'FIX-LEAN SCHEDULER API',
        description: 'FIX-LEAN SCHEDULER SERVICES',
    },
    host: process.env.HOST,
    
};

const options = {
    disableLogs: false,
    autoHeaders: true,
    writeOutputFile: true,
    autoQuery: true,
    autoBody: true,
};

const generateSwagger = swaggerAutogen(options);

const swaggerFile = "swagger_output.json";
const apiRouteFile = ["./index.js"];

generateSwagger(swaggerFile, apiRouteFile, doc);
