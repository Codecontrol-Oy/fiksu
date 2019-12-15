import React from 'react';
import { Switch, Route, Redirect } from "react-router-dom";
import { HomePage, Login, Register, NotFound, LandingPage, LogOut, Challenges, Friends } from './containers';
import PrivateRoute from './PrivateRoute'

import Header from "./components/atoms/header"
import Main from './components/atoms/main';
import Footer from './components/atoms/footer';
import HeaderBar from "./components/molecules/header"
import "./icons/icofont.css"
import HeaderAccount from "./containers/AccountHeader"
import * as constants from './constants'
import ProfileController from "./components/controllers/profileController"
import ProfileContainer from "./containers/ProfileContainer"
import FamilyController from './components/controllers/familyController'
import ProfileElectricityController from "./components/controllers/profileElectricityController"
import EcoActionController from './components/controllers/ecoActionController'
import GroupController from './components/controllers/groupController'

const App = () => (
  <>
    <HeaderBar />
    <Main>
      <PrivateRoute path={constants.ROUTE_ACCOUNT} component={HeaderAccount} />
      <Switch>
        <Route exact path="/" component={LandingPage} />
        <Route exact path="/login" component={Login} />
        <Route exact path="/register" component={Register} />
        <Redirect exact from="/account" to="/account/profile" />
        <PrivateRoute exact path="/account/profile" component={ProfileContainer} />
        <PrivateRoute exact path="/home" component={HomePage} />
        <PrivateRoute exact path="/logout" component={LogOut} />
        <PrivateRoute exact path={constants.ROUTE_ACCOUNT_PROFILE} component={ProfileController} />
        <PrivateRoute exact path={constants.ROUTE_ACCOUNT_ELECTRICITY} component={ProfileElectricityController} />
        <PrivateRoute exact path={constants.ROUTE_ACCOUNT_FAMILY} component={FamilyController} />
        <PrivateRoute exact path={constants.ROUTE_ACCOUNT_GROUP} component={GroupController} />
        <PrivateRoute exact pah={constants.ROUTE_ACCOUNT_ECO} component={EcoActionController} />
        <PrivateRoute exact path={constants.ROUTE_ACCOUNT_GROUP} component={GroupController} />
        <Route component={NotFound} />
      </Switch>
    </Main>
    <Footer />
  </>
);

export default App;
