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
 *       200:
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

/**
 * @swagger
 * /argument/updateSoBenhNhanToiDa:
 *   post:
 *     summary: Cập nhật số bệnh nhân tối đa
 *     description: API dùng để cập nhật giá trị `SoBenhNhanToiDa` trong bảng THAMSO. Sau khi cập nhật, trả về bản ghi hiện tại của bảng.
 *     tags:
 *       - Argument
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - so_benh_nhan_moi
 *             properties:
 *               so_benh_nhan_moi:
 *                 type: integer
 *                 description: Giá trị mới của số bệnh nhân tối đa
 *                 example: 60
 *     responses:
 *       200:
 *         description: Cập nhật thành công và trả về bản ghi hiện tại trong bảng THAMSO
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 SoBenhNhanToiDa:
 *                   type: integer
 *                   example: 60
 *                 TiLeTinhDonGiaBan:
 *                   type: number
 *                   format: float
 *                   example: 1.2
 *                 TienKham:
 *                   type: integer
 *                   example: 100000
 *       500:
 *         description: Lỗi máy chủ nội bộ
 */
router.post('/updateSoBenhNhanToiDa', argumentController.updateSoBenhNhanToiDa);

/**
 * @swagger
 * /argument/updateTiLeTinhDonGiaBan:
 *   post:
 *     summary: Cập nhật tỉ lệ tính đơn giá bán
 *     description: API dùng để cập nhật giá trị `TiLeTinhDonGiaBan` trong bảng THAMSO. Sau khi cập nhật, trả về bản ghi hiện tại của bảng.
 *     tags:
 *       - Argument
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - ti_le_moi
 *             properties:
 *               ti_le_moi:
 *                 type: number
 *                 format: float
 *                 description: Giá trị mới của tỉ lệ tính đơn giá bán
 *                 example: 1.5
 *     responses:
 *       200:
 *         description: Cập nhật thành công và trả về bản ghi hiện tại trong bảng THAMSO
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 SoBenhNhanToiDa:
 *                   type: integer
 *                   example: 50
 *                 TiLeTinhDonGiaBan:
 *                   type: number
 *                   format: float
 *                   example: 1.5
 *                 TienKham:
 *                   type: integer
 *                   example: 100000
 *       500:
 *         description: Lỗi máy chủ nội bộ
 */
router.post('/updateTiLeTinhDonGiaBan', argumentController.updateTiLeTinhDonGiaBan);

/**
 * @swagger
 * /argument/updateTienKham:
 *   post:
 *     summary: Cập nhật tiền khám
 *     description: API dùng để cập nhật giá trị `TienKham` trong bảng THAMSO. Sau khi cập nhật, trả về bản ghi hiện tại của bảng.
 *     tags:
 *       - Argument
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - tien_kham
 *             properties:
 *               tien_kham:
 *                 type: integer
 *                 description: Giá trị mới của tiền khám
 *                 example: 120000
 *     responses:
 *       200:
 *         description: Cập nhật thành công và trả về bản ghi hiện tại trong bảng THAMSO
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 SoBenhNhanToiDa:
 *                   type: integer
 *                   example: 50
 *                 TiLeTinhDonGiaBan:
 *                   type: number
 *                   format: float
 *                   example: 1.2
 *                 TienKham:
 *                   type: integer
 *                   example: 120000
 *       500:
 *         description: Lỗi máy chủ nội bộ
 */
router.post('/updateTienKham', argumentController.updateTienKham);
module.exports = router;