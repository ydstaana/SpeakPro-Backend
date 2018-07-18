const moment = require('moment');
const Sched = require('./../../../../../../models/SchedSchema');

const reservationDate = moment();
let reservee = null;

module.exports = async (req, res, next) => {
    const items = req.body.items;
    reservee = req.body.id;
    reserveClasses(items, res);
};

async function reserveClasses(items, res){
    let reserved = [];
    let notReserved = [];

    for(let i = 0; i < items.length; i++){
        try{
            const item = await findSched(items[i]);
            reserved.push(item);
        } catch(e) {
            notReserved.push(e);
        }
    }

    if(reserved.length > 0 && notReserved.length == 0){
        res.status(200).json({
            code: 200,
            message: 'Successfully reserved all of the selected classes',
            reserved: reserved,
            notReserved: null
        });
    }
    else if(reserved.length == 0 && notReserved.length > 0){
        res.status(500).json({
            code: 500,
            message: 'All of the selected classes are already reserved',
            reserved: null,
            notReserved: notReserved
        }); 
    }
    else if(reserved.length > 0 && notReserved.length > 0){
        res.status(500).json({
            code: 500,
            message: 'Some of the selected classes are already reserved',
            reserved: reserved,
            notReserved: notReserved
        }); 
    }
    else{
        res.status(500).json({
            code: 500,
            message: 'An error occured',
            reserved: null,
            notReserved: null
        });
    }
}


function findSched(item){
    return new Promise((resolve, reject) => {
        Sched.findById(item)
        .populate('teacher', 'firstName lastName')
        .exec((err, sched) => {
            if(sched.reservationDate == null) {
                sched.available = false;
                sched.reservationDate = reservationDate;
                sched.reservee = reservee;
                sched.save();
                resolve(sched);
            }
            reject(sched);
        });
    });
}