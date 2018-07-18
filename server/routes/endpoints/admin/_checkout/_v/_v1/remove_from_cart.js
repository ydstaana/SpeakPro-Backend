const Sched = require('./../../../../../../models/SchedSchema');

module.exports = async (req, res, next) => {
    const itemId = req.params.id;

    Sched.findById(itemId)
        .exec((err, sched) => {
            if(err){
                res.status(500).json({
                    code: 500,
                    message: err
                });
            }

            sched.available = true;
            sched.reservationDate = null;
            sched.reservee = null;
            sched.save();

            res.status(200).json({
                code: 200,
                message: `You have successfully remove the item from cart`,
            });
        });
};