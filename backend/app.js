require("dotenv").config();
const express = require('express');
const body_parser = require("body-parser");
const swaggerUi = require('swagger-ui-express');
const swaggerSpec = require('./docs/swagger');

const argumentRouter = require('./routers/argument_router');
const usageRouter = require('./routers/usage_router');
const diseaseRouter = require('./routers/disease_router');
const patientRouter = require('./routers/patient_router');
const functionRouter = require('./routers/function_router');
const groupUserRouter = require('./routers/groupuser_router');
const userRouter = require('./routers/user_router');
const permissionRouter = require('./routers/permission_router');
const unitRouter = require('./routers/unit_router');
const medicineRouter = require('./routers/medicine_router');
const medicineImportRouter = require('./routers/medicineImport_router');
const medicalExamFormRouter = require('./routers/medical_exam_form_router');
const medicineUsageReport = require('./routers/medicineUsageReport_router');
const revenueReport = require('./routers/revenueReport_router');
const invoiceRouter = require('./routers/invoice_router');

const app = express();
app.use(body_parser.json());

// Url api để mở UI Swagger (thấy được mô tả các API)
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec));  

app.use('/api/argument', argumentRouter);
app.use('/api/usage', usageRouter);
app.use('/api/disease', diseaseRouter);
app.use('/api/patient', patientRouter);
app.use('/api/function', functionRouter);
app.use('/api/groupUser', groupUserRouter);
app.use('/api/user', userRouter);
app.use('/api/permission', permissionRouter);
app.use('/api/unit', unitRouter);
app.use('/api/medicine', medicineRouter);
app.use('/api/medicineImport', medicineImportRouter);
app.use('/api/medicalExamForm', medicalExamFormRouter);
app.use('/api/medicineUsageReport', medicineUsageReport);
app.use('/api/revenueReport', revenueReport);
app.use('/api/invoice', invoiceRouter);

module.exports = app;