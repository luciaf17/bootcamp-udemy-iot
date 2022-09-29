const express = require('express');
const morgan = require('morgan');
const cors = require('cors');
const mongoose = require('mongoose');
const colors = require('colors');

const app = express();

//express config
app.use(morgan('tiny'));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cors());

//express routes
app.use('/api', require('./routes/devices.js'));
app.use("/api", require("./routes/users.js"));
app.use("/api", require("./routes/templates.js"));
app.use("/api", require("./routes/webhooks.js"));
app.use("/api", require("./routes/emqxapi.js"));
app.use("/api", require("./routes/alarms.js"));
app.use("/api", require("./routes/dataprovider.js"));

module.exports = app;

//listener
app.listen(3001, () => {
    console.log('Server on port 3001'.green);
});

//endpoint test
app.get("/testing", (req, res) => {
    console.log("Hello World");
});

//mongo connection
const mongoUserName = "devuser";
const mongoPassword = "devpassword";
const mongoHost = "localhost";
const mongoPort = "27017";
const mongoDataBase = "smart-green";

const mongoUri = `mongodb://${mongoUserName}:${mongoPassword}@${mongoHost}:${mongoPort}/${mongoDataBase}`;

const options = {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    useCreateIndex: true,
    authSource: 'admin'
}

    mongoose.connect(mongoUri, options).then(
        () => {
          console.log("\n");
          console.log("*******************************".green);
          console.log("✔ Mongo Successfully Connected!".green);
          console.log("*******************************".green);
          console.log("\n");
        },
        (err) => {
          console.log("\n");
          console.log("*******************************".red);
          console.log("    Mongo Connection Failed    ".red);
          console.log("*******************************".red);
          console.log("\n");
          console.log(err);
        }
      );

