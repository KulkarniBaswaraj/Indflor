const express = require('express');
const userRouter = require('./routers/user');
const taskRouter = require('./routers/task');

const cors = require('cors');
require("./db/mongoose");
const app = express();
const port = process.env.PORT;

app.use(express.json());
app.use(cors());

//API Routes
app.use(userRouter);
app.use(taskRouter);


app.listen(port, () => {
   console.info("Node server up on port ", port);
});