import React from 'react'
import Block from "../atoms/block"
import GridContainer from '../grid/container'
import GridRow from '../grid/row'
import GroupMemberInvitation from '../molecules/groupMemberInvitation'
import CreateGroup from '../molecules/createGroup'
import GroupInfo from '../molecules/groupInfo'
import GroupMemberSearch from '../molecules/groupMemberSearch'
import GroupSearch from '../molecules/groupSearch'
const Group = props => <Block className="group-container">
  <GridContainer height={12} width={12} direction={"column"}>
    <GridRow justify={"center"}>
      <GroupMemberInvitation />
    </GridRow>
    <GridRow justify={"center"}>
      <GroupSearch />
    </GridRow>
    <GridRow justify={"center"}>
      <GroupInfo />
    </GridRow>
    <GridRow justify={"center"}>
    <CreateGroup />
    </GridRow>
    <GridRow justify={"center"}>
      <GroupMemberSearch />
    </GridRow>
  </GridContainer>
</Block>

export default Group