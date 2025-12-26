const router = require('express').Router();
const permissionController = require('../controllers/permission_controller');

/**
 * @swagger
 * tags:
 *   name: Permission
 *   description: Các API liên quan phân quyền chức năng cho các nhóm người dùng.
 */

/**
 * @swagger
 * /permission/createPermission:
 *   post:
 *     summary: Tạo mới phân quyền cho nhóm người dùng
 *     description: API dùng để tạo phân quyền cho nhóm người dùng bằng cách gán danh sách chức năng cho nhóm.
 *     tags:
 *       - Permission
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               MaNhom:
 *                 type: string
 *                 description: Mã nhóm người dùng
 *                 example: "GR001"
 *               DSMaChucNang:
 *                 type: array
 *                 description: Danh sách mã chức năng được gán cho nhóm
 *                 items:
 *                   type: string
 *                 example: ["CN001", "CN002", "CN003"]
 *     responses:
 *       201:
 *         description: Tạo phân quyền thành công cho nhóm người dùng
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Tạo phân quyền cho nhóm người dùng thành công"
 *       400:
 *         description: Nhóm đã có phân quyền trước đó hoặc dữ liệu không hợp lệ
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Nhóm đã tạo phân quyền"
 *       500:
 *         description: Lỗi hệ thống hoặc tạo phân quyền thất bại
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 *                   example: "Internal Server Error"
 */

router.post('/createPermission', permissionController.createPermission);

/**
 * @swagger
 * /permission/deletePermission/{MaNhom}:
 *   delete:
 *     summary: Xóa phân quyền của nhóm người dùng
 *     description: API dùng để xóa phân quyền của nhóm người dùng bằng cách loại bỏ danh sách chức năng đã gán cho nhóm.
 *     tags:
 *       - Permission
 *     parameters:
 *       - in: path
 *         name: MaNhom
 *         required: true
 *         schema:
 *           type: string
 *         description: Mã nhóm người dùng cần xóa phân quyền
 *         example: "GR001"
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               DSMaChucNang:
 *                 type: array
 *                 description: Danh sách mã chức năng cần xóa khỏi nhóm
 *                 items:
 *                   type: string
 *                 example: ["CN001", "CN002"]
 *     responses:
 *       200:
 *         description: Xóa phân quyền thành công
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Xóa phân quyền thành công"
 *       400:
 *         description: Nhóm chưa được tạo phân quyền hoặc dữ liệu không hợp lệ
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Nhóm chưa được tạo phân quyền"
 *       500:
 *         description: Lỗi hệ thống hoặc xóa phân quyền thất bại
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 *                   example: "Internal Server Error"
 */
router.delete('/deletePermission/:MaNhom', permissionController.deletePermission);
/**
 * @swagger
 * /permission/getFunctionsOfGroupUser/{MaNhom}:
 *   get:
 *     summary: Lấy danh sách các chức năng của một nhóm người dùng
 *     description: API trả về danh sách các chức năng (id và tên) được phân quyền cho nhóm người dùng dựa trên mã nhóm.
 *     tags:
 *       - Permission
 *     parameters:
 *       - in: path
 *         name: MaNhom
 *         required: true
 *         schema:
 *           type: string
 *         description: Mã nhóm người dùng cần lấy danh sách chức năng
 *         example: "GR001"
 *     responses:
 *       200:
 *         description: Thành công - trả về danh sách chức năng của nhóm
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
router.get('/getFunctionsOfGroupUser/:MaNhom', permissionController.getFunctionsOfGroupUser);

/**
 * @swagger
 * /permission/updatePermission/{MaNhom}:
 *   put:
 *     summary: Cập nhật danh sách phân quyền cho nhóm người dùng
 *     description: API dùng để cập nhật lại danh sách chức năng được gán cho một nhóm người dùng.
 *     tags:
 *       - Permission
 *     parameters:
 *       - in: path
 *         name: MaNhom
 *         required: true
 *         schema:
 *           type: string
 *         description: Mã nhóm người dùng cần cập nhật phân quyền
 *         example: "GR001"
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               DSMaChucNang:
 *                 type: array
 *                 description: Danh sách mã chức năng mới cần gán cho nhóm
 *                 items:
 *                   type: string
 *                 example: ["CN001", "CN002", "CN003"]
 *     responses:
 *       200:
 *         description: Cập nhật danh sách phân quyền thành công
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Cập nhật danh sách phân quyền thành công"
 *       400:
 *         description: Cập nhật không thành công (dữ liệu không hợp lệ hoặc nhóm chưa có phân quyền)
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Cập nhật không thành công"
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
router.put('/updatePermission/:MaNhom', permissionController.updatePermission);
module.exports = router;