// Liên quan đến cập nhật tham số, lấy các giá trị tham số
const router = require('express').Router();
const argumentController = require('../controllers/argument_controller');

/**
 * @swagger
 * tags:
 *   name: Argument
 *   description: Các API liên quan tới tham số (lấy giá trị, cập nhật)
 */

/**
 * @swagger
 * /argument/createThamSo:
 *   post:
 *     summary: Tạo mới tham số hệ thống
 *     description: Thêm một bản ghi mới vào bảng THAMSO, bao gồm số bệnh nhân tối đa, tỉ lệ tính đơn giá bán và tiền khám.
 *     tags:
 *       - Argument
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - so_benh_nhan
 *               - ti_le
 *               - tien_kham
 *             properties:
 *               so_benh_nhan:
 *                 type: integer
 *                 description: Số bệnh nhân tối đa
 *                 example: 50
 *               ti_le:
 *                 type: number
 *                 format: float
 *                 description: Tỉ lệ tính đơn giá bán
 *                 example: 1.2
 *               tien_kham:
 *                 type: integer
 *                 description: Tiền khám bệnh
 *                 example: 100000
 *     responses:
 *       201:
 *         description: Tạo tham số thành công
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               example:
 *                 SoBenhNhanToiDa: 50
 *                 TiLeTinhDonGiaBan: 1.2
 *                 TienKham: 100000
 *       500:
 *         description: Internal Server Error
 */

router.post('/createThamSo', argumentController.createThamSo);

/**
 * @swagger
 * /argument/getThamSo:
 *   get:
 *     summary: Lấy thông tin cấu hình từ bảng THAMSO
 *     description: Trả về một bản ghi duy nhất từ bảng THAMSO, bao gồm số bệnh nhân tối đa, tỉ lệ tính đơn giá bán và tiền khám.
 *     tags:
 *       - Argument
 *     responses:
 *       201:
 *         description: Truy xuất thành công thông tin cấu hình
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 SoBenhNhanToiDa:
 *                   type: integer
 *                   example: 50
 *                   description: Số bệnh nhân tối đa trong ngày
 *                 TiLeTinhDonGiaBan:
 *                   type: number
 *                   format: float
 *                   example: 1.2
 *                   description: Tỉ lệ tính đơn giá bán
 *                 TienKham:
 *                   type: integer
 *                   example: 100000
 *                   description: Tiền khám bệnh
 *       500:
 *         description: Lỗi máy chủ nội bộ
 */
router.get('/getThamSo', argumentController.getThamSo);


module.exports = router;