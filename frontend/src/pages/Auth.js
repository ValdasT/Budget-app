import React, { useState, Fragment, useContext } from 'react';
import './Auth.css';

import Spinner from '../components/Spinner/Spinner';
import AuthContext from '../context/auth-context';
import ModalContext from '../context/modal-context';
import SignUp from '../components/SignUp/SignUp';
import SignIn from '../components/SignIn/SignIn';

import InfoModal from '../components/Modal/Modal';


const AuthPage = () => {
    let [isLogin, setisLogin] = useState(false);
    let [isLoading, setIsLoading] = useState(false);
    let [showModal, setShowModal] = useState(false);
    let [modalHeader, setModalHeader] = useState('');
    let [modalText, setModalText] = useState();

    const modalInfo = (show, header, text) => {
        setShowModal(show);
        setModalHeader(header);
        setModalText(text);
    };

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
                if (!res.ok) {
                    setIsLoading(false);
                    throw (res.statusText);
                }
                return res.json();
            })
            .then(res => {
                setIsLoading(false);
                if (res.data.login) {
                    login(
                        res.data.login.token,
                        res.data.login.userId,
                        res.data.login.tokenExpiration,

                    );
                } else {
                    modalInfo(true, 'Confirmation','Your account was created. Now You can sign in.');
                    switchModeHandler();
                }
            })
            .catch(err => {
                setIsLoading(false);
                modalInfo(true, 'Oops!',`Your email or password is incorect.`);
                throw err;
            });
    };



    return (
        <ModalContext.Provider value={{ modalHeader, modalText, showModal, setShowModal }}>
            <AuthContext.Provider value={{ submitHandler, switchModeHandler }}>
                <InfoModal />
                {
                    isLoading ? <Spinner /> :
                        <Fragment>
                            {
                                isLogin ? <SignUp /> : <SignIn />
                            }
                        </Fragment>
                }

            </AuthContext.Provider>
        </ModalContext.Provider>
    );
};

export default AuthPage;