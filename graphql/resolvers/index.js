const authResolver = require('./auth');
const eventsResolver = require('./events');
const bookingResolver = require('./booking');
const fileResolver = require('./files');

const rootResolver = {
  ...authResolver,
  ...eventsResolver,
  ...bookingResolver,
  ...fileResolver
};

module.exports = rootResolver;
