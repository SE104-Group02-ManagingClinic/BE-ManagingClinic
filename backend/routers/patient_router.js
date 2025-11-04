// Liên quan đến bệnh nhân: 
// + Tạo profile cho bệnh nhân, 
// + tra cứu, 
// tạo phiếu khám bệnh, 
// tạo hóa đơn thanh toán
const router = requir('express').Router();
const patientController = require('../controllers/patient_controller');

/**
 * @swagger
 * tags:
 *   name: Patient
 *   description: Các API liên quan tới bệnh nhân
 */