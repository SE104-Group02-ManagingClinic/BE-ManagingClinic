const router = require('express').Router();
const userController = require('../controllers/user_controller');

/**
 * @swagger
 * tags:
 *   name: User
 *   description: Các API liên quan tới nguoi dung
 */

/**
 * @swagger
 * /user/createAccount:
 *   post:
 *     summary: Tạo tài khoản người dùng
 *     description: API dùng để tạo mới một tài khoản người dùng trong hệ thống.
 *     tags:
 *       - User
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               TenDangNhap:
 *                 type: string
 *                 example: "tien.nguyen"
 *               MatKhau:
 *                 type: string
 *                 example: "123456"
 *               MaNhom:
 *                 type: string
 *                 example: "GR001"
 *     responses:
 *       201:
 *         description: Tạo tài khoản thành công
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Tạo tài khoản người dùng thành công"
 *       409:
 *         description: Tên đăng nhập đã tồn tại
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Tên đăng nhập đã tồn tại"
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
router.post('/createAccount', userController.createAccount);

/**
 * @swagger
 * /user/login:
 *   post:
 *     summary: Đăng nhập hệ thống
 *     description: API dùng để đăng nhập vào hệ thống. Trả về thông tin người dùng, nhóm và danh sách chức năng được phân quyền.
 *     tags:
 *       - User
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               TenDangNhap:
 *                 type: string
 *                 description: Tên đăng nhập của người dùng
 *                 example: "admin"
 *               MatKhau:
 *                 type: string
 *                 description: Mật khẩu của người dùng
 *                 example: "123456"
 *     responses:
 *       200:
 *         description: Đăng nhập thành công - trả về thông tin người dùng và danh sách chức năng
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 TenDangNhap:
 *                   type: string
 *                   example: "admin"
 *                 MatKhau:
 *                   type: string
 *                   example: "123456"
 *                 MaNhom:
 *                   type: string
 *                   example: "GR001"
 *                 TenNhom:
 *                   type: string
 *                   example: "Quản trị viên"
 *                 DanhSachChucNang:
 *                   type: array
 *                   items:
 *                     type: object
 *                     properties:
 *                       MaChucNang:
 *                         type: string
 *                         example: "CN001"
 *                       TenChucNang:
 *                         type: string
 *                         example: "Quản lý thuốc"
 *                       TenThanhPhanDuocLoad:
 *                         type: string
 *                         example: "MedicineComponent"
 *       404:
 *         description: Tài khoản đăng nhập không đúng
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Tài khoản đăng nhập không đúng"
 *       500:
 *         description: Lỗi hệ thống khi đăng nhập
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 *                   example: "Internal Server Error"
 */
router.post('/login', userController.login);

/**
 * @swagger
 * /user/updatePassword/{TenDangNhap}:
 *   put:
 *     summary: Đổi mật khẩu người dùng
 *     description: API dùng để đổi mật khẩu của người dùng dựa trên tên đăng nhập.
 *     tags:
 *       - User
 *     parameters:
 *       - in: path
 *         name: TenDangNhap
 *         required: true
 *         schema:
 *           type: string
 *         description: Tên đăng nhập của người dùng cần đổi mật khẩu
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               MatKhauMoi:
 *                 type: string
 *                 example: "newpassword123"
 *     responses:
 *       200:
 *         description: Đổi mật khẩu thành công
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Cập nhật thành công"
 *       400:
 *         description: Tài khoản không tồn tại hoặc dữ liệu không hợp lệ
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Tài khoản không tồn tại"
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
router.put('/updatePassword/:TenDangNhap', userController.updatePassword);

/**
 * @swagger
 * /user/updateGroup/{TenDangNhap}:
 *   put:
 *     summary: Đổi nhóm người dùng
 *     description: API dùng để đổi nhóm người dùng dựa trên tên đăng nhập.
 *     tags:
 *       - User
 *     parameters:
 *       - in: path
 *         name: TenDangNhap
 *         required: true
 *         schema:
 *           type: string
 *         description: Tên đăng nhập của người dùng cần đổi nhóm
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               MaNhomMoi:
 *                 type: string
 *                 example: "GR002"
 *     responses:
 *       200:
 *         description: Đổi nhóm thành công
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Cập nhật thành công"
 *       400:
 *         description: Tài khoản không tồn tại hoặc dữ liệu không hợp lệ
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Tài khoản không tồn tại"
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
router.put('/updateGroup/:TenDangNhap', userController.updateGroup);

/**
 * @swagger
 * /user/deleteUser/{TenDangNhap}:
 *   delete:
 *     summary: Xóa người dùng
 *     description: API dùng để xóa người dùng dựa trên tên đăng nhập.
 *     tags:
 *       - User
 *     parameters:
 *       - in: path
 *         name: TenDangNhap
 *         required: true
 *         schema:
 *           type: string
 *         description: Tên đăng nhập của người dùng cần xóa
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
 *         description: Xóa không thành công hoặc dữ liệu không hợp lệ
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
router.delete('/deleteUser/:TenDangNhap', userController.deleteUser);

module.exports = router;