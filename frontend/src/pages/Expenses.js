import React, { useEffect, useState, useReducer, Fragment } from 'react';
import expensesReducer from '../reducers/expenses';
import ExpensesContext from '../context/expenses-context';
import ExpenseList from '../components/Expenses/ExpensesList/ExpensesList';
import AddExpense from '../components/Expenses/AddExpense/AddExpense';
import Spinner from '../components/Spinner/Spinner';
import './Expenses.css';

import AuthContext from '../context/auth-context';

const Expenses = () => {
    let currentUser = AuthContext._currentValue;
    let [isLoading, setIsLoading] = useState(false);
    let [allExpenses, setAllExpenses] = useState([]);

    useEffect(() => {
        getExpenseList();
    }, []);

    const removeExpense = expenseId => {
        const requestBody = {
            query: `
              mutation RemoveExpense($id: ID!) {
                removeExpense(expenseId: $id) {
                _id
                 title
                }
              }
            `,
            variables: {
                id: expenseId
            }
        };
        fetch('/graphql', {
            method: 'POST',
            body: JSON.stringify(requestBody),
            headers: {
                'Content-Type': 'application/json',
                Authorization: 'Bearer ' + currentUser.token
            }
        })
            .then(res => {
                console.log(res);
                if (res.status !== 200 && res.status !== 201) {
                    throw new Error('Failed!');
                }
                return res.json();
            })
            .then(res => {
                let newExpensesList = [];
                allExpenses.forEach(expense => {
                    if (expense._id != res.data.removeExpense._id) {
                        newExpensesList.push(expense);
                    }
                });
                setAllExpenses(newExpensesList);
            })
            .catch(err => {

                console.log(err);
            });
    };

    const getExpenseList = () => {
        setIsLoading(true);
        const requestBody = {
            query: `
              query {
                expenses {
                    _id
                    title
                    description
                    price
                    group
                    createdAt
                    updatedAt
                  }
              }`
        };
        fetch('/graphql', {
            method: 'POST',
            body: JSON.stringify(requestBody),
            headers: {
                'Content-Type': 'application/json',
                Authorization: 'Bearer ' + currentUser.token
            }
        })
            .then(res => {
                setIsLoading(false);
                if (res.status !== 200 && res.status !== 201) {
                    throw new Error('Failed!');
                }
                return res.json();
            })
            .then(resData => {
                setIsLoading(false);
                setAllExpenses(resData.data.expenses);
                console.log(resData.data.expenses);

            })
            .catch(err => {
                setIsLoading(false);
                console.log(err);
            });
    };

    const [expenses, dispatch] = useReducer(expensesReducer, []);

    // useEffect(() => {
    //     const expenses = JSON.parse(localStorage.getItem('expenses'));

    //     if (expenses) {
    //         dispatch({ type: 'POPULATE_EXPENSES', expenses });
    //     }
    // }, []);

    // useEffect(() => {
    //     localStorage.setItem('expenses', JSON.stringify(expenses));
    // }, [expenses]);


    return (
        <ExpensesContext.Provider value={{ currentUser, allExpenses, setAllExpenses, removeExpense }}>
            {
                isLoading ? <Spinner /> :
                    <Fragment>
                        <AddExpense />
                        <div className='center'>
                            <ExpenseList />
                        </div>
                    </Fragment>
            }
        </ExpensesContext.Provider>
    );
};

export { Expenses as default };
