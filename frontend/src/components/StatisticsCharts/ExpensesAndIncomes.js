import React, { useContext, useState, Fragment, useEffect } from 'react';
import StatisticsContext from '../../context/statistics-context';
import { PieChart, Pie, Sector, Cell, ResponsiveContainer, Tooltip } from 'recharts';

const ExpensesAndIncomes = () => {
    const { allExpenses, totalExpenses, setTotalExpenses } = useContext(StatisticsContext);
    useEffect(() => {
        prepareChartData(allExpenses);
    }, [allExpenses]);

    let prepareChartData = allExpenses => {
        let data = {
            expenses: 0,
            incomes: 0,
            budget: 0
        }
        allExpenses.forEach(element => {
            if (element.tag === 'Expense') {
                data.expenses += parseFloat(element.price);
            } else if((element.tag === 'Income')) {
                data.incomes += parseFloat(element.price);
            }
        });
        data.expenses = parseFloat(data.expenses.toFixed(2));
        data.incomes = parseFloat(data.incomes.toFixed(2));
        data.budget -= data.expenses;
        data.budget += data.incomes;
        data.budget = parseFloat(data.budget.toFixed(2));
        setTotalExpenses(data);
    };

    const data = [
        { name: 'Expenses', value: totalExpenses.expenses },
        { name: 'Incomes', value: totalExpenses.incomes },
    ];

    const RADIAN = Math.PI / 180;
    const renderCustomizedLabel = ({
        cx, cy, midAngle, innerRadius, outerRadius, percent, index,
    }) => {
        const radius = innerRadius + (outerRadius - innerRadius) * 0.5;
        const x = cx + radius * Math.cos(-midAngle * RADIAN);
        const y = cy + radius * Math.sin(-midAngle * RADIAN);

        return (
            <text x={x} y={y} fill="white" textAnchor={x > cx ? 'start' : 'end'} dominantBaseline="central">
                {`${(percent * 100).toFixed(0)}%`}
            </text>
        );
    };

    const COLORS = ['#F5A2A2', '#C4DCA3'];

    return (
        <ResponsiveContainer width="100%" height={300} >
            <PieChart>
                <Pie
                    data={data}
                    // cx={200}
                    // cy={200}
                    labelLine={false}
                    label={renderCustomizedLabel}
                    outerRadius="100%"
                    fill="#8884d8"
                    dataKey="value"

                >
                    {
                        data.map((entry, index) => <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />)
                    }
                </Pie>
                <Tooltip />
            </PieChart>
        </ResponsiveContainer>
    );
};

export { ExpensesAndIncomes as default };
