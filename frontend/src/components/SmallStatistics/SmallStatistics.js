import React, { useContext, useState, Fragment, useEffect } from 'react';
import moment from 'moment';
import ExpensesContext from '../../context/expenses-context';
import { CartesianGrid, XAxis, YAxis, Tooltip, AreaChart, Area, ResponsiveContainer, Legend } from 'recharts';

const SmallStatistics = () => {

    const { allExpenses } = useContext(ExpensesContext);
    let [initData, setInitData] = useState([]);
    let [budget, setBudget] = useState(true);
    let [income, setIncome] = useState(true);
    let [expense, setExpense] = useState(true);
    let minAndMax = { first: [] };

    const prepareChartData = allExpenses => {
        let allData = [];
        let totals = {
            expenses: 0,
            incomes: 0,
            budget: 0
        };
        allExpenses.forEach(expense => {
            expense.date = moment(expense.createdAt, 'x').format('DD/MM');
            if (expense.tag === 'Expense') {
                totals.expenses = totals.expenses + parseFloat(expense.price);
                totals.budget = totals.budget - parseFloat(expense.price);
                allData.push({
                    date: expense.date,
                    Expenses: totals.expenses.toFixed(2),
                    Incomes: totals.incomes.toFixed(2),
                    Budget: totals.budget.toFixed(2)
                });
            } else {
                totals.incomes = totals.incomes + parseFloat(expense.price);
                totals.budget = totals.budget + parseFloat(expense.price);
                allData.push({
                    date: expense.date,
                    Expenses: totals.expenses.toFixed(2),
                    Incomes: totals.incomes.toFixed(2),
                    Budget: totals.budget.toFixed(2)
                });
            }
        });

        minAndMax.first.push(Math.min.apply(Math, allData.map((expense) => { return expense.Incomes; })));
        minAndMax.first.push(Math.max.apply(Math, allData.map((expense) => { return expense.Incomes; })));
        minAndMax.first.push(Math.min.apply(Math, allData.map((expense) => { return expense.Budget; })));
        minAndMax.first.push(Math.max.apply(Math, allData.map((expense) => { return expense.Budget; })));
        minAndMax.first.push(Math.min.apply(Math, allData.map((expense) => { return expense.Expenses; })));
        minAndMax.first.push(Math.max.apply(Math, allData.map((expense) => { return expense.Expenses; })));
        minAndMax.smallest = Math.min.apply(Math, minAndMax.first.map((expense) => { return expense; }));
        minAndMax.biggest = Math.max.apply(Math, minAndMax.first.map((expense) => { return expense; }));
        setInitData(allData);
    };

    useEffect(() => {
        prepareChartData(allExpenses);
    }, [allExpenses]);

    const removeColor = (e) => {
        switch (e.dataKey) {
        case 'Budget':
            setBudget(!budget);
            break;
        case 'Incomes':
            setIncome(!income);
            break;
        case 'Expenses':
            setExpense(!expense);
            break;
        default:
            console.log('incorect name');
        }
    };

    return (
        <Fragment>
            {allExpenses.length ? <ResponsiveContainer width="95%" height={150} >
                <AreaChart data={initData}
                    margin={{ top: 10, right: 30, left: 0, bottom: 0 }}>
                    <defs>
                        {expense ? <linearGradient id="colorExp" x1="0" y1="0" x2="0" y2="1">
                            <stop offset="5%" stopColor="#FF0000" stopOpacity={0.8} />
                            <stop offset="95%" stopColor="#FF0000" stopOpacity={0} />
                        </linearGradient> : null

                        },
                        {income ? <linearGradient id="colorInc" x1="0" y1="0" x2="0" y2="1">
                            <stop offset="5%" stopColor="#82ca9d" stopOpacity={0.8} />
                            <stop offset="95%" stopColor="#82ca9d" stopOpacity={0} />
                        </linearGradient> : null
                        },
                        {budget ? <linearGradient id="colorBud" x1="0" y1="0" x2="0" y2="1">
                            <stop offset="5%" stopColor="#0000FF" stopOpacity={0.8} />
                            <stop offset="95%" stopColor="#0000FF" stopOpacity={0} />
                        </linearGradient> : null
                        }
                    </defs>
                    <CartesianGrid
                        vertical={false}
                        horizontal={false}
                    />
                    <Legend onClick={(line) => { removeColor(line); }} />
                    <Tooltip />
                    <Area type="monotone" dataKey="Budget" stroke="#0000FF" fillOpacity={1} fill="url(#colorBud)" />
                    <Area type="monotone" dataKey="Incomes" stroke="#82ca9d" fillOpacity={1} fill="url(#colorInc)" />
                    <Area type="monotone" dataKey="Expenses" stroke="#FF0000" fillOpacity={1} fill="url(#colorExp)" />
                    <XAxis
                        dataKey="date"
                        fontSize='10'
                    />
                    <YAxis
                        type="number"
                        domain={[minAndMax.smallest, minAndMax.biggest]}
                        allowDataOverflow
                        fontSize='10'
                    />
                </AreaChart>
            </ResponsiveContainer> : null}
        </Fragment>
    );
};

export { SmallStatistics as default };
