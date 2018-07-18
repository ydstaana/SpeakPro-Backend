const mongoose = require('mongoose')

const SchedSchema = new mongoose.Schema({
  timeSlot: String,
  day: String,
	teacher: {
		type: mongoose.Schema.Types.ObjectId,
		ref: 'User'
	},
	student : {
		type: mongoose.Schema.Types.ObjectId,
		ref: 'User',
		default: null
	},
	code: Number,
	available: Boolean,
	reservationDate: {
		type: Date,
		default: ''
	},
	reservee: {
		type: mongoose.Schema.Types.ObjectId,
		ref: 'User',
		default: null
	}
});

//This function drops all students from the class being deleted before deleting itself
SchedSchema.pre('remove', function(next) {
    this.update(
        { schedule : this._id},
        { $pull: { schedule: this._id } },
        { multi: true })  //if reference exists in multiple documents
    .exec();
    next();
});

module.exports = mongoose.model('Sched', SchedSchema);
