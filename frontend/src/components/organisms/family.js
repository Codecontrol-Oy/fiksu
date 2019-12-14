import React from 'react'
import Block from "../atoms/block"
import GridContainer from '../grid/container'
import GridRow from '../grid/row'
import ProfileAchievements from "../molecules/profileAchievements"
import ProfileFamily from '../molecules/profileFamily'
import ProfileBenefits from '../molecules/profileBenefits'
import FamilyInfo from "../molecules/familyInfo"

const Family = props => <Block className="profile-container">
  <GridContainer height={12} width={12} direction={"column"}>
    <GridRow justify={"center"}>
      <FamilyInfo />
    </GridRow>
    <GridRow justify={"center"}>
    
    </GridRow>
    <GridRow justify={"center"}>
   
    </GridRow>
    <GridRow justify={"center"}>

    </GridRow>
  </GridContainer>
</Block>

export default Family