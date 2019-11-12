import React, { useEffect, useState, Fragment } from 'react';
import moment from 'moment';
import AuthContext from '../context/auth-context';
import ExpensesContext from '../context/expenses-context';
import ModalContext from '../context/modal-context';
import ExpenseList from '../components/Expenses/ExpensesList/ExpensesList';
import Filter from '../components/Filter/Filter';
import SmallStatistics from '../components/SmallStatistics/SmallStatistics';
import InfoModal from '../components/Modal/Modal';
import ImportModal from '../components/Modal/ImportFileModal';
import Spinner from '../components/Spinner/Spinner';
import ChatBot from '../components/chatBot/ChatBot';
import './Expenses.css';

const Expenses = () => {
    let currentUser = AuthContext._currentValue;
    let [isLoading, setIsLoading] = useState(false);
    let [showModal, setShowModal] = useState(false);
    let [showInfoModal, setShowInfoModal] = useState(false);
    let [showImportModal, setShowIportModal] = useState(false);
    let [allExpenses, setAllExpenses] = useState([]);
    let [modalHeader, setModalHeader] = useState('');
    let [modalText, setModalText] = useState();
    let [showMore, setShowMore] = useState(false);
    let [settings, setSettings] = useState([]);
    let [settingsForBot, setSettingsForBot] = useState([]);
    let [allExpensesForBot, setAllExpensesForBot] = useState([]);
    let [user, setUser] = useState({});

    const modalInfo = (show, header, text) => {
        setShowInfoModal(show);
        setModalHeader(header);
        setModalText(text);
    };

    useEffect(() => {
        getAll();
    }, []);

    const getSettingsData = () => {
        setIsLoading(true);
        const requestBody = {
            query: `
              query {
                settingsData {
                    _id
                    dailyBudget
                    weeklyBudget
                    monthlyBudget
                    categories
                    members
                    currency
                    creatorId
                    creatorEmail
                  }
              }`
        };
        return fetch('/graphql', {
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
                console.log(resData.data);
                setSettings(...settings, resData.data.settingsData);
                return resData.data.settingsData;
            })
            .catch(err => {
                setIsLoading(false);
                modalInfo(true, 'Error', err);
                console.log(err);
                return err;
            });
    };

    const removeExpense = expense => {
        let requestBody = {
            query: ''
        };
        if (expense.tag === 'Expense') {
            requestBody = {
                query: `
                  mutation RemoveExpense($id: ID!) {
                    removeExpense(expenseId: $id) {
                    _id
                     title
                    }
                  }
                `,
                variables: {
                    id: expense._id
                }
            };
        } else {
            requestBody = {
                query: `
                  mutation RemoveIncome($id: ID!) {
                    removeIncome(incomeId: $id) {
                    _id
                     title
                    }
                  }
                `,
                variables: {
                    id: expense._id
                }
            };
        }

        fetch('/graphql', {
            method: 'POST',
            body: JSON.stringify(requestBody),
            headers: {
                'Content-Type': 'application/json',
                Authorization: 'Bearer ' + currentUser.token
            }
        })
            .then(res => {
                if (res.status !== 200 && res.status !== 201) {
                    throw new Error('Failed!');
                }
                return res.json();
            })
            .then(res => {
                let newArray = [];
                let newArrayForBot = [];
                if (res.data.removeExpense) {
                    newArray = updateArrayAfterRemove(res.data.removeExpense, allExpenses);
                    newArrayForBot = updateArrayAfterRemove(res.data.removeExpense, allExpensesForBot);
                    modalInfo(true, 'Confirmation', 'Expense was deleted');
                } else {
                    newArray = updateArrayAfterRemove(res.data.removeIncome, allExpenses);
                    newArrayForBot = updateArrayAfterRemove(res.data.removeIncome, allExpensesForBot);
                    modalInfo(true, 'Confirmation', 'Income was deleted');
                }
                setAllExpenses(newArray);
                setAllExpensesForBot(newArrayForBot);
            })
            .catch(err => {
                console.log(err);
                return err;
            });
    };

    const getExpenseList = (users) => {
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
                    creatorId
                  }
              }`,
            allUsers: users
        };
        return fetch('/graphql', {
            method: 'POST',
            body: JSON.stringify(requestBody),
            headers: {
                'Content-Type': 'application/json',
                Authorization: 'Bearer ' + currentUser.token
            }
        })
            .then( res => {
                setIsLoading(false);
                if (res.status !== 200 && res.status !== 201) {
                    throw new Error('Failed!');
                }
                return  res.json();
            })
            .then( resData => {
                console.log(resData.data.expenses);
                resData.data.expenses = addTag(resData.data.expenses, 'Expense');
                setIsLoading(false);
                return resData.data.expenses;

            })
            .catch( err => {
                setIsLoading(false);
                console.log(err);
                return err;
            });
    };

    const getIncomeList = (users) => {
        setIsLoading(true);
        const requestBody = {
            query: `
              query {
                incomes {
                    _id
                    title
                    description
                    price
                    group
                    createdAt
                    updatedAt
                    creatorId
                  }
              }`,
            allUsers: users
        };
        return fetch('/graphql', {
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
                resData.data.incomes = addTag(resData.data.incomes, 'Income');
                console.log( resData.data.incomes);
                setIsLoading(false);
                return resData.data.incomes;
            })
            .catch(err => {
                setIsLoading(false);
                console.log(err);
                return err;
            });
    };

    const onFilterExpenses = (values, allUsers) => {
        setIsLoading(true);
        const requestBody = {
            query: `
            query ExpensesFilter($dateFrom: String!, $dateTo: String!){
                expensesFilter(dateFrom: $dateFrom, dateTo: $dateTo) {
                    _id
                    title
                    description
                    price
                    group
                    createdAt
                    updatedAt
                    creatorId
                }
            }`,
            variables: {
                dateFrom: convertTimeToMs(values.dateFrom),
                dateTo: convertTimeToMs(values.dateTo)
            },
            allUsers: allUsers
        };
        return fetch('/graphql', {
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
                res.data.expensesFilter = addTag(res.data.expensesFilter, 'Expense');
                setIsLoading(false);
                return res.data.expensesFilter;
            })
            .catch(err => {
                setIsLoading(false);
                console.log(err);
                modalInfo(true, 'Error', err);
                throw err;
            });
    };

    const onFilterIncomes = (values, allUsers) => {
        setIsLoading(true);
        const requestBody = {
            query: `
            query IncomesFilter($dateFrom: String!, $dateTo: String!){
                incomesFilter(dateFrom: $dateFrom, dateTo: $dateTo) {
                    _id
                    title
                    description
                    price
                    group
                    createdAt
                    updatedAt
                    creatorId
                }
            }`,
            variables: {
                dateFrom: convertTimeToMs(values.dateFrom),
                dateTo: convertTimeToMs(values.dateTo)
            },
            allUsers: allUsers
        };
        return fetch('/graphql', {
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
                res.data.incomesFilter = addTag(res.data.incomesFilter, 'Income');
                setIsLoading(false);
                return res.data.incomesFilter;
            })
            .catch(err => {
                setIsLoading(false);
                console.log(err);
                modalInfo(true, 'Error', err);
                throw err;
            });
    };

    const submitExpense = fields => {
        let requestBody = {
            query: ''
        };
        setIsLoading(true);
        let time = convertTimeToMs(fields.date);
        if (fields.tag === 'Expense') {
            requestBody = {
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
                                creatorId
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
        } else {
            requestBody = {
                query: `
                          mutation CreateIncome($title: String!, $description: String, $price: String!, $group: String!, $createdAt: String!, $updatedAt: String! ) {
                            createIncome(incomeInput:{title: $title, description: $description, price: $price, group:$group, createdAt:$createdAt, updatedAt: $updatedAt}) {
                                _id
                                title
                                price
                                createdAt
                                updatedAt
                                description
                                group
                                creatorId
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
        }

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
                if (res.data.createExpense) {
                    modalInfo(true, 'Confirmation', 'Expense was created');
                    res.data.createExpense.tag = 'Expense';
                    setAllExpenses([...allExpenses, res.data.createExpense]);
                    setAllExpensesForBot([...allExpensesForBot, res.data.createExpense]);
                } else {
                    modalInfo(true, 'Confirmation', 'Income was created');
                    res.data.createIncome.tag = 'Income';
                    setAllExpenses([...allExpenses, res.data.createIncome]);
                    setAllExpensesForBot([...allExpensesForBot,  res.data.createIncome]);
                }
            })
            .catch(err => {
                setIsLoading(false);
                setShowModal(false);
                console.log(err);
                modalInfo(true, 'Error', err);
                throw err;
            });
    };

    const submitExpenseFromImport = fields => {
        let requestBody = {
            query: ''
        };
        let time = convertTimeToMs(fields.createdAt);
        if (fields.tag === 'Expense') {
            requestBody = {
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
                                creatorId
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
        } else {
            requestBody = {
                query: `
                          mutation CreateIncome($title: String!, $description: String, $price: String!, $group: String!, $createdAt: String!, $updatedAt: String! ) {
                            createIncome(incomeInput:{title: $title, description: $description, price: $price, group:$group, createdAt:$createdAt, updatedAt: $updatedAt}) {
                                _id
                                title
                                price
                                createdAt
                                updatedAt
                                description
                                group
                                creatorId
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
        }

        return fetch('/graphql', {
            method: 'POST',
            body: JSON.stringify(requestBody),
            headers: {
                'Content-Type': 'application/json',
                Authorization: 'Bearer ' + currentUser.token
            }
        })
            .then(res => {
                if (!res.ok) {
                    throw (res.statusText);
                }
                return res.json();
            })
            .then(res => {
                if (res.errors) {
                    throw (res.errors[0].message);
                }
                if (res.data.createExpense) {
                    res.data.createExpense.tag = 'Expense';
                    return res.data.createExpense;
                } else {
                    res.data.createIncome.tag = 'Income';
                    return res.data.createIncome;
                }
            })
            .catch(err => {
                console.log(err);
                modalInfo(true, 'Error', err);
                throw err;
            });
    };

    const updateExpense = expense => {
        setIsLoading(true);
        let requestBody = {
            query: ''
        };
        expense.date = convertTimeToMs(expense.date);
        expense.updateDate = convertTimeToMs(expense.updateDate);
        if (expense.tag === 'Expense') {
            requestBody = {
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
                                creatorId
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
        } else {
            requestBody = {
                query: `
                          mutation UpdateIncome($id: ID!, $title: String!, $description: String, $price: String!, $group: String!, $createdAt: String!, $updatedAt: String! ) {
                            updateIncome(incomeId: $id, incomeInput:{title: $title, description: $description, price: $price, group:$group, createdAt:$createdAt, updatedAt: $updatedAt}) {
                                _id
                                title
                                price
                                createdAt
                                updatedAt
                                description
                                group
                                creatorId
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
        }
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
                let updatedAllList = [];
                let updatedAllListForBot = [];
                if (res.data.updateExpense) {
                    res.data.updateExpense.tag = 'Expense';
                    console.log(res.data.updateExpense);
                    updatedAllList = updateArrayAfterUpdate(res.data.updateExpense, allExpenses);
                    updatedAllListForBot = updateArrayAfterUpdate(res.data.updateExpense, allExpensesForBot);
                    modalInfo(true, 'Confirmation', 'Expense was updated');
                } else {
                    res.data.updateIncome.tag = 'Income';
                    console.log(res.data.updateIncome);
                    updatedAllList = updateArrayAfterUpdate(res.data.updateIncome, allExpenses);
                    updatedAllListForBot = updateArrayAfterUpdate(res.data.updateIncome, allExpensesForBot);
                    modalInfo(true, 'Confirmation', 'Income was updated');
                }
                setAllExpenses(updatedAllList);
                setAllExpensesForBot(updatedAllListForBot);
                setIsLoading(false);
            })
            .catch(err => {
                setIsLoading(false);
                console.log(err);
                modalInfo(true, 'Error', err);
                throw err;
            });
    };

    const getUserData = () => {
        const requestBody = {
            query: `
              query {
                userData {
                    _id
                    email
                    name
                    surname
                    createdAt
                    updatedAt
                  }
              }`
        };
        return fetch('/graphql', {
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
                return resData.data.userData[0];

            })
            .catch(err => {
                console.log(err);
                return err;
            });
    };

    const convertTimeToMs = time => {
        return JSON.stringify(moment(time).valueOf());
    };

    const sortByDate = arrayWithDate => {
        arrayWithDate.sort(function (a, b) {
            a = moment(a.createdAt, 'x').format('DD-MM-YYYY').split('-').reverse().join('');
            b = moment(b.createdAt, 'x').format('DD-MM-YYYY').split('-').reverse().join('');
            return a.localeCompare(b);
        });
        return arrayWithDate;
    };

    const addTag = (array, tag) => {
        array.forEach(e => {
            e.tag = tag;
        });
        return array;
    };

    const updateArrayAfterUpdate = (updateElement, allExpenses) => {
        let newArray = [];
        allExpenses.map(expense => {
            if (expense._id === updateElement._id) {
                expense = updateElement;
                newArray.push(expense);
            } else {
                newArray.push(expense);
            }
        });
        return newArray = sortByDate(newArray);
    };

    const updateArrayAfterRemove = (updateElement, allExpenses) => {
        let newArray = [];
        allExpenses.forEach(expense => {
            if (expense._id !== updateElement._id) {
                newArray.push(expense);
            }
        });
        return newArray = sortByDate(newArray);
    };

    const getAll = async (values) => {
        if (values == undefined || values === 'All') {
            let allSettings = [];
            if (!settings.length) {
                allSettings = await getSettingsData();
            } else {
                allSettings = settings;
            }
            let allUsers = [];
            allSettings.forEach(setting => {
                allUsers.push(setting.creatorId);
            });
            let expenses = await getExpenseList(allUsers);
            let incomes = await getIncomeList(allUsers);
            let all = expenses.concat(incomes);
            all = sortByDate(all);
            setAllExpenses(all);
            if (!allExpensesForBot.length) {
                let user = await getUserData();
                setAllExpensesForBot(all);
                setSettingsForBot(allSettings);
                setUser(user);
            }
        } else if (values === 'Expense') {
            let allSettings = [];
            if (!settings.length) {
                allSettings = await getSettingsData();
            } else {
                allSettings = settings;
            }
            let allUsers = [];
            allSettings.forEach(setting => {
                allUsers.push(setting.creatorId);
            });
            let expenses = await getExpenseList(allUsers);
            expenses = sortByDate(expenses);
            setAllExpenses(expenses);
        } else {
            let allSettings = [];
            if (!settings.length) {
                allSettings = await getSettingsData();
            } else {
                allSettings = settings;
            }
            let allUsers = [];
            allSettings.forEach(setting => {
                allUsers.push(setting.creatorId);
            });
            let incomes = await getIncomeList(allUsers);
            incomes = sortByDate(incomes);
            setAllExpenses(incomes);
        }
    };

    const getAllOnFilter = async values => {
        let allUsers = [];
        if (values.tag === 'All') {
            settings.forEach(setting => {
                allUsers.push(setting.creatorId);
            });
            let expenses = await onFilterExpenses(values, allUsers);
            let incomes = await onFilterIncomes(values, allUsers);
            let all = expenses.concat(incomes);
            all = sortByDate(all);
            setAllExpenses(all);
        } else if (values.tag === 'Expense') {
            settings.forEach(setting => {
                allUsers.push(setting.creatorId);
            });
            let expenses = await onFilterExpenses(values, allUsers);
            expenses = sortByDate(expenses);
            setAllExpenses(expenses);
        } else {
            settings.forEach(setting => {
                allUsers.push(setting.creatorId);
            });
            let incomes = await onFilterIncomes(values, allUsers);
            incomes = sortByDate(incomes);
            setAllExpenses(incomes);
        }
    };
    return (
        <ExpensesContext.Provider value={{ currentUser, allExpenses, setAllExpenses, removeExpense, isLoading, getAllOnFilter, getAll, showMore, setShowMore, submitExpenseFromImport, settings, settingsForBot, allExpensesForBot, user, updateExpense}}>
            <ModalContext.Provider value={{ showInfoModal, setShowInfoModal, modalHeader, modalText, showModal, submitExpense, setShowModal, modalInfo, showImportModal, setShowIportModal }}>
                <Filter />
                <Fragment>
                    {user._id? <ChatBot />:null}
                </Fragment>
                <SmallStatistics />
                {
                    isLoading ? <Spinner /> :
                        <Fragment>
                            <InfoModal />
                            <ImportModal/>
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
