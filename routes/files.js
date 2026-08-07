const express = require('express');
const fs = require('fs');

const router = express.Router();

router.get('/files', (req, res) => {
    
    fs.readdir("uploads", (err, files) =>{

        if(err){
            return res.status(500).json({
                success: false,
                message: "Something went wrong"
            });
        }

        res.json({
            success: true,
            message: "Files fetched succesfully",
            files: files
        })
        
    })
})

module.exports = router;