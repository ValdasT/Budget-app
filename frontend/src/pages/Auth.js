import React, { useState, Fragment, useContext } from 'react';
import './Auth.css';

import Spinner from '../components/Spinner/Spinner';
import AuthContext from '../context/auth-context';
import SignUp from '../components/SignUp/SignUp';
import SignIn from '../components/SignIn/SignIn';


const AuthPage = () => {
    let [isLogin, setisLogin] = useState(false);
    let [isLoading, setIsLoading] = useState(false);

    const { login } = useContext(AuthContext);

    const switchModeHandler = () => {
        return setisLogin(!isLogin);
    };

    const submitHandler = (values) => {
        setIsLoading(true);
        let query = {
            query: `
              query Login($email: String!, $password: String!) {
                login(email: $email, password: $password) {
                  userId
                  token
                  tokenExpiration
                }
              }
            `,
            variables: {
                email: values.email,
                password: values.password
            }
        };
        if (isLogin) {
            query = {
                query: `
            mutation CreateUser($email: String!, $password: String!, $name: String!, $surname: String!) {
              createUser(userInput: {email: $email, password: $password, name: $name, surname: $surname}) {
                _id
                email
              }
            }
          `,
                variables: {
                    email: values.email,
                    password: values.password,
                    name: values.firstName,
                    surname: values.lastName
                }
            };
        }

        fetch('/graphql', {
            method: 'POST',
            body: JSON.stringify(query),
            headers: {
                'Content-Type': 'application/json'
            }
        })
            .then(res => {
                console.log(res);
                if (res.status !== 200 && res.status !== 201) {
                    setIsLoading(false);
                    throw ('Failed!' + res.status);
                }
                return res.json();
            })
            .then(res => {
                setIsLoading(false);
                console.log(res);
                if (res.data.login) {
                    login(
                        res.data.login.token,
                        res.data.login.userId,
                        res.data.login.tokenExpiration,

                    );
                } else {
                    console.log('New acc was created!');
                    switchModeHandler();
                }
            })
            .catch(err => {
                setIsLoading(false);
                throw err;
            });
    };



    return (
        <AuthContext.Provider value={{ submitHandler, switchModeHandler }}>
            {
                isLoading ? <Spinner /> :
                    <Fragment>
                        {
                            isLogin ? <SignUp /> : <SignIn />
                        }
                    </Fragment>
            }

        </AuthContext.Provider>
    );
};

export default AuthPage;