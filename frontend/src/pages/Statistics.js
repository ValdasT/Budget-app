import React, { useEffect, useState, Fragment } from 'react';
import Filter from '../components/Filter/FilterForStatistics';
import AuthContext from '../context/auth-context';
import Spinner from '../components/Spinner/Spinner';
import moment from 'moment';
import { onFilterExpenses, onFilterIncomes, getSettingsData, getExpenseList, getIncomeList, getUserData, sortByDate, getCurrency, getFirstAndLastExpenseDate } from './ApiCalls';
import StatisticsContext from '../context/statistics-context';
import ExpensesAndIncomes from '../components/StatisticsCharts/ExpensesAndIncomes';
import ExpensesByCategory from '../components/StatisticsCharts/ExpensesByCategory';
import IncomesByCategory from '../components/StatisticsCharts/IncomesByCategories';
import DailyBudget from '../components/StatisticsCharts/DailyBudget';
import './Statistics.css';

const Statistics = () => {

    let currentUser = AuthContext._currentValue;
    let [isLoading, setIsLoading] = useState(false);
    let [allExpenses, setAllExpenses] = useState([]);
    let [settings, setSettings] = useState([]);
    let [settingsForBot, setSettingsForBot] = useState([]);
    let [allExpensesForBot, setAllExpensesForBot] = useState([]);
    let [user, setUser] = useState({});
    let [dateFromFilter, setDateFromFilter] = useState({});
    let [dailyAverage, setDailyAverage] = useState('');

    let [totalExpenses, setTotalExpenses] = useState({});

    useEffect(() => {
        let date = {
            dateFrom: moment().startOf('month').format('MM/DD/YYYY'),
            dateTo: moment().endOf('month').format('MM/DD/YYYY')
        };
        getAllOnFilter(date);
    }, []);

    const getAll = async () => {
        setIsLoading(true);
        let allSettings = [];
        if (!settings.length) {
            allSettings = await getSettingsData(currentUser);
            setSettings(allSettings);
        } else {
            allSettings = settings;
        }
        let allUsers = [];
        allSettings.forEach(setting => {
            allUsers.push(setting.creatorId);
        });
        let expenses = await getExpenseList(allUsers, currentUser);
        let incomes = await getIncomeList(allUsers, currentUser);
        let all = expenses.concat(incomes);
        all = sortByDate(all);
        setDateFromFilter(getFirstAndLastExpenseDate(all));
        setAllExpenses(all);
        setIsLoading(false);
        if (!allExpensesForBot.length) {
            let user = await getUserData(currentUser);
            setAllExpensesForBot(all);
            setSettingsForBot(allSettings);
            setUser(user)
        };
    }

    const getAllOnFilter = async values => {
        setDateFromFilter(values);
        setIsLoading(true);
        let allSettings = [];
        if (!settings.length) {
            allSettings = await getSettingsData(currentUser);
            setSettings(allSettings);
        } else {
            allSettings = settings;
        };
        let allUsers = [];
        allSettings.forEach(setting => {
            allUsers.push(setting.creatorId);
        });
        let expenses = await onFilterExpenses(values, allUsers, currentUser);
        let incomes = await onFilterIncomes(values, allUsers, currentUser);
        let all = expenses.concat(incomes);
        all = sortByDate(all);
        setAllExpenses(all);
        setIsLoading(false);
        if (!allExpensesForBot.length) {
            let user = await getUserData(currentUser);
            setAllExpensesForBot(all);
            setSettingsForBot(allSettings);
            setUser(user)
        };
    };


    return (
        <StatisticsContext.Provider value={{ getAllOnFilter, getAll, allExpenses, totalExpenses, setTotalExpenses, dateFromFilter, settings, setDailyAverage }}>
            <Fragment>
                <Filter />
                {
                    isLoading ? <Spinner /> :
                        allExpenses.length ?
                            <div className='statistics-board'>
                                <div className="statistics-card">
                                    <p className='statistics-text'>
                                        <li>Total expenses: {totalExpenses.expenses}&nbsp;{getCurrency(settings[0])}</li>
                                        <li>Total incomes: {totalExpenses.incomes}&nbsp;{getCurrency(settings[0])}</li>
                                        <li>Total budget: {totalExpenses.budget}&nbsp;{getCurrency(settings[0])}</li>
                                    </p>
                                    <ExpensesAndIncomes />
                                </div>
                                <div className="statistics-card">
                                    <p className='statistics-text'>Expenses by categories: </p>
                                    <ExpensesByCategory />
                                </div>
                                <div className="statistics-card">
                                    <p className='statistics-text'>Incomes by categories:</p>
                                    <IncomesByCategory />
                                </div>
                                <div className="statistics-card-big">
                                    <p className='statistics-text'>
                                        <li>Your average daily expenses are : {dailyAverage}&nbsp;{getCurrency(settings[0])}</li>
                                        {settings[0].dailyBudget.length ? <li>Your daily budget is: {settings[0].dailyBudget} &nbsp;{getCurrency(settings[0])}.</li> : null}
                                    </p>
                                    <DailyBudget />
                                </div>
                                <div className="statistics-card">
                                    <p className='statistics-text'>This is pieCart test test est e </p>
                                    <ExpensesAndIncomes />
                                </div>
                            </div> :
                            <div className='warning-box' style={{ marginTop: "5%" }}>
                                <div className="alert alert-danger" style={{ marginBottom: "0px" }} role="alert">
                                    There are no data.
                                 </div>
                            </div>
                }
            </Fragment>
        </StatisticsContext.Provider>
    );
};

export { Statistics as default };
