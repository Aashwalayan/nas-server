const express = require("express");
const fs = require("fs");
const authMiddleware = require("../middleware/auth");
const { resolveUserPath } = require("../utils/storagePath");

const router = express.Router();

router.delete("/delete", authMiddleware, (req, res) => {
    try {
        const { path: relativePath } = req.body;

        if (!relativePath) {
            return res.status(400).json({ success: false, message: "Path is required." });
        }

        const targetPath = resolveUserPath(req.user.userId, relativePath);

        if (!fs.existsSync(targetPath)) {
            return res.status(404).json({ success: false, message: "Not found." });
        }

        fs.rmSync(targetPath, { recursive: true, force: true });

        res.json({ success: true, message: "Deleted." });
    } catch (err) {
        res.status(400).json({ success: false, message: err.message || "Could not delete." });
    }
});

module.exports = router;