import React from 'react';
import asiakunnossa from '../images/logo.png';
import '../App.scss';
import Person from '../Person';
import Block from "../components/atoms/block"
import Card from '../components/atoms/card';
import Lifestyle from '../images/lifestyle.svg'
import Home from '../images/smart_home.svg'
import Button from '../components/atoms/button';
import Grid from '../components/grid/grid';
import GridContainer from "../components/grid/container"
import Heading from "../components/atoms/heading"
import Paragraph from '../components/atoms/paragraph';
import Transition from '../components/transition/transition';
import InformationBlock from '../components/molecules/informationBlock';
import GridRow from '../components/grid/row';
import InformationBlockReverse from '../components/molecules/informationBlockReverse';
import * as constants from '../constants'
import { withRouter } from "react-router-dom"
class LandingPage extends React.PureComponent {
  componentWillMount() {
    if (localStorage.getItem('token')) {

    }
  }
  render() {
    return (
      <GridContainer direction="column">

        <GridContainer direction="row" justify="center">
          <GridContainer size={6} justify="center" align="center">
            <Grid sizeM={6} sizeL={6} sizeS={12}>
              <GridRow direction={"column"}>
                <Card>
                  <Transition transition={"slow-fade-from-top"}>
                    <GridContainer height={12} justify="around" align="center" direction="column">
                      <Heading variant={1}>Fiksu</Heading>
                      <Heading variant={3}>
                        Kestävän arjen ei tarvitse olla vaikeaa!
                </Heading>
                      <Paragraph>
                        Fiksu auttaa sinua säästämään luontoa sekä lompakkoasi.
                </Paragraph>

                      <Paragraph>Säästä rahaa. Säästä luontoa. Ole Fiksu.</Paragraph>
                      <Button onClick={() => this.props.history.push(`${constants.ROUTE_REGISTER}?register=true`)} basic rounded style={{ width: '15rem', marginTop: '2rem', height: '2rem', fontSize: '1.2rem', textTransform: 'capitalize' }}>Liity Nyt</Button>
                    </GridContainer>
                  </Transition>
                </Card>

              </GridRow>

            </Grid>



          </GridContainer>
          <Grid id="landing-page-image" size={6}>
            <img style={{ width: '100%' }} src={Home} />
          </Grid>
        </GridContainer>
        <GridContainer gutter={8} justify="around" align="center" direction="column">
          <GridRow justify="center" align="center">
            <Grid size={9}>
              <InformationBlock />
            </Grid>
          </GridRow>
          <GridRow justify="center" align="center">
            <Grid size={9}>
              <InformationBlockReverse />
            </Grid>
          </GridRow>
          <GridRow justify="center" align="center">
            <Grid size={9}>
              <InformationBlock />
            </Grid>
          </GridRow>
        </GridContainer>
      </GridContainer>
    );
  }
}
export default withRouter(LandingPage)