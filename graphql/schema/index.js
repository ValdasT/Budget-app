const { buildSchema } = require('graphql');

module.exports = buildSchema(`
type Booking {
    _id: ID!
    event: Event!
    user: User!
    createdAt: String!
    updatedAt: String!
}

type Event {
  _id: ID!
  title: String!
  description: String!
  price: Float!
  date: String!
  creator: User!
}

type Expense {
  _id: ID!
  title: String!
  description: String!
  price: Float!
  createdAt: String!
  updatedAt: String!
  creator: User!
}

type Income {
  _id: ID!
  title: String!
  description: String!
  price: Float!
  createdAt: String!
  updatedAt: String!
  creator: User!
}

type Category {
  key: String!
  value: String!
}

type Settings{
  _id: ID!
  categories: [Category!]
}

type User {
  _id: ID!
  email: String!
  password: String
  name: String!
  surname: String!
  userSettings: [Settings!]
  createdEvents: [Event!]
  createdExpenses: [Expense!]
  createdIncomes: [Income!]
}

type AuthData {
  userId: ID!
  token: String!
  tokenExpiration: Int!
}

type File {
  _id: ID!
  title: String!
  description: String!
}

input EventInput {
  title: String!
  description: String!
  price: Float!
  date: String!
}

input UserInput {
  email: String!
  password: String!
  name: String!
  surname: String!
}

input FileInput {
  title: String!
  description: String!
}

type RootQuery {
    allFiles: [File!]!
    events: [Event!]!
    bookings: [Booking!]!
    login(email: String!, password: String!): AuthData!
}

type RootMutation {
    createFile(fileInput: FileInput): File
    deleteFile(fileId: ID!): File
    updateFile(fileId: ID!): File

    createEvent(eventInput: EventInput): Event
    createUser(userInput: UserInput): User

    bookEvent(eventId: ID!): Booking!
    cancelBooking(bookingId: ID!): Event!
}

schema {
    query: RootQuery
    mutation: RootMutation
}
`);
