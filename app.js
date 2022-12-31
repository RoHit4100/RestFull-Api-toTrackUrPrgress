const express = require('express');
const bodyParser = require('body-parser');
const _ = require('lodash');
const mongoose = require('mongoose');
const app = express();
const port = process.env.PORT || 3000;
main().catch(err => console.log(err));

async function main() {
    mongoose.set('strictQuery', true);
    await mongoose.connect('mongodb://127.0.0.1:27017/apiDb');
}

app.listen(port, function () {
    console.log("Server is running on port" + port);
})