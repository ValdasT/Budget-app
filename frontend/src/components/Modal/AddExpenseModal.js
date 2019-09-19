import React, { useContext, Fragment, useState } from 'react';
import ModalContext from '../../context/modal-context';
import { Modal } from 'react-bootstrap';
import { Formik, Field, Form, ErrorMessage } from 'formik';
import * as Yup from 'yup';
import moment from 'moment';
import DatePicker from 'react-datepicker';
import { FaRegCalendarAlt } from 'react-icons/fa';
import { MdEuroSymbol } from 'react-icons/md';


import 'react-datepicker/dist/react-datepicker.css';
import './Modal.css';

const formatDate = (pleaseformat) => {
    return moment(pleaseformat).format('MM/DD/YYYY');
};

const dateBeautify = (milliseconds) => {
    return moment(milliseconds, 'x').format('MM/DD/YYYY');
};

const validatePrice = (event) => {
    let price = event.target.value;
    if (price.length === 1 && price === '.') {
        price = price.slice(0, -1);
    }
    if (price.length === 2 && price === '00') {
        price = price.slice(0, -1);
    }
    if (price.split('.').length - 1 > 1) {
        price = price.slice(0, -1);
    }
    price = (price.indexOf('.') >= 0) ? (price.substr(0, price.indexOf('.')) + price.substr(price.indexOf('.'), 3)) : price;
    return price.replace(/[^\d.-]/g, '').replace('-', '');
};

const AddExpenseModal = () => {
    const {submitExpense, showModal, setShowModal, expense, onUpdate } = useContext(ModalContext);
    const handleClose = () => setShowModal(!showModal);
    let time = moment().format('MM/DD/YYYY');
    const [selectedDate, setSelectedDate] = useState(new Date(expense ? dateBeautify(expense.createdAt) : time));

    return (
        <Fragment>
            <Modal
                aria-labelledby="contained-modal-title-vcenter"
                centered show={showModal} onHide={handleClose}>
                <Modal.Header closeButton>
                    {onUpdate ? <Modal.Title>Update expense</Modal.Title> : <Modal.Title>Add expense</Modal.Title>}
                </Modal.Header>
                <Modal.Body>
                    <Formik
                        initialValues={{
                            tag: expense ? expense.tag : '',
                            title: expense ? expense.title : '',
                            description: expense ? expense.description : '',
                            group: expense ? expense.group : '',
                            price: expense ? expense.price : '',
                            date: expense ? dateBeautify(expense.createdAt) : time,
                            updateDate: expense ? dateBeautify(expense.updatedAt) : time,
                        }}
                        validationSchema={Yup.object().shape({
                            title: Yup.string()
                                .required('title is required'),
                            description: Yup.string(),
                            group: Yup.string()
                                .required('Group is required'),
                            tag: Yup.string()
                                .required('Type is required'),
                            price: Yup.number()
                                .required('Price is required'),
                            date: Yup.date()
                                .required('Date is required')
                        })}
                        onSubmit={fields => {
                            submitExpense(fields);
                        }}

                        render={({ errors, values, touched, handleChange, setFieldValue, handleBlur, }) => (
                            <Form className="auth-form">
                                <div className="p-2">
                                </div>
                                <div className="form-group row">
                                    <label className="col-sm-3 col-form-label" htmlFor="title">Type</label>
                                    <div className="col-sm-9">
                                        <select name="tag" onChange={handleChange}
                                            onBlur={handleBlur} value={values.tag} className={'custom-select mr-sm-2 form-control' + (errors.tag && touched.tag ? ' is-invalid' : '')} id="inlineFormCustomSelect">
                                            <option value="">Select a type</option>
                                            <option value="Expense">Expense</option>
                                            <option value="Income">Income</option>
                                        </select>
                                        <ErrorMessage name="tag" component="div" className="invalid-feedback" />
                                    </div>
                                </div>
                                <div className="form-group row">
                                    <label className="col-sm-3 col-form-label" htmlFor="title">Title</label>
                                    <div className="col-sm-9">
                                        <Field placeholder="Title" name="title" type="text" className={'form-control' + (errors.title && touched.title ? ' is-invalid' : '')} />
                                        <ErrorMessage name="title" component="div" className="invalid-feedback" />
                                    </div>
                                </div>
                                <div className="form-group row">
                                    <label className="col-sm-3 col-form-label" htmlFor="description">Description</label>
                                    <div className="col-sm-9">
                                        <Field component="textarea" placeholder="Description" name="description" type="text" className="form-control" />
                                        <ErrorMessage name="description" className="invalid-feedback" />
                                    </div>
                                </div>
                                <div className="form-group row">
                                    <label className="col-sm-3 col-form-label" htmlFor="title">Group</label>
                                    <div className="col-sm-9">
                                        <select name="group" onChange={handleChange}
                                            onBlur={handleBlur} value={values.group} className={'custom-select mr-sm-2 form-control' + (errors.group && touched.group ? ' is-invalid' : '')} id="inlineFormCustomSelect">
                                            <option value="">Select a group</option>
                                            <option value="1">One</option>
                                            <option value="2">Two</option>
                                            <option value="3">Three</option>
                                        </select>
                                        <ErrorMessage name="group" component="div" className="invalid-feedback" />
                                    </div>
                                </div>
                                <div className="form-group row">
                                    <label className="col-sm-3 col-form-label" htmlFor="title">Price</label>
                                    <div className="col-sm-9">
                                        <div className="input-group mb-2 mr-sm-2">
                                            <input placeholder="0.00" name="price" onChange={e => { setFieldValue('price', validatePrice(e)); }} value={values.price} className={'form-control' + (errors.price && touched.price ? ' is-invalid' : '')} />
                                            <div className="input-group-append">
                                                <div className="input-group-text"><MdEuroSymbol className="" size={20} /></div>
                                            </div>
                                            <ErrorMessage name="price" component="div" className="invalid-feedback" />
                                        </div>
                                    </div>
                                </div>
                                <div className="form-group row">
                                    <label className="col-sm-3 col-form-label" htmlFor="date">Date</label>
                                    <div className="col-sm-9">
                                        <div className="input-group mb-2 mr-sm-2">
                                            <DatePicker
                                                className={'form-control not-round-right-corner' + (errors.date && touched.date ? ' is-invalid' : '')}
                                                customInput={
                                                    <div>
                                                        <span className="">{values.date}</span>
                                                    </div>
                                                }
                                                peekNextMonth
                                                showMonthDropdown
                                                dropdownMode="select"
                                                type="text"
                                                autoComplete="off"
                                                name="date"
                                                selected={selectedDate}
                                                placeholder="Enter date"
                                                onChange={e => { setFieldValue('date', formatDate(e)); setSelectedDate(e); }} />
                                            <div className="input-group-append">
                                                <div className="input-group-text"><FaRegCalendarAlt className="" size={20} /></div>
                                            </div>
                                        </div>
                                    </div>
                                    <ErrorMessage name="date" component="div" className="invalid-feedback" />
                                </div>
                                <div className="form-actions float-right">
                                    {onUpdate? <button type="submit" className="btn btn-primary mr-2">Update</button> : <button type="submit" className="btn btn-primary mr-2">Submit</button> }
                                    <button  type='button' className="btn btn-secondary" onClick={handleClose}>Cancel</button>
                                </div>
                            </Form>
                        )}
                    />
                </Modal.Body>
            </Modal>
        </Fragment>
    );
};

export default AddExpenseModal;