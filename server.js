const express = require('express');
const app = express();
const path = require('path');

app.use(express.static("client/public"));

app.route('/*')
    .get(function (req, res) {
        res.sendFile(path.join(__dirname + '/client/views/index.html'));
    })
const port = 3000;
app.listen(port, () => console.log(`Listening at port: ${port}`));