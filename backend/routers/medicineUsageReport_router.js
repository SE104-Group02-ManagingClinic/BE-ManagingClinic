const router = require('express').Router();
const controller = require('../controllers/medicineUsageReport_controller');

/**
 * @swagger
 * tags:
 *   name: MedicineUsageReport
 *   description: |
 *     API báo cáo sử dụng thuốc.
 *     Dữ liệu báo cáo được TỰ ĐỘNG TỔNG HỢP từ:
 *     - PHIEUKHAMBENH
 *     - CT_THUOC
 *     Người dùng KHÔNG nhập chi tiết thủ công.
 */

/* =====================================================
   TẠO BÁO CÁO SỬ DỤNG THUỐC
   ===================================================== */
/**
 * @swagger
 * /medicineUsageReport/createReport:
 *   post:
 *     summary: Tạo báo cáo sử dụng thuốc theo tháng/năm
 *     description: |
 *       API này sẽ:
 *       1. Tạo mới một báo cáo sử dụng thuốc (BAOCAOSUDUNGTHUOC)
 *       2. Tự động tổng hợp dữ liệu từ CT_THUOC + PHIEUKHAMBENH
 *       3. Sinh chi tiết báo cáo (CT_BCSDT)
 *
 *       ❗ Không cho phép nhập chi tiết thủ công.
 *     tags:
 *       - MedicineUsageReport
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - Thang
 *               - Nam
 *             properties:
 *               Thang:
 *                 type: integer
 *                 description: Tháng cần lập báo cáo
 *                 example: 12
 *               Nam:
 *                 type: integer
 *                 description: Năm cần lập báo cáo
 *                 example: 2025
 *     responses:
 *       201:
 *         description: Tạo báo cáo sử dụng thuốc thành công
 *         content:
 *           application/json:
 *             example:
 *               MaBCSDT: BCSDT001
 *               Thang: 12
 *               Nam: 2025
 *       400:
 *         description: Thiếu tháng hoặc năm
 *       500:
 *         description: Lỗi máy chủ nội bộ
 */
router.post(
    '/createReport',
    controller.createReport
);

/* =====================================================
   LẤY DANH SÁCH BÁO CÁO SỬ DỤNG THUỐC
   ===================================================== */
/**
 * @swagger
 * /medicineUsageReport/getReports:
 *   get:
 *     summary: Lấy danh sách các báo cáo sử dụng thuốc
 *     description: Trả về danh sách các báo cáo (theo tháng/năm)
 *     tags:
 *       - MedicineUsageReport
 *     responses:
 *       200:
 *         description: Lấy danh sách báo cáo thành công
 *         content:
 *           application/json:
 *             example:
 *               - MaBCSDT: BCSDT001
 *                 Thang: 12
 *                 Nam: 2025
 *       500:
 *         description: Lỗi máy chủ nội bộ
 */
router.get(
    '/getReports',
    controller.getReports
);

/* =====================================================
   XEM CHI TIẾT BÁO CÁO SỬ DỤNG THUỐC
   ===================================================== */
/**
 * @swagger
 * /medicineUsageReport/getReportDetail/{MaBCSDT}:
 *   get:
 *     summary: Xem chi tiết báo cáo sử dụng thuốc
 *     description: |
 *       Trả về chi tiết báo cáo (CT_BCSDT).
 *       Dữ liệu được tổng hợp tự động, không nhập tay.
 *     tags:
 *       - MedicineUsageReport
 *     parameters:
 *       - in: path
 *         name: MaBCSDT
 *         required: true
 *         schema:
 *           type: string
 *         example: BCSDT001
 *     responses:
 *       200:
 *         description: Lấy chi tiết báo cáo thành công
 *       404:
 *         description: Không tìm thấy báo cáo
 *       500:
 *         description: Lỗi máy chủ nội bộ
 */
router.get(
    '/getReportDetail/:MaBCSDT',
    controller.getReportDetail
);

/* =====================================================
   CẬP NHẬT (TÁI TỔNG HỢP) BÁO CÁO
   ===================================================== */
/**
 * @swagger
 * /medicineUsageReport/updateReport/{MaBCSDT}:
 *   put:
 *     summary: Cập nhật (tái tổng hợp) báo cáo sử dụng thuốc
 *     description: |
 *       API này KHÔNG sửa tay số liệu.
 *       Nó sẽ:
 *       1. Xóa toàn bộ chi tiết báo cáo cũ (CT_BCSDT)
 *       2. Tổng hợp lại dữ liệu mới nhất từ CT_THUOC
 *       3. Ghi lại chi tiết báo cáo mới
 *
 *       👉 Dùng khi có thay đổi đơn thuốc trong tháng.
 *     tags:
 *       - MedicineUsageReport
 *     parameters:
 *       - in: path
 *         name: MaBCSDT
 *         required: true
 *         schema:
 *           type: string
 *         description: Mã báo cáo sử dụng thuốc
 *         example: BCSDT001
 *     responses:
 *       200:
 *         description: Cập nhật báo cáo thành công
 *         content:
 *           application/json:
 *             example:
 *               message: Cập nhật báo cáo thành công
 *       404:
 *         description: Không tìm thấy báo cáo
 *       500:
 *         description: Lỗi máy chủ nội bộ
 */
router.put(
    '/updateReport/:MaBCSDT',
    controller.updateReport
);

/* =====================================================
   XÓA BÁO CÁO SỬ DỤNG THUỐC
   ===================================================== */
/**
 * @swagger
 * /medicineUsageReport/deleteReport/{MaBCSDT}:
 *   delete:
 *     summary: Xóa báo cáo sử dụng thuốc
 *     description: |
 *       API này sẽ:
 *       - Xóa chi tiết báo cáo (CT_BCSDT)
 *       - Xóa báo cáo tổng hợp (BAOCAOSUDUNGTHUOC)
 *
 *       ❗ Không ảnh hưởng đến dữ liệu đơn thuốc gốc.
 *     tags:
 *       - MedicineUsageReport
 *     parameters:
 *       - in: path
 *         name: MaBCSDT
 *         required: true
 *         schema:
 *           type: string
 *         description: Mã báo cáo sử dụng thuốc cần xóa
 *         example: BCSDT001
 *     responses:
 *       200:
 *         description: Xóa báo cáo thành công
 *         content:
 *           application/json:
 *             example:
 *               message: Xóa thành công
 *       404:
 *         description: Không tìm thấy báo cáo
 *       500:
 *         description: Lỗi máy chủ nội bộ
 */
router.delete(
    '/deleteReport/:MaBCSDT',
    controller.deleteReport
);

module.exports = router;
