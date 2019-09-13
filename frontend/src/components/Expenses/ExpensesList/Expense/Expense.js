import React, { useContext, useState } from 'react';
import moment from 'moment';
import ExpensesContext from '../../../../context/expenses-context';
import ModalContext from '../../../../context/modal-context';
import AddExpenseModal from '../../../Modal/AddExpenseModal';
import ConfirmationModal from '../../../Modal/confirmationModal';
import { FaRegTimesCircle, FaRegEdit } from "react-icons/fa";
import './Expense.css';

const Expense = ({ expense }) => {

    let [showInfoModal, setShowInfoModal] = useState(false);
    let [modalText, setModalText] = useState();
    let [docId, setDocId] = useState();
    let [showModal, setShowModal] = useState(false);
    let onUpdate = true;

    const modalInfo = (show, text, id) => {
        setShowInfoModal(show);
        setModalText(text);
        setDocId(id);
    };

    const { removeExpense, updateExpense } = useContext(ExpensesContext);

    const dateBeautify = (milliseconds) => {
        return moment(milliseconds, 'x').format('MM-DD-YYYY');
    };

    const actionFunction = () => {
        removeExpense(docId);
    };

    const submitExpense = (updatedFields) => {
        updatedFields.id = expense._id;
        updateExpense(updatedFields);
    };

    return (
        <ModalContext.Provider value={{ modalText, showInfoModal, setShowInfoModal, actionFunction, showModal, setShowModal, expense, onUpdate, submitExpense}}>
            <ConfirmationModal />
            <AddExpenseModal />
            <span className="card">
                <div style={{ background: 'rgb(249, 248, 248)' }}>
                    <div className='card_title'> {expense.title}</div>
                </div>
                <div className='card_date'>{dateBeautify(expense.createdAt)}</div>
                <div className='card_group'>Group: {expense.group}</div>
                <div className='card_description'>{expense.description}</div>
                <div className='card_price'>-{expense.price} € </div>
                <button className='btn card_removeButton' onClick={() => modalInfo(true,'Are you sure whant to delete this item?', expense._id)}>
                    <i><FaRegTimesCircle size={20} /></i>
                </button>
                <button className='btn card_editButton' onClick={() => setShowModal(!showModal)}>
                    <i><FaRegEdit size={20} /></i>
                </button>
            </span>
        </ModalContext.Provider>
    );
};

export { Expense as default };