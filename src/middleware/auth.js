const jwt = require("jsonwebtoken");
const User = require("../model/user");
const {common} = require("../common");

const auth = async (req, res, next) => {
    try {
        const token = req.header('Authorization').replace('Bearer ', '');
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        const user = await User.findOne({_id: decoded._id, 'tokens.token': token})

        if(!user) {
            common.error(res, 'Authentication failed');
        }

        req.token = token;
        req.user = user;
        next();

    } catch(e) {
        common.error(res, 'Please Authenticate');
    }
}

module.exports = auth;