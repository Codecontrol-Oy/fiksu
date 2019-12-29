import React, { useState, useEffect } from 'react'
import Block from "../atoms/block"
import GridContainer from '../grid/container'
import GridRow from '../grid/row'
import GroupMemberInvitation from '../molecules/groupMemberInvitation'
import CreateGroup from '../molecules/createGroup'
import GroupInfo from '../molecules/groupInfo'
import GroupMemberSearch from '../molecules/groupMemberSearch'
import GroupSearch from '../molecules/groupSearch'
import Grid from "../grid/grid"
import Button from "../atoms/button"
import Heading from "../atoms/heading"

const Group = props => {
  const [displayModal, setDisplayModal] = useState(false)
  const [headerName, setHeaderName] = useState("")
  const [owner, setOwner] = useState(false)

  return <Block className="group-container">
    <GridContainer height={12} width={12} direction={"column"}>
      <Block id={"snackbars"} />
      <Block id={"modal"} />
      <GridRow justify={"center"}>
        <GroupMemberInvitation />
      </GridRow>
      <GridRow justify={"center"}>
        <GroupSearch />
      </GridRow>
      <GridRow justify={"center"}>
        <GroupInfo
          setOwner={setOwner}
          displayModal={displayModal}
          setDisplayModal={setDisplayModal}
          setHeaderName={setHeaderName}
        />
      </GridRow>
      <GridRow justify={"center"}>
        <CreateGroup />
      </GridRow>
      <GridRow justify={"center"}>
        <GroupMemberSearch />
      </GridRow>
    </GridContainer>
  </Block>
}


export default Group