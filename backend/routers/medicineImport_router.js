// Liên quan đến phiếu nhập thuốc (Medicine Import)
// + Lập danh sách phiếu nhập thuốc
const router = require('express').Router();
const medicineImportController = require('../controllers/medicineImport_controller');

/**
 * @swagger
 * tags:
 *   name: MedicineImport
 *   description: Các API liên quan tới bảng PHIEUNHAPTHUOC (Phiếu nhập thuốc)
 */

/**
 * =========================
 *  TẠO PHIẾU NHẬP THUỐC
 * =========================
 */
/**
 * @swagger
 * /medicineImport/createMedicineImport:
 *   post:
 *     summary: Tạo phiếu nhập thuốc
 *     description: Thêm một phiếu nhập thuốc mới và cập nhật tồn kho thuốc
 *     tags:
 *       - MedicineImport
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - MaThuoc
 *               - NgayNhap
 *               - SoLuongNhap
 *             properties:
 *               MaThuoc:
 *                 type: string
 *                 description: Mã thuốc cần nhập
 *                 example: LT001
 *               GiaNhap:
 *                 type: integer
 *                 description: Giá nhập của thuốc
 *                 example: 1500
 *               NgayNhap:
 *                 type: string
 *                 format: date
 *                 description: Ngày nhập thuốc
 *                 example: 2025-12-14
 *               SoLuongNhap:
 *                 type: integer
 *                 description: Số lượng thuốc nhập
 *                 example: 50
 *     responses:
 *       201:
 *         description: Tạo phiếu nhập thuốc thành công
 *       400:
 *         description: Dữ liệu không hợp lệ hoặc thuốc không tồn tại
 *       500:
 *         description: Lỗi máy chủ nội bộ
 */
router.post(
    '/createMedicineImport',
    medicineImportController.createMedicineImport
);

/**
 * =========================
 *  LẤY DANH SÁCH PHIẾU NHẬP
 * =========================
 */
/**
 * @swagger
 * /medicineImport/getMedicineImport:
 *   get:
 *     summary: Lấy danh sách phiếu nhập thuốc
 *     description: Trả về danh sách tất cả phiếu nhập thuốc trong hệ thống
 *     tags:
 *       - MedicineImport
 *     responses:
 *       200:
 *         description: Lấy danh sách phiếu nhập thuốc thành công
 *       500:
 *         description: Lỗi máy chủ nội bộ
 */
router.get(
    '/getMedicineImport',
    medicineImportController.getMedicineImport
);

/**
 * =========================
 *  CẬP NHẬT PHIẾU NHẬP
 * =========================
 */
/**
 * @swagger
 * /medicineImport/updateMedicineImport/{MaPNT}:
 *   put:
 *     summary: Cập nhật phiếu nhập thuốc
 *     description: Cập nhật thông tin của một phiếu nhập thuốc theo mã phiếu nhập
 *     tags:
 *       - MedicineImport
 *     parameters:
 *       - in: path
 *         name: MaPNT
 *         required: true
 *         schema:
 *           type: string
 *         description: Mã phiếu nhập thuốc
 *         example: PNT001
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               MaThuoc:
 *                 type: string
 *                 example: LT001
 *               GiaNhap:
 *                 type: integer
 *                 example: 1600
 *               NgayNhap:
 *                 type: string
 *                 example: 2025-12-15
 *               SoLuongNhap:
 *                 type: integer
 *                 example: 60
 *     responses:
 *       200:
 *         description: Cập nhật phiếu nhập thuốc thành công
 *       404:
 *         description: Không tìm thấy phiếu nhập thuốc
 *       500:
 *         description: Lỗi máy chủ nội bộ
 */
router.put(
    '/updateMedicineImport/:MaPNT',
    medicineImportController.updateMedicineImport
);

/**
 * =========================
 *  XÓA PHIẾU NHẬP
 * =========================
 */
/**
 * @swagger
 * /medicineImport/deleteMedicineImport/{MaPNT}:
 *   delete:
 *     summary: Xóa phiếu nhập thuốc
 *     description: Xóa một phiếu nhập thuốc khỏi hệ thống
 *     tags:
 *       - MedicineImport
 *     parameters:
 *       - in: path
 *         name: MaPNT
 *         required: true
 *         schema:
 *           type: string
 *         description: Mã phiếu nhập thuốc cần xóa
 *         example: PNT001
 *     responses:
 *       200:
 *         description: Xóa phiếu nhập thuốc thành công
 *       404:
 *         description: Không tìm thấy phiếu nhập thuốc để xóa
 *       500:
 *         description: Lỗi máy chủ nội bộ
 */
router.delete(
    '/deleteMedicineImport/:MaPNT',
    medicineImportController.deleteMedicineImport
);

module.exports = router;
