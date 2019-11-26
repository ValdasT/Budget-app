import moment from 'moment';

export const getSettingsData = (currentUser) => {
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
            if (res.status !== 200 && res.status !== 201) {
                throw new Error('Failed!');
            }
            return res.json();
        })
        .then(resData => {
            console.log(resData.data);
            return resData.data.settingsData;
        })
        .catch(err => {
            console.log(err);
            return err;
        });
};

export const getUserData = (currentUser) => {
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

export const getExpenseList = (users, currentUser) => {
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
        .then(res => {
            if (res.status !== 200 && res.status !== 201) {
                throw new Error('Failed!');
            }
            return res.json();
        })
        .then(resData => {
            console.log(resData.data.expenses);
            resData.data.expenses = addTag(resData.data.expenses, 'Expense');
            return resData.data.expenses;

        })
        .catch(err => {
            console.log(err);
            return err;
        });
};

export const getIncomeList = (users, currentUser) => {
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
            if (res.status !== 200 && res.status !== 201) {
                throw new Error('Failed!');
            }
            return res.json();
        })
        .then(resData => {
            resData.data.incomes = addTag(resData.data.incomes, 'Income');
            console.log(resData.data.incomes);
            return resData.data.incomes;
        })
        .catch(err => {
            console.log(err);
            return err;
        });
};

export const onFilterExpenses = (values, allUsers, currentUser) => {
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
                throw (res.statusText);
            }
            return res.json();
        })
        .then(res => {
            if (res.errors) {
                throw (res.errors[0].message);
            }
            res.data.expensesFilter = addTag(res.data.expensesFilter, 'Expense');
            return res.data.expensesFilter;
        })
        .catch(err => {
            console.log(err);
            throw err;
        });
};

export const onFilterIncomes = (values, allUsers, currentUser) => {
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
                throw (res.statusText);
            }
            return res.json();
        })
        .then(res => {
            if (res.errors) {
                throw (res.errors[0].message);
            }
            res.data.incomesFilter = addTag(res.data.incomesFilter, 'Income');
            return res.data.incomesFilter;
        })
        .catch(err => {
            console.log(err);
            throw err;
        });
};

export const sortByDate = arrayWithDate => {
    arrayWithDate.sort(function (a, b) {
        a = moment(a.createdAt, 'x').format('DD-MM-YYYY').split('-').reverse().join('');
        b = moment(b.createdAt, 'x').format('DD-MM-YYYY').split('-').reverse().join('');
        return a.localeCompare(b);
    });
    return arrayWithDate;
};

export const getFirstAndLastExpenseDate = arrayWithDate => {
    let size = arrayWithDate.length - 1;
    let date = {
        dateFrom: moment(arrayWithDate[0].createdAt, 'x').format('MM/DD/YYYY'),
        dateTo: moment(arrayWithDate[size].createdAt, 'x').format('MM/DD/YYYY')
    };
    return { dateFrom: date.dateFrom, dateTo: date.dateTo };
};

const convertTimeToMs = time => {
    return JSON.stringify(moment(time).valueOf());
};

const addTag = (array, tag) => {
    array.forEach(e => {
        e.tag = tag;
    });
    return array;
};

export const getCurrency = settings => {
    let currencyValue = settings.currency === 'GBD' ? '£' : settings.currency === 'Dollar' ? '$' : '€';
    return currencyValue;
};

export const getAllDaysFromTo = (from, to) => {
    from = convertTimeToMs(from);
    to = convertTimeToMs(to);
    let allDates = [];
    let newDate = from;
    allDates.push(moment(newDate, 'x').format('MM/DD/YYYY'));
    while (newDate < to) {
        newDate = moment(newDate, 'x').add('days', 1).format('MM/DD/YYYY');
        allDates.push(newDate);
        newDate = convertTimeToMs(newDate);
    }
    return allDates;
};