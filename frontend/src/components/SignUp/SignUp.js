
import React, { useContext } from 'react';
import { Formik, Field, Form, ErrorMessage } from 'formik';
import * as Yup from 'yup';

import AuthContext from '../../context/auth-context';

const SignUp = () => {

    const { submitHandler, switchModeHandler } = useContext(AuthContext);
    
    return (
        <Formik
            initialValues={{
                firstName: '',
                lastName: '',
                email: '',
                password: '',
                confirmPassword: ''
            }}
            validationSchema={Yup.object().shape({
                firstName: Yup.string()
                    .required('First Name is required'),
                lastName: Yup.string()
                    .required('Last Name is required'),
                email: Yup.string()
                    .email('Email is invalid')
                    .required('Email is required'),
                password: Yup.string()
                    .min(6, 'Password must be at least 6 characters')
                    .required('Password is required'),
                confirmPassword: Yup.string()
                    .oneOf([Yup.ref('password'), null], 'Passwords must match')
                    .required('Confirm Password is required')
            })}
            onSubmit={fields => {
                submitHandler(fields);
            }}
            render={({ errors, status, touched }) => (
                <Form className="auth-form" id="formContentSignUp">
                    <div className="p-2">
                        <h4>Create account</h4>
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
                    <div className="form-group row">
                        <label className="col-sm-4 col-form-label" htmlFor="password">Password</label>
                        <div className="col-sm-8">
                            <Field placeholder="Password" name="password" type="password" className={'form-control' + (errors.password && touched.password ? ' is-invalid' : '')} />
                            <ErrorMessage name="password" component="div" className="invalid-feedback" />
                        </div>
                    </div>
                    <div className="form-group row">
                        <label className="col-sm-4 col-form-label" htmlFor="confirmPassword">Confirm Password</label>
                        <div className="col-sm-8">
                            <Field placeholder="Confirm" name="confirmPassword" type="password" className={'form-control' + (errors.confirmPassword && touched.confirmPassword ? ' is-invalid' : '')} />
                            <ErrorMessage name="confirmPassword" component="div" className="invalid-feedback" />
                        </div>
                    </div>
                    <div className="form-group">
                        <button type="submit" className="btn btn-primary mr-2">Register</button>
                        <button onClick={switchModeHandler} type="button" className="btn btn-secondary mr-2">Sign in</button>
                        {/* <button type="reset" className="btn btn-secondary">Reset</button> */}
                    </div>
                </Form>
            )}
        />
    );
};

export default SignUp;