const common = {
    success(res, result) {
        res.status(200).send({
            status: 1,
            result: result
        });
    },
    fail(res, err) {
        console.log("comm ", err);
        res.status(400).send({
            status: 0,
            error: err.message
        });
    },
    error(res, err) {
        res.status(400).send({
            status: 0,
            error: err
        })
    }
};

module.exports = {
    common
};