const Expense = require('../../models/expense');
const User = require('../../models/user');

const { transformExpense } = require('./merge');

module.exports = {

    removeExpense: async (args, req) => {
        if (!req.isAuth) {
            throw new Error('Unauthenticated!');
        }
        try {
            const expense = await Expense.findById(args.expenseId).populate('expense');
            await Expense.deleteOne({ _id: args.expenseId });
            return expense;
        } catch (err) {
            throw err;
        }
    },

    expenses: async (args, req) => {
        if (!req.isAuth) {
            throw new Error('Unauthenticated!');
        }
        try {
            const expenses = await Expense.find({ creator: req.userId });
            return expenses.map(expense => {
                return transformExpense(expense);
            });
        } catch (err) {
            throw err;
        }
    },

    expensesFilter: async (args, req) => {
        if (!req.isAuth) {
            throw new Error('Unauthenticated!');
        }
        try {
            const expenses = await Expense.find({
                creator: req.userId,
                createdAt: {$gte: args.dateFrom, $lte:args.dateTo}
            });
            return expenses.map(expense => {
                return transformExpense(expense);
            });
        } catch (err) {
            throw err;
        }
    },

    createExpense: async (args, req) => {
        if (!req.isAuth) {
            throw new Error('Unauthenticated!');
        }
        const expense = new Expense({
            title: args.expenseInput.title,
            description: args.expenseInput.description,
            price: args.expenseInput.price,
            group: args.expenseInput.group,
            createdAt: args.expenseInput.createdAt,
            updatedAt: args.expenseInput.updatedAt,
            creator: req.userId
        });
        let createdExpense;
        try {
            const result = await expense.save();
            createdExpense = transformExpense(result);
            const creator = await User.findById(req.userId);

            if (!creator) {
                throw new Error('User not found.');
            }
            creator.createdExpenses.push(expense);
            await creator.save();

            return createdExpense;
        } catch (err) {
            console.log(err);
            throw err;
        }
    },

    updateExpense: async (args, req) => {
        if (!req.isAuth) {
            throw new Error('Unauthenticated!');
        }
        try {
            const expense = await Expense.findByIdAndUpdate(args.expenseId,
                {
                    title: args.expenseInput.title,
                    description: args.expenseInput.description,
                    price: args.expenseInput.price,
                    group: args.expenseInput.group,
                    createdAt: args.expenseInput.createdAt,
                    updatedAt: args.expenseInput.updatedAt
                },
                { new: true });
            return {
                ...expense._doc,
                _id: expense.id
            }
        } catch (err) {
            throw err;
        }
    }
}