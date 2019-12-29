import React from 'react'
import Block from '../atoms/block'
import InputLabel from '../atoms/inputLabel'
import Button from '../atoms/button'
import GridContainer from "../grid/container"
import Grid from "../grid/grid"
import GridRow from "../grid/row"
import Paragraph from "../atoms/paragraph"

const FamilyMember = props =>

  <>
    <Block className="member-wrapper">
      <GridContainer style={{ padding: '0' }} justify={"start"} align="center">
        <Grid style={{ padding: '0' }} sizeXL={7} sizeL={4} sizeM={7} sizeS={4}>
          <GridRow direction={"column"} justify={"start"} align={"start"}>
            <Paragraph style={{ margin: '0' }} size={2} color={"secondary"}>{props.name}</Paragraph>
          </GridRow>
        </Grid>
        <Grid style={{ padding: '0' }} sizeS={4} sizeM={3} sizeL={4} sizeXL={3}>
          {props.isOwner && props.memberUser && <Button onClick={() => props.promote()} style={{ marginLeft: '5px' }} type="button" outlined>
            <i class={'icofont-curved-up'} style={{ marginRight: '5px' }}></i> Pääkäyttäjäksi
    </Button>}
          {props.isOwner && props.adminUser && <Button onClick={() => props.demote()} style={{ marginLeft: '5px' }} type="button" outlined>
            <i class={'icofont-curved-down'} style={{ marginRight: '5px' }}></i> Jäseneksi
    </Button>}
        </Grid>
        <Grid style={{ padding: '0' }} sizeS={4} sizeM={2} style={{ display: 'flex', justifyContent: 'flex-end' }} sizeL={4} sizeXL={2}>
          {props.isOwner && props.id != localStorage.getItem("userId") && <Button color={"alert"} onClick={() => props.delete()} style={{ marginLeft: '5px' }} type="button" outlined>
            <i class={'icofont-ui-delete'} style={{ marginRight: '5px' }}></i> Poista
    </Button>}
          {props.isAdmin && props.memberUser && <Button color={"alert"} onClick={() => props.delete()} style={{ marginLeft: '5px' }} type="button" outlined>
            <i class={'icofont-ui-delete'} style={{ marginRight: '5px' }}></i> Poista
    </Button>}
          {!props.isOwner && props.id == localStorage.getItem('userId') && <Button color={"alert"} onClick={() => props.delete()} style={{ marginLeft: '5px' }} type="button" outlined>
            <i class={'icofont-ui-delete'} style={{ marginRight: '5px' }}></i> Poistu ryhmästä
    </Button>}
        </Grid>
      </GridContainer>
    </Block>
  </>

export default FamilyMember