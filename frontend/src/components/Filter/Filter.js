import React, { useContext,useState, Fragment } from 'react';
import { Formik, Form, ErrorMessage } from 'formik';
import * as Yup from 'yup';
import ExpensesContext from '../../context/expenses-context';
import moment from 'moment';
import DatePicker from 'react-datepicker';
import { FaRegCalendarAlt } from 'react-icons/fa';

import 'react-datepicker/dist/react-datepicker.css';


const Filter = () => {
    const { getAllOnFilter, getAll } = useContext(ExpensesContext);
    let toTime = moment().format('MM/DD/YYYY');
    let fromTime = moment().subtract(1, 'months').format('MM/DD/YYYY');
    const [startDate, setStartDate] = useState(new Date(fromTime));
    const [endDate, setEndDate] = useState(new Date(toTime));

    const formatDate = (pleaseformat) => {
        return moment(pleaseformat).format('MM/DD/YYYY');
    };

    const fastFilter = (filter, values) => {
        let date = {
            dateFrom: '',
            dateTo: '',
            tag: values
        };
        switch (filter) {
        case 'today':
            date = {
                dateFrom: moment().format('MM/DD/YYYY'),
                dateTo: moment().format('MM/DD/YYYY'),
                tag: values
            };
            getAllOnFilter(date);
            break;
        case 'week':
            date = {
                dateFrom: moment().startOf('week').format('MM/DD/YYYY'),
                dateTo: moment().endOf('week').format('MM/DD/YYYY'),
                tag: values
            };
            getAllOnFilter(date);
            break;
        case 'month':
            date = {
                dateFrom: moment().startOf('month').format('MM/DD/YYYY'),
                dateTo: moment().endOf('month').format('MM/DD/YYYY'),
                tag: values
            };
            getAllOnFilter(date);
            break;
        case 'year':
            date = {
                dateFrom: moment().startOf('year').format('MM/DD/YYYY'),
                dateTo: moment().endOf('year').format('MM/DD/YYYY'),
                tag: values
            };
            getAllOnFilter(date);
            break;
        case 'all':
            getAll(date.tag);
            break;
        default:
            date = {
                dateFrom: moment().startOf('month').format('MM/DD/YYYY'),
                dateTo: moment().endOf('month').format('MM/DD/YYYY'),
                tag: values
            };
            getAllOnFilter(date);
        }
    };

    return (
        <Fragment>
            <Formik
                initialValues={{
                    dateFrom: fromTime,
                    dateTo: toTime,
                    tag: 'All'
                }}
                validationSchema={Yup.object().shape({
                    dateFrom: Yup.date()
                        .required('Date is required'),
                    dateTo: Yup.date()
                        .required('Date is required'),
                    tag: Yup.string()
                })}
                onSubmit={fields => {
                    getAllOnFilter(fields);
                }}

                render={({ errors, values, touched, setFieldValue, handleChange, handleBlur }) => (
                    <Form>
                        <div className="form-group row col-sm-12  justify-content-center mb-3">
                            <button type='button' className=" col-sm-2 btn btn_with_line" onClick={() => {
                                fastFilter('today', values.tag);
                                setFieldValue('dateFrom', moment().format('MM/DD/YYYY'));
                                setFieldValue('dateTo', moment().format('MM/DD/YYYY'));
                                setStartDate(moment()._d);
                                setEndDate(moment()._d);
                            }}>Today</button>
                            <button type='button' className="col-sm-2 btn btn_with_line" onClick={() => {
                                fastFilter('week', values.tag);
                                setFieldValue('dateFrom', moment().startOf('week').format('MM/DD/YYYY'));
                                setFieldValue('dateTo', moment().endOf('week').format('MM/DD/YYYY'));
                                setStartDate(moment().startOf('week')._d);
                                setEndDate(moment().endOf('week')._d);
                            }}>This week</button>
                            <button type='button' className="col-sm-2 btn btn_with_line" onClick={() => {
                                fastFilter('month', values.tag);
                                setFieldValue('dateFrom', moment().startOf('month').format('MM/DD/YYYY'));
                                setFieldValue('dateTo', moment().endOf('month').format('MM/DD/YYYY'));
                                setStartDate(moment().startOf('month')._d);
                                setEndDate(moment().endOf('month')._d);
                            }}>This month</button>
                            <button type='button' className="col-sm-2 btn btn_with_line" onClick={() => {
                                fastFilter('year', values.tag);
                                setFieldValue('dateFrom', moment().startOf('year').format('MM/DD/YYYY'));
                                setFieldValue('dateTo', moment().endOf('year').format('MM/DD/YYYY'));
                                setStartDate(moment().startOf('year')._d);
                                setEndDate(moment().endOf('year')._d);
                            }}>This year</button>
                            <button type='button' className="col-sm-2 btn btn_with_line" onClick={() => fastFilter('all', values.tag)}>All</button>
                        </div>
                        <div className="form-group row col-sm-12  justify-content-center mb-2">
                            <div className="form-group row">
                                <label className=" col-form-label" htmlFor="title">Type:</label>
                                <div className="ml-3 mr-2">
                                    <select name="tag" onChange={handleChange}
                                        onBlur={handleBlur} value={values.tag} className={'custom-select mr-sm-2 form-control' + (errors.tag && touched.tag ? ' is-invalid' : '')} id="inlineFormCustomSelect">
                                        <option value="All">All</option>
                                        <option value="Expense">Expenses</option>
                                        <option value="Income">Incomes</option>
                                    </select>
                                    <ErrorMessage name="tag" component="div" className="invalid-feedback" />
                                </div>
                            </div>
                            <label className=" col-form-label ml-4" htmlFor="dateFrom">From:</label>
                            <div>
                                <div className="input-group mb-2 mr-sm-2 ml-3 mr-3">
                                    <DatePicker
                                        selected={startDate}
                                        startDate={startDate}
                                        endDate={endDate}
                                        className={'form-control not-round-right-corner' + (errors.dateFrom && touched.dateFrom ? ' is-invalid' : '')}
                                        customInput={
                                            <div>
                                                <span>{values.dateFrom}</span>
                                            </div>
                                        }
                                        peekNextMonth
                                        showMonthDropdown
                                        dropdownMode="select"
                                        type="text"
                                        autoComplete="off"
                                        name="dateFrom"
                                        placeholder="Enter date"
                                        onChange={date => { setFieldValue('dateFrom', formatDate(date)); setStartDate(date); }} />
                                    <div className="input-group-append">
                                        <div className="input-group-text"><FaRegCalendarAlt className="" size={20} /></div>
                                    </div>
                                </div>
                            </div>
                            <ErrorMessage name="dateTo" component="div" className="invalid-feedback" />
                            <label className="col-form-label ml-5 mr-3" htmlFor="dateTo">To:</label>
                            <div>
                                <div className="input-group mb-2 mr-sm-2">
                                    <DatePicker
                                        selected={endDate}
                                        startDate={startDate}
                                        endDate={endDate}
                                        className={'form-control not-round-right-corner' + (errors.dateTo && touched.dateTo ? ' is-invalid' : '')}
                                        customInput={
                                            <div>
                                                <span>{values.dateTo}</span>
                                            </div>
                                        }
                                        peekNextMonth
                                        showMonthDropdown
                                        dropdownMode="select"
                                        type="text"
                                        autoComplete="off"
                                        name="dateTo"
                                        placeholder="Enter date"
                                        onChange={date => { setFieldValue('dateTo', formatDate(date)); setEndDate(date); }} />
                                    <div className="input-group-append">
                                        <div className="input-group-text"><FaRegCalendarAlt className="" size={20} /></div>
                                    </div>
                                </div>
                            </div>
                            <ErrorMessage name="dateTo" component="div" className="invalid-feedback" />
                            <div className="float-right ml-5">
                                <button type="submit" className="btn btn_main">Filter</button>
                            </div>
                        </div>
                    </Form>
                )}
            />
        </Fragment>
    );
};

export default Filter;