import React, { useContext, Fragment } from 'react';
import ModalContext from '../../../context/modal-context';
import AddExpenseModal from '../../Modal/AddExpenseModal';
import InfoModal from '../../Modal/Modal';
import '../../../pages/Expenses.css';

const AddExpenseForm = () => {
    const { showModal, setShowModal } = useContext(ModalContext);

    return (
        <Fragment>
            <Fragment>
                <InfoModal />
                <div className="expenses-control">
                    <div className="card-body text-center">
                        <p className="card-text">Collect all your expenses</p>
                        <button className='btn btn_main' onClick={() => setShowModal(!showModal)}>add expense</button>
                    </div>
                </div>
                {showModal && (
                    <Fragment>
                        <AddExpenseModal />
                    </Fragment>
                )}
            </Fragment>
        </Fragment >
    );
};

export { AddExpenseForm as default };