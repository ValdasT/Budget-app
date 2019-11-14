import moment from 'moment';

export const getAnswer = (answer, settings, allExpenses, user) => {
    // recomentdationForCategories(answer, settings, allExpenses);
    if (answer.includes('{NAME}')) {
        return answer.replace('{NAME}', user.name).replace('{SURNAME}', user.surname);
    }
    if (answer.includes('{DAY_EXPENSES}')) {
        answer = todaysExpenses(answer, settings, allExpenses);
        return answer;
    }
    if (answer.includes('{YEAR_EXPENSES}')) {
        answer = yearsExpenses(answer, settings, allExpenses);
        return answer;
    }
    if (answer.includes('{WEEK_EXPENSES}')) {
        answer = weeksExpenses(answer, settings, allExpenses);
        return answer;
    }
    if (answer.includes('{MONTH_EXPENSES}')) {
        answer = monthsExpenses(answer, settings, allExpenses);
        return answer;
    }
    if (answer.includes('{DAY_INCOME}')) {
        answer = todaysIncomes(answer, settings, allExpenses);
        return answer;
    }
    if (answer.includes('{YEAR_INCOME}')) {
        answer = yearsIncomes(answer, settings, allExpenses);
        return answer;
    }
    if (answer.includes('{WEEK_INCOME}')) {
        answer = weeksIncomes(answer, settings, allExpenses);
        return answer;
    }
    if (answer.includes('{MONTH_INCOME}')) {
        answer = monthsIncomes(answer, settings, allExpenses);
        return answer;
    }
    if (answer.includes('{All_GROUPS}')) {
        answer = recomentdationForCategories(answer, settings, allExpenses);
        return answer;
    }
    return answer;
};

//==================================EXPENSES===============================

const todaysExpenses = (answer, settings, allExpenses) => {
    let today = moment().format('YYYY-MM-DD');
    let todaysExpenses = 0;
    allExpenses.forEach(expense => {
        if (expense.tag === 'Expense') {
            if (today === moment(expense.createdAt, 'x').format('YYYY-MM-DD')) {
                todaysExpenses += parseFloat(expense.price);
            }
        }
    });
    todaysExpenses = todaysExpenses.toFixed(2);
    if (settings[0].dailyBudget.length) {
        answer = answer.replace('{DAY_EXPENSES}', todaysExpenses).replace('{CURRENCY}', getCurrency(settings[0]));
        return `${answer} and your daily budget is ${settings[0].dailyBudget} ${getCurrency(settings[0])}`;
    } else {
        return answer.replace('{DAY_EXPENSES}', todaysExpenses).replace('{CURRENCY}', getCurrency(settings[0]));
    }
};

const yearsExpenses = (answer, settings, allExpenses) => {
    let dateFrom = moment().startOf('year').format('YYYY-MM-DD');
    let dateTo = moment().endOf('year').format('YYYY-MM-DD');
    let yearExpenses = 0;
    allExpenses.forEach(expense => {
        if (expense.tag === 'Expense') {
            if ((dateFrom <= moment(expense.createdAt, 'x').format('YYYY-MM-DD')) && (dateTo >= moment(expense.createdAt, 'x').format('YYYY-MM-DD'))) {
                yearExpenses += parseFloat(expense.price);
            }
        }
    });
    yearExpenses = yearExpenses.toFixed(2);
    return answer.replace('{YEAR_EXPENSES}', yearExpenses).replace('{CURRENCY}', getCurrency(settings[0]));
};

const weeksExpenses = (answer, settings, allExpenses) => {
    let dateFrom = moment().startOf('week').format('YYYY-MM-DD');
    let dateTo = moment().endOf('week').format('YYYY-MM-DD');
    let weekExpenses = 0;
    allExpenses.forEach(expense => {
        if (expense.tag === 'Expense') {
            if ((dateFrom <= moment(expense.createdAt, 'x').format('YYYY-MM-DD')) && (dateTo >= moment(expense.createdAt, 'x').format('YYYY-MM-DD'))) {
                weekExpenses += parseFloat(expense.price);
            }
        }
    });
    weekExpenses = weekExpenses.toFixed(2);
    if (settings[0].weeklyBudget.length) {
        answer = answer.replace('{WEEK_EXPENSES}', weekExpenses).replace('{CURRENCY}', getCurrency(settings[0]));
        return `${answer} and your weekly budget is ${settings[0].weeklyBudget} ${getCurrency(settings[0])}`;
    } else {
        return answer.replace('{WEEK_EXPENSES}', weekExpenses).replace('{CURRENCY}', getCurrency(settings[0]));
    }
};

const monthsExpenses = (answer, settings, allExpenses) => {
    let dateFrom = moment().startOf('month').format('YYYY-MM-DD');
    let dateTo = moment().endOf('month').format('YYYY-MM-DD');
    let monthExpenses = 0;
    allExpenses.forEach(expense => {
        if (expense.tag === 'Expense') {
            if ((dateFrom <= moment(expense.createdAt, 'x').format('YYYY-MM-DD')) && (dateTo >= moment(expense.createdAt, 'x').format('YYYY-MM-DD'))) {
                monthExpenses += parseFloat(expense.price);
            }
        }
    });
    monthExpenses = monthExpenses.toFixed(2);
    if (settings[0].monthlyBudget.length) {
        answer = answer.replace('{MONTH_EXPENSES}', monthExpenses).replace('{CURRENCY}', getCurrency(settings[0]));
        return `${answer} and your monthly budget is ${settings[0].monthlyBudget} ${getCurrency(settings[0])}`;
    } else {
        return answer.replace('{MONTH_EXPENSES}', monthExpenses).replace('{CURRENCY}', getCurrency(settings[0]));
    }
};

//==================================INCOMES===============================

const todaysIncomes = (answer, settings, allExpenses) => {
    let today = moment().format('YYYY-MM-DD');
    let todaysIncomes = 0;
    allExpenses.forEach(expense => {
        if (expense.tag === 'Income') {
            if (today === moment(expense.createdAt, 'x').format('YYYY-MM-DD')) {
                todaysIncomes += parseFloat(expense.price);
            }
        }
    });
    todaysIncomes = todaysIncomes.toFixed(2);
    return answer.replace('{DAY_INCOME}', todaysIncomes).replace('{CURRENCY}', getCurrency(settings[0]));
};

const yearsIncomes = (answer, settings, allExpenses) => {
    let dateFrom = moment().startOf('year').format('YYYY-MM-DD');
    let dateTo = moment().endOf('year').format('YYYY-MM-DD');
    let yearIncomes = 0;
    allExpenses.forEach(expense => {
        if (expense.tag === 'Income') {
            if ((dateFrom <= moment(expense.createdAt, 'x').format('YYYY-MM-DD')) && (dateTo >= moment(expense.createdAt, 'x').format('YYYY-MM-DD'))) {
                yearIncomes += parseFloat(expense.price);
            }
        }
    });
    yearIncomes = yearIncomes.toFixed(2);
    return answer.replace('{YEAR_INCOME}', yearIncomes).replace('{CURRENCY}', getCurrency(settings[0]));
};

const weeksIncomes = (answer, settings, allExpenses) => {
    let dateFrom = moment().startOf('week').format('YYYY-MM-DD');
    let dateTo = moment().endOf('week').format('YYYY-MM-DD');
    let weekIncomes = 0;
    allExpenses.forEach(expense => {
        if (expense.tag === 'Income') {
            if ((dateFrom <= moment(expense.createdAt, 'x').format('YYYY-MM-DD')) && (dateTo >= moment(expense.createdAt, 'x').format('YYYY-MM-DD'))) {
                weekIncomes += parseFloat(expense.price);
            }
        }
    });
    weekIncomes = weekIncomes.toFixed(2);
    return answer.replace('{WEEK_INCOME}', weekIncomes).replace('{CURRENCY}', getCurrency(settings[0]));
};

const monthsIncomes = (answer, settings, allExpenses) => {
    let dateFrom = moment().startOf('month').format('YYYY-MM-DD');
    let dateTo = moment().endOf('month').format('YYYY-MM-DD');
    let monthIncomes = 0;
    allExpenses.forEach(expense => {
        if (expense.tag === 'Income') {
            if ((dateFrom <= moment(expense.createdAt, 'x').format('YYYY-MM-DD')) && (dateTo >= moment(expense.createdAt, 'x').format('YYYY-MM-DD'))) {
                monthIncomes += parseFloat(expense.price);
            }
        }
    });
    monthIncomes = monthIncomes.toFixed(2);
    return answer.replace('{MONTH_INCOME}', monthIncomes).replace('{CURRENCY}', getCurrency(settings[0]));
};

//==================================RECOMENDATION===============================

const recomentdationForCategories = (answer, settings, allExpenses) => {
    let groupedExpenses = [];
    allExpenses.forEach(expense => {
        if (expense.tag === 'Expense') {
            let found = false;
            groupedExpenses.forEach(group => {
                if (group.groupName === expense.group) {
                    found = true;
                    group.amount += parseFloat(expense.price);
                }
            });
            if (!found) {
                groupedExpenses.push({
                    groupName: expense.group,
                    amount: parseFloat(expense.price)
                });
            }  
        }
    });

    groupedExpenses.forEach(expense => {
        expense.amount = expense.amount.toFixed(2);
    });

    groupedExpenses = groupedExpenses.sort((a, b) => parseFloat(b.amount) - parseFloat(a.amount) );
    let answerString = '';
    groupedExpenses.forEach((expense, i) => {
        if (groupedExpenses.length === i+1) {
            answerString += `• ${expense.groupName} - ${expense.amount} ${getCurrency(settings[0])}.`;
        } else {
            answerString += `• ${expense.groupName} - ${expense.amount} ${getCurrency(settings[0])}; `;
        }
    });
    return answer.replace('{All_GROUPS}', answerString);
};
  
const getCurrency = settings => {
    let currencyValue = settings.currency === 'GBD' ? '£' : settings.currency === 'Dollar' ? '$' : '€';
    return currencyValue;
};