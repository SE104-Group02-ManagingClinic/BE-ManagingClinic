const router = require('express').Router();
const medicalExamFormController = require('../controllers/medical_exam_form_controller');

/**
 * @swagger
 * tags:
 *   name: MedicalExamForm
 *   description: Các API liên quan đến Phiếu khám bệnh.
 */

/**
 * @swagger
 * /medicalExamForm/createMedicalExamForm:
 *   post:
 *     summary: Tạo phiếu khám bệnh (PKB)
 *     description: API dùng để tạo mới phiếu khám bệnh cho bệnh nhân, bao gồm triệu chứng, danh sách bệnh và thuốc. Nếu bệnh nhân không tồn tại, trả về lỗi 409.
 *     tags:
 *       - MedicalExamForm
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               MaBN:
 *                 type: string
 *                 example: "BN001"
 *               NgayKham:
 *                 type: string
 *                 format: date
 *                 example: "2025-12-13"
 *               TrieuChung:
 *                 type: string
 *                 example: "Ho, sốt, đau đầu"
 *               CT_Benh:
 *                 type: array
 *                 items:
 *                   type: string
 *                   example: "B0001"
 *               CT_Thuoc:
 *                 type: array
 *                 items:
 *                   type: object
 *                   properties:
 *                     MaThuoc:
 *                       type: string
 *                       example: "T0001"
 *                     SoLuong:
 *                       type: integer
 *                       example: 2
 *                     DonGiaBan:
 *                       type: number
 *                       example: 50000
 *                     ThanhTien:
 *                       type: number
 *                       example: 100000
 *               TongTienThuoc:
 *                 type: number
 *                 example: 200000
 *     responses:
 *       201:
 *         description: Tạo phiếu khám bệnh thành công
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Tạo thành công phiếu khám bệnh"
 *                 MaPKB:
 *                   type: string
 *                   example: "PKB00001"
 *       409:
 *         description: Bệnh nhân không tồn tại
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Bệnh nhân không tồn tại"
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
router.post('/createMedicalExamForm', medicalExamFormController.createMedicalExamForm);

/**
 * @swagger
 * /medicalExamForm/updateMedicalExamForm/{MaPKB}:
 *   put:
 *     summary: Cập nhật phiếu khám bệnh (PKB)
 *     description: API dùng để cập nhật phiếu khám bệnh theo mã PKB, bao gồm thông tin bệnh nhân, triệu chứng, danh sách bệnh, thuốc và tổng tiền thuốc.
 *     tags:
 *       - MedicalExamForm
 *     parameters:
 *       - in: path
 *         name: MaPKB
 *         required: true
 *         schema:
 *           type: string
 *         description: Mã phiếu khám bệnh cần cập nhật
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               MaBN:
 *                 type: string
 *                 example: "BN001"
 *               NgayKham:
 *                 type: string
 *                 format: date
 *                 example: "2025-12-13"
 *               TrieuChung:
 *                 type: string
 *                 example: "Ho, sốt, đau đầu"
 *               CT_Benh:
 *                 type: array
 *                 items:
 *                   type: string
 *                   example: "B0001"
 *               CT_Thuoc:
 *                 type: array
 *                 items:
 *                   type: object
 *                   properties:
 *                     MaThuoc:
 *                       type: string
 *                       example: "T0001"
 *                     SoLuong:
 *                       type: integer
 *                       example: 2
 *                     DonGiaBan:
 *                       type: number
 *                       example: 50000
 *                     ThanhTien:
 *                       type: number
 *                       example: 100000
 *               TongTienThuoc:
 *                 type: number
 *                 example: 200000
 *     responses:
 *       200:
 *         description: Cập nhật phiếu khám bệnh thành công
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: string
 *                   example: "Cập nhật thành công"
 *       409:
 *         description: Bệnh nhân không tồn tại
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Bệnh nhân không tồn tại"
 *       500:
 *         description: Lỗi hệ thống hoặc cập nhật thất bại
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 *                   example: "Internal Server Error"
 */
router.put('/updateMedicalExamForm/:MaPKB', medicalExamFormController.updateMedicalExamForm);

/**
 * @swagger
 * /medicalExamForm/deleteMedicalExamForm/{MaPKB}:
 *   delete:
 *     summary: Xóa phiếu khám bệnh (PKB)
 *     description: API dùng để xóa phiếu khám bệnh dựa trên mã PKB.
 *     tags:
 *       - MedicalExamForm
 *     parameters:
 *       - in: path
 *         name: MaPKB
 *         required: true
 *         schema:
 *           type: string
 *         description: Mã phiếu khám bệnh cần xóa
 *     responses:
 *       200:
 *         description: Xóa phiếu khám bệnh thành công
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: string
 *                   example: "Xóa thành công"
 *       400:
 *         description: Xóa không thành công hoặc dữ liệu không hợp lệ
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
router.delete('/deleteMedicalExamForm/:MaPKB', medicalExamFormController.deleteMedicalExamForm);

/**
 * @swagger
 * /medicalExamForm/getExamsFormByDate/{NgayKham}:
 *   get:
 *     summary: Lấy danh sách phiếu khám bệnh theo ngày khám
 *     description: API trả về danh sách phiếu khám bệnh theo ngày khám, bao gồm thông tin bệnh nhân và triệu chứng.
 *     tags:
 *       - MedicalExamForm
 *     parameters:
 *       - in: path
 *         name: NgayKham
 *         required: true
 *         schema:
 *           type: string
 *           format: date
 *         description: Ngày khám cần lấy danh sách phiếu khám bệnh (yyyy-MM-dd)
 *         example: "2025-12-13"
 *     responses:
 *       200:
 *         description: Thành công - trả về danh sách phiếu khám bệnh theo ngày khám
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: object
 *                 properties:
 *                   MaPKB:
 *                     type: string
 *                     example: "PKB00001"
 *                   MaBN:
 *                     type: string
 *                     example: "BN001"
 *                   HoTen:
 *                     type: string
 *                     example: "Nguyễn Văn A"
 *                   CCCD:
 *                     type: string
 *                     example: "012345678901"
 *                   TrieuChung:
 *                     type: string
 *                     example: "Ho, sốt, đau đầu"
 *                   TongTienThuoc:
 *                     type: number
 *                     example: 200000
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
router.get('/getExamsFormByDate/:NgayKham', medicalExamFormController.getExamFormsByDate);

/**
 * @swagger
 * /medicalExamForm/getExamFormById/{MaPKB}:
 *   get:
 *     summary: Lấy thông tin phiếu khám bệnh theo mã PKB
 *     description: API trả về thông tin chi tiết của phiếu khám bệnh, bao gồm thông tin bệnh nhân, danh sách bệnh và danh sách thuốc.
 *     tags:
 *       - MedicalExamForm
 *     parameters:
 *       - in: path
 *         name: MaPKB
 *         required: true
 *         schema:
 *           type: string
 *         description: Mã phiếu khám bệnh cần lấy thông tin
 *         example: "PKB00001"
 *     responses:
 *       200:
 *         description: Thành công - trả về thông tin phiếu khám bệnh
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 MaPKB:
 *                   type: string
 *                   example: "PKB00001"
 *                 MaBN:
 *                   type: string
 *                   example: "BN001"
 *                 HoTen:
 *                   type: string
 *                   example: "Nguyễn Văn A"
 *                 CCCD:
 *                   type: string
 *                   example: "012345678901"
 *                 NgayKham:
 *                   type: string
 *                   format: date
 *                   example: "2025-12-13"
 *                 TrieuChung:
 *                   type: string
 *                   example: "Ho, sốt, đau đầu"
 *                 TongTienThuoc:
 *                   type: number
 *                   example: 200000
 *                 CT_Benh:
 *                   type: array
 *                   items:
 *                     type: object
 *                     properties:
 *                       MaBenh:
 *                         type: string
 *                         example: "B0001"
 *                       TenBenh:
 *                         type: string
 *                         example: "Cúm"
 *                 CT_Thuoc:
 *                   type: array
 *                   items:
 *                     type: object
 *                     properties:
 *                       MaThuoc:
 *                         type: string
 *                         example: "T0001"
 *                       TenThuoc:
 *                         type: string
 *                         example: "Paracetamol"
 *                       SoLuong:
 *                         type: integer
 *                         example: 2
 *                       DonGiaBan:
 *                         type: number
 *                         example: 50000
 *                       ThanhTien:
 *                         type: number
 *                         example: 100000
 *       404:
 *         description: Không tìm thấy phiếu khám bệnh
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Không tìm thấy"
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
router.get('/getExamFormById/:MaPKB', medicalExamFormController.getExamFormById);
module.exports = router;