const express = require('express');
const fs = require('fs');
const path = require('path');

const router = express.Router();

router.delete("/delete/:filename", (req, res) => {
    const filePath = path.join(__dirname, "../uploads", req.params.filename);



    fs.unlink(filePath, (err) => {

        if (err) {
            return res.status(404).json({
                success: false,
                message: "file not found",
            });
        }

        res.json({
            success: true,
            message: "file deleted succesfully",
        });
    });
});

module.exports = router;