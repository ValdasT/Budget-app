const authResolver = require('./auth');
const eventsResolver = require('./events');
const bookingResolver = require('./booking');
const fileResolver = require('./files');
const expenseResolver = require('./expenses');
const incomeResolver = require('./incomes');

const rootResolver = {
  ...authResolver,
  ...eventsResolver,
  ...bookingResolver,
  ...fileResolver,
  ...expenseResolver,
  ...incomeResolver
};

module.exports = rootResolver;
