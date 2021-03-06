import React, { Component, Fragment } from 'react';
import { BrowserRouter, Route, Redirect, Switch } from 'react-router-dom';
import ApolloClient from 'apollo-boost';
import { ApolloProvider } from 'react-apollo';

import AuthPage from './pages/Auth';
import UploadFile from './components/UploadToMng/UploadFile';
// import TestPage from './pages/Test';
import Expenses from './pages/Expenses';
import Settings from './pages/Settings';
import Statistics from './pages/Statistics';
import MainNavigation from './components/Navigation/MainNavigation';
import AuthContext from './context/auth-context';

import './App.css';

const client = new ApolloClient({
  uri: '/graphql'
});

class App extends Component {
  state = {
    token: null,
    userId: null
  };

  login = (token, userId) => {
    this.setState({ token: token, userId: userId });
  };

  logout = () => {
    fetch('/removeCookie', {
      method: 'GET',
      credentials: "same-origin",
      headers: {
        'Content-Type': 'application/json'
      }
    }).then(res => res.json())
      .then(data => {
        console.log(data.response.message);
      })
      .catch(err => {
        console.log(err);
      });
    this.setState({ token: null, userId: null });
  };

  render() {
    return (
      <ApolloProvider client={client}>
        <BrowserRouter>
          <Fragment>
            <AuthContext.Provider
              value={{
                token: this.state.token,
                userId: this.state.userId,
                login: this.login,
                logout: this.logout
              }}
            >
              <MainNavigation />
              <Switch>
                <Route path="/uploadfiles" component={UploadFile} />
                {/* <Route path="/test" component={TestPage} /> */}
                {!this.state.token && (<Route path="/auth" component={AuthPage} />)}
                {!this.state.token && <Redirect to="/auth" exact />}
                {this.state.token && (<Redirect from="/auth" to="/expenses" exact />)}
                {this.state.token && <Redirect from="/" to="/expenses" exact />}
                {this.state.token && (<Route path="/expenses" component={Expenses} />)}
                {this.state.token && (<Route path="/settings" component={Settings} />)}
                {this.state.token && (<Route path="/statistics" component={Statistics} />)}
              </Switch>
            </AuthContext.Provider>
          </Fragment>
        </BrowserRouter>
      </ApolloProvider>
    );
  }
}

export default App;
