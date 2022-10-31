const serverless = require('serverless-http');
const express = require('express');
const app = express();
const cors = require("cors");
require("dotenv").config({ path: "./config.env" });
const port = process.env.NODE_DOCKER_PORT || 3000;

// Runs on local port if ran using node app.js local
let local:boolean = false;
process.argv.forEach(function(val, index, array) {
    if (index === 2 && val === 'local') {
        local = true;
    }
});

const db = require("./app/models");

console.log(db.url);

db.mongoose
    .connect(db.url, {
        useNewUrlParser: true,
        useUnifiedTopology: true
    })
    .then(() => {
        console.log("Connected to the database!");
    })
    .catch(err => {
        console.log("Cannot connect to the database!", err);
        process.exit();
    });

app.use(require("./app/routes/record"));
app.use(cors());
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.get('/api/info', (req, res) => {
  res.send({ application: 'sample-app', version: '1' });
});
app.post('/api/v1/getback', (req, res) => {
  res.send({ ...req.body });
});

if (local) {
    app.listen(port, () => console.log(`Listening on: ${port}`));
}
else {
    module.exports.handler = serverless(app);
}