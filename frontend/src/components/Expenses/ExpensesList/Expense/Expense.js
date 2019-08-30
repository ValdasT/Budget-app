import React, { useContext, Fragment } from 'react';
import moment from 'moment';
import ExpensesContext from '../../../../context/expenses-context';
import { FaRegTimesCircle, FaRegEdit } from "react-icons/fa";
import './Expense.css';

const Expense = ({ expense }) => {

    const { removeExpense } = useContext(ExpensesContext);
    const { dispatch } = useContext(ExpensesContext);

    const dateBeautify = (milliseconds) => {
        return moment(milliseconds, 'x').format('MM-DD-YYYY');
    };

    return (
        <span className="card">
            <div style={{ background: 'rgb(249, 248, 248)' }}>
                <div className='card_title'> {expense.title}</div>
            </div>
            <div className='card_date'>{dateBeautify(expense.createdAt)}</div>
            <div className='card_group'>Group: {expense.group}</div>
            <div className='card_description'>{expense.description}</div>
            <div className='card_price'>-{expense.price} € </div>
            <button className='btn card_removeButton' onClick={() => removeExpense(expense._id)}>
                <i><FaRegTimesCircle size={20} /></i>
            </button>
            <button className='btn card_editButton' onClick={() => dispatch({ type: 'REMOVE_EXPENSE', title: expense.title })}>
                <i><FaRegEdit size={20} /></i>
            </button>
        </span>
    );
};

export { Expense as default };