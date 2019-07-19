import React, { useContext } from 'react';
import ExpensesContext from '../../../../context/expenses-context';
import './Expense.css';

const Expense = ({ expense }) => {
    const { dispatch } = useContext(ExpensesContext);

    return (
        <div className = 'events_list-item'>
            <h1>{expense.title}</h1>
            <h2>{expense.body}</h2>
            <button className= 'btn' onClick={() => dispatch({ type: 'REMOVE_EXPENSE', title: expense.title })}>x</button>
        </div>
    );
};

export { Expense as default };