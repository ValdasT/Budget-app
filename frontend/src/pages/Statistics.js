import React, { useEffect, useState, Fragment } from 'react';
import Filter from '../components/Filter/FilterForStatistics';
import AuthContext from '../context/auth-context';
import Spinner from '../components/Spinner/Spinner';
// import moment from 'moment';
import { onFilterExpenses, onFilterIncomes, getSettingsData, getExpenseList, getIncomeList, getUserData, sortByDate } from './ApiCalls';
import StatisticsContext from '../context/statistics-context';
import ExpensesAndIncomes from '../components/StatisticsCharts/ExpensesAndIncomes'
import './Statistics.css';

const Statistics = () => {

    let currentUser = AuthContext._currentValue;
    let [isLoading, setIsLoading] = useState(false);
    let [allExpenses, setAllExpenses] = useState([]);
    let [settings, setSettings] = useState([]);
    let [settingsForBot, setSettingsForBot] = useState([]);
    let [allExpensesForBot, setAllExpensesForBot] = useState([]);
    let [user, setUser] = useState({});

    useEffect(() => {
        getAll();
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
        setIsLoading(true);
        let allSettings = [];
        if (!settings.length) {
            allSettings = await getSettingsData(currentUser);
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
    };


    return (
        <StatisticsContext.Provider value={{ getAllOnFilter, getAll, allExpenses }}>
            <Fragment>
                <Filter />
                {
                    isLoading ? <Spinner /> :
                        <div className='statistics-board'>
                            <div className="statistics-card">
                                <p className='statistics-text'>This is pieCart test test est e </p>
                                <ExpensesAndIncomes />
                            </div>
                            <div className="statistics-card">
                                <p className='statistics-text'>This is pieCart test test est e sd asd asd asd asda sda sd as das d as das d asd </p>
                                <ExpensesAndIncomes />
                            </div>
                            <div className="statistics-card">
                                <p className='statistics-text'>This is pieCart test test est e </p>
                                <ExpensesAndIncomes />
                            </div>
                            <div className="statistics-card">
                                <p className='statistics-text'>This is pieCart test test est e </p>
                                <ExpensesAndIncomes />
                            </div>
                            <div className="statistics-card">
                                <p className='statistics-text'>This is pieCart test test est e </p>
                                <ExpensesAndIncomes />
                            </div>
                        </div>
                }
            </Fragment>
        </StatisticsContext.Provider>
    );
};

export { Statistics as default };
