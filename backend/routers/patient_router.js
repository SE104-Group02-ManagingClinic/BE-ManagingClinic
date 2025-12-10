// Liên quan đến bệnh nhân: 
// + Tạo profile cho bệnh nhân, 
// + tra cứu, 
// tạo phiếu khám bệnh, 
// tạo hóa đơn thanh toán
const router = require('express').Router();
const patientController = require('../controllers/patient_controller');

/**
 * @swagger
 * tags:
 *   name: Patient
 *   description: Các API liên quan tới bệnh nhân
 */

/**
 * @swagger
 * /patient/createPatient:
 *   post:
 *     summary: Tạo mới bệnh nhân
 *     description: API để tạo mới bệnh nhân trong hệ thống.
 *     tags:
 *       - Patient
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               HoTen:
 *                 type: string
 *                 maxLength: 40
 *                 example: "Nguyen Van A"
 *               CCCD:
 *                 type: string
 *                 maxLength: 12
 *                 example: "012345678901"
 *               GioiTinh:
 *                 type: string
 *                 maxLength: 5
 *                 example: "Nam"
 *               NamSinh:
 *                 type: string
 *                 format: date
 *                 example: "1990-01-01"
 *               DiaChi:
 *                 type: string
 *                 maxLength: 100
 *                 example: "123 Đường ABC, Quận 1, TP.HCM"
 *               SDT:
 *                 type: string
 *                 maxLength: 10
 *                 example: "0901234567"
 *     responses:
 *       201:
 *         description: Bệnh nhân được tạo thành công
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 MaBN:
 *                   type: string
 *                   maxLength: 5
 *                   example: "BN001"
 *                 HoTen:
 *                   type: string
 *                   example: "Nguyen Van A"
 *                 CCCD:
 *                   type: string
 *                   example: "012345678901"
 *                 GioiTinh:
 *                   type: string
 *                   example: "Nam"
 *                 NamSinh:
 *                   type: string
 *                   format: date
 *                   example: "1990-01-01"
 *                 DiaChi:
 *                   type: string
 *                   example: "123 Đường ABC, Quận 1, TP.HCM"
 *                 SDT:
 *                   type: string
 *                   example: "0901234567"
 *       409:
 *         description: Bệnh nhân đã tồn tại
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Bệnh nhân đã tồn tại"
 *       500:
 *         description: Lỗi hệ thống
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 *                   example: "Internal Server Error"
 */

router.post('/createPatient', patientController.createPatient);

/**
 * @swagger
 * /patient/searchPatient/{cccd}:
 *   get:
 *     summary: Tra cứu thông tin bệnh nhân
 *     description: API tra cứu bệnh nhân theo số CCCD.
 *     tags:
 *       - Patient
 *     parameters:
 *       - in: path
 *         name: cccd
 *         required: true
 *         schema:
 *           type: string
 *           example: "012345678901"
 *         description: Số CCCD của bệnh nhân
 *     responses:
 *       200:
 *         description: Thông tin bệnh nhân tìm thấy
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: object
 *                 properties:
 *                   MaBN:
 *                     type: string
 *                     example: "BN001"
 *                   HoTen:
 *                     type: string
 *                     example: "Nguyen Van A"
 *                   CCCD:
 *                     type: string
 *                     example: "012345678901"
 *                   GioiTinh:
 *                     type: string
 *                     example: "Nam"
 *                   NamSinh:
 *                     type: string
 *                     format: date
 *                     example: "1990-01-01"
 *                   DiaChi:
 *                     type: string
 *                     example: "123 Đường ABC, Quận 1, TP.HCM"
 *                   SDT:
 *                     type: string
 *                     example: "0901234567"
 *       400:
 *         description: Thiếu hoặc rỗng CCCD
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "CCCD patient is empty"
 *       404:
 *         description: Không tìm thấy bệnh nhân
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Not found."
 *       500:
 *         description: Lỗi hệ thống
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 *                   example: "Internal Server Error"
 */
router.get('/searchPatient/:cccd', patientController.searchPatient);
/**
 * @swagger
 * /patient/updatePatient/{MaBN}:
 *   put:
 *     summary: Cập nhật thông tin bệnh nhân
 *     description: API cập nhật thông tin bệnh nhân theo mã bệnh nhân (MaBN).
 *     tags:
 *       - Patient
 *     parameters:
 *       - in: path
 *         name: MaBN
 *         required: true
 *         schema:
 *           type: string
 *           example: "BN001"
 *         description: Mã bệnh nhân cần cập nhật
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               HoTen:
 *                 type: string
 *                 example: "Nguyen Van A"
 *               CCCD:
 *                 type: string
 *                 example: "012345678901"
 *               GioiTinh:
 *                 type: string
 *                 example: "Nam"
 *               NamSinh:
 *                 type: string
 *                 format: date
 *                 example: "1990-01-01"
 *               DiaChi:
 *                 type: string
 *                 example: "123 Đường ABC, Quận 1, TP.HCM"
 *               SDT:
 *                 type: string
 *                 example: "0901234567"
 *     responses:
 *       200:
 *         description: Cập nhật thành công
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: string
 *                   example: "Cập nhật thành công"
 *       400:
 *         description: Thông tin không thay đổi hoặc dữ liệu không hợp lệ
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Thông tin không thay đổi"
 *       500:
 *         description: Lỗi hệ thống
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 *                   example: "Internal Server Error"
 */
router.put('/updatePatient/:MaBN', patientController.updatePatient);

/**
 * @swagger
 * /patient/deletePatient/{MaBN}:
 *   delete:
 *     summary: Xóa bệnh nhân
 *     description: API xóa bệnh nhân theo mã bệnh nhân (MaBN).
 *     tags:
 *       - Patient
 *     parameters:
 *       - in: path
 *         name: MaBN
 *         required: true
 *         schema:
 *           type: string
 *           example: "BN001"
 *         description: Mã bệnh nhân cần xóa
 *     responses:
 *       200:
 *         description: Xóa thành công
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: string
 *                   example: "Xóa thành công"
 *       400:
 *         description: Xóa không thành công (ví dụ bệnh nhân không tồn tại hoặc dữ liệu không hợp lệ)
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Xóa không thành công"
 *       500:
 *         description: Lỗi hệ thống
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 *                   example: "Internal Server Error"
 */
router.delete('/deletePatient/:MaBN', patientController.deletePatient);
module.exports = router;