import React, { useContext } from 'react';
import ExpensesContext from '../../context/expenses-context';

import './Modal.css';

const Modal2 = () => {
    const { startAdd, cancelButton} = useContext(ExpensesContext);
  
  
    return (
      <div className="modal">
      <header className="modal__header">
        <h1>{'Add expense'}</h1>
      </header>
      <section className="modal__content">{startAdd}</section>
      <section className="modal__actions">
        {/* {props.canCancel && ( */}
          <button className="btn" onClick={cancelButton}>
            Cancel
          </button>
        {/* )} */}
        {/* {props.canConfirm && (
          <button className="btn" onClick={props.onConfirm}>
            {props.confirmText}
          </button>
        )} */}
      </section>
    </div>
    );
  };
  
  export { Modal2 as default };