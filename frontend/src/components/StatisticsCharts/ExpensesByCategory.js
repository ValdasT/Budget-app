import React, { useContext, useState, Fragment, useEffect } from 'react';
import StatisticsContext from '../../context/statistics-context';
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip } from 'recharts';

const ExpensesByCategory = () => {
    const { allExpenses } = useContext(StatisticsContext);

    useEffect(() => {
        prepareChartData(allExpenses);
    }, [allExpenses]);

    let [allExpensesByCategory, setAllExpensesByCategory] = useState([]);

    let prepareChartData = allExpenses => {
        let expensesByCategories = [];
        allExpenses.forEach(element => {
            let found = false;
            expensesByCategories.forEach(expensesCategory => {
                if (element.tag === 'Expense') {
                    if (element.group === expensesCategory.group) {
                        found = true;
                        expensesCategory.price += parseFloat(element.price);
                    }
                } else {
                    found = true;
                }
            })
            if (!found && element.tag === 'Expense') {
                expensesByCategories.push({
                    group: element.group,
                    price: parseFloat(element.price)
                })
            }
        });
        setAllExpensesByCategory(expensesByCategories);
    };

    const data = [];
    allExpensesByCategory.forEach(element => {
        element.price = parseFloat(element.price.toFixed(2));
        data.push({ name: element.group, value: element.price });
    });

    const COLORS = ['#F5A2A2', '#C4DCA3', '#A3A6DC', '#D1A3DC', '#E8F57E', '#AB7EF5', '#7EDEF5', '#B2C5DD', '#B8DDB2', '#E8D33B'];

    return (
        <ResponsiveContainer width="100%" height={300} >
            <PieChart>
                <Pie
                    data={data}
                    labelLine={true}
                    label={true}
                    outerRadius="100%"
                    fill="#8884d8"
                    dataKey="value"
                    innerRadius={50}
                    outerRadius={80}
                    paddingAngle={10}

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

export { ExpensesByCategory as default };
