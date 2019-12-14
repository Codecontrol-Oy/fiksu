import React from 'react'
import Block from '../atoms/block'
import InputLabel from '../atoms/inputLabel'
import Button from '../atoms/button'
const FamilyMember = props => <Block className="family-member">
  <InputLabel color={"secondary"} variant={4} name={props.name}>
    {props.isOwner && props.id != localStorage.getItem("userId") && <Button onClick={() => props.delete()} style={{marginLeft: '5px'}} type="button" alert>
      <i class={'icofont-ui-delete'} style={{marginRight: '5px'}}></i> Poista
    </Button>}
    {props.isAdmin && props.memberUser && <Button onClick={() => props.delete()} style={{marginLeft: '5px'}} type="button" alert>
      <i class={'icofont-ui-delete'} style={{marginRight: '5px'}}></i> Poista
    </Button>}
    {!props.isOwner && props.id == localStorage.getItem('userId') && <Button onClick={() => props.delete()} style={{marginLeft: '5px'}} type="button" alert>
      <i class={'icofont-ui-delete'} style={{marginRight: '5px'}}></i> Poista
    </Button>}
    {props.isOwner && props.memberUser && <Button onClick={() => props.promote()} style={{marginLeft: '5px'}} type="button" basic>
      <i class={'icofont-curved-up'} style={{marginRight: '5px'}}></i> Nosta pääkäyttäjäksi
    </Button>}
    {props.isOwner && props.adminUser && <Button onClick={() => props.demote()} style={{marginLeft: '5px'}} type="button" basic>
      <i class={'icofont-curved-down'} style={{marginRight: '5px'}}></i> palauta käyttäjäksi
    </Button>}
  </InputLabel>
  
</Block>

export default FamilyMember