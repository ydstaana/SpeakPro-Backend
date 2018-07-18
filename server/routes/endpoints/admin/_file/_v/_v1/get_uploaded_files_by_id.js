var mongoose = require('mongoose');
var File = require('../../../../../../models/FileSchema.js');

module.exports = function (req, res, next) {
  File.find({ author: req.params.id })
    .populate('author', 'firstName lastName')
    .sort({ fileName: 1 })
    .exec((err, files) => {
      if (err) {
        res.status(500).json({
          code: 500,
          message: err
        });
      }

      res.status(200).json({
        code: 200,
        message: 'Successfully fetched files by author id',
        data: files
      });
    });
}
