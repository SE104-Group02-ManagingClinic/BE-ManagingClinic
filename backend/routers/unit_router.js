// Liên quan đến đơn vị tính
// + Lập danh sách đơn vị tính
const router = require('express').Router();
const unitController = require('../controllers/unit_controller');

/**
 * @swagger
 * tags:
 *   name: Unit
 *   description: Các API liên quan tới bảng DONVITINH (Tạo, Lấy, Cập nhật, Xóa)
 */

// Tạo đơn vị tính mới
/**
 * @swagger
 * /unit/createUnit:
 *   post:
 *     summary: Tạo mới một đơn vị tính
 *     description: API để thêm một đơn vị tính mới vào hệ thống
 *     tags:
 *       - Unit
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - TenDVT
 *             properties:
 *               TenDVT:
 *                 type: string
 *                 description: Tên đơn vị tính
 *                 example: Viên
 *     responses:
 *       201:
 *         description: Tạo đơn vị tính thành công
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               example:
 *                 MaDVT: DVT01
 *                 TenDVT: Viên
 *       400:
 *         description: Dữ liệu không hợp lệ hoặc thiếu thông tin
 *       409:
 *         description: Tên đơn vị tính đã tồn tại
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Tên đơn vị tính đã tồn tại"
 *       500:
 *         description: Lỗi máy chủ nội bộ
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 *                   example: "Internal Server Error"
 */
router.post('/createUnit', unitController.createUnit);

/**
 * @swagger
 * /unit/getUnit:
 *   get:
 *     summary: Lấy danh sách tất cả đơn vị tính
 *     description: Trả về danh sách các bản ghi trong bảng DONVITINH.
 *     tags:
 *       - Unit
 *     responses:
 *       200:
 *         description: Truy xuất thành công danh sách đơn vị tính
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: object
 *                 properties:
 *                   MaDVT:
 *                     type: string
 *                     example: DVT01
 *                   TenDVT:
 *                     type: string
 *                     example: Viên
 *       500:
 *         description: Lỗi máy chủ nội bộ
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 *                   example: "Internal Server Error"
 */
router.get('/getUnit', unitController.getUnit);

/**
 * @swagger
 * /unit/updateUnit/{MaDVT}:
 *   put:
 *     summary: Cập nhật thông tin đơn vị tính
 *     description: Cập nhật tên đơn vị tính dựa trên mã đơn vị tính có sẵn trong bảng DONVITINH.
 *     tags:
 *       - Unit
 *     parameters:
 *       - in: path
 *         name: MaDVT
 *         required: true
 *         schema:
 *           type: string
 *         description: Mã đơn vị tính cần cập nhật
 *         example: DVT01
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - TenDVT
 *             properties:
 *               TenDVT:
 *                 type: string
 *                 example: Hộp
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
 *       404:
 *         description: Không tìm thấy đơn vị tính để cập nhật
 *       500:
 *         description: Lỗi máy chủ nội bộ
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 *                   example: "Internal Server Error"
 */
router.put('/updateUnit/:MaDVT', unitController.updateUnit);

/**
 * @swagger
 * /unit/deleteUnit/{MaDVT}:
 *   delete:
 *     summary: Xóa một đơn vị tính
 *     description: Xóa một bản ghi trong bảng DONVITINH dựa trên mã đơn vị tính.
 *     tags:
 *       - Unit
 *     parameters:
 *       - in: path
 *         name: MaDVT
 *         required: true
 *         schema:
 *           type: string
 *         description: Mã đơn vị tính cần xóa
 *         example: DVT01
 *     responses:
 *       200:
 *         description: Xóa thành công
 *       404:
 *         description: Không tìm thấy đơn vị tính để xóa
 *       500:
 *         description: Lỗi máy chủ nội bộ
 */
router.delete('/deleteUnit/:MaDVT', unitController.deleteUnit);

module.exports = router;
