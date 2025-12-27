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
 * @swagger
 * /medicineImport/createMedicineImport:
 *   post:
 *     summary: Tạo phiếu nhập thuốc
 *     description: API dùng để tạo phiếu nhập thuốc mới, đồng thời sinh mã lô thuốc và mã phiếu nhập. Hệ thống sẽ kiểm tra thuốc tồn tại và cấu hình tham số trước khi tạo.
 *     tags:
 *       - MedicineImport
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               MaThuoc:
 *                 type: string
 *                 description: Mã thuốc cần nhập
 *                 example: "LT001"
 *               GiaNhap:
 *                 type: integer
 *                 description: Giá nhập của thuốc
 *                 example: 2000
 *               NgayNhap:
 *                 type: string
 *                 format: date
 *                 description: Ngày nhập thuốc
 *                 example: "2025-12-27"
 *               SoLuongNhap:
 *                 type: integer
 *                 description: Số lượng thuốc nhập
 *                 example: 100
 *               HanSuDung:
 *                 type: string
 *                 format: date
 *                 description: Hạn sử dụng của thuốc
 *                 example: "2026-12-31"
 *     responses:
 *       201:
 *         description: Tạo phiếu nhập thuốc thành công
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 MaPNT:
 *                   type: string
 *                   example: "PNT001"
 *                 MaLo:
 *                   type: string
 *                   example: "LO001"
 *                 MaThuoc:
 *                   type: string
 *                   example: "LT001"
 *                 GiaNhap:
 *                   type: integer
 *                   example: 2000
 *                 GiaBan:
 *                   type: integer
 *                   example: 2500
 *                 SoLuongNhap:
 *                   type: integer
 *                   example: 100
 *                 HanSuDung:
 *                   type: string
 *                   format: date
 *                   example: "2026-12-31"
 *       400:
 *         description: Thiếu dữ liệu bắt buộc hoặc thuốc không tồn tại, hoặc dữ liệu không hợp lệ
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Thuốc không tồn tại"
 *       409:
 *         description: Chưa cấu hình tỷ lệ tính đơn giá bán
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Chưa cấu hình tỷ lệ tính đơn giá bán"
 *       500:
 *         description: Lỗi hệ thống khi tạo phiếu nhập thuốc
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 *                   example: "Internal Server Error"
 */
router.post(
    '/createMedicineImport',
    medicineImportController.createMedicineImport
);

/**
 * @swagger
 * /medicineImport/getMedicineImport:
 *   get:
 *     summary: Lấy danh sách phiếu nhập thuốc
 *     description: API trả về danh sách tất cả phiếu nhập thuốc, bao gồm thông tin thuốc, lô thuốc và chi tiết nhập.
 *     tags:
 *       - MedicineImport
 *     responses:
 *       200:
 *         description: Thành công - trả về danh sách phiếu nhập thuốc
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: object
 *                 properties:
 *                   MaPNT:
 *                     type: string
 *                     example: "PNT001"
 *                   MaLo:
 *                     type: string
 *                     example: "LO001"
 *                   MaThuoc:
 *                     type: string
 *                     example: "LT001"
 *                   TenThuoc:
 *                     type: string
 *                     example: "Paracetamol"
 *                   GiaNhap:
 *                     type: integer
 *                     example: 2000
 *                   SoLuongNhap:
 *                     type: integer
 *                     example: 100
 *                   NgayNhap:
 *                     type: string
 *                     format: date
 *                     example: "2025-12-27"
 *                   GiaBan:
 *                     type: integer
 *                     example: 2500
 *                   SoLuongTon:
 *                     type: integer
 *                     example: 80
 *                   HanSuDung:
 *                     type: string
 *                     format: date
 *                     example: "2026-12-31"
 *       500:
 *         description: Lỗi hệ thống khi lấy danh sách phiếu nhập thuốc
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 *                   example: "Internal Server Error"
 */
router.get(
    '/getMedicineImport',
    medicineImportController.getMedicineImport
);

/**
 * @swagger
 * /medicineImport/updateMedicineImport/{MaPNT}:
 *   put:
 *     summary: Cập nhật phiếu nhập thuốc
 *     description: API dùng để cập nhật thông tin phiếu nhập thuốc theo mã phiếu nhập (MaPNT). Bao gồm giá nhập, ngày nhập, số lượng nhập và hạn sử dụng.
 *     tags:
 *       - MedicineImport
 *     parameters:
 *       - in: path
 *         name: MaPNT
 *         required: true
 *         schema:
 *           type: string
 *         description: Mã phiếu nhập thuốc cần cập nhật
 *         example: "PNT001"
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               GiaNhap:
 *                 type: integer
 *                 description: Giá nhập của thuốc
 *                 example: 2000
 *               NgayNhap:
 *                 type: string
 *                 format: date
 *                 description: Ngày nhập thuốc
 *                 example: "2025-12-27"
 *               SoLuongNhap:
 *                 type: integer
 *                 description: Số lượng thuốc nhập
 *                 example: 100
 *               HanSuDung:
 *                 type: string
 *                 format: date
 *                 description: Hạn sử dụng của thuốc
 *                 example: "2026-12-31"
 *     responses:
 *       200:
 *         description: Cập nhật phiếu nhập thành công
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Cập nhật phiếu nhập thành công"
 *       400:
 *         description: Giá nhập hoặc số lượng không hợp lệ, hoặc cập nhật làm tồn kho âm
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Giá nhập hoặc số lượng không hợp lệ"
 *       404:
 *         description: Không tìm thấy phiếu nhập thuốc để cập nhật
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Không tìm thấy phiếu nhập thuốc"
 *       409:
 *         description: Không thể cập nhật vì lô thuốc đã được kê đơn
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Không thể cập nhật vì lô thuốc đã được kê đơn"
 *       500:
 *         description: Lỗi hệ thống hoặc cập nhật thất bại
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Lỗi hệ thống"
 */
router.put(
    '/updateMedicineImport/:MaPNT',
    medicineImportController.updateMedicineImport
);

/**
 * @swagger
 * /medicineImport/deleteMedicineImport/{MaPNT}:
 *   delete:
 *     summary: Xóa phiếu nhập thuốc
 *     description: API dùng để xóa phiếu nhập thuốc theo mã phiếu nhập (MaPNT). Trước khi xóa, hệ thống sẽ kiểm tra các điều kiện nghiệp vụ như lô thuốc đã được kê đơn.
 *     tags:
 *       - MedicineImport
 *     parameters:
 *       - in: path
 *         name: MaPNT
 *         required: true
 *         schema:
 *           type: string
 *         description: Mã phiếu nhập thuốc cần xóa
 *         example: "PNT001"
 *     responses:
 *       200:
 *         description: Xóa phiếu nhập thuốc thành công
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Xóa phiếu nhập thuốc thành công"
 *       404:
 *         description: Không tìm thấy phiếu nhập thuốc để xóa
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Không tìm thấy phiếu nhập thuốc"
 *       409:
 *         description: Không thể xóa phiếu nhập vì lô thuốc đã được kê đơn
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Không thể xóa phiếu nhập vì lô thuốc đã được kê đơn"
 *       500:
 *         description: Lỗi hệ thống hoặc xóa thất bại
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Lỗi hệ thống"
 */
router.delete(
    '/deleteMedicineImport/:MaPNT',
    medicineImportController.deleteMedicineImport
);

module.exports = router;
