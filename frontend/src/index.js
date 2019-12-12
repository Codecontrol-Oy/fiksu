import React, { useState } from 'react';
import ReactDOM from 'react-dom';
import { Router, withRouter } from 'react-router-dom'
import { MuiThemeProvider, createMuiTheme } from '@material-ui/core/styles';
import FontFaceObserver from 'fontfaceobserver';
import { createBrowserHistory as createHistory } from 'history'
import { ApolloProvider, useMutation } from "@apollo/react-hooks"
import { InMemoryCache } from 'apollo-cache-inmemory';
import './index.css';
import * as serviceWorker from './serviceWorker';
import ApolloClient from 'apollo-boost';
import * as constants from './constants'
import App from './App';

import './theme/theme.scss';
import colors from './theme/colors.scss';
import { GET_REFRESH_TOKEN } from './graphqlMutations';

// Load the favicon
/* eslint-disable-next-line import/no-webpack-loader-syntax */
// import '!file-loader?name=[name].[ext]!./images/favicon.ico';

//import './theme/theme.scss';
//import 'theme/colors.scss';


// Create customFetch function for handling re-authorization
// This customFetch (or any fetch you pass to the link) gets uri and options as arguments. We'll use those when we actually execute a fetch.
const customFetch = (uri, options) => {

  if (localStorage.getItem("token")) {
    options.headers.Authorization = `Bearer ${localStorage.getItem("token")}`
  }

  let initialRequest = fetch(uri, options)

  return fetch(uri, options).then((response) => {
    return (response.json())
  }).then((json) => {

    if (json && json.errors && json.errors[0] && json.errors[0].extensions.code === 'TokenExpiredError') {

      return fetch("http://182.168.1.103:4002/refreshToken", {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ refreshToken: localStorage.getItem("refreshToken") })
      }).then((response) => {
        if (response.status == 401) {
          window.location(constants.ROUTE_HOMEPAGE)
        }
        return response.json()
      }).then((json) => {

        localStorage.setItem("token", json.token)

        localStorage.setItem("refreshToken", json.refreshToken)

        options.headers.Authorization = `Bearer ${json.token}`
        return fetch(uri, options)
      })
    }

    const result = {};
    result.ok = true;
    result.json = () =>
      new Promise(resolve => {
        resolve(json);
      });
    result.text = () =>
      new Promise(resolve => {
        resolve(JSON.stringify(json));
      });
    return result;

  })

}

const client = new ApolloClient({
  uri: "https://api.fiksu.codecontrol.fi",
  fetch: customFetch,
  cache: new InMemoryCache(),
});

const history = createHistory();
const MOUNT_NODE = document.getElementById('root');

const render = () => {
  ReactDOM.render(
    <ApolloProvider client={client}>
      <Router history={history}>
        <App />
      </Router>
    </ApolloProvider>,
    MOUNT_NODE
  );
};

render();

serviceWorker.unregister();
