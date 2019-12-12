import React from 'react';
import { Route, Redirect } from "react-router-dom";
import MainWrapper from './containers/MainWrapper';

export default class PrivateRoute extends React.Component {

  render() {
    const { component: Component, ...rest } = this.props
    return (
      <Route
        {...rest}
        render={(props) => (
          localStorage.getItem('token')
            ? (
                <Component {...props} />
            )
            : <Redirect
              to={{
                pathname: '/login',
                state: { from: props.location }
              }} />
        )} />
    )
  }
}
