import React from 'react';
import { Button } from '@material-ui/core';
import { Grid } from '@material-ui/core';
import '../App.scss';

import DeleteIcon from '@material-ui/icons/Delete';

export default class RemoveFriendForm extends React.Component {
  constructor(props) {
    super(props);
  };

  onSubmit = () => event => {
    const { onSubmit } = this.props;
    event.preventDefault();
    onSubmit();
  }

  render() {
    return (
      <form onSubmit={this.onSubmit()} noValidate autoComplete="false">
        <Grid
          container
          spacing={0}
          direction="column"
          alignItems="center"
          justify="center">

          <Button
            type="submit"
            variant="contained"
            color="secondary"
            startIcon={<DeleteIcon />}>Delete</Button>
        </Grid>
      </form>
    );
  }
}