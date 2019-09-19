const Income = require('../../models/income');
const User = require('../../models/user');

const { transformIncome } = require('./merge');

module.exports = {

    removeIncome: async (args, req) => {
        if (!req.isAuth) {
            throw new Error('Unauthenticated!');
        }
        try {
            const income = await Income.findById(args.incomeId).populate('income');
            await Income.deleteOne({ _id: args.incomeId });
            return income;
        } catch (err) {
            throw err;
        }
    },

    incomes: async (args, req) => {
        if (!req.isAuth) {
            throw new Error('Unauthenticated!');
        }
        try {
            const incomes = await Income.find({ creator: req.userId });
            return incomes.map(income => {
                return transformIncome(income);
            });
        } catch (err) {
            throw err;
        }
    },

    incomesFilter: async (args, req) => {
        if (!req.isAuth) {
            throw new Error('Unauthenticated!');
        }
        try {
            const incomes = await Income.find({
                creator: req.userId,
                createdAt: {$gte: args.dateFrom, $lte:args.dateTo}
            });
            return incomes.map(income => {
                return transformIncome(income);
            });
        } catch (err) {
            throw err;
        }
    },

    createIncome: async (args, req) => {
        console.log(args);
        if (!req.isAuth) {
            throw new Error('Unauthenticated!');
        }
        const income = new Income({
            title: args.incomeInput.title,
            description: args.incomeInput.description,
            price: args.incomeInput.price,
            group: args.incomeInput.group,
            createdAt: args.incomeInput.createdAt,
            updatedAt: args.incomeInput.updatedAt,
            creator: req.userId
        });
        let createdIncome;
        try {
            const result = await income.save();
            createdIncome = transformIncome(result);
            const creator = await User.findById(req.userId);

            if (!creator) {
                throw new Error('User not found.');
            }
            creator.createdIncomes.push(income);
            await creator.save();

            return createdIncome;
        } catch (err) {
            console.log(err);
            throw err;
        }
    },

    updateIncome: async (args, req) => {
        if (!req.isAuth) {
            throw new Error('Unauthenticated!');
        }
        try {
            console.log(args);
            const income = await Income.findByIdAndUpdate(args.incomeId,
                {
                    title: args.incomeInput.title,
                    description: args.incomeInput.description,
                    price: args.incomeInput.price,
                    group: args.incomeInput.group,
                    createdAt: args.incomeInput.createdAt,
                    updatedAt: args.incomeInput.updatedAt
                },
                { new: true });
            return {
                ...income._doc,
                _id: income.id
            }
        } catch (err) {
            throw err;
        }
    }

    // updateExpense: async (args, req) => {
    //     if (!req.isAuth) {
    //         throw new Error('Unauthenticated!');
    //     }
    //     try {
    //         const expense = await Expense.findByIdAndUpdate(args.expenseId,
    //             {
    //                 title: args.expenseInput.title,
    //                 description: args.expenseInput.description,
    //                 price: args.expenseInput.price,
    //                 group: args.expenseInput.group,
    //                 createdAt: args.expenseInput.createdAt,
    //                 updatedAt: args.expenseInput.updatedAt
    //             },
    //             { new: true });
    //         return {
    //             ...expense._doc,
    //             _id: expense.id
    //         }
    //     } catch (err) {
    //         throw err;
    //     }
    // }
}