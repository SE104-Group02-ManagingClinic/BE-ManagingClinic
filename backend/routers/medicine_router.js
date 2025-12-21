// Liên quan đến loại thuốc
// + Lập danh sách thuốc
const router = require('express').Router();
const medicineController = require('../controllers/medicine_controller');

/**
 * @swagger
 * tags:
 *   name: Medicine
 *   description: Các API liên quan tới bảng LOAITHUOC (Tạo, Lấy, Cập nhật, Xóa)
 */

// Tạo thuốc mới
/**
 * @swagger
 * /medicine/createMedicine:
 *   post:
 *     summary: Tạo mới thuốc
 *     description: |
 *       Thêm một loại thuốc mới vào hệ thống.
 * 
 * 
 *       ❗ Khi tạo mới:
 *       - Số lượng tồn kho mặc định = 0
 *       - Giá bán mặc định = 0
 *       
 *       Hai giá trị này sẽ được cập nhật thông qua:
 *       - Phiếu nhập thuốc
 *       - Chức năng cập nhật giá bán
 *     tags:
 *       - Medicine
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - TenThuoc
 *               - MaDVT
 *               - MaCachDung
 *             properties:
 *               TenThuoc:
 *                 type: string
 *                 example: Paracetamol
 *               CongDung:
 *                 type: string
 *                 example: Giảm đau, hạ sốt
 *               MaCachDung:
 *                 type: string
 *                 example: CD001
 *               MaDVT:
 *                 type: string
 *                 example: DVT01
 *               TacDungPhu:
 *                 type: string
 *                 example: Buồn nôn
 *     responses:
 *       201:
 *         description: Tạo thuốc thành công
 *       400:
 *         description: Dữ liệu không hợp lệ hoặc khóa ngoại không tồn tại
 *       409:
 *         description: Tên thuốc đã tồn tại
 *       500:
 *         description: Lỗi máy chủ nội bộ
 */
router.post('/createMedicine', medicineController.createMedicine);

// Lấy danh sách thuốc
/**
 * @swagger
 * /medicine/getMedicine:
 *   get:
 *     summary: Lấy danh sách tất cả thuốc
 *     description: Trả về danh sách các thuốc trong hệ thống
 *     tags:
 *       - Medicine
 *     responses:
 *       200:
 *         description: Lấy danh sách thuốc thành công
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: object
 *                 properties:
 *                   MaThuoc:
 *                     type: string
 *                     example: LT001
 *                   TenThuoc:
 *                     type: string
 *                     example: Paracetamol
 *                   TenDVT:
 *                     type: string
 *                     example: Viên
 *                   TenCachDung:
 *                     type: string
 *                     example: Uống sau ăn
 *                   SoLuongTon:
 *                     type: integer
 *                     example: 0
 *                   GiaBan:
 *                     type: integer
 *                     example: 0
 *       500:
 *         description: Lỗi máy chủ nội bộ
 */
router.get('/getMedicine', medicineController.getMedicine);

// Cập nhật thuốc
/**
 * @swagger
 * /medicine/updateMedicine/{MaThuoc}:
 *   put:
 *     summary: Cập nhật thông tin thuốc
 *     description: Cập nhật các thuộc tính của thuốc theo mã thuốc
 *     tags:
 *       - Medicine
 *     parameters:
 *       - in: path
 *         name: MaThuoc
 *         required: true
 *         schema:
 *           type: string
 *         example: LT001
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               TenThuoc:
 *                 type: string
 *                 example: Paracetamol 500mg
 *               CongDung:
 *                 type: string
 *               MaCachDung:
 *                 type: string
 *                 example: CD001
 *               MaDVT:
 *                 type: string
 *                 example: DVT01
 *               TacDungPhu:
 *                 type: string
 *     responses:
 *       200:
 *         description: Cập nhật thuốc thành công
 *       400:
 *         description: Dữ liệu không hợp lệ hoặc khóa ngoại không tồn tại
 *       404:
 *         description: Không tìm thấy thuốc để cập nhật
 *       500:
 *         description: Lỗi máy chủ nội bộ
 */
router.put('/updateMedicine/:MaThuoc', medicineController.updateMedicine);

// Xóa thuốc
/**
 * @swagger
 * /medicine/deleteMedicine/{MaThuoc}:
 *   delete:
 *     summary: Xóa một loại thuốc
 *     description: Xóa thuốc khỏi hệ thống nếu chưa được sử dụng
 *     tags:
 *       - Medicine
 *     parameters:
 *       - in: path
 *         name: MaThuoc
 *         required: true
 *         schema:
 *           type: string
 *         example: LT001
 *     responses:
 *       200:
 *         description: Xóa thuốc thành công
 *       400:
 *         description: Không thể xóa thuốc đã được sử dụng
 *       404:
 *         description: Không tìm thấy thuốc để xóa
 *       500:
 *         description: Lỗi máy chủ nội bộ
 */
router.delete('/deleteMedicine/:MaThuoc', medicineController.deleteMedicine);

module.exports = router;
