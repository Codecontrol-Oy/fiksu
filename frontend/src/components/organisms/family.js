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
      <Block id={"snackbars"} />
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