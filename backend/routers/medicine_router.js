// ===============================
//  LIÊN QUAN ĐẾN THUỐC (THEO SỐ LÔ)
// ===============================
const router = require('express').Router();
const medicineController = require('../controllers/medicine_controller');

/**
 * @swagger
 * tags:
 *   name: Medicine
 *   description: |
 *     Các API liên quan tới bảng LOAITHUOC.
 */

/* =====================================================
   TẠO THUỐC MỚI (THEO LÔ)
   ===================================================== */
/**
 * @swagger
 * /medicine/createMedicine:
 *   post:
 *     summary: Tạo thuốc mới theo số lô
 *     description: |
 *       Tạo một thuốc mới trong hệ thống.
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
 *               - SoLo
 *               - HanSuDung
 *               - MaDVT
 *               - MaCachDung
 *             properties:
 *               TenThuoc:
 *                 type: string
 *                 example: Paracetamol
 *               SoLo:
 *                 type: string
 *                 example: SL2025001
 *               HanSuDung:
 *                 type: string
 *                 format: date
 *                 example: 2026-12-31
 *               CongDung:
 *                 type: string
 *                 example: Giảm đau, hạ sốt
 *               MaDVT:
 *                 type: string
 *                 example: DVT01
 *               MaCachDung:
 *                 type: string
 *                 example: CD001
 *               TacDungPhu:
 *                 type: string
 *                 example: Buồn nôn
 *     responses:
 *       201:
 *         description: Tạo thuốc thành công
 *       400:
 *         description: |
 *           - Thiếu dữ liệu bắt buộc  
 *           - Đơn vị tính không tồn tại  
 *           - Cách dùng không tồn tại
 *       409:
 *         description: Thuốc với tên + số lô này đã tồn tại
 *       500:
 *         description: Lỗi máy chủ nội bộ
 */
router.post('/createMedicine', medicineController.createMedicine);


/* =====================================================
   LẤY DANH SÁCH THUỐC (THEO LÔ)
   ===================================================== */
/**
 * @swagger
 * /medicine/getMedicine:
 *   get:
 *     summary: Lấy danh sách thuốc
 *     description: |
 *       Trả về danh sách tất cả thuốc trong hệ thống,
 *       bao gồm thông tin theo **từng số lô**.
 *     tags:
 *       - Medicine
 *     responses:
 *       200:
 *         description: Lấy danh sách thuốc thành công
 *         content:
 *           application/json:
 *             example:
 *               - MaThuoc: LT001
 *                 SoLo: SL2025001
 *                 TenThuoc: Paracetamol
 *                 TenDVT: Viên
 *                 TenCachDung: Uống sau ăn
 *                 SoLuongTon: 100
 *                 GiaBan: 3000
 *                 HanSuDung: 2026-12-31
 *       500:
 *         description: Lỗi máy chủ nội bộ
 */
router.get('/getMedicine', medicineController.getMedicine);


/* =====================================================
   TÌM KIẾM THUỐC
   ===================================================== */
/**
 * @swagger
 * /medicine/searchMedicine:
 *   get:
 *     summary: Tìm kiếm thuốc
 *     description: |
 *       Tìm kiếm thuốc theo:
 *       - Tên thuốc
 *       - Đơn vị tính
 *       - Số lô
 *       
 *       Có thể kết hợp nhiều điều kiện.
 *     tags:
 *       - Medicine
 *     parameters:
 *       - in: query
 *         name: TenThuoc
 *         schema:
 *           type: string
 *         description: Tìm theo tên thuốc (LIKE)
 *       - in: query
 *         name: TenDVT
 *         schema:
 *           type: string
 *         description: Tìm theo tên đơn vị tính
 *       - in: query
 *         name: SoLo
 *         schema:
 *           type: string
 *         description: Tìm theo số lô
 *     responses:
 *       200:
 *         description: Trả về danh sách thuốc phù hợp
 *       500:
 *         description: Lỗi máy chủ nội bộ
 */
router.get('/searchMedicine', medicineController.searchMedicine);


/* =====================================================
   CẬP NHẬT THÔNG TIN THUỐC (THEO LÔ)
   ===================================================== */
/**
 * @swagger
 * /medicine/updateMedicine/{MaThuoc}/{SoLo}:
 *   put:
 *     summary: Cập nhật thuốc theo số lô
 *     description: |
 *       Chỉ cho phép cập nhật:
 *       - Tên thuốc
 *       - Công dụng
 *       - Cách dùng
 *       - Đơn vị tính
 *       - Tác dụng phụ
 *       - Hạn sử dụng
 *       
 *       ❗ Không cho cập nhật:
 *       - Số lượng tồn
 *       - Giá bán
 *     tags:
 *       - Medicine
 *     parameters:
 *       - in: path
 *         name: MaThuoc
 *         required: true
 *         schema:
 *           type: string
 *         example: LT001
 *       - in: path
 *         name: SoLo
 *         required: true
 *         schema:
 *           type: string
 *         example: SL2025001
 *     requestBody:
 *       required: true
 *     responses:
 *       200:
 *         description: Cập nhật thuốc thành công
 *       400:
 *         description: Dữ liệu không hợp lệ hoặc khóa ngoại không tồn tại
 *       404:
 *         description: Không tìm thấy thuốc theo mã + số lô
 *       500:
 *         description: Lỗi máy chủ nội bộ
 */
router.put(
    '/updateMedicine/:MaThuoc/:SoLo',
    medicineController.updateMedicine
);


/* =====================================================
   XÓA THUỐC (THEO LÔ)
   ===================================================== */
/**
 * @swagger
 * /medicine/deleteMedicine/{MaThuoc}/{SoLo}:
 *   delete:
 *     summary: Xóa thuốc theo số lô
 *     description: |
 *       Chỉ cho phép xóa khi:
 *       - Thuốc CHƯA được sử dụng trong đơn thuốc
 *       - Không còn ràng buộc nghiệp vụ
 *     tags:
 *       - Medicine
 *     parameters:
 *       - in: path
 *         name: MaThuoc
 *         required: true
 *         schema:
 *           type: string
 *         example: LT001
 *       - in: path
 *         name: SoLo
 *         required: true
 *         schema:
 *           type: string
 *         example: SL2025001
 *     responses:
 *       200:
 *         description: Xóa thuốc thành công
 *       400:
 *         description: Thuốc đã được sử dụng trong đơn thuốc
 *       404:
 *         description: Không tìm thấy thuốc để xóa
 *       500:
 *         description: Lỗi máy chủ nội bộ
 */
router.delete(
    '/deleteMedicine/:MaThuoc/:SoLo',
    medicineController.deleteMedicine
);

module.exports = router;
