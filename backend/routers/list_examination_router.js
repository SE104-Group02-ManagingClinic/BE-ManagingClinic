const router = require('express').Router();
const controllers = require('../controllers/list_examination_controller');

/**
 * @swagger
 * tags:
 *   name: ListExam
 *   description: Các API liên quan tới thêm, xóa 1 bệnh nhân vào ds khám bệnh
 */

// Thêm mới
/**
 * @swagger
 * /listExam/addInList:
 *   post:
 *     summary: Thêm bệnh nhân vào danh sách khám
 *     description: API dùng để thêm bệnh nhân vào danh sách khám theo ngày khám và mã bệnh nhân.
 *     tags:
 *       - ListExam
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               NgayKham:
 *                 type: string
 *                 format: date
 *                 description: Ngày khám bệnh
 *                 example: "2025-12-28"
 *               MaBN:
 *                 type: string
 *                 description: Mã bệnh nhân
 *                 example: "BN001"
 *     responses:
 *       201:
 *         description: Thêm bệnh nhân vào danh sách khám thành công
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
 *                 DiaChi:
 *                   type: string
 *                   example: "123 Đường ABC, Quận 1, TP.HCM"
 *                 MaPKB:
 *                   type: string
 *                   nullable: true
 *                   example: null
 *                 MaHD:
 *                   type: string
 *                   nullable: true
 *                   example: null
 *       409:
 *         description: Không thể thêm bệnh nhân vào danh sách (ví dụ đã tồn tại hoặc lỗi nghiệp vụ)
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Bệnh nhân đã có trong danh sách khám"
 *       500:
 *         description: Lỗi hệ thống khi thêm bệnh nhân vào danh sách khám
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 *                   example: "Internal Server Error"
 */
router.post('/addInList', controllers.addInList);

/**
 * @swagger
 * /listExam/removeFromList:
 *   delete:
 *     summary: Xóa bệnh nhân khỏi danh sách khám
 *     description: API dùng để xóa bệnh nhân khỏi danh sách khám theo ngày khám và mã bệnh nhân.
 *     tags:
 *       - ListExam
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               NgayKham:
 *                 type: string
 *                 format: date
 *                 description: Ngày khám bệnh
 *                 example: "2025-12-28"
 *               MaBN:
 *                 type: string
 *                 description: Mã bệnh nhân
 *                 example: "BN001"
 *     responses:
 *       200:
 *         description: Xóa bệnh nhân khỏi danh sách khám thành công
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 NgayKham:
 *                   type: string
 *                   format: date
 *                   example: "2025-12-28"
 *                 MaBN:
 *                   type: string
 *                   example: "BN001"
 *       404:
 *         description: Không tìm thấy bệnh nhân trong danh sách khám để xóa
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Không tìm thấy bệnh nhân trong danh sách khám"
 *       500:
 *         description: Lỗi hệ thống khi xóa bệnh nhân khỏi danh sách khám
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 *                   example: "Internal Server Error"
 */
router.delete('/removeFromList', controllers.removeFromList);

/**
 * @swagger
 * /listExam/getDaylyList/{NgayKham}:
 *   get:
 *     summary: Lấy danh sách bệnh nhân khám trong ngày
 *     description: API dùng để lấy danh sách bệnh nhân khám bệnh theo ngày (NgayKham), bao gồm thông tin bệnh nhân và phiếu khám bệnh.
 *     tags:
 *       - ListExam
 *     parameters:
 *       - in: path
 *         name: NgayKham
 *         required: true
 *         schema:
 *           type: string
 *           format: date
 *         description: Ngày khám bệnh cần lấy danh sách
 *         example: "2025-12-28"
 *     responses:
 *       200:
 *         description: Thành công - trả về danh sách bệnh nhân khám trong ngày
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 NgayKham:
 *                   type: string
 *                   format: date
 *                   example: "2025-12-28"
 *                 TongSoBenhNhan:
 *                   type: integer
 *                   example: 2
 *                 DanhSachBenhNhan:
 *                   type: array
 *                   items:
 *                     type: object
 *                     properties:
 *                       MaBN:
 *                         type: string
 *                       HoTen:
 *                         type: string
 *                       CCCD:
 *                         type: string
 *                       GioiTinh:
 *                         type: string
 *                       DiaChi:
 *                         type: string
 *                       MaPKB:
 *                         type: string
 *                       MaHD:
 *                         type: string
 *                         nullable: true
 *                   example:
 *                     - MaBN: "BN001"
 *                       HoTen: "Nguyễn Văn A"
 *                       CCCD: "012345678901"
 *                       GioiTinh: "Nam"
 *                       DiaChi: "123 Đường ABC, Quận 1, TP.HCM"
 *                       MaPKB: "PKB001"
 *                       MaHD: null
 *                     - MaBN: "BN002"
 *                       HoTen: "Trần Thị B"
 *                       CCCD: "098765432109"
 *                       GioiTinh: "Nữ"
 *                       DiaChi: "456 Đường XYZ, Quận 2, TP.HCM"
 *                       MaPKB: "PKB002"
 *                       MaHD: null
 *       404:
 *         description: Không tìm thấy dữ liệu cho ngày khám đã cung cấp
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Không có bệnh nhân nào trong ngày này"
 *       500:
 *         description: Lỗi hệ thống khi lấy danh sách bệnh nhân khám trong ngày
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 *                   example: "Internal Server Error"
 */
router.get('/getDaylyList/:NgayKham', controllers.getDailyList);
module.exports = router;