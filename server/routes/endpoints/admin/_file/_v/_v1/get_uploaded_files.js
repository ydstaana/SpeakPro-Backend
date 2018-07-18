var mongoose = require('mongoose');
var File = require('../../../../../../models/FileSchema.js');

module.exports = function (req, res, next) {
  File.find({})
    .populate('author', 'firstName lastName')
    .exec(function (err, files) {
      console.log(files)
      if (err) res.status(500).json({
        code: 500,
        message: err
      });
      res.status(200).json(files);
    });
}
