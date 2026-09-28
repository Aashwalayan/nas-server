const express = require("express");
const fs = require("fs");
const authMiddleware = require("../middleware/auth");
const { resolveUserPath } = require("../utils/storagePath");

const router = express.Router();

router.post("/folders", authMiddleware, (req, res) => {
    try {
        const { path: relativePath = "", name } = req.body;

        if (!name || typeof name !== "string" || !name.trim()) {
            return res.status(400).json({ success: false, message: "Folder name is required." });
        }

        // strip slashes out of the name itself — the "path" field is how
        // you nest folders, the name shouldn't be able to add extra nesting
        const safeName = name.trim().replace(/[/\\]/g, "");
        const newRelativePath = relativePath ? `${relativePath}/${safeName}` : safeName;
        const targetPath = resolveUserPath(req.user.userId, newRelativePath);

        if (fs.existsSync(targetPath)) {
            return res.status(409).json({ success: false, message: "A folder with that name already exists here." });
        }

        fs.mkdirSync(targetPath, { recursive: true });

        res.json({
            success: true,
            message: "Folder created",
            folder: { name: safeName, path: newRelativePath },
        });
    } catch (err) {
        res.status(400).json({ success: false, message: err.message || "Could not create folder." });
    }
});

module.exports = router;