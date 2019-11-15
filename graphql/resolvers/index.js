const authResolver = require('./auth');
const fileResolver = require('./files');
const expenseResolver = require('./expenses');
const incomeResolver = require('./incomes');

const rootResolver = {
  ...authResolver,
  ...fileResolver,
  ...expenseResolver,
  ...incomeResolver
};

module.exports = rootResolver;
