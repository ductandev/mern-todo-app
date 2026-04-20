import express from "express"
import { addTask, getTask, removeTask} from "../controllers/taskController.js"
import requireAuth from "../middleware/requireAuth.js";
const router = express.Router();

/**
 * @swagger
 * /api/task/addTask:
 *   post:
 *     summary: Thêm task mới
 *     tags: [Task]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [title]
 *             properties:
 *               title:
 *                 type: string
 *     responses:
 *       200:
 *         description: Task đã được tạo
 */
router.post("/addTask", requireAuth, addTask)

/**
 * @swagger
 * /api/task/getTask:
 *   get:
 *     summary: Lấy danh sách task
 *     tags: [Task]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Danh sách task
 */
router.get("/getTask",requireAuth, getTask)

/**
 * @swagger
 * /api/task/removeTask:
 *   get:
 *     summary: Xóa task
 *     tags: [Task]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: id
 *         schema:
 *           type: string
 *         required: true
 *         description: ID của task cần xóa
 *     responses:
 *       200:
 *         description: Task đã xóa
 */
router.get("/removeTask",requireAuth, removeTask)

export default router;