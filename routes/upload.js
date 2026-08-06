const express = require("express");
const multer = require("multer");

const router = express.Router();

const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, "uploads/");
    },

    filename: (req, file, cb) => {
        cb(null, file.originalname);
    },
});

const upload = multer({ storage });

router.get("/test", (req, res) => {
    res.send("Working");
});

router.post("/upload", upload.single("file"), (req, res) => {
    res.json({
        success: true,
        message: "File uploaded successfully",
        file: req.file,
    });
});

module.exports = router;