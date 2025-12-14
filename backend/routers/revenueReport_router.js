// ===============================
//  LIÊN QUAN ĐẾN BÁO CÁO DOANH THU
// ===============================
const router = require('express').Router();
const revenueReportController = require('../controllers/revenueReport_controller');

/**
 * @swagger
 * tags:
 *   name: RevenueReport
 *   description: |
 *     Các API liên quan tới BÁO CÁO DOANH THU.
 *     
 *     🔹 Dữ liệu báo cáo được TỰ ĐỘNG TỔNG HỢP từ bảng HOADONTHANHTOAN  
 *     🔹 KHÔNG cho phép nhập hoặc chỉnh sửa chi tiết thủ công  
 *     🔹 Mỗi tháng + năm chỉ tồn tại 1 báo cáo doanh thu
 */

/**
 * =====================================================
 *  TẠO BÁO CÁO DOANH THU THEO THÁNG / NĂM
 * =====================================================
 */
/**
 * @swagger
 * /revenueReport/createReport:
 *   post:
 *     summary: Tạo báo cáo doanh thu
 *     description: |
 *       API tạo báo cáo doanh thu cho một tháng – năm.
 *       
 *       Quy trình xử lý:
 *       1️⃣ Kiểm tra tháng/năm đã có báo cáo hay chưa  
 *       2️⃣ Tổng hợp dữ liệu từ bảng HOADONTHANHTOAN  
 *       3️⃣ Tạo báo cáo tổng hợp (BAOCAODOANHTHU)  
 *       4️⃣ Tạo chi tiết báo cáo theo ngày (CT_BCDT)
 *       
 *       ❗ Nếu tháng đó không có hóa đơn → KHÔNG tạo báo cáo
 *     tags:
 *       - RevenueReport
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
 *         description: Tạo báo cáo doanh thu thành công
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               example:
 *                 MaBCDT: BCDT0001
 *                 Thang: 12
 *                 Nam: 2025
 *                 TongDoanhThu: 35000000
 *       400:
 *         description: Không có dữ liệu hóa đơn trong tháng
 *       409:
 *         description: Báo cáo tháng này đã tồn tại
 *       500:
 *         description: Lỗi máy chủ nội bộ
 */
router.post(
    '/createReport',
    revenueReportController.createReport
);

/**
 * =====================================================
 *  CẬP NHẬT (TÁI TỔNG HỢP) BÁO CÁO DOANH THU
 * =====================================================
 */
/**
 * @swagger
 * /revenueReport/updateReport/{MaBCDT}:
 *   put:
 *     summary: Cập nhật báo cáo doanh thu
 *     description: |
 *       API dùng khi dữ liệu hóa đơn trong tháng có thay đổi.
 *       
 *       Quy trình:
 *       1️⃣ Xóa toàn bộ chi tiết báo cáo cũ (CT_BCDT)  
 *       2️⃣ Tổng hợp lại dữ liệu mới nhất từ HOADONTHANHTOAN  
 *       3️⃣ Cập nhật tổng doanh thu + chi tiết theo ngày
 *       
 *       ❗ Không cho chỉnh sửa thủ công số liệu
 *     tags:
 *       - RevenueReport
 *     parameters:
 *       - in: path
 *         name: MaBCDT
 *         required: true
 *         schema:
 *           type: string
 *         description: Mã báo cáo doanh thu
 *         example: BCDT0001
 *     responses:
 *       200:
 *         description: Cập nhật báo cáo doanh thu thành công
 *         content:
 *           application/json:
 *             example:
 *               message: "Cập nhật báo cáo doanh thu thành công"
 *       404:
 *         description: Không tìm thấy báo cáo doanh thu
 *       409:
 *         description: Không có dữ liệu mới để cập nhật
 *       500:
 *         description: Lỗi máy chủ nội bộ
 */
router.put(
    '/updateReport/:MaBCDT',
    revenueReportController.updateReport
);

/**
 * =====================================================
 *  XÓA BÁO CÁO DOANH THU
 * =====================================================
 */
/**
 * @swagger
 * /revenueReport/deleteReport/{MaBCDT}:
 *   delete:
 *     summary: Xóa báo cáo doanh thu
 *     description: |
 *       Xóa hoàn toàn một báo cáo doanh thu khỏi hệ thống.
 *       
 *       Quy trình:
 *       1️⃣ Xóa chi tiết báo cáo (CT_BCDT)  
 *       2️⃣ Xóa báo cáo tổng hợp (BAOCAODOANHTHU)
 *       
 *       ❗ Không ảnh hưởng đến dữ liệu hóa đơn gốc
 *     tags:
 *       - RevenueReport
 *     parameters:
 *       - in: path
 *         name: MaBCDT
 *         required: true
 *         schema:
 *           type: string
 *         description: Mã báo cáo doanh thu cần xóa
 *         example: BCDT0001
 *     responses:
 *       200:
 *         description: Xóa báo cáo doanh thu thành công
 *         content:
 *           application/json:
 *             example:
 *               message: "Xóa báo cáo doanh thu thành công"
 *       404:
 *         description: Không tìm thấy báo cáo doanh thu
 *       500:
 *         description: Lỗi máy chủ nội bộ
 */
router.delete(
    '/deleteReport/:MaBCDT',
    revenueReportController.deleteReport
);

module.exports = router;
