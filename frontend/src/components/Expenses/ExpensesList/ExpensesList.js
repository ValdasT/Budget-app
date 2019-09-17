import React, { useContext, Fragment} from 'react';
import Expense from './Expense/Expense';
import AddExpense from '../AddExpense/AddExpense';
import ExpensesContext from '../../../context/expenses-context';
import './ExpensesList.css';

const Expenselist = () => {
    const { allExpenses } = useContext(ExpensesContext);

    return (
        <Fragment>
            <AddExpense/>
            {
                allExpenses.map((expense) => (
                    <Expense className='expenses_list' key={expense._id} expense={expense} />
                ))
            }
        </Fragment>
    );
};
                
export { Expenselist as default };