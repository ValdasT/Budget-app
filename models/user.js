const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const userSchema = new Schema({
  email: {
    type: String,
    required: true
  },
  password: {
    type: String,
    required: true
  },
  // name: {
  //   type: String,
  //   required: true
  // },
  // surname: {
  //   type: String,
  //   required: true
  // },
  createdEvents: [
    {
      type: Schema.Types.ObjectId,
      ref: 'Event'
    }
  ],
  createdIncomes: [
    {
      type: Schema.Types.ObjectId,
      ref: 'Income'
    }
  ],
  createdExpenses: [
    {
      type: Schema.Types.ObjectId,
      ref: 'Expense'
    }
  ],
  settings: [
    {
      type: Schema.Types.ObjectId,
      ref: 'Settings'
    }
  ]
});

module.exports = mongoose.model('User', userSchema);
