import React, { useEffect, useState, Fragment } from 'react';
import { Formik, Field, Form, ErrorMessage } from 'formik';
import * as Yup from 'yup';
import { Tab, Tabs } from 'react-bootstrap';
import moment from 'moment';
import ModalContext from '../context/modal-context';
import InfoModal from '../components/Modal/Modal';
import Spinner from '../components/Spinner/Spinner';
import { FiUser, FiSettings } from "react-icons/fi";
import './Settings.css';

import AuthContext from '../context/auth-context';

const Settings = () => {
    let currentUser = AuthContext._currentValue;
    let [userData, setUserData] = useState({});
    let [editableUserData, setEditableUserData] = useState({});
    let [isLoading, setIsLoading] = useState(false);

    let [showInfoModal, setShowInfoModal] = useState(false);
    let [modalHeader, setModalHeader] = useState('');
    let [modalText, setModalText] = useState();

    const modalInfo = (show, header, text) => {
        setShowInfoModal(show);
        setModalHeader(header);
        setModalText(text);
    };

    const [key, setKey] = useState('userSettings');

    useEffect(() => {
        getUserData();
    }, []);

    const getUserData = () => {
        setIsLoading(true);
        const requestBody = {
            query: `
              query {
                userData {
                    _id
                    email
                    name
                    surname
                    createdAt
                    updatedAt
                  }
              }`
        };
        return fetch('/graphql', {
            method: 'POST',
            body: JSON.stringify(requestBody),
            headers: {
                'Content-Type': 'application/json',
                Authorization: 'Bearer ' + currentUser.token
            }
        })
            .then(res => {
                setIsLoading(false);
                if (res.status !== 200 && res.status !== 201) {
                    throw new Error('Failed!');
                }
                return res.json();
            })
            .then(resData => {
                setUserData(resData.data.userData[0]);
                setEditableUserData(resData.data.userData[0]);
                setIsLoading(false);
                return resData.data.expenses;

            })
            .catch(err => {
                setIsLoading(false);
                console.log(err);
                return err;
            });
    };

    const updateUser = (fields) => {
        fields.updatedAt = JSON.stringify(moment(new Date()).valueOf());

        setIsLoading(true);
        let requestBody = {
            query: `

                              mutation UpdateUser($id: ID!, $name: String!, $surname: String!, $email: String!, $updatedAt: String!) {
                                updateUser(userId: $id, name: $name, surname: $surname, email: $email, updatedAt: $updatedAt) {
                                    name
                                    surname
                                    email
                                  }
                              }
                            `,
            variables: {
                id: userData._id,
                name: fields.firstName,
                surname: fields.lastName,
                email: fields.email,
                updatedAt: fields.updatedAt
            }
        };

        fetch('/graphql', {
            method: 'POST',
            body: JSON.stringify(requestBody),
            headers: {
                'Content-Type': 'application/json',
                Authorization: 'Bearer ' + currentUser.token
            }
        })
            .then(res => {
                if (!res.ok) {
                    setIsLoading(false);
                    throw (res.statusText);
                }
                return res.json();
            })
            .then(res => {
                if (res.errors) {
                    throw (res.errors[0].message);
                }
                console.log(res);
                setEditableUserData(res.data.updateUser);
                modalInfo(true, 'Confirmation', 'User was updated');
                setIsLoading(false);
            })
            .catch(err => {
                setIsLoading(false);
                console.log(err);
                modalInfo(true, 'Error', err);
                throw err;
            });
    };

    return (
        isLoading ? <Spinner /> :
            <Fragment>
                <ModalContext.Provider value={{ showInfoModal, setShowInfoModal, modalHeader, modalText, modalInfo }}>
                    <InfoModal />
                    <Tabs id="settings-tab" activeKey={key} onSelect={k => setKey(k)}>
                        <Tab eventKey="userSettings" title={key === 'userSettings' ? <span style={{ color: '#ea97c4' }}><FiUser size={20} />&nbsp; User </span> :
                            <span><FiUser size={20} color={'#aeaeae'} />&nbsp; User </span>}>
                            <Formik
                                enableReinitialize={true}
                                initialValues={{
                                    firstName: editableUserData.name || '',
                                    lastName: editableUserData.surname || '',
                                    email: editableUserData.email || '',
                                }}
                                validationSchema={Yup.object().shape({
                                    firstName: Yup.string()
                                        .required('First Name is required'),
                                    lastName: Yup.string()
                                        .required('Last Name is required'),
                                    email: Yup.string()
                                        .email('Email is invalid')
                                        .required('Email is required'),
                                })}
                                onSubmit={fields => {
                                    updateUser(fields);
                                }}
                                render={({ errors, status, touched }) => (
                                    <Form className="settings-form" id="formContentUserSettings">
                                        <div className="p-2">
                                            {/* <h4>User settings</h4> */}
                                        </div>
                                        <div className="form-group row">
                                            <label className="col-sm-4 col-form-label" htmlFor="firstName">First Name</label>
                                            <div className="col-sm-8 col-form-label">
                                                <Field placeholder="First name" name="firstName" type="text" className={'form-control' + (errors.firstName && touched.firstName ? ' is-invalid' : '')} />
                                                <ErrorMessage name="firstName" component="div" className="invalid-feedback" />
                                            </div>
                                        </div>
                                        <div className="form-group row">
                                            <label className="col-sm-4 col-form-label" htmlFor="lastName">Last Name</label>
                                            <div className="col-sm-8">
                                                <Field placeholder="Last name" name="lastName" type="text" className={'form-control' + (errors.lastName && touched.lastName ? ' is-invalid' : '')} />
                                                <ErrorMessage name="lastName" component="div" className="invalid-feedback" />
                                            </div>
                                        </div>
                                        <div className="form-group row">
                                            <label className="col-sm-4 col-form-label" htmlFor="email">Email</label>
                                            <div className="col-sm-8">
                                                <Field placeholder="Email" name="email" type="text" className={'form-control' + (errors.email && touched.email ? ' is-invalid' : '')} />
                                                <ErrorMessage name="email" component="div" className="invalid-feedback" />
                                            </div>
                                        </div>
                                        <div className="form-group">
                                            <button type="submit" className="btn btn_main update-btn">Update</button>
                                        </div>
                                    </Form>
                                )}
                            />
                        </Tab>
                        <Tab eventKey="systemSettings" title={key === 'systemSettings' ? <span style={{ color: '#ea97c4' }}><FiSettings size={20} />&nbsp; System </span> :
                            <span><FiSettings size={20} color={'#aeaeae'} />&nbsp; System </span>}>
                            <p>11111</p>
                        </Tab>
                    </Tabs>
                </ModalContext.Provider>
            </Fragment>
    );
};

export { Settings as default };
