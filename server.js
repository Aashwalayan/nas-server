const express = require('express');
const cors = require('cors');


const app = express();

app.use(cors());
app.use(express.json());

app.get( '/', (req, res) => {
    res.send("hello world")
});

const PORT = process.env.PORT || 5500

app.listen(PORT, () =>{
    console.log(`server is running on port ${PORT}`)
});