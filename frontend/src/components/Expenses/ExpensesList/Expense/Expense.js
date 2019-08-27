import React, { useContext } from 'react';
import ExpensesContext from '../../../../context/expenses-context';
import './Expense.css';

const Expense = ({ expense }) => {
    const { dispatch } = useContext(ExpensesContext);

    return (
        // <div className = 'events_list-item'>
        //     <h1>{expense.title}</h1>
        //     <h2>{expense.price}</h2>
        //     <h2>{expense.createdAt}</h2>
        //     <h2>{expense._id}</h2>
        //     <button className= 'btn' onClick={() => dispatch({ type: 'REMOVE_EXPENSE', title: expense.title })}>x</button>
        // </div>

        // <div className="card" style={{ width: '18rem' }}>
        //     <div className="card-body">
        //         <h5 className="card-title">Special title treatment</h5>
        //         <p className="card-text">With supporting text below as a natural lead-in to additional content.</p>
        //         <a href="#" className="btn btn-primary">Go somewhere</a>
        //     </div>
        // </div>



        // <div className="cards-list">

        <span className="card">
            {/* <div className="card_image"> <img src="https://i.redd.it/b3esnz5ra34y.jpg" /> </div> */}
            <div style ={{background: 'rgb(249, 248, 248)'}}>
            <div className="card_title title-white"> {expense.title}</div>
            </div>
            <div>{expense.createdAt}</div>
            <div>{expense.description}</div>
            <div>{expense.price} € </div>
        </span>

        // </div>



    );
};

export { Expense as default };