
import React, { useEffect, useReducer } from 'react';
import expensesReducer from '../reducers/expenses';
import ExpensesContext from '../context/expenses-context';
import ExpenseList from '../components/Expenses/ExpensesList/ExpensesList';
import AddExpense from '../components/Expenses/AddExpense/AddExpense';


const Expenses = () => {

    const [expenses, dispatch] = useReducer(expensesReducer, []);

    useEffect(() => {
        const expenses = JSON.parse(localStorage.getItem('expenses'));

        if (expenses) {
            dispatch({ type: 'POPULATE_EXPENSES', expenses });
        }
    }, []);

    useEffect(() => {
        localStorage.setItem('expenses', JSON.stringify(expenses));
    }, [expenses]);


    return (
        
        <ExpensesContext.Provider value={{ expenses, dispatch }}>
            <AddExpense/>
            <ExpenseList/>
        </ExpensesContext.Provider>
    );
};

export { Expenses as default };
