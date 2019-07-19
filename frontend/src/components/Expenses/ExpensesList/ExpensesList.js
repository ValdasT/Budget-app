import React, { useContext } from 'react';
import Expense from './Expense/Expense';
import ExpensesContext from '../../../context/expenses-context';
import './ExpensesList.css';

const Expenselist = () => {
    const { expenses } = useContext(ExpensesContext);

    return expenses.map((expense) => (
        <Expense className = 'expenses_list' key={expense.title} expense={expense} />
    ));
};

export { Expenselist as default };