import React, { useEffect, useState, Fragment } from 'react';
import moment from 'moment';
import ExpensesContext from '../context/expenses-context';
import ModalContext from '../context/modal-context';
import ExpenseList from '../components/Expenses/ExpensesList/ExpensesList';
import AddExpense from '../components/Expenses/AddExpense/AddExpense';
import InfoModal from '../components/Modal/Modal';
import Spinner from '../components/Spinner/Spinner';
import './Expenses.css';

import AuthContext from '../context/auth-context';

const Expenses = () => {
    let currentUser = AuthContext._currentValue;
    let [isLoading, setIsLoading] = useState(false);
    let [showModal, setShowModal] = useState(false);
    let [allExpenses, setAllExpenses] = useState([]);
    let [modalHeader, setModalHeader] = useState('');
    let [modalText, setModalText] = useState();
    let [showInfoModal, setShowInfoModal] = useState(false);

    const modalInfo = (show, header, text) => {
        setShowInfoModal(show);
        setModalHeader(header);
        setModalText(text);
    };

    useEffect(() => {
        getExpenseList();
    }, []);

    const removeExpense = expenseId => {
        const requestBody = {
            query: `
              mutation RemoveExpense($id: ID!) {
                removeExpense(expenseId: $id) {
                _id
                 title
                }
              }
            `,
            variables: {
                id: expenseId
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
                console.log(res);
                if (res.status !== 200 && res.status !== 201) {
                    throw new Error('Failed!');
                }
                return res.json();
            })
            .then(res => {
                let newExpensesList = [];
                allExpenses.forEach(expense => {
                    if (expense._id !== res.data.removeExpense._id) {
                        newExpensesList.push(expense);
                    }
                });
                setAllExpenses(newExpensesList);
            })
            .catch(err => {

                console.log(err);
            });
    };

    const getExpenseList = () => {
        setIsLoading(true);
        const requestBody = {
            query: `
              query {
                expenses {
                    _id
                    title
                    description
                    price
                    group
                    createdAt
                    updatedAt
                  }
              }`
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
                setIsLoading(false);
                if (res.status !== 200 && res.status !== 201) {
                    throw new Error('Failed!');
                }
                return res.json();
            })
            .then(resData => {
                setIsLoading(false);
                setAllExpenses(resData.data.expenses);
                console.log(resData.data.expenses);

            })
            .catch(err => {
                setIsLoading(false);
                console.log(err);
            });
    };

    const submitExpense = fields => {
        setIsLoading(true);
        let time = convertTimeToMs(fields.date);
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

    const updateExpense = expense => {
        setIsLoading(true);
        expense.date = convertTimeToMs(expense.date);
        expense.updateDate = convertTimeToMs(expense.updateDate);

        const requestBody = {
            query: `
                      mutation UpdateExpense($id: ID!, $title: String!, $description: String, $price: String!, $group: String!, $createdAt: String!, $updatedAt: String! ) {
                        updateExpense(expenseId: $id, expenseInput:{title: $title, description: $description, price: $price, group:$group, createdAt:$createdAt, updatedAt: $updatedAt}) {
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
                id: expense.id,
                title: expense.title,
                description: expense.description,
                price: expense.price,
                group: expense.group,
                createdAt: expense.date,
                updatedAt: expense.updateDate
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
                let newArray = [];
                allExpenses.map(expense => {
                    if (expense._id === res.data.updateExpense._id) {
                        expense = res.data.updateExpense;
                        newArray.push(expense);
                    } else {
                        newArray.push(expense);
                    }
                });
                setAllExpenses([...newArray]);
                setIsLoading(false);
                modalInfo(true, 'Confirmation', 'Expense was updated');
                console.log(res.data.updateExpense);
            })
            .catch(err => {
                setIsLoading(false);
                console.log(err);
                modalInfo(true, 'Error', err);
                throw err;
            });
    };

    const convertTimeToMs = time => {
        return JSON.stringify(moment(time).valueOf());
    };

    return (
        <ExpensesContext.Provider value={{ currentUser, allExpenses, setAllExpenses, removeExpense, updateExpense, isLoading }}>
            <ModalContext.Provider value={{ showInfoModal, setShowInfoModal,  modalHeader, modalText, showModal, submitExpense, setShowModal, modalInfo}}>
                {
                    isLoading ? <Spinner /> :
                        <Fragment>
                            <InfoModal />
                            <AddExpense />
                            <div className='center'>
                                <ExpenseList />
                            </div>
                        </Fragment>
                }
            </ModalContext.Provider>
        </ExpensesContext.Provider>
    );
};

export { Expenses as default };
