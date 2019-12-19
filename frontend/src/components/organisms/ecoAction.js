import React from 'react'
import Block from "../atoms/block"
import GridContainer from '../grid/container'
import GridRow from '../grid/row'
import EcoInfo from '../molecules/ecoInfo'
import UserEcoActions from '../molecules/userEcoActions'
import SnackbarPortal from '../atoms/snackbarPortal'
const EcoAction = props => <Block className="eco-container">
  <Block id={"snackbars"} />
  <GridContainer height={12} width={12} direction={"column"}>
    <GridRow justify={"center"}>
      <EcoInfo />
    </GridRow>
    <GridRow justify={"center"}>
      <UserEcoActions />
    </GridRow>
    <GridRow justify={"center"}>

    </GridRow>
  </GridContainer>
</Block>

export default EcoAction