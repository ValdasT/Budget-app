import React, { useContext, useState, Fragment } from 'react';
import moment from 'moment';
import ExpensesContext from '../../../../context/expenses-context';
import AuthContext from '../../../../context/auth-context';
import ModalContext from '../../../../context/modal-context';
import AddExpenseModal from '../../../Modal/AddExpenseModal';
import ConfirmationModal from '../../../Modal/confirmationModal';
import { FaRegTimesCircle, FaRegEdit } from "react-icons/fa";
import './Expense.css';

const Expense = ({ expense, setting }) => {

    let currentUser = AuthContext._currentValue;
    let [showInfoModal, setShowInfoModal] = useState(false);
    let [modalText, setModalText] = useState();
    let [doc, setDoc] = useState();
    let [showModal, setShowModal] = useState(false);
    let onUpdate = true;
    let currencyValue = setting.currency === 'GBD' ? '£' : setting.currency === 'Dollar' ? '$' : '€';                                                           
    
    const modalInfo = (show, text, id) => {
        setShowInfoModal(show);
        setModalText(text);
        setDoc(id);
    };

    const { removeExpense, updateExpense, showMore} = useContext(ExpensesContext);

    const dateBeautify = (milliseconds) => {
        return moment(milliseconds, 'x').format('MM/DD/YYYY');
    };

    const actionFunction = () => {
        removeExpense(doc);
    };

    const submitExpense = (updatedFields) => {
        updatedFields.id = expense._id;
        updateExpense(updatedFields);
    };

    return (
        <ModalContext.Provider value={{ modalText, showInfoModal, setShowInfoModal, actionFunction, showModal, setShowModal, expense, onUpdate, submitExpense }}>
            <ConfirmationModal />
            <AddExpenseModal setting={setting} />
            <span className={!showMore ? 'card' : 'card_more'}>
                <div style={{ background: 'rgb(249, 248, 248)' }}>
                    <div className={!showMore ? 'card_title' : 'card_title_more'}> {expense.title}</div>
                </div>
                <div className={'card_date'}>{dateBeautify(expense.createdAt)}</div>
                <div className={!showMore ? 'card_group invisible' : 'card_group'}>Group: {expense.group}</div>
                <div className={!showMore ? 'card_group invisible' : 'card_group'}>Creator: {setting.creatorEmail}</div>
                <div className={!showMore ? 'card_description invisible' : 'card_description'}>{expense.description}</div>
                {expense.tag === 'Expense' ? <div className='card_price_expense'>-{expense.price} {currencyValue} </div> : <div className='card_price_income'>{expense.price} {currencyValue} </div>}
                {
                    currentUser.userId === setting.creatorId ?
                        <Fragment>
                            <button className='btn card_removeButton' onClick={() => modalInfo(true, 'Are you sure whant to delete this item?', expense)}>
                                <i><FaRegTimesCircle size={20} /></i>
                            </button>
                            <button className='btn card_editButton' onClick={() => setShowModal(!showModal)}>
                                <i><FaRegEdit size={20} /></i>
                            </button>
                        </Fragment> :
                        <Fragment>
                            <button className='btn card_removeButton disabled' disabled onClick={() => modalInfo(true, 'Are you sure whant to delete this item?', expense)}>
                                <i><FaRegTimesCircle size={20} /></i>
                            </button>
                            <button className='btn card_editButton disabled' disabled onClick={() => setShowModal(!showModal)}>
                                <i><FaRegEdit size={20} /></i>
                            </button>
                        </Fragment>
                }
            </span>
        </ModalContext.Provider>
    );
};

export { Expense as default };