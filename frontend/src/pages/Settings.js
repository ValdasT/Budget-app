import React, { useEffect, useState, Fragment } from 'react';
import { Formik, Field, Form, ErrorMessage } from 'formik';
import * as Yup from 'yup';
import { Tab, Tabs } from 'react-bootstrap';
import moment from 'moment';
import ModalContext from '../context/modal-context';
import InfoModal from '../components/Modal/Modal';
import Spinner from '../components/Spinner/Spinner';
import { FiUser, FiSettings } from "react-icons/fi";
import { MdEuroSymbol } from 'react-icons/md';
import { FaRegTimesCircle } from "react-icons/fa";
import './Settings.css';

import AuthContext from '../context/auth-context';

const Settings = () => {
    let [err, setErr] = useState({ newCategorie: false });
    let [categories, setCategories] = useState([]);
    let currentUser = AuthContext._currentValue;
    let [userData, setUserData] = useState({});
    let [editableUserData, setEditableUserData] = useState({});
    let [settingsData, setSettingsData] = useState({});
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
        getSettingsData();
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



    const getSettingsData = () => {
        setIsLoading(true);
        const requestBody = {
            query: `
              query {
                settingsData {
                    _id
                    dailyBudget
                    weeklyBudget
                    monthlyBudget
                    categories
                    members
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
                setSettingsData(resData.data.settingsData[0]);
                setCategories(resData.data.settingsData[0].categories.split(';'));
            })
            .catch(err => {
                setIsLoading(false);
                modalInfo(true, 'Error', err);
                console.log(err);
                return err;
            });
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

    const addCategory = (event, oldCategory) => {
        if (event.target.value === undefined || !event.target.value.length) {
            setErr({ ...err, newCategorie: true });
            return oldCategory;
        } else {
            event.target.value = event.target.value.toLowerCase();
            let newCategory = event.target.value.charAt(0).toUpperCase() + event.target.value.slice(1);
            let found = false;
            categories.forEach(category => {
                if (category === newCategory) {
                    found = true;
                }
            });
            if (found) {
                modalInfo(true, 'Error', 'This category already in the category list.');
            } else {
                setCategories([...categories, newCategory]);
            }
        }
    };

    const removeCategory = category => {
        if (categories.length === 1) {
            modalInfo(true, 'Error', 'You can\'t delete all categories.');
        } else {
            setCategories(categories.filter(item => item !== category));
        }
    };

    const clearCategory = event => {
        return '';
    };

    const emitChangesToCategory = event => {
        if (err.newCategorie) {
            setErr({ ...err, newCategorie: false });
        }
        return event.target.value.replace(/[//|/;&$%@"<>()+{}.',=_~`!#^*/?]/g, '');
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
                                render={({ errors, touched }) => (
                                    <Form className="settings-form" id="formContentUserSettings">
                                        <div className="p-2">
                                            <h4>User settings</h4>
                                        </div>
                                        <div className="form-group row">
                                            <label className="col-sm-4 col-form-label" htmlFor="firstName">First Name</label>
                                            <div className="col-sm-8">
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
                            <Formik
                                enableReinitialize={true}
                                initialValues={{
                                    dailyBudget: settingsData.dailyBudget || '',
                                    weeklyBudget: settingsData.weeklyBudget || '',
                                    monthlyBudget: settingsData.monthlyBudget || '',
                                    categories: settingsData.categories || '',
                                    newCategorie: '',
                                    members: settingsData.members || '',
                                }}
                                validationSchema={Yup.object().shape({
                                    dailyBudget: Yup.number(),
                                    weeklyBudget: Yup.number(),
                                    monthlyBudget: Yup.number(),
                                    categories: Yup.string(),
                                    newCategorie: Yup.string(),
                                })}
                                onSubmit={fields => {
                                    console.log(fields);
                                    // updateUser(fields);
                                }}
                                render={({ errors, values, touched, handleChange, setFieldValue, handleBlur, }) => (
                                    <Form id="formContentSystemSettings">
                                        <div className="form-group row col-sm-12" style={{ paddingTop: '25px' }}>
                                            <div className="col-sm-4 ">
                                                <div className="p-2 settings-form">
                                                    <h4>Budget settings</h4>
                                                </div>
                                                <div className="form-group row">
                                                    <label className="col-sm-5" htmlFor="title">Daily budget</label>
                                                    <div className="col-sm-5">
                                                        <div className="input-group ">
                                                            <input placeholder="0.00" name="dailyBudget" onChange={e => { setFieldValue('dailyBudget', validatePrice(e)); }} value={values.dailyBudget} className={'form-control' + (errors.dailyBudget && touched.dailyBudget ? ' is-invalid' : '')} />
                                                            <div className="input-group-append">
                                                                <div className="input-group-text"><MdEuroSymbol className="" size={20} /></div>
                                                            </div>
                                                            <ErrorMessage name="dailyBudget" component="div" className="invalid-feedback" />
                                                        </div>
                                                    </div>
                                                </div>
                                                <div className="form-group row">
                                                    <label className="col-sm-5" htmlFor="title">Weekly budget</label>
                                                    <div className="col-sm-5">
                                                        <div className="input-group mb-2 mr-sm-2">
                                                            <input placeholder="0.00" name="weeklyBudget" onChange={e => { setFieldValue('weeklyBudget', validatePrice(e)); }} value={values.weeklyBudget} className={'form-control' + (errors.weeklyBudget && touched.weeklyBudget ? ' is-invalid' : '')} />
                                                            <div className="input-group-append">
                                                                <div className="input-group-text"><MdEuroSymbol className="" size={20} /></div>
                                                            </div>
                                                            <ErrorMessage name="weeklyBudget" component="div" className="invalid-feedback" />
                                                        </div>
                                                    </div>
                                                </div>
                                                <div className="form-group row">
                                                    <label className="col-sm-5" htmlFor="title">Monthly budget</label>
                                                    <div className="col-sm-5">
                                                        <div className="input-group mb-2 mr-sm-2">
                                                            <input placeholder="0.00" name="monthlyBudget" onChange={e => { setFieldValue('monthlyBudget', validatePrice(e)); }} value={values.monthlyBudget} className={'form-control' + (errors.monthlyBudget && touched.monthlyBudget ? ' is-invalid' : '')} />
                                                            <div className="input-group-append">
                                                                <div className="input-group-text"><MdEuroSymbol className="" size={20} /></div>
                                                            </div>
                                                            <ErrorMessage name="monthlyBudget" component="div" className="invalid-feedback" />
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                            <div className="col-sm-4 ">
                                                <div className="p-2 settings-form">
                                                    <h4>Categories settings</h4>
                                                </div>
                                                <div className="form-group row">
                                                    <label className="col-sm-4" htmlFor="title">Add category</label>
                                                    <div className="col-sm-6">
                                                        <div className="form-group row">
                                                            <input placeholder="Category name" name="newCategorie" onChange={e => { setFieldValue('newCategorie', emitChangesToCategory(e)); }} value={values.newCategorie} className={'form-control col-sm-8 mr-1' + (err.newCategorie ? ' is-invalid' : '')} />
                                                            <button type="button" onClick={e => { setFieldValue('categories', addCategory(e, values.categories)); setFieldValue('newCategorie', clearCategory(e)); }} value={values.newCategorie} className="col-sm-3 btn btn_main">Add</button>
                                                            <ErrorMessage name="newCategorie" component="div" className="invalid-feedback" />
                                                            {err.newCategorie ? <div className="invalid-feedback"> Category field can't be empty</div> : null}
                                                        </div>

                                                    </div>
                                                </div>

                                                <div className="form-group row">
                                                    <label className="col-sm-4" htmlFor="title">All categories</label>
                                                    <div className="col-sm-8">
                                                        <ul className="list-group col-sm-9">
                                                            {
                                                                categories.map((category) => (
                                                                    <li className='row' key={category}>
                                                                        <span className='list-group-item list-item col-sm-12'>{category}
                                                                            <button className='btn card_removeButton' type='button' onClick={() => removeCategory(category)}>
                                                                                <i><FaRegTimesCircle size={20} /></i>
                                                                            </button>
                                                                        </span>
                                                                    </li>
                                                                ))
                                                            }
                                                        </ul>

                                                    </div>
                                                </div>
                                            </div>
                                            <div className="col-sm-4 ">
                                            <div className="p-2 settings-form">
                                                    <h4>Fammily settings</h4>
                                                </div>
                                            </div>
                                        </div>
                                        <div className="form-group">
                                            <button type="submit" className="btn btn_main update-btn">Update</button>
                                        </div>
                                    </Form>
                                )}
                            />
                        </Tab>
                    </Tabs>
                </ModalContext.Provider>
            </Fragment>
    );
};

export { Settings as default };
