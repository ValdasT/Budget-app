import React, { useContext, Fragment} from 'react';
import ModalContext from '../../../context/modal-context';
import ExpensesContext from '../../../context/expenses-context';
import AddExpenseModal from '../../Modal/AddExpenseModal';
import InfoModal from '../../Modal/Modal';
import { FiPlus } from "react-icons/fi";
import { MdUnfoldMore, MdUnfoldLess  } from "react-icons/md";
import '../ExpensesList/Expense/Expense.css';

const AddExpenseForm = () => {
    const { showModal, setShowModal } = useContext(ModalContext);
    const { setShowMore,showMore } = useContext(ExpensesContext);

    return (
        <ExpensesContext.Provider value={{ showMore }}>
            <span className="card_first card">
                <Fragment>
                    <InfoModal />
                    <div className='row d-flex align-self-center'>
                        <button className='btn_one' onClick={() => setShowModal(!showModal)}>
                            <i><FiPlus size={40} /></i>
                        </button>
                        <button className='btn_one' onClick={() => setShowMore(!showMore)}>
                            {!showMore ? <i><MdUnfoldMore size={40} /></i> : <i><MdUnfoldLess size={40} /></i>}
                        </button>
                    </div>
                    {showModal && (
                        <Fragment>
                            <AddExpenseModal />
                        </Fragment>
                    )}
                </Fragment>
            </span>
        </ExpensesContext.Provider>
    );
};

export { AddExpenseForm as default };