const router = require('express').Router();
const medicalExamFormController = require('../controllers/medical_exam_form_controller');

/**
 * @swagger
 * tags:
 *   name: MedicalExamForm
 *   description: Các API liên quan đến Phiếu khám bệnh.
 */

/* =====================================================
   1. TẠO PHIẾU KHÁM BỆNH (CREATE)
   ===================================================== */
/**
 * @swagger
 * /medicalExamForm/createMedicalExamForm:
 *   post:
 *     summary: Tạo phiếu khám bệnh (PKB) và trừ tồn kho
 *     description: |
 *       API tạo phiếu khám bệnh.
 *       
 *       🔹 Chức năng:
 *       - Lưu thông tin phiếu khám bệnh
 *       - Lưu chi tiết bệnh (CT_BENH)
 *       - Lưu chi tiết thuốc (CT_THUOC)
 *       - Trừ tồn kho thuốc theo **MaLo**
 *
 *       ❗ Lưu ý quan trọng:
 *       - **MaLo là bắt buộc**
 *       - Client phải gọi API `/confirmMedicalExamForm` trước
 *         để lấy MaLo hợp lệ
 *     tags:
 *       - MedicalExamForm
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - MaBN
 *               - NgayKham
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
 *                 description: Danh sách mã bệnh
 *                 items:
 *                   type: string
 *                   example: "B0001"
 *               CT_Thuoc:
 *                 type: array
 *                 items:
 *                   type: object
 *                   required:
 *                     - MaThuoc
 *                     - MaLo
 *                     - SoLuong
 *                     - DonGiaBan
 *                   properties:
 *                     MaThuoc:
 *                       type: string
 *                       example: "LT001"
 *                     MaLo:
 *                       type: string
 *                       description: Mã lô đã được confirm
 *                       example: "LO001"
 *                     SoLuong:
 *                       type: integer
 *                       example: 2
 *                     DonGiaBan:
 *                       type: integer
 *                       example: 50000
 *                     ThanhTien:
 *                       type: integer
 *                       description: |
 *                         Thành tiền của thuốc
 *                         = SoLuong × DonGiaBan
 *                       example: 100000
 *               TongTienThuoc:
 *                 type: integer
 *                 example: 100000
 *     responses:
 *       201:
 *         description: Tạo phiếu khám bệnh thành công
 *         content:
 *           application/json:
 *             example:
 *               message: "Tạo phiếu khám thành công"
 *               MaPKB: "PKB00012"
 *       400:
 *         description: Thiếu dữ liệu bắt buộc hoặc dữ liệu không hợp lệ
 *       500:
 *         description: Lỗi hệ thống
 */
router.post(
  '/createMedicalExamForm',
  medicalExamFormController.createMedicalExamForm
);

/* =====================================================
   2. KIỂM TRA THUỐC & LẤY MÃ LÔ (CONFIRM)
   ===================================================== */
/**
 * @swagger
 * /medicalExamForm/confirmMedicalExamForm:
 *   post:
 *     summary: Kiểm tra tồn kho và lấy mã lô phù hợp
 *     description: |
 *       API này **KHÔNG trừ tồn kho**.
 *       
 *       🔹 Chức năng:
 *       - Kiểm tra kho theo từng thuốc
 *       - Tìm lô còn hạn sử dụng
 *       - Đảm bảo đủ số lượng yêu cầu
 *       - Ưu tiên lô có hạn dùng gần nhất
 *
 *       👉 Dùng API này để lấy **MaLo**
 *       trước khi gọi API tạo phiếu khám bệnh
 *     tags:
 *       - MedicalExamForm
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: array
 *             items:
 *               type: object
 *               required:
 *                 - MaThuoc
 *                 - SoLuong
 *               properties:
 *                 MaThuoc:
 *                   type: string
 *                   example: "LT001"
 *                 SoLuong:
 *                   type: integer
 *                   example: 2
 *     responses:
 *       200:
 *         description: Trả về danh sách thuốc kèm mã lô
 *         content:
 *           application/json:
 *             example:
 *               - MaThuoc: "LT001"
 *                 MaLo: "LO001"
 *               - MaThuoc: "LT002"
 *                 MaLo: null
 *       400:
 *         description: Danh sách thuốc không hợp lệ
 *       500:
 *         description: Lỗi hệ thống
 */
router.post(
  '/confirmMedicalExamForm',
  medicalExamFormController.confirmMedicalExamForm
);


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
 *                       example: "LT001"
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
 *                         example: "LT001"
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