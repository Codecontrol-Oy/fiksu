import React, { useState } from 'react'
import Block from "../atoms/block"
import GridContainer from '../grid/container'
import GridRow from '../grid/row'
import FamilyInfo from "../molecules/familyInfo"
import FamilyMemberSearch from "../molecules/familyMemberSearch"
import FamilyMemberInvitation from "../molecules/familyMemberInvitation"
import Grid from "../grid/grid"
import Heading from "../atoms/heading"
import Button from "../atoms/button"

const Family = props => {

  const [displayModal, setDisplayModal] = useState(false)
  const [familyName, setFamilyName] = useState("")
  const [owner, setOwner] = useState(false)
  return <Block className="family-container">
    <GridContainer height={12} width={12} direction={"column"}>
      {owner &&
        <Block className="family-header">
          <GridContainer height={12} align="center" justify="start">
            <Grid style={{ display: "flex", justifyContent: "flex-start" }} sizeL={1} sizeM={10} sizeS={8} sizeXL={1}>
              <Heading style={{ margin: '0rem' }} variant={4}>
                TALOUS {familyName.toUpperCase()}
              </Heading>
            </Grid>
            <Grid style={{ display: 'flex', justifyContent: 'flex-end' }} sizeL={2} sizeM={2} sizeS={4} sizeXL={1}>
              <Button onClick={() => setDisplayModal(true)} outlined color={'alert'}>Poista talous</Button>
            </Grid>
          </GridContainer>
        </Block>
      }

      <Block id={"modal"} />
      <FamilyMemberInvitation />
      <GridRow style={{ padding: '0' }} justify={"center"}>
        <FamilyInfo setOwner={setOwner} setFamilyName={setFamilyName} displayModal={displayModal} setDisplayModal={setDisplayModal} />
      </GridRow>
      <GridRow justify={"center"}>
        <FamilyMemberSearch />
      </GridRow>
    </GridContainer>
  </Block>
}




export default Family