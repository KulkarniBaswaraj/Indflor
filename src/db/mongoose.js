const mongoose = require("mongoose");

const dbPath = process.env.MONGODB_URL;
const options = {
    useNewUrlParser: true,
    useCreateIndex: true
};

//connect to the DB
mongoose.connect(dbPath, options);


