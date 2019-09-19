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

    const fastFilter = filter => {
        let date = {
            dateFrom: '',
            dateTo: ''
        };
        switch (filter) {
        case 'today':
            date = {
                dateFrom: moment().format('MM/DD/YYYY'),
                dateTo: moment().format('MM/DD/YYYY')
            };
            getAllOnFilter(date);
            break;
        case 'week':
            date = {
                dateFrom: moment().startOf('week').format('MM/DD/YYYY'),
                dateTo: moment().endOf('week').format('MM/DD/YYYY')
            };
            getAllOnFilter(date);
            break;
        case 'month':
            date = {
                dateFrom: moment().startOf('month').format('MM/DD/YYYY'),
                dateTo: moment().endOf('month').format('MM/DD/YYYY')
            };
            getAllOnFilter(date);
            break;
        case 'year':
            date = {
                dateFrom: moment().startOf('year').format('MM/DD/YYYY'),
                dateTo: moment().endOf('year').format('MM/DD/YYYY')
            };
            getAllOnFilter(date);
            break;
        case 'all':
            getAll();
            break;
        default:
            date = {
                dateFrom: moment().startOf('month').format('MM/DD/YYYY'),
                dateTo: moment().endOf('month').format('MM/DD/YYYY')
            };
            getAllOnFilter(date);
        }
    };

    return (
        <Fragment>
            <div className="form-group row col-sm-12  justify-content-center mb-3">
                <button className=" col-sm-2 btn btn_with_line" onClick={() => fastFilter('today')}>Today</button>
                <button className="col-sm-2 btn btn_with_line" onClick={() => fastFilter('week')}>This week</button>
                <button className="col-sm-2 btn btn_with_line" onClick={() => fastFilter('month')}>This month</button>
                <button className="col-sm-2 btn btn_with_line" onClick={() => fastFilter('year')}>This year</button>
                <button className="col-sm-2 btn btn_with_line" onClick={() => fastFilter('all')}>All</button>
            </div>
            <Formik
                initialValues={{
                    dateFrom: fromTime,
                    dateTo:  toTime,
                }}
                validationSchema={Yup.object().shape({
                    dateFrom: Yup.date()
                        .required('Date is required'),
                    dateTo: Yup.date()
                        .required('Date is required')
                })}
                onSubmit={fields => {
                    getAllOnFilter(fields);
                }}

                render={({ errors, values, touched, setFieldValue }) => (
                    <Form>
                        <div className="form-group row col-sm-12  justify-content-center mb-2">
                            <label className=" col-form-label mr-3" htmlFor="dateFrom">From:</label>
                            <div>
                                <div className="input-group mb-2 mr-sm-2">
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