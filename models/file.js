const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const fileSchema = new Schema({
    title: {
    type: String,
    required: true
  },
  description: {
    type: String,
    required: true
  }
});

module.exports = mongoose.model('File', fileSchema);