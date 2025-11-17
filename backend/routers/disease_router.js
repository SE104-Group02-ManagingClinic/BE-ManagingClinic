// Liên quan đến bệnh: 
// + Lập danh sách bệnh
// + Tra cứu danh sách bệnh
const router = require('express').Router();
const diseaseController = require('../controllers/disease_controller');

/**
 * @swagger
 * tags:
 *   name: Disease
 *   description: Các API liên quan tới bệnh
 */

// Tạo bệnh mới
/**
 * @swagger
 * /disease/createBenh:
 *   post:
 *     summary: Tạo bệnh mới
 *     description: API để thêm một bệnh mới vào hệ thống.
 *     tags:
 *       - Disease
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               TenBenh:
 *                 type: string
 *                 example: "Cúm mùa"
 *               TrieuChung:
 *                 type: string
 *                 example: "Sốt, ho, đau đầu"
 *               NguyenNhan:
 *                 type: string
 *                 example: "Virus cúm"
 *               BienPhapChanDoan:
 *                 type: string
 *                 example: "Giữ vệ sinh, tránh tiếp xúc"
 *               CachDieuTri:
 *                 type: string
 *                 example: "Thuốc hạ sốt, nghỉ ngơi"
 *     responses:
 *       201:
 *         description: Tạo bệnh thành công
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 MaBenh:
 *                   type: string
 *                   example: "B0001"
 *                 TenBenh:
 *                   type: string
 *                   example: "Cúm mùa"
 *                 TrieuChung:
 *                   type: string
 *                   example: "Sốt, ho, đau đầu"
 *                 NguyenNhan:
 *                   type: string
 *                   example: "Virus cúm"
 *                 BienPhapChuanDoan:
 *                   type: string
 *                   example: "Giữ vệ sinh, tránh tiếp xúc"
 *                 CachDieuTri:
 *                   type: string
 *                   example: "Thuốc hạ sốt, nghỉ ngơi"
 *       409:
 *         description: Tên bệnh đã tồn tại
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Tên bệnh đã tồn tại"
 *       500:
 *         description: Lỗi hệ thống
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 *                   example: "Internal Server Error"
 */
router.post('/createBenh', diseaseController.createBenh);

// Lấy toàn bộ thông tin bệnh
/**
 * @swagger
 * /disease/getDSBenh:
 *   get:
 *     summary: Lấy toàn bộ danh sách bệnh
 *     description: Trả về danh sách tất cả các bệnh trong bảng BENH với đầy đủ thông tin.
 *     tags:
 *       - Disease
 *     responses:
 *       200:
 *         description: Danh sách bệnh được trả về thành công
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: object
 *                 properties:
 *                   MaBenh:
 *                     type: string
 *                     example: "B0001"
 *                   TenBenh:
 *                     type: string
 *                     example: "Cúm mùa"
 *                   TrieuChung:
 *                     type: string
 *                     example: "Sốt, ho, đau đầu"
 *                   NguyenNhan:
 *                     type: string
 *                     example: "Virus cúm"
 *                   BienPhapChanDoan:
 *                     type: string
 *                     example: "Khám lâm sàng, xét nghiệm máu"
 *                   CachDieuTri:
 *                     type: string
 *                     example: "Thuốc hạ sốt, nghỉ ngơi"
 *       500:
 *         description: Lỗi hệ thống
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 *                   example: "Internal Server Error"
 */
router.get('/getDSBenh', diseaseController.getDSBenh);

// Lấy danh sách tên bệnh
/**
 * @swagger
 * /disease/getDSTenBenh:
 *   get:
 *     summary: Lấy danh sách các bệnh
 *     description: Trả về danh sách gồm MaBenh và TenBenh từ bảng BENH.
 *     tags:
 *       - Disease
 *     responses:
 *       200:
 *         description: Danh sách bệnh được trả về thành công
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: object
 *                 properties:
 *                   MaBenh:
 *                     type: string
 *                     example: "B0001"
 *                   TenBenh:
 *                     type: string
 *                     example: "Cúm mùa"
 *       500:
 *         description: Lỗi hệ thống
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 *                   example: "Internal Server Error"
 */
router.get('/getDSTenBenh', diseaseController.getDSTenBenh);

// Lấy thông tin bệnh theo tên bệnh
/**
 * @swagger
 * /disease/searchBenh/{ten_benh}:
 *   get:
 *     summary: Tra cứu bệnh theo tên
 *     description: Tìm kiếm và trả về danh sách bệnh có chứa tên bệnh được cung cấp.
 *     tags:
 *       - Disease
 *     parameters:
 *       - in: path
 *         name: ten_benh
 *         required: true
 *         schema:
 *           type: string
 *         description: Tên bệnh cần tra cứu
 *         example: "Cúm"
 *     responses:
 *       200:
 *         description: Danh sách bệnh phù hợp
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: object
 *                 properties:
 *                   MaBenh:
 *                     type: string
 *                     example: "B0001"
 *                   TenBenh:
 *                     type: string
 *                     example: "Cúm mùa"
 *                   TrieuChung:
 *                     type: string
 *                     example: "Sốt, ho, đau đầu"
 *                   NguyenNhan:
 *                     type: string
 *                     example: "Virus cúm"
 *                   BienPhapChanDoan:
 *                     type: string
 *                     example: "Khám lâm sàng, xét nghiệm máu"
 *                   CachDieuTri:
 *                     type: string
 *                     example: "Thuốc hạ sốt, nghỉ ngơi"
 *       404:
 *         description: Không tìm thấy bệnh phù hợp
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Not found."
 *       500:
 *         description: Lỗi hệ thống
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 *                   example: "Internal Server Error"
 */
router.get('/searchBenh/:ten_benh', diseaseController.searchBenh);

// Sửa thông tin bệnh theo MaBenh
/**
 * @swagger
 * /disease/updateBenh/{ma_benh}:
 *   put:
 *     summary: Cập nhật thông tin bệnh
 *     description: Sửa thông tin bệnh theo mã bệnh (MaBenh).
 *     tags:
 *       - Disease
 *     parameters:
 *       - in: path
 *         name: ma_benh
 *         required: true
 *         schema:
 *           type: string
 *         description: Mã bệnh cần cập nhật
 *         example: "B0001"
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               TrieuChung:
 *                 type: string
 *                 example: "Sốt cao, ho, đau đầu"
 *               NguyenNhan:
 *                 type: string
 *                 example: "Virus cúm"
 *               BienPhapChanDoan:
 *                 type: string
 *                 example: "Khám lâm sàng, xét nghiệm máu"
 *               CachDieuTri:
 *                 type: string
 *                 example: "Thuốc hạ sốt, nghỉ ngơi"
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
 *       400:
 *         description: Không có thay đổi nào được thực hiện
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Thông tin không thay đổi"
 *       500:
 *         description: Lỗi hệ thống
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 *                   example: "Internal Server Error"
 */
router.put('/updateBenh/:MaBenh', diseaseController.updateBenh);

// Xóa 1 bệnh theo MaBenh
/**
 * @swagger
 * /disease/deleteBenh/{MaBenh}:
 *   delete:
 *     summary: Xóa bệnh theo mã bệnh
 *     description: Xóa một bệnh khỏi hệ thống dựa trên mã bệnh (MaBenh).
 *     tags:
 *       - Disease
 *     parameters:
 *       - in: path
 *         name: MaBenh
 *         required: true
 *         schema:
 *           type: string
 *         description: Mã bệnh cần xóa
 *         example: "B001"
 *     responses:
 *       200:
 *         description: Xóa thành công
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: string
 *                   example: "Xóa thành công"
 *       400:
 *         description: Xóa không thành công
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Xóa không thành công"
 *       500:
 *         description: Lỗi hệ thống
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 *                   example: "Internal Server Error"
 */
router.delete('/deleteBenh/:MaBenh', diseaseController.deleteBenh);

module.exports = router;