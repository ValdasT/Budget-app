import React, { useContext, useState, useEffect } from 'react';
import moment from 'moment';
import StatisticsContext from '../../context/statistics-context';
import { getAllDaysFromTo } from '../../pages/ApiCalls';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, ReferenceLine } from 'recharts';

const DailyBudget = () => {
    const { allExpenses, dateFromFilter, settings, setDailyAverage } = useContext(StatisticsContext);
    let [initData, setInitData] = useState([]);
    useEffect(() => {
        prepareChartData(allExpenses);
    }, [allExpenses]);

    let data = [];

    let prepareChartData = allExpenses => {
        let chartData = [];
        let allDays = [];
        allDays = getAllDaysFromTo(dateFromFilter.dateFrom, dateFromFilter.dateTo);
        allExpenses.forEach(expense => {
            if (expense.tag === 'Expense') {
                let date = moment(expense.createdAt, 'x').format(`MM/DD/YYYY`);
                allDays.forEach(dateFromList => {
                    if (dateFromList === date) {
                        let found = false;
                        chartData.forEach(forChart => {
                            if (forChart.date === date) {
                                found = true;
                                forChart.value += parseFloat(expense.price);
                            }
                        })
                        if (!found) {
                            chartData.push({
                                date: date,
                                value: parseFloat(expense.price)
                            });
                        }
                    }
                })
            }
        })

        let allExpense = 0;
        chartData.forEach(element => {
            element.value = element.value.toFixed(2);
            allExpense += parseFloat(element.value);
            data.push({
                name: moment(element.date, 'MM/DD/YYYY').format('DD/MM'),
                Expenses: parseFloat(element.value)
            })
        })
        setInitData(data);
        if (allDays.length) {
            let average = (allExpense / allDays.length).toFixed(2)
            setDailyAverage(average);
        }
    };

    return (
        <ResponsiveContainer width="100%" height={300} >
            <BarChart
                data={initData}
                margin={{
                    top: 5, right: 30, left: 20, bottom: 5,
                }}
            >
                <CartesianGrid
                    vertical={false}
                    horizontal={false} />
                <XAxis dataKey="name" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Bar dataKey="Expenses" fill="#A3A6DC" />
                {settings[0].dailyBudget.length ?
                    <ReferenceLine y={settings[0].dailyBudget} label="Daily budget" stroke="#F5A2A2" />
                    : null}}
            </BarChart>
        </ResponsiveContainer>
    );
};

export { DailyBudget as default };
