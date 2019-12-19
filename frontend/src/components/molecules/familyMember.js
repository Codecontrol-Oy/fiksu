import React from 'react'
import Block from '../atoms/block'
import InputLabel from '../atoms/inputLabel'
import Button from '../atoms/button'
import GridContainer from "../grid/container"
import Grid from "../grid/grid"
import Paragraph from "../atoms/paragraph"
import GridRow from "../grid/row"

const FamilyMember = props =>

  <Block className="member-wrapper">
    <GridContainer justify={"start"} align="center">
      <Grid sizeL={6} sizeS={4}>
        <GridRow direction={"column"} justify={"start"} align={"start"}>
          <Paragraph style={{ margin: '0' }} color={"secondary"}>Testi nimi</Paragraph>
          <Paragraph style={{ margin: '0 0 0 0' }} color={"secondary"} size={4}>Pääkäyttäjä</Paragraph>
        </GridRow>
      </Grid>
      <Grid sizeS={4} sizeL={2}>
        <Button style={{ display: 'flex', justifyContent: 'flex-end' }} outlined>Käyttäjätaso</Button>
      </Grid>
      <Grid sizeS={4} style={{ display: 'flex', justifyContent: 'flex-end' }} sizeL={3}>
        <Button outlined>Poista</Button>
      </Grid>
    </GridContainer>
  </Block>

export default FamilyMember