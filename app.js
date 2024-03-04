const express = require('express');
const app = express()
const port = 5000;
const mongoose = require("mongoose");
const { mongoUrl } = require("./keys");
const cors = require("cors");

app.use(express.json())
app.use(cors({
    origin: ['http://localhost:3000','https://socialify-frontend.onrender.com'],
    credentials: true
}));
require('./models/model')
require('./models/post')
require('./models/message')
app.use(require("./routes/auth"))
app.use(require("./routes/createPost"))
app.use(require("./routes/user"))
// app.use(require("./routes/messageRoutes"))
mongoose.connect(mongoUrl);

mongoose.connection.on("connected", () => {
    console.log("successfully connected to mongo")
})

mongoose.connection.on("error", () => {
    console.log("not connected to mongodb")
})


app.listen(port, () => {
    console.log("server is running on port" + " " + port)

})