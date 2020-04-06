const express = require('express');
const userRouter = require('./routers/user');
const taskRouter = require('./routers/task');

const cors = require('cors')
require("./db/mongoose");

const app = express();
const port = process.env.PORT;

app.use(express.json());

//API Routes
app.use(userRouter);
app.use(taskRouter);

app.use(cors())

app.listen(port, () => {
   console.info("Node server up on port ", port);
});