require("dotenv").config();
const express = require('express');
const swaggerUi = require('swagger-ui-express');
const swaggerSpec = require('./docs/swagger');
const patientRouter = require('./controllers/patient_controller');
const medicineRouter = require('./controllers/medicine_controller');
const diseaseRouter = require('./controllers/disease_controller');

const app = express();

// Url api để mở UI Swagger (thấy được mô tả các API)
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec));  

// Url api liên quan đến bệnh nhân
app.use('/api/patient', patientRouter);

// Url liên quan đến tạo thuốc, lấy danh sách thuốc, lập phiếu nhập thuốc
app.use('/api/medicine', medicineRouter);

// Url liên quan đến tạo danh sách bệnh, ...
app.use('/api/disease', diseaseRouter);

module.exports = app;