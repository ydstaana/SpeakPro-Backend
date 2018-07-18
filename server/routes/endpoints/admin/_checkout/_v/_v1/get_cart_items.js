const Sched = require('./../../../../../../models/SchedSchema');

module.exports = async (req, res, next) => {
    const reservee = req.params.id;

    Sched.find({reservee: reservee})
        .populate('teacher', 'firstName lastName')
        .sort({ code: 1 })
        .exec((err, scheds) => {
            if(err){
                res.status(500).json({
                    code: 500,
                    message: err
                });
            }

            res.status(200).json({
                code: 200,
                message: `You have successfully retrieved the cart items of ${reservee}`,
                content: scheds
            })
        });
};