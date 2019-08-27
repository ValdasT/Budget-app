
import React, { useEffect,useState, useReducer, Fragment } from 'react';
import expensesReducer from '../reducers/expenses';
import ExpensesContext from '../context/expenses-context';
import ExpenseList from '../components/Expenses/ExpensesList/ExpensesList';
import AddExpense from '../components/Expenses/AddExpense/AddExpense';
import './Expenses.css';

import AuthContext from '../context/auth-context';


const Expenses = () => {
    let currentUser = AuthContext._currentValue;
    let [allExpenses, setallExpenses] = useState([]);

    useEffect(() => {
        getDate();
    }, []);
    
    const getDate = () => {
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
                console.log(res);
                if (res.status !== 200 && res.status !== 201) {
                    throw new Error('Failed!');
                }
                return res.json();
            })
            .then(resData => {
                setallExpenses(resData.data.expenses);
                console.log(resData);

            })
            .catch(err => {
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
        <ExpensesContext.Provider value={{ currentUser, allExpenses, setallExpenses, dispatch }}>
            <AddExpense />
            <div className='center'>
            <ExpenseList />
            </div>

        </ExpensesContext.Provider>
    );
};

export { Expenses as default };
