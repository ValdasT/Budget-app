import React, { useState, useContext } from 'react';
import Modal2 from '../../Modal/Modal2';
import ExpensesContext from '../../../context/expenses-context';
import Backdrop from '../../Backdrop/Backdrop';

const AddExpenseForm = () => {
    const { dispatch } = useContext(ExpensesContext);
    const [title, setTitle] = useState('');
    const [body, setBody] = useState('');
    let [startAdd, setStartAdd] = useState(false);

    const cancelButton = () => {
        return setStartAdd(startAdd = !startAdd);
    };

    const addExpense = (e) => {
        e.preventDefault();
        dispatch({
            type: 'ADD_EXPENSE',
            title,
            body
        });
        setTitle('');
        setBody('');
    };

    return (
        <div>
            this is {startAdd}
            <button className='btn' onClick={() => setStartAdd(startAdd = !startAdd)}>add expense2</button>
            {startAdd && (
                <ExpensesContext.Provider value={{ startAdd, cancelButton }}>
                    <Backdrop />
                    <form onSubmit={addExpense}>
                        <Modal2 />
                        <input value={title} onChange={(e) => setTitle(e.target.value)} />
                        <textarea value={body} onChange={(e) => setBody(e.target.value)}></textarea>
                        <button className='btn'>add expense</button>
                    </form>
                </ExpensesContext.Provider>
            )}
        </div>
    );
};

export { AddExpenseForm as default };