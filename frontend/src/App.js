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
import ProfileSettingsController from "./components/controllers/profileSettingsController"
import EcoActionController from './components/controllers/ecoActionController'
import StatisticsController from "./components/controllers/statisticsController"
import GroupController from './components/controllers/groupController'
import ResetPasswordController from "./components/controllers/resetPasswordController"
import NewPasswordController from "./components/controllers/newPasswordController"
import Block from "./components/atoms/block"
import VerifyProfileController from "./components/controllers/verifyProfileController"
import GdprPage from "./components/templates/gdprPage"

const App = () => (
  <>
    <HeaderBar />
    <Main>
      <PrivateRoute path={constants.ROUTE_ACCOUNT} component={HeaderAccount} />
      <Switch>
        <Route exact path="/" component={LandingPage} />
        <Route exact path="/register" component={Register} />
        <Route exact path={constants.ROUTE_RESET_PASSWORD} component={ResetPasswordController} />
        <Route exact path={constants.ROUTE_NEW_PASSWORD} component={NewPasswordController} />
        <Route exact path={constants.ROUTE_VERIFY_PROFILE} component={VerifyProfileController} />
        <Route exact path={constants.ROUTE_GDPR} component={GdprPage} />
        <Redirect exact from="/account" to="/account/profile" />
        <PrivateRoute exact path="/account/profile" component={ProfileContainer} />
        <PrivateRoute exact path="/logout" component={LogOut} />
        <PrivateRoute exact path={constants.ROUTE_ACCOUNT_PROFILE} component={ProfileController} />
        <PrivateRoute exact path={constants.ROUTE_ACCOUNT_SETTINGS} component={ProfileSettingsController} />
        <PrivateRoute exact path={constants.ROUTE_ACCOUNT_ELECTRICITY} component={ProfileElectricityController} />
        <PrivateRoute exact path={constants.ROUTE_ACCOUNT_FAMILY} component={FamilyController} />
        <PrivateRoute exact path={constants.ROUTE_ACCOUNT_GROUP} component={GroupController} />
        <PrivateRoute exact path={constants.ROUTE_ACCOUNT_SETTINGS} component={ProfileSettingsController} />
        <PrivateRoute exact path={constants.ROUTE_ACCOUNT_ECO} component={EcoActionController} />
        <PrivateRoute exact path={constants.ROUTE_ACCOUNT_STATISTICS} component={StatisticsController} />
        <Route component={NotFound} />
      </Switch>
    </Main>
    <Footer />
  </>
);

export default App;
