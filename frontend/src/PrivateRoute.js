import React from 'react';
import { Route, Redirect } from "react-router-dom";
import MainWrapper from './containers/MainWrapper';
import * as constants from './constants'
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
                pathname: constants.ROUTE_REGISTER,
                state: { from: props.location }
              }} />
        )} />
    )
  }
}
