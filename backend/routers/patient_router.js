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
 *     summary: Tra cứu bệnh nhân theo CCCD
 *     description: API dùng để tra cứu thông tin bệnh nhân theo số CCCD. Kết quả trả về bao gồm thông tin bệnh nhân và danh sách phiếu khám bệnh kèm loại bệnh, triệu chứng.
 *     tags:
 *       - Patient
 *     parameters:
 *       - in: path
 *         name: cccd
 *         required: true
 *         schema:
 *           type: string
 *         description: Số CCCD của bệnh nhân
 *         example: "012345678901"
 *     responses:
 *       200:
 *         description: Thành công - trả về thông tin bệnh nhân và danh sách phiếu khám bệnh
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 MaBN:
 *                   type: string
 *                   example: "BN001"
 *                 HoTen:
 *                   type: string
 *                   example: "Nguyễn Văn A"
 *                 CCCD:
 *                   type: string
 *                   example: "012345678901"
 *                 GioiTinh:
 *                   type: string
 *                   example: "Nam"
 *                 NamSinh:
 *                   type: string
 *                   format: date
 *                   example: "1990-05-20"
 *                 DiaChi:
 *                   type: string
 *                   example: "123 Lê Lợi, Quận 1, TP.HCM"
 *                 SDT:
 *                   type: string
 *                   example: "0912345678"
 *                 PhieuKhamBenh:
 *                   type: array
 *                   items:
 *                     type: object
 *                     properties:
 *                       MaPKB:
 *                         type: string
 *                         example: "PKB001"
 *                       NgayKham:
 *                         type: string
 *                         format: date
 *                         example: "2025-12-13"
 *                       TrieuChung:
 *                         type: string
 *                         example: "Ho, sốt, đau đầu"
 *                       Benh:
 *                         type: array
 *                         items:
 *                           type: string
 *                           example: "Cúm"
 *       400:
 *         description: CCCD rỗng hoặc không hợp lệ
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
 *         description: Lỗi hệ thống hoặc truy vấn thất bại
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
 * /patient/getAllPatients:
 *   get:
 *     summary: Lấy danh sách tất cả bệnh nhân
 *     description: API trả về danh sách toàn bộ bệnh nhân trong hệ thống.
 *     tags:
 *       - Patient
 *     responses:
 *       200:
 *         description: Thành công - trả về danh sách bệnh nhân
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
 *                     example: "Nguyễn Văn A"
 *                   CCCD:
 *                     type: string
 *                     example: "012345678901"
 *                   GioiTinh:
 *                     type: string
 *                     example: "Nam"
 *                   NamSinh:
 *                     type: string
 *                     format: date
 *                     example: "1990-05-20"
 *                   DiaChi:
 *                     type: string
 *                     example: "123 Lê Lợi, Quận 1, TP.HCM"
 *                   SDT:
 *                     type: string
 *                     example: "0912345678"
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
router.get('/getAllPatients', patientController.getAllPatients);
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