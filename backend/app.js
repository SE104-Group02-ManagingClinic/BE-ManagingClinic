require("dotenv").config();
const express = require('express');
const body_parser = require("body-parser");
const swaggerUi = require('swagger-ui-express');
const swaggerSpec = require('./docs/swagger');
const argumentRouter = require('./routers/argument_router');
const diseaseRouter = require('./routers/disease_router');
const patientRouter = require('./routers/patient_router');
const functionRouter = require('./routers/function_router');

const app = express();
app.use(body_parser.json());

// Url api để mở UI Swagger (thấy được mô tả các API)
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec));  

app.use('/api/argument', argumentRouter);

app.use('/api/disease', diseaseRouter);

app.use('/api/patient', patientRouter);

app.use('/api/function', functionRouter);

module.exports = app;