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

  return <Block className="group-container">
    <GridContainer height={12} width={12} direction={"column"}>
      <Block className="family-header">
        <GridContainer height={12} align="center" justify="start">
          <Grid style={{ display: "flex", justifyContent: "flex-start" }} sizeL={2} sizeM={10} sizeS={8} sizeXL={2}>
            <Heading style={{ margin: '0rem' }} variant={4}>
              RYHMÄ {headerName.toUpperCase()}
            </Heading>
          </Grid>
          <Grid style={{ display: 'flex', justifyContent: 'flex-end' }} sizeL={1} sizeM={2} sizeS={4} sizeXL={1}>
            <Button onClick={() => setDisplayModal(true)} color={'alert'} outlined>Poista ryhmä</Button>
          </Grid>
        </GridContainer>
      </Block>
      <Block id={"modal"} />
      <GridRow justify={"center"}>
        <GroupMemberInvitation />
      </GridRow>
      <GridRow justify={"center"}>
        <GroupSearch />
      </GridRow>
      <GridRow justify={"center"}>
        <GroupInfo
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