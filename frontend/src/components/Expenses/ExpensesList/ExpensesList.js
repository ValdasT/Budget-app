import React, { useContext} from 'react';
import Expense from './Expense/Expense';
import ExpensesContext from '../../../context/expenses-context';
import './ExpensesList.css';

const Expenselist = () => {
    const { allExpenses } = useContext(ExpensesContext);

    return (
        allExpenses.map((expense) => (
            <Expense className='expenses_list' key={expense._id} expense={expense} />
        )
        )
    );

};
        
export { Expenselist as default };