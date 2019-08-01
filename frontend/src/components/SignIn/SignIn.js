
import React, { useContext } from 'react';
import { Formik, Field, Form, ErrorMessage } from 'formik';
import * as Yup from 'yup';

import AuthContext from '../../context/auth-context';

const SignIn = () => {

    const { submitHandler, switchModeHandler } = useContext(AuthContext);

    return (
        <Formik
            initialValues={{
                email: '',
                password: '',
            }}
            validationSchema={Yup.object().shape({
                email: Yup.string()
                    .email('Email is invalid')
                    .required('Email is required'),
                password: Yup.string()
                    .required('Password is required'),
            })}
            onSubmit={fields => {
                submitHandler(fields);
            }}
            render={({ errors, status, touched }) => (
                <Form className="auth-form" id="formContentSignIn">
                    <div className="p-2">
                        <h4>Sign in</h4>
                    </div>
                    <div className="form-group row">
                        <label className="col-sm-3 col-form-label" htmlFor="email">Email</label>
                        <div className="col-sm-9">
                            <Field placeholder="Email" name="email" type="text" className={'form-control' + (errors.email && touched.email ? ' is-invalid' : '')} />
                            <ErrorMessage name="email" component="div" className="invalid-feedback" />
                        </div>
                    </div>
                    <div className="form-group row">
                        <label className="col-sm-3 col-form-label" htmlFor="password">Password</label>
                        <div className="col-sm-9">
                            <Field placeholder="Password" name="password" type="password" className={'form-control' + (errors.password && touched.password ? ' is-invalid' : '')} />
                            <ErrorMessage name="password" component="div" className="invalid-feedback" />
                        </div>
                    </div>
                    <div className="form-actions">
                        <button type="submit" className="btn btn-primary mr-2">Submit</button>
                        <button onClick={switchModeHandler} type="button" className="btn btn-secondary mr-2">Sign up</button>

                    </div>
                </Form>
            )}
        />
    );
};

export default SignIn;