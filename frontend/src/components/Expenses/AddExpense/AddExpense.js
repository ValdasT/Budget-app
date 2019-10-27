import React, { useContext, Fragment} from 'react';
import ModalContext from '../../../context/modal-context';
import ExpensesContext from '../../../context/expenses-context';
import AddExpenseModal from '../../Modal/AddExpenseModal';
import InfoModal from '../../Modal/Modal';
import { FiPlus, FiUpload } from "react-icons/fi";
import { MdUnfoldMore, MdUnfoldLess  } from "react-icons/md";
import '../ExpensesList/Expense/Expense.css';

const AddExpenseForm = () => {
    const { showModal, setShowModal, showImportModal, setShowIportModal } = useContext(ModalContext);
    const { setShowMore, showMore, allExpenses, settings } = useContext(ExpensesContext);

    return (
        <span className="card_first card">
            <Fragment>
                <InfoModal />
                <div className='row d-flex align-self-center'>
                    <button className='btn_one' onClick={() => setShowModal(!showModal)}>
                        <i><FiPlus size={30} /></i>
                    </button>
                    <button className='btn_upload' onClick={() => setShowIportModal(!showImportModal)}>
                        <i><FiUpload size={25} /></i>
                    </button>
                    {allExpenses.length ? <button className='btn_one' onClick={() => setShowMore(!showMore)}>
                        {!showMore ? <i><MdUnfoldMore size={30} /></i> : <i><MdUnfoldLess size={30} /></i>}
                    </button> : null}
                </div>
                {showModal && (
                    <Fragment>
                        <AddExpenseModal setting={settings[0]} />
                    </Fragment>
                )}
            </Fragment>
        </span>
    );
};

export { AddExpenseForm as default };