import React, { useContext, Fragment } from 'react';
import ModalContext from '../../context/modal-context';
import { Modal, Button } from 'react-bootstrap';
import { Formik, Field, Form, ErrorMessage } from 'formik';
import * as Yup from 'yup';
import moment from 'moment';

import './Modal.css';


const dummyFunction = (fields) => {
    let time = new Date().getTime();
    console.log(fields);
};

const AddExpenseModal = () => {
    const { modalHeader, modalText, showModal, setShowModal } = useContext(ModalContext);
    const handleClose = () => setShowModal(!showModal);

    return (
        <Fragment>
            <Modal
                aria-labelledby="contained-modal-title-vcenter"
                centered show={showModal} onHide={handleClose}>
                <Modal.Header closeButton>
                    <Modal.Title>Add expense</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <Formik
                        initialValues={{
                            title: '',
                            description: '',
                            price: '',
                        }}
                        validationSchema={Yup.object().shape({
                            title: Yup.string()
                                .required('title is required'),
                            description: Yup.string(),
                            price: Yup.number()
                                .required()
                                .positive()
                        })}
                        onSubmit={fields => {
                            dummyFunction(fields);
                            // submitHandler(fields);
                        }}
                        render={({ errors, status, touched }) => (
                            <Form className="auth-form">
                                <div className="p-2">
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
                                    <label className="col-sm-3 col-form-label" htmlFor="title">Price</label>
                                    <div className="col-sm-9">
                                        <Field placeholder="0.00" name="price" step="0.01" type="number" className={'form-control' + (errors.price && touched.price ? ' is-invalid' : '')} />
                                        <ErrorMessage name="price" component="div" className="invalid-feedback" />
                                    </div>
                                </div>
                                <div className="form-actions float-right">
                                    <button type="submit" className="btn btn-primary mr-2">Submit</button>
                                    <button className="btn btn-secondary" onClick={handleClose}>Cancel</button>
                                    {/* <button onClick={switchModeHandler} type="button" className="btn btn-secondary mr-2">Sign up</button> */}
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