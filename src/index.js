const express = require('express');
const userRouter = require('./routers/user');
const taskRouter = require('./routers/task');
const path = require('path');

const cors = require('cors');
require("./db/mongoose");
const app = express();
const port = process.env.PORT;

app.use(express.json());
app.use(cors());

//API Routes
app.use(userRouter);
app.use(taskRouter);

// set public resources folder
app.use(express.static(__dirname + '/../public/'));

// set your first route
app.get('/', (req, res) => {
   res.sendFile(path.join(__dirname, '/../public/index.html'));
});
app.listen(port, () => {
   console.info("Node server up on port ", port);
});