const express = require("express");
const multer = require("multer");
const path = require("path");
const fs = require("fs");
const authMiddleware = require("../middleware/auth");
const { resolveUserPath } = require("../utils/storagePath");

const router = express.Router();

// IMPORTANT: in the FormData you send from the frontend, append the
// "path" field BEFORE the "file" field. Multer reads multipart fields
// in the order they're sent, so req.body.path won't be populated yet
// inside these callbacks if "file" comes first.
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        try {
            const relativePath = req.body.path || "";
            const destDir = resolveUserPath(req.user.userId, relativePath);
            fs.mkdirSync(destDir, { recursive: true });
            cb(null, destDir);
        } catch (err) {
            cb(err);
        }
    },

    filename: (req, file, cb) => {
        try {
            const relativePath = req.body.path || "";
            const destDir = resolveUserPath(req.user.userId, relativePath);

            const ext = path.extname(file.originalname);
            const base = path.basename(file.originalname, ext);
            let finalName = file.originalname;
            let counter = 1;

            while (fs.existsSync(path.join(destDir, finalName))) {
                finalName = `${base} (${counter})${ext}`;
                counter++;
            }

            cb(null, finalName);
        } catch (err) {
            cb(err);
        }
    },
});

const upload = multer({ storage });

router.post("/upload", authMiddleware, upload.single("file"), (req, res) => {
    if (!req.file) {
        return res.status(400).json({ success: false, message: "No file received." });
    }

    res.json({
        success: true,
        message: "File uploaded successfully",
        file: {
            name: req.file.filename,
            size: req.file.size,
            path: req.body.path || "",
        },
    });
});

module.exports = router;