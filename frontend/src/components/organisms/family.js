import React from 'react'
import Block from "../atoms/block"
import GridContainer from '../grid/container'
import GridRow from '../grid/row'
import FamilyInfo from "../molecules/familyInfo"
import FamilyMemberSearch from "../molecules/familyMemberSearch"
import FamilyMemberInvitation from "../molecules/familyMemberInvitation"

const Family = props => <Block className="family-container">

  <GridContainer height={12} width={12} direction={"column"}>
    <FamilyMemberInvitation />
    <GridRow justify={"center"}>
      <FamilyInfo />
    </GridRow>
    <GridRow justify={"center"}>
      <FamilyMemberSearch />
    </GridRow>
  </GridContainer>
</Block>

export default Family