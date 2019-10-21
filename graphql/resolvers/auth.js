const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

const User = require('../../models/user');

module.exports = {
    createUser: async args => {
        try {
            const existingUser = await User.findOne({ email: args.userInput.email });
            if (existingUser) {
                throw new Error('User exists already.');
            }
            const hashedPassword = await bcrypt.hash(args.userInput.password, 12);
            const user = new User({
                email: args.userInput.email,
                password: hashedPassword,
                name: args.userInput.name,
                surname: args.userInput.surname,
                createdAt: args.userInput.createdAt,
                updatedAt: args.userInput.updatedAt,
            });

            const result = await user.save();
            return { ...result._doc, password: null, _id: result.id };
        } catch (err) {
            throw err;
        }
    },
    login: async ({ email, password }) => {
        try {
            const user = await User.findOne({ email: email });
            if (!user) {
                throw new Error('User does not exist!');
            }
            const isEqual = await bcrypt.compare(password, user.password);
            if (!isEqual) {
                throw new Error('Password is incorrect!');
            }
            const token = jwt.sign(
                { userId: user.id, email: user.email },
                'somesupersecretkey',
                {
                    expiresIn: '1h'
                }
            );
            return { userId: user.id, token: token, tokenExpiration: 1 };
        } catch (err) {
            throw err;
        }
    },
    userData: async (args, req) => {
        if (!req.isAuth) {
            throw new Error('Unauthenticated!');
        }
        try {
            const user = await User.find({ _id: req.userId });
            return user;
        } catch (err) {
            throw err;
        }
    },
    updateUser: async (args, req) => {
        if (!req.isAuth) {
            throw new Error('Unauthenticated!');
        }
        try {
            const user = await User.findByIdAndUpdate(args.userId,
                {
                    name: args.name,
                    surname: args.surname,
                    email: args.email,
                    updatedAt: args.updatedAt
                },
                { new: true });
            return {
                ...user._doc,
                _id: user.id
            }
        } catch (err) {
            throw err;
        }
    }
};
