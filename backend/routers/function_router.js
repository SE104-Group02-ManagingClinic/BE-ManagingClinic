const router = require('express').Router();
const functionController = require('../controllers/function_controller');

/**
 * @swagger
 * tags:
 *   name: Function
 *   description: Các API liên quan tới chức năng cua ung dung mà user có thể sử dụng
 */

/**
 * @swagger
 * /function/createFunction:
 *   post:
 *     summary: Tạo mới chức năng
 *     description: API dùng để tạo mới một chức năng trong hệ thống. Kiểm tra tên chức năng đã tồn tại trước khi thêm mới.
 *     tags:
 *       - Function
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               TenChucNang:
 *                 type: string
 *                 description: Tên chức năng
 *                 example: "Quản lý thuốc"
 *               TenThanhPhanDuocLoad:
 *                 type: string
 *                 description: Tên thành phần được load
 *                 example: "MedicineComponent"
 *     responses:
 *       201:
 *         description: Tạo chức năng thành công
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 MaChucNang:
 *                   type: string
 *                   example: "CN001"
 *                 TenChucNang:
 *                   type: string
 *                   example: "Quản lý thuốc"
 *                 TenThanhPhanDuocLoad:
 *                   type: string
 *                   example: "MedicineComponent"
 *       409:
 *         description: Tên chức năng đã tồn tại trong hệ thống
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Tên chức năng đã tồn tại"
 *       500:
 *         description: Lỗi hệ thống khi tạo chức năng
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 *                   example: "Internal Server Error"
 */
router.post("/createFunction", functionController.createFunction);

/**
 * @swagger
 * /function/getFunctionById/{MaChucNang}:
 *   get:
 *     summary: Lấy thông tin chức năng theo mã chức năng
 *     description: API dùng để lấy thông tin chi tiết của một chức năng trong hệ thống dựa trên mã chức năng (MaChucNang).
 *     tags:
 *       - Function
 *     parameters:
 *       - in: path
 *         name: MaChucNang
 *         required: true
 *         schema:
 *           type: string
 *         description: Mã chức năng cần lấy thông tin
 *         example: "CN001"
 *     responses:
 *       200:
 *         description: Thành công - trả về thông tin chức năng
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 MaChucNang:
 *                   type: string
 *                   example: "CN001"
 *                 TenChucNang:
 *                   type: string
 *                   example: "Quản lý thuốc"
 *                 TenThanhPhanDuocLoad:
 *                   type: string
 *                   example: "MedicineComponent"
 *       400:
 *         description: Thiếu mã chức năng trong request
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Id function is empty."
 *       404:
 *         description: Không tìm thấy chức năng theo mã đã cung cấp
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Not found."
 *       500:
 *         description: Lỗi hệ thống khi lấy thông tin chức năng
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 *                   example: "Internal Server Error"
 */
router.get("/getFunctionById/:MaChucNang", functionController.getFunctionById);

/**
 * @swagger
 * /function/getAllFunctions:
 *   get:
 *     summary: Lấy thông tin toàn bộ các chức năng
 *     description: API dùng để lấy danh sách tất cả các chức năng trong hệ thống.
 *     tags:
 *       - Function
 *     responses:
 *       200:
 *         description: Thành công - trả về danh sách chức năng
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: object
 *                 properties:
 *                   MaChucNang:
 *                     type: string
 *                     example: "CN001"
 *                   TenChucNang:
 *                     type: string
 *                     example: "Quản lý thuốc"
 *                   TenThanhPhanDuocLoad:
 *                     type: string
 *                     example: "MedicineComponent"
 *       500:
 *         description: Lỗi hệ thống khi lấy danh sách chức năng
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 *                   example: "Internal Server Error"
 */
router.get("/getAllFunctions", functionController.getAllFunctions);

/**
 * @swagger
 * /function/getFunctionNameList:
 *   get:
 *     summary: Lấy danh sách các chức năng (id và tên)
 *     description: API trả về danh sách mã và tên của tất cả các chức năng trong hệ thống.
 *     tags:
 *       - Function
 *     responses:
 *       200:
 *         description: Thành công - trả về danh sách id và tên chức năng
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: object
 *                 properties:
 *                   MaChucNang:
 *                     type: string
 *                     example: "CN001"
 *                   TenChucNang:
 *                     type: string
 *                     example: "Quản lý người dùng"
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
router.get("/getFunctionNameList", functionController.getFunctionNameList);

/**
 * @swagger
 * /updateFunction/{MaChucNang}:
 *   put:
 *     summary: Cập nhật chức năng theo mã chức năng
 *     description: API dùng để cập nhật thông tin chức năng trong hệ thống dựa trên mã chức năng (MaChucNang).
 *     tags:
 *       - Function
 *     parameters:
 *       - in: path
 *         name: MaChucNang
 *         required: true
 *         schema:
 *           type: string
 *         description: Mã chức năng cần cập nhật
 *         example: "CN001"
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               TenThanhPhanDuocLoad:
 *                 type: string
 *                 description: Tên thành phần được load
 *                 example: "MedicineComponent"
 *     responses:
 *       200:
 *         description: Cập nhật chức năng thành công
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: string
 *                   example: "Cập nhật thành công"
 *       400:
 *         description: Thông tin không thay đổi hoặc dữ liệu không hợp lệ
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Thông tin không thay đổi"
 *       500:
 *         description: Lỗi hệ thống khi cập nhật chức năng
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 *                   example: "Internal Server Error"
 */
router.put("/updateFunction/:MaChucNang", functionController.updateFunction);

/**
 * @swagger
 * /function/deleteFunction/{MaChucNang}:
 *   delete:
 *     summary: Xóa chức năng theo mã chức năng
 *     description: API dùng để xóa một chức năng trong hệ thống dựa trên mã chức năng (MaChucNang). Nếu chức năng đã được phân quyền trong group thì không thể xóa.
 *     tags:
 *       - Function
 *     parameters:
 *       - in: path
 *         name: MaChucNang
 *         required: true
 *         schema:
 *           type: string
 *         description: Mã chức năng cần xóa
 *         example: "CN001"
 *     responses:
 *       200:
 *         description: Xóa chức năng thành công
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: string
 *                   example: "Xóa thành công"
 *       400:
 *         description: Không thể xóa do chức năng đã được phân quyền trong group hoặc dữ liệu không hợp lệ
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Xóa không thành công do chức năng được phân quyền trong group"
 *       500:
 *         description: Lỗi hệ thống khi xóa chức năng
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 *                   example: "Internal Server Error"
 */
router.delete("/deleteFunction/:MaChucNang", functionController.deleteFunction);

module.exports = router;