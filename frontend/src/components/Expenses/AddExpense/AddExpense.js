import React, { useState, useContext } from 'react';
// import Modal2 from '../../Modal/Modal2';
import ExpensesContext from '../../../context/expenses-context';
import ModalContext from '../../../context/modal-context';
import AddExpenseModal from '../../Modal/AddExpenseModal';
// import Backdrop from '../../Backdrop/Backdrop';

const AddExpenseForm = () => {
    const { dispatch } = useContext(ExpensesContext);
    const [title, setTitle] = useState('');
    const [body, setBody] = useState('');
    let [showModal, setShowModal] = useState(false);
    let [modalHeader, setModalHeader] = useState('');
    let [modalText, setModalText] = useState();

    const modalInfo = (show, header, text) => {
        setShowModal(show);
        setModalHeader(header);
        setModalText(text);
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



    // modalConfirmHandler = () => {
    //     this.setState({ creating: false });
    //     const title = this.titleElRef.current.value;
    //     const price = +this.priceElRef.current.value;
    //     const date = this.dateElRef.current.value;
    //     const description = this.descriptionElRef.current.value;
    
    //     if (
    //       title.trim().length === 0 ||
    //       price <= 0 ||
    //       date.trim().length === 0 ||
    //       description.trim().length === 0
    //     ) {
    //       return;
    //     }
    
    //     const event = { title, price, date, description };
    //     console.log(event);
    
    //     const requestBody = {
    //       query: `
    //           mutation CreateEvent($title: String!, $desc: String!, $price: Float!, $date: String!) {
    //             createEvent(eventInput: {title: $title, description: $desc, price: $price, date: $date}) {
    //               _id
    //               title
    //               description
    //               date
    //               price
    //             }
    //           }
    //         `,
    //         variables: {
    //           title: title,
    //           desc: description,
    //           price: price,
    //           date: date
    //         }
    //     };
    
    //     const token = this.context.token;
    
    //     fetch('http://localhost:8000/graphql', {
    //       method: 'POST',
    //       body: JSON.stringify(requestBody),
    //       headers: {
    //         'Content-Type': 'application/json',
    //         Authorization: 'Bearer ' + token
    //       }
    //     })
    //       .then(res => {
    //         if (res.status !== 200 && res.status !== 201) {
    //           throw new Error('Failed!');
    //         }
    //         return res.json();
    //       })
    //       .then(resData => {
    //         this.setState(prevState => {
    //           const updatedEvents = [...prevState.events];
    //           updatedEvents.push({
    //             _id: resData.data.createEvent._id,
    //             title: resData.data.createEvent.title,
    //             description: resData.data.createEvent.description,
    //             date: resData.data.createEvent.date,
    //             price: resData.data.createEvent.price,
    //             creator: {
    //               _id: this.context.userId
    //             }
    //           });
    //           return { events: updatedEvents };
    //         });
    //       })
    //       .catch(err => {
    //         console.log(err);
    //       });
    // };
    


    return (
        <div>
            {/* <button className='btn btn-primary' onClick={() => setStartAdd(startAdd = !startAdd)}>add expense</button> */}
            <button className='btn btn-primary' onClick={() => modalInfo(!showModal,'sdsdsdsdsdsdsadasdasdasd','asdasdasdasdasdasdasdasdasdasdasd')}>add expense</button>
            {showModal && (
                <ModalContext.Provider value={{ modalHeader, modalText, showModal, setShowModal }}>
                    test
                    <AddExpenseModal/>
                    {/* <ExpensesContext.Provider value={{ startAdd, cancelButton }}>
                    <form onSubmit={addExpense}>
                        <input value={title} onChange={(e) => setTitle(e.target.value)} />
                        <textarea value={body} onChange={(e) => setBody(e.target.value)}></textarea>
                        <button className='btn'>add expense</button>
                    </form>
                    </ExpensesContext.Provider> */}
                </ModalContext.Provider>
            )}
        </div>
    );
};

export { AddExpenseForm as default };