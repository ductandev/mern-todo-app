import express from "express";

const router = express.Router();

const BUILD_VERSION = process.env.BUILD_VERSION || "dev";
const BUILD_TIME = process.env.BUILD_TIME || new Date().toISOString();
const BUILD_COMMIT = process.env.BUILD_COMMIT || "unknown";

/**
 * @swagger
 * /api/test/build:
 *   get:
 *     summary: Health check — xác nhận build và deploy thành công
 *     tags: [Test]
 *     security: []
 *     responses:
 *       200:
 *         description: Build và deploy thành công
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status:
 *                   type: string
 *                   example: ok
 *                 message:
 *                   type: string
 *                   example: Build deployed successfully
 *                 version:
 *                   type: string
 *                 commit:
 *                   type: string
 *                 buildTime:
 *                   type: string
 *                 serverTime:
 *                   type: string
 *                 uptime:
 *                   type: number
 */
router.get("/build", (_req, res) => {
  res.status(200).json({
    status: "ok",
    message: "Build deployed successfully",
    version: BUILD_VERSION,
    commit: BUILD_COMMIT,
    buildTime: BUILD_TIME,
    serverTime: new Date().toISOString(),
    uptime: process.uptime(),
  });
});

export default router;
