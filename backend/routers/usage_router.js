// Liên quan đến cách dùng thuốc
// + Lập danh sách cách dùng thuôc
const router = require('express').Router();
const usageController = require('../controllers/usage_controller');

/**
 * @swagger
 * tags:
 *   name: Usage
 *   description: Các API liên quan tới bảng CACHDUNG (Tạo, Lấy, Cập nhật, Xóa)
 */

// Tạo cách dùng mới
/**
 * @swagger
 * /usage/createUsage:
 *   post:
 *     summary: Tạo mới một cách dùng
 *     description: API để thêm một cách dùng mới vào hệ thống
 *     tags:
 *       - Usage
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - TenCachDung
 *             properties:
 *               TenCachDung:
 *                 type: string
 *                 description: Tên cách dùng
 *                 example: Uống sau bữa ăn
 *     responses:
 *       201:
 *         description: Tạo cách dùng thành công
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               example:
 *                 MaCachDung: CD001
 *                 TenCachDung: Uống sau bữa ăn
 *       400:
 *         description: Dữ liệu không hợp lệ hoặc thiếu thông tin
 *       409:
 *         description: Tên cách dùng đã tồn tại
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Tên cách dùng đã tồn tại"
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
router.post('/createUsage', usageController.createUsage);

/**
 * @swagger
 * /usage/getUsage:
 *   get:
 *     summary: Lấy danh sách tất cả cách dùng
 *     description: Trả về danh sách các bản ghi trong bảng CACHDUNG.
 *     tags:
 *       - Usage
 *     responses:
 *       200:
 *         description: Truy xuất thành công danh sách cách dùng
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: object
 *                 properties:
 *                   MaCachDung:
 *                     type: string
 *                     example: CD001
 *                   TenCachDung:
 *                     type: string
 *                     example: Uống sau bữa ăn
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
router.get('/getUsage', usageController.getUsage);

/**
 * @swagger
 * /usage/updateUsage/{MaCachDung}:
 *   put:
 *     summary: Cập nhật thông tin cách dùng
 *     description: Cập nhật tên cách dùng dựa trên mã cách dùng có sẵn trong bảng CACHDUNG.
 *     tags:
 *       - Usage
 *     parameters:
 *       - in: path
 *         name: MaCachDung
 *         required: true
 *         schema:
 *           type: string
 *         description: Mã cách dùng cần cập nhật
 *         example: CD001
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - TenCachDung
 *             properties:
 *               TenCachDung:
 *                 type: string
 *                 example: Uống trước bữa sáng
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
 *         description: Không tìm thấy cách dùng để cập nhật
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
router.put('/updateUsage/:MaCachDung', usageController.updateUsage);

/**
 * @swagger
 * /usage/deleteUsage/{MaCachDung}:
 *   delete:
 *     summary: Xóa một cách dùng
 *     description: Xóa một bản ghi trong bảng CACHDUNG dựa trên mã cách dùng.
 *     tags:
 *       - Usage
 *     parameters:
 *       - in: path
 *         name: MaCachDung
 *         required: true
 *         schema:
 *           type: string
 *         description: Mã cách dùng cần xóa
 *         example: CD001
 *     responses:
 *       200:
 *         description: Xóa thành công
 *       400:
 *        description: Thiếu mã cách dùng cần xóa
 *       404:
 *         description: Không tìm thấy cách dùng để xóa
 *       409:
 *         description: Cách dùng đang được sử dụng cho thuốc, không thể xóa!
 *       500:
 *         description: Lỗi máy chủ nội bộ
 */
router.delete('/deleteUsage/:MaCachDung', usageController.deleteUsage);

module.exports = router;
