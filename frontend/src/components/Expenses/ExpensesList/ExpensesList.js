import React, { useContext, Fragment} from 'react';
import Expense from './Expense/Expense';
import AddExpense from '../AddExpense/AddExpense';
import ExpensesContext from '../../../context/expenses-context';
import './ExpensesList.css';

const Expenselist = () => {
    const { allExpenses, settings } = useContext(ExpensesContext);

    return (
        <Fragment>
            <AddExpense/>
            {
                allExpenses.map((expense) => (
                    settings.map((setting) => (
                        expense.creatorId === setting.creatorId? <Expense className='expenses_list' key={expense._id} expense={expense} setting={setting} />: null
                    ))
                ))
            }
        </Fragment>
    );
};
                
export { Expenselist as default };