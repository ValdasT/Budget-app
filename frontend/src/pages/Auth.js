import React, { useState, Fragment, useContext } from 'react';
import './Auth.css';
import AuthContext from '../context/auth-context';
import Spinner from '../components/Spinner/Spinner';
// import { Query } from 'react-apollo';
// import gql from 'graphql-tag';

const AuthPage = () => {
    let [email, setEmail] = useState('');
    let [password, setPassword] = useState('');
    let [name, setName] = useState('');
    let [surname, setSurname] = useState('');
    let [isLogin, setisLogin] = useState(false);
    let [isLoading, setIsLoading] = useState(false);

    const { login} = useContext(AuthContext);

    
 

    const switchModeHandler = () => {
        return setisLogin(!isLogin);
    };

    const submitHandler = (event) => {
        setIsLoading(true);
        event.preventDefault();
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
                email: email,
                password: password
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
                    email: email,
                    password: password,
                    name: name,
                    surname: surname
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
                if (res.status !== 200 && res.status !== 201) {
                    setIsLoading(false);
                    throw new Error('Failed!');
                }
                return res.json();
            })
            .then(res => {
                setIsLoading(false);
                console.log(res.data);
                if (res.data.login) {
                    login(
                        res.data.login.token,
                        res.data.login.userId,
                        res.data.login.tokenExpiration,

                    );
                }
            })
            .catch(err => {
                setIsLoading(false);
                console.log(err);
            });
    };

    return (
        <Fragment>
            {
                isLoading ? <Spinner /> :
            
                    <form className="auth-form" id="formContent" onSubmit={submitHandler}>
                        <div className="p-2">
                            {
                                isLogin ? <h4>Create account</h4> : <h4>Sign in</h4>
                            }
                        </div>
                        <div className="form-group row">
                            <label htmlFor="email" className="col-sm-3 col-form-label">Email:</label>
                            <div className="col-sm-9">
                                <input type="text" placeholder="Email" className="form-control" id="email"
                                    value={email} onChange={e => setEmail(e.target.value)} required
                                />
                            </div>
                        </div>
                        <Fragment>
                            {isLogin ? <Fragment>
                                <div className="form-group row">
                                    <label htmlFor="name" className="col-sm-3 col-form-label">Name:</label>
                                    <div className="col-sm-9">
                                        <input type="text" placeholder="Name" className="form-control" id="name"
                                            value={name} onChange={e => setName(e.target.value)} required
                                        />
                                    </div>
                                </div>
                                <div className="form-group row">
                                    <label htmlFor="surname" className="col-sm-3 col-form-label">Surname:</label>
                                    <div className="col-sm-9">
                                        <input type="text" placeholder="Surname" className="form-control" id="surname"
                                            value={surname} onChange={e => setSurname(e.target.value)} required
                                        />
                                    </div>
                                </div>
                            </Fragment>
                                : null
                            }
                        </Fragment>
                        <div className="form-group row">
                            <label htmlFor="password" className="col-sm-3 col-form-label">Password:</label>
                            <div className="col-sm-9">
                                <input type="password" placeholder="Password" className="form-control" id="password"
                                    value={password} onChange={e => setPassword(e.target.value)} required
                                />
                            </div>
                        </div>
                        <div className="form-actions">
                            <button className="btn btn-primary mr-2" type="submit">Submit</button>
                            <button className="btn btn-primary" type="button" onClick={switchModeHandler}>
                                {!isLogin ? 'Sign up' : 'Sign in'}
                            </button>
                        </div>
                    </form>
            }
        </Fragment>
    );
};

export default AuthPage;

// class AuthPage extends Component {
//   state = {
//     isLogin: true
//   };

//   static contextType = AuthContext;

//   constructor(props) {
//     super(props);
//     this.emailEl = React.createRef();
//     this.passwordEl = React.createRef();
//   }

//   switchModeHandler = () => {
//     this.setState(prevState => {
//       return { isLogin: !prevState.isLogin };
//     });
//   };

//   submitHandler = event => {
//     event.preventDefault();
//     const email = this.emailEl.current.value;
//     const password = this.passwordEl.current.value;

//     if (email.trim().length === 0 || password.trim().length === 0) {
//       return;
//     }

//     let requestBody = {
//       query: `
//         query Login($email: String!, $password: String!) {
//           login(email: $email, password: $password) {
//             userId
//             token
//             tokenExpiration
//           }
//         }
//       `,
//       variables: {
//         email: email,
//         password: password
//       }
//     };

//     if (!this.state.isLogin) {
//       requestBody = {
//         query: `
//           mutation CreateUser($email: String!, $password: String!) {
//             createUser(userInput: {email: $email, password: $password}) {
//               _id
//               email
//             }
//           }
//         `,
//         variables: {
//           email: email,
//           password: password
//         }
//       };
//     }

//     fetch('http://localhost:8000/graphql', {
//       method: 'POST',
//       body: JSON.stringify(requestBody),
//       headers: {
//         'Content-Type': 'application/json'
//       }
//     })
//       .then(res => {
//         if (res.status !== 200 && res.status !== 201) {
//           throw new Error('Failed!');
//         }
//         return res.json();
//       })
//       .then(resData => {
//         if (resData.data.login.token) {
//           this.context.login(
//             resData.data.login.token,
//             resData.data.login.userId,
//             resData.data.login.tokenExpiration
//           );
//         }
//       })
//       .catch(err => {
//         console.log(err);
//       });
//   };

//   render() {
//     return (
//       <form className="auth-form" onSubmit={this.submitHandler}>
//         <div className="form-control">
//           <label htmlFor="email">E-Mail</label>
//           <input type="email" id="email" ref={this.emailEl} />
//         </div>
//         <div className="form-control">
//           <label htmlFor="password">Password</label>
//           <input type="password" id="password" ref={this.passwordEl} />
//         </div>
//         <div className="form-actions">
//           <button type="submit">Submit</button>
//           <button type="button" onClick={this.switchModeHandler}>
//             Switch to {this.state.isLogin ? 'Signup' : 'Login'}
//           </button>
//         </div>
//       </form>
//     );
//   }
// }








        //=========================================================
        //     const loginQuery = gql`
//     query login($email: String!, $password: String!) {
//       login(email: $email, password: $password) {
//         userId
//         token
//         tokenExpiration
//       }
//     }
//   `;


    //     let requestBody = {
    //         query: `
    //     query Login($email: String!, $password: String!) {
    //       login(email: $email, password: $password) {
    //         userId
    //         token
    //         tokenExpiration
    //       }
    //     }
    //   `,
    //         variables: {
    //             email: email,
    //             password: password
    //         }
    //     };
    //     fetch('/graphql', {
    //         method: 'POST',
    //         body: JSON.stringify(requestBody),
    //         headers: {
    //             'Content-Type': 'application/json'
    //         }
    //     })
    //         .then(res => {
    //             if (res.status !== 200 && res.status !== 201) {
    //                 throw new Error('Failed!');
    //             }
    //             return res.json();
    //         })
    //         .then(resData => {
    //             console.log(resData.data.login.token);
    //             // if (resData.data.login.token) {
    //             //   this.context.login(
    //             //     resData.data.login.token,
    //             //     resData.data.login.userId,
    //             //     resData.data.login.tokenExpiration
    //             //   );
    //             // }
    //         })
    //         .catch(err => {
    //             console.log(err);
    //         });
    // };

            // setshow(show = (
            //     <Query query={loginQuery} variables={{ email: email, password: password }}>
            //         {({ loading, error, data }) => {
            //             if (loading) return "Loading...";
            //             if (error) return `Error! ${error.message}`;
            //             if (data) {
            //                 { console.log(data.login) }
            //                 return (
            //                     <Fragment>
            //                         {
            //                             // <div>SUCssses</div>
            //                             AuthContext._currentValue.login(                               
            //                                 data.login.token,
            //                                 data.login.userId,
            //                                 data.login.tokenExpiration,

            //                             )
                                        
            //                             // data.login.map(e => (
            //                             //     <div key={e._id}>{e._id}</div>
            //                             // ))
            //                         }
                                    
            //                     </Fragment>
            //                 );
            //             }
            //         }
            //         }
            //     </Query>
            //     ));
        
            //===============================================
