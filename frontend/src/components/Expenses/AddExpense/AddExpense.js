import React, { useContext, Fragment } from 'react';
import ExpensesContext from '../../../context/expenses-context';
import ModalContext from '../../../context/modal-context';
import AddExpenseModal from '../../Modal/AddExpenseModal';
import Spinner from '../../Spinner/Spinner';
import InfoModal from '../../Modal/Modal';
import '../../../pages/Expenses.css';

const AddExpenseForm = () => {
    const { isLoading } = useContext(ExpensesContext);
    const { showModal, setShowModal } = useContext(ModalContext);

    return (
        <Fragment>
            {
                isLoading ? <Spinner /> :
                    <Fragment>
                        <InfoModal />
                        <div className="expenses-control">
                            <div className="card-body text-center">
                                <p className="card-text">Collect all your expenses</p>
                                <button className='btn btn_addExpense' onClick={() => setShowModal(!showModal)}>add expense</button>
                            </div>
                        </div>
                        {showModal && (
                            <Fragment>
                                <AddExpenseModal />
                            </Fragment>
                        )}
                    </Fragment>
            }
        </Fragment >
    );
};

export { AddExpenseForm as default };