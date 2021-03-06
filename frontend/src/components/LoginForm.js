import React from 'react';
import { TextField, Button } from '@material-ui/core';
import { Grid } from '@material-ui/core';
import '../App.scss';

export default class LoginForm extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      nickname: '',
      password: '',
      errors: {
        nickname: 'first',
        password: 'first',
      }
    }
  };

  handleChange = input => event => {
    this.validate(input, event.target.value)
    this.setState({ [input]: event.target.value });
  }

  onSubmit = (nickname, password) => event => {
    const { onSubmit } = this.props;
    event.preventDefault();
    const hasErrors = Object.keys(this.state.errors).map(p => this.state.errors[p]).includes(true);
    const hasFirst = Object.keys(this.state.errors).map(p => this.state.errors[p]).includes('first');
    if (hasFirst) {
      const errors = this.state.errors;
      Object.keys(this.state.errors).forEach(e => {
        if (this.state.errors[e] === 'first') {
          errors[e] = true;
        }
      });
      this.setState({ errors })
    }
    if (!hasErrors && !hasFirst) onSubmit(nickname, password);
  }

  validate = (input, value) => {
    const { errors } = this.state;
    if (!value) {
      this.setState({ errors: { [input]: true } })
    }

    else {
      this.setState({ errors: { ...errors, [input]: false } })
    }
  }


  render() {
    const { nickname, password, errors } = this.state;

    return (
      <form
        onSubmit={this.onSubmit(nickname, password)} noValidate autoComplete="false">
        <Grid
          container
          spacing={16}
          direction="column"
          alignItems="center"
          justify="center"
          style={{ minHeight: '100vh' }}
        >
          <Grid container direction="row">
            <Grid item xs={12}>
              <TextField
                error={errors.nickname === true}
                id="nickname"
                label="Käyttäjätunnus"
                value={this.state.nickname}
                onChange={this.handleChange('nickname')}
                fullWidth
                margin="normal"
                required
              />
            </Grid>
          </Grid>
          <Grid container spacing={16} direction="row">
            <Grid item xs={12}>
              <TextField
                error={errors.password === true}
                id="password"
                label="Salasana"
                value={this.state.password}
                onChange={this.handleChange('password')}
                margin="normal"
                type="password"
                required
              />
            </Grid>
          </Grid>
          <Button fullWidth type="submit" style={{ marginTop: '16px' }} variant="contained" color="primary">
            Kirjaudu
          </Button>
          {this.props.wrongLogin && <p>Väärä käyttäjänimi tai salasana</p>}
        </Grid>
      </form>
    );
  }
}