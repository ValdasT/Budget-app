import React, { useState, useContext, Fragment } from 'react';
import moment from 'moment';
import ExpensesContext from '../../../context/expenses-context';
import ModalContext from '../../../context/modal-context';
import AddExpenseModal from '../../Modal/AddExpenseModal';
import Spinner from '../../Spinner/Spinner';
import InfoModal from '../../Modal/Modal';
import '../../../pages/Expenses.css';

const AddExpenseForm = () => {
    const { currentUser, allExpenses, setAllExpenses} = useContext(ExpensesContext);
    let [showModal, setShowModal] = useState(false);
    let [modalHeader, setModalHeader] = useState('');
    let [modalText, setModalText] = useState();
    let [isLoading, setIsLoading] = useState(false);
    let [showInfoModal, setShowInfoModal] = useState(false);

    const modalInfo = (show, header, text) => {
        setShowInfoModal(show);
        setModalHeader(header);
        setModalText(text);
    };

    const submitExpense = (fields) => {
        setIsLoading(true);
        let time = JSON.stringify(moment(fields.date).valueOf());
        const requestBody = {
            query: `
                      mutation CreateExpense($title: String!, $description: String, $price: String!, $group: String!, $createdAt: String!, $updatedAt: String! ) {
                        createExpense(expenseInput:{title: $title, description: $description, price: $price, group:$group, createdAt:$createdAt, updatedAt: $updatedAt}) {
                            _id
                            title
                            price
                            createdAt
                            updatedAt
                            description
                            group
                          }
                      }
                    `,
            variables: {
                title: fields.title,
                description: fields.description,
                price: fields.price,
                group: fields.group,
                createdAt: time,
                updatedAt: time
            }
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
                if (!res.ok) {
                    setIsLoading(false);
                    throw (res.statusText);
                }
                return res.json();
            })
            .then(res => {
                if (res.errors) {
                    throw (res.errors[0].message);
                }
                setIsLoading(false);
                setShowModal(false);
                modalInfo(true, 'Confirmation', 'Expense was created');
                setAllExpenses([...allExpenses, res.data.createExpense]);
                console.log(res.data.createExpense);
            })
            .catch(err => {
                setIsLoading(false);
                setShowModal(false);
                console.log(err);
                modalInfo(true, 'Error', err);
                throw err;
            });
    };

    return (
        <Fragment>
            <ModalContext.Provider value={{ showInfoModal, setShowInfoModal, submitExpense, modalHeader, modalText, showModal, setShowModal }}>
                {
                    isLoading ? <Spinner /> :
                        <Fragment>
                            <InfoModal />
                            <div className="expenses-control">
                                <div className="card-body text-center">
                                    <p className="card-text">Collect all your expenses</p>
                                    <button className='btn btn_addExpense' onClick={() => setShowModal(!showModal)}>add expense</button>
                                </div>
                            </div>
                            {showModal && (
                                <Fragment>
                                    <AddExpenseModal />
                                </Fragment>
                            )}
                        </Fragment>
                }
            </ModalContext.Provider>
        </Fragment >
    );
};

export { AddExpenseForm as default };