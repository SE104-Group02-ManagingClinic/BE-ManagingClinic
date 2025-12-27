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
 *     summary: Tạo thuốc mới
 *     description: API dùng để thêm một loại thuốc mới vào hệ thống. Thuốc sẽ được kiểm tra trùng tên và kiểm tra khóa ngoại trước khi tạo.
 *     tags:
 *       - Medicine
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               TenThuoc:
 *                 type: string
 *                 description: Tên thuốc
 *                 example: "Paracetamol"
 *               CongDung:
 *                 type: string
 *                 description: Công dụng của thuốc
 *                 example: "Giảm đau, hạ sốt"
 *               MaCachDung:
 *                 type: string
 *                 description: Mã cách dùng (khóa ngoại)
 *                 example: "CD001"
 *               MaDVT:
 *                 type: string
 *                 description: Mã đơn vị tính (khóa ngoại)
 *                 example: "DVT01"
 *               TacDungPhu:
 *                 type: string
 *                 description: Tác dụng phụ của thuốc
 *                 example: "Buồn nôn, chóng mặt"
 *     responses:
 *       201:
 *         description: Tạo thuốc mới thành công
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 MaThuoc:
 *                   type: string
 *                   example: "LT001"
 *                 TenThuoc:
 *                   type: string
 *                   example: "Paracetamol"
 *                 CongDung:
 *                   type: string
 *                   example: "Giảm đau, hạ sốt"
 *                 MaCachDung:
 *                   type: string
 *                   example: "CD001"
 *                 MaDVT:
 *                   type: string
 *                   example: "DVT01"
 *                 TacDungPhu:
 *                   type: string
 *                   example: "Buồn nôn, chóng mặt"
 *       409:
 *         description: Tên thuốc đã tồn tại
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Tên thuốc đã tồn tại"
 *       400:
 *         description: Khóa ngoại không hợp lệ (MaDVT hoặc MaCachDung không tồn tại)
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Mã đơn vị tính hoặc mã cách dùng không tồn tại"
 *       500:
 *         description: Lỗi hệ thống hoặc tạo thuốc thất bại
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 *                   example: "Internal Server Error"
 */
router.post('/createMedicine', medicineController.createMedicine);

// Lấy danh sách thuốc
/**
 * @swagger
 * /medicine/getMedicine:
 *   get:
 *     summary: Lấy danh sách thuốc
 *     description: API trả về danh sách tất cả các loại thuốc, bao gồm thông tin chi tiết và các lô thuốc liên quan.
 *     tags:
 *       - Medicine
 *     responses:
 *       200:
 *         description: Thành công - trả về danh sách thuốc
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: object
 *                 properties:
 *                   MaThuoc:
 *                     type: string
 *                     example: "LT001"
 *                   TenThuoc:
 *                     type: string
 *                     example: "Paracetamol"
 *                   CongDung:
 *                     type: string
 *                     example: "Giảm đau, hạ sốt"
 *                   TenDVT:
 *                     type: string
 *                     example: "Viên"
 *                   TenCachDung:
 *                     type: string
 *                     example: "Uống sau ăn"
 *                   TacDungPhu:
 *                     type: string
 *                     example: "Buồn nôn, chóng mặt"
 *                   LoThuoc:
 *                     type: array
 *                     items:
 *                       type: object
 *                       properties:
 *                         MaLo:
 *                           type: string
 *                           example: "LO001"
 *                         SoLuongTon:
 *                           type: integer
 *                           example: 100
 *                         GiaBan:
 *                           type: integer
 *                           example: 5000
 *                         HanSuDung:
 *                           type: string
 *                           format: date
 *                           example: "2026-12-31"
 *       500:
 *         description: Lỗi hệ thống khi lấy danh sách thuốc
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 *                   example: "Internal Server Error"
 */
router.get('/getMedicine', medicineController.getMedicine);

// Tìm kiếm thuốc theo tiêu chuẩn
/**
 * @swagger
 * /medicine/searchMedicine:
 *   get:
 *     summary: Tìm kiếm thuốc
 *     description: API dùng để tìm kiếm thuốc theo tên thuốc hoặc công dụng. Kết quả trả về bao gồm thông tin chi tiết thuốc và các lô thuốc liên quan.
 *     tags:
 *       - Medicine
 *     parameters:
 *       - in: query
 *         name: TenThuoc
 *         required: false
 *         schema:
 *           type: string
 *         description: Tên thuốc cần tìm kiếm
 *         example: "Paracetamol"
 *       - in: query
 *         name: CongDung
 *         required: false
 *         schema:
 *           type: string
 *         description: Công dụng của thuốc cần tìm kiếm
 *         example: "Giảm đau"
 *     responses:
 *       200:
 *         description: Thành công - trả về danh sách thuốc phù hợp
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: object
 *                 properties:
 *                   MaThuoc:
 *                     type: string
 *                     example: "LT001"
 *                   TenThuoc:
 *                     type: string
 *                     example: "Paracetamol"
 *                   CongDung:
 *                     type: string
 *                     example: "Giảm đau, hạ sốt"
 *                   TenDVT:
 *                     type: string
 *                     example: "Viên"
 *                   TenCachDung:
 *                     type: string
 *                     example: "Uống sau ăn"
 *                   TacDungPhu:
 *                     type: string
 *                     example: "Buồn nôn, chóng mặt"
 *                   LoThuoc:
 *                     type: array
 *                     items:
 *                       type: object
 *                       properties:
 *                         MaLo:
 *                           type: string
 *                           example: "LO001"
 *                         SoLuongTon:
 *                           type: integer
 *                           example: 100
 *                         GiaBan:
 *                           type: integer
 *                           example: 5000
 *                         HanSuDung:
 *                           type: string
 *                           format: date
 *                           example: "2026-12-31"
 *       500:
 *         description: Lỗi hệ thống khi tìm kiếm thuốc
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 *                   example: "Internal Server Error"
 */
router.get('/searchMedicine', medicineController.searchMedicine);

// Cập nhật thuốc
/**
 * @swagger
 * /medicine/updateMedicine/{MaThuoc}:
 *   put:
 *     summary: Cập nhật thông tin thuốc
 *     description: API dùng để cập nhật thông tin thuốc theo mã thuốc (MaThuoc). Bao gồm công dụng, cách dùng, đơn vị tính và tác dụng phụ.
 *     tags:
 *       - Medicine
 *     parameters:
 *       - in: path
 *         name: MaThuoc
 *         required: true
 *         schema:
 *           type: string
 *         description: Mã thuốc cần cập nhật
 *         example: "LT001"
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               CongDung:
 *                 type: string
 *                 description: Công dụng của thuốc
 *                 example: "Giảm đau, hạ sốt"
 *               MaCachDung:
 *                 type: string
 *                 description: Mã cách dùng (khóa ngoại)
 *                 example: "CD001"
 *               MaDVT:
 *                 type: string
 *                 description: Mã đơn vị tính (khóa ngoại)
 *                 example: "DVT001"
 *               TacDungPhu:
 *                 type: string
 *                 description: Tác dụng phụ của thuốc
 *                 example: "Buồn nôn, chóng mặt"
 *     responses:
 *       200:
 *         description: Cập nhật thuốc thành công
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Cập nhật thành công"
 *       400:
 *         description: Khóa ngoại không hợp lệ hoặc dữ liệu không hợp lệ
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Mã đơn vị tính hoặc mã cách dùng không tồn tại"
 *       404:
 *         description: Không tìm thấy thuốc để cập nhật
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 *                   example: "Không tìm thấy thuốc để cập nhật"
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
router.put('/updateMedicine/:MaThuoc', medicineController.updateMedicine);

// Xóa thuốc
/**
 * @swagger
 * /medicine/deleteMedicine/{MaThuoc}:
 *   delete:
 *     summary: Xóa thuốc theo mã thuốc
 *     description: API dùng để xóa thuốc khỏi hệ thống. Trước khi xóa sẽ kiểm tra xem thuốc đã từng được kê đơn hoặc đã tồn tại lô thuốc hay chưa.
 *     tags:
 *       - Medicine
 *     parameters:
 *       - in: path
 *         name: MaThuoc
 *         required: true
 *         schema:
 *           type: string
 *         description: Mã thuốc cần xóa
 *         example: "LT001"
 *     responses:
 *       200:
 *         description: Xóa thuốc thành công
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Xóa thành công"
 *       400:
 *         description: Không thể xóa thuốc (do đã được kê đơn, đã tồn tại lô thuốc hoặc thiếu mã thuốc)
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Không thể xóa thuốc đã được kê đơn"
 *       404:
 *         description: Không tìm thấy thuốc để xóa
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 *                   example: "Không tìm thấy thuốc để xóa"
 *       500:
 *         description: Lỗi hệ thống khi xóa thuốc
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 *                   example: "Internal Server Error"
 */
router.delete('/deleteMedicine/:MaThuoc', medicineController.deleteMedicine);

module.exports = router;
