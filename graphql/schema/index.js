const { buildSchema } = require('graphql');

module.exports = buildSchema(`

type Expense {
  _id: ID!
  title: String!
  description: String
  price: String!
  group: String!
  createdAt: String!
  updatedAt: String!
  creator: User!
  creatorId: String!
}

type Income {
  _id: ID!
  title: String!
  description: String!
  price: String!
  group: String!
  createdAt: String!
  updatedAt: String!
  creator: User!
  creatorId: String!
}

type Category {
  key: String!
  value: String!
}

type Settings{
  _id: ID!
  dailyBudget: String!
  weeklyBudget: String!
  monthlyBudget: String!
  categories: String!
  members: String!
  currency: String!
  creator: User!
  creatorId: String!
  creatorEmail: String!
}

type User {
  _id: ID!
  email: String!
  password: String
  name: String!
  surname: String!
  createdAt: String!
  updatedAt: String!
  userSettings: [Settings!]
  createdExpenses: [Expense!]
  createdIncomes: [Income!]
}

type AuthData {
  userId: ID!
  token: String!
}

type File {
  _id: ID!
  title: String!
  description: String!
}

input UserInput {
  email: String!
  password: String!
  name: String!
  surname: String!
  createdAt: String!
  updatedAt: String!
}

input FileInput {
  title: String!
  description: String!
}

input ExpenseInput {
  title: String!
  description: String
  price: String!
  group: String!
  createdAt: String!
  updatedAt: String!
}

input IncomeInput {
  title: String!
  description: String
  price: String!
  group: String!
  createdAt: String!
  updatedAt: String!
}

input SettingsInput {
  dailyBudget: String!
  weeklyBudget: String!
  monthlyBudget: String!
  categories: String!
  members: String!
  currency: String!
  userId: String!
  creatorEmail: String!
}

type RootQuery {
    allFiles: [File!]!
    login(email: String!, password: String!): AuthData!

    expenses: [Expense!]!
    expensesFilter (dateFrom: String!, dateTo: String!): [Expense!]!

    incomes: [Income!]!
    incomesFilter (dateFrom: String!, dateTo: String!): [Income!]!

    userData: [User!]!

    settingsData: [Settings!]!
}

type RootMutation {
    createFile (fileInput: FileInput): File
    deleteFile (fileId: ID!): File
    updateFile (fileId: ID!): File

    createExpense (expenseInput: ExpenseInput): Expense
    removeExpense (expenseId: ID!): Expense!
    updateExpense (expenseId: ID!, expenseInput: ExpenseInput): Expense!

    createIncome (incomeInput: IncomeInput): Income
    removeIncome (incomeId: ID!): Income!
    updateIncome (incomeId: ID!, incomeInput: IncomeInput): Income!

    createUser (userInput: UserInput): User
    updateUser (userId: ID!, name: String!, surname: String!, email: String!, updatedAt: String!): User!

    createSettings (settingsInput: SettingsInput): Settings
    updateSettings (settingsId: ID!, dailyBudget: String!, weeklyBudget: String!, monthlyBudget: String!, categories: String!, members: String!, currency: String!): Settings!
}

schema {
    query: RootQuery
    mutation: RootMutation
}
`);
