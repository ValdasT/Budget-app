const DataLoader = require('dataloader');

const User = require('../../models/user');
const { dateToString } = require('../../helpers/date');

const userLoader = new DataLoader(userIds => {
  return User.find({ _id: { $in: userIds } });
});

const user = async userId => {
  try {
    const user = await userLoader.load(userId.toString());
    return {
      ...user._doc,
      _id: user.id,
      createdEvents: () => eventLoader.loadMany(user._doc.createdEvents)
    };
  } catch (err) {
    throw err;
  }
};

const transformExpense = expense => {
  return {
    ...expense._doc,
    _id: expense.id,
    creator: user.bind(this, expense.creator)
  }
}

const transformSetting = setting => {
  return {
    ...setting._doc,
    _id: setting.id,
    creator: user.bind(this, setting.creator)
  }
}

const transformIncome = income => {
  return {
    ...income._doc,
    _id: income.id,
    creator: user.bind(this, income.creator)
  }
}


exports.transformExpense = transformExpense;
exports.transformIncome = transformIncome;
exports.transformSetting = transformSetting;
