const router = require('express').Router();
const usageController = require('../controllers/usage_controller');

/**
 * @swagger
 * tags:
 *   name: Usage
 *   description: Các API liên quan tới bảng CACHDUNG (Tạo, Lấy, Cập nhật, Xóa)
 */

/**
 * @swagger
 * /usage/createUsage:
 *   post:
 *     summary: Tạo mới một cách dùng
 *     description: Thêm một bản ghi mới vào bảng CACHDUNG với mã cách dùng và tên cách dùng.
 *     tags:
 *       - Usage
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - ma_cach_dung
 *               - ten_cach_dung
 *             properties:
 *               ma_cach_dung:
 *                 type: string
 *                 description: Mã cách dùng (duy nhất)
 *                 example: CD001
 *               ten_cach_dung:
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
 *       500:
 *         description: Lỗi máy chủ nội bộ
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
 */
router.get('/getUsage', usageController.getUsage);

/**
 * @swagger
 * /usage/updateUsage:
 *   put:
 *     summary: Cập nhật thông tin cách dùng
 *     description: Cập nhật tên cách dùng dựa trên mã cách dùng có sẵn trong bảng CACHDUNG.
 *     tags:
 *       - Usage
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - ma_cach_dung
 *               - ten_cach_dung
 *             properties:
 *               ma_cach_dung:
 *                 type: string
 *                 example: CD001
 *               ten_cach_dung:
 *                 type: string
 *                 example: Uống trước bữa sáng
 *     responses:
 *       200:
 *         description: Cập nhật thành công
 *       404:
 *         description: Không tìm thấy cách dùng để cập nhật
 *       500:
 *         description: Lỗi máy chủ nội bộ
 */
router.put('/updateUsage', usageController.updateUsage);

/**
 * @swagger
 * /usage/deleteUsage/{ma_cach_dung}:
 *   delete:
 *     summary: Xóa một cách dùng
 *     description: Xóa một bản ghi trong bảng CACHDUNG dựa trên mã cách dùng.
 *     tags:
 *       - Usage
 *     parameters:
 *       - in: path
 *         name: ma_cach_dung
 *         required: true
 *         schema:
 *           type: string
 *         description: Mã cách dùng cần xóa
 *         example: CD001
 *     responses:
 *       200:
 *         description: Xóa thành công
 *       404:
 *         description: Không tìm thấy cách dùng để xóa
 *       500:
 *         description: Lỗi máy chủ nội bộ
 */
router.delete('/deleteUsage/:ma_cach_dung', usageController.deleteUsage);

module.exports = router;
