const express = require("express");
const fs = require("fs");
const path = require("path");
const authMiddleware = require("../middleware/auth");
const { resolveUserPath } = require("../utils/storagePath");

const router = express.Router();

router.get("/files", authMiddleware, (req, res) => {
    try {
        const relativePath = req.query.path || "";
        const dirPath = resolveUserPath(req.user.userId, relativePath);

        if (!fs.existsSync(dirPath)) {
            return res.json({ success: true, files: [] });
        }

        const entries = fs.readdirSync(dirPath, { withFileTypes: true }).map((entry) => {
            const entryPath = path.join(dirPath, entry.name);
            const stats = fs.statSync(entryPath);
            return {
                name: entry.name,
                type: entry.isDirectory() ? "folder" : "file",
                size: entry.isDirectory() ? null : stats.size,
                modifiedAt: stats.mtime,
                path: relativePath ? `${relativePath}/${entry.name}` : entry.name,
            };
        });

        res.json({ success: true, files: entries });
    } catch (err) {
        res.status(400).json({ success: false, message: err.message || "Could not list files." });
    }
});

module.exports = router;