import React from 'react'
import {
  XYPlot,
  XAxis,
  YAxis,
  LineSeries,
  HorizontalGridLines,
} from 'react-vis';
import { Grid } from '@material-ui/core';
import gql from 'graphql-tag';
import { Query } from 'react-apollo';

export default class TotalConsumptionChart extends React.Component {


  factorMeasurements = (inbound) => {
    let data = []
    let sorted = inbound.sort((a, b) => new Date(a.date) - new Date(b.date));
    if (sorted && sorted.length > 1) {
      for (var i = 0; i < sorted.length; i++) {
        if (i > 0) {
          let value = sorted[i].value - sorted[i - 1].value
          data.push({ x: i, y: value })
        }
      }
      return data
    } else {
      return data
    }
  }

  render() {

    const GET_ALL_MEASUREMENTS = gql`
    query AllConsumptions($id: String!, $from: Date!, $to: Date!) {
      measurements(userId: $id, from: $from, to: $to) {
        value,
        date
      }
    }
    `
    return (
      <Query query={GET_ALL_MEASUREMENTS} variables={{ id: localStorage.getItem('userId'), from: new Date("2019-05-01").toDateString(), to: new Date().toDateString() }}>
        {({ loading, error, data }) => {
          if (loading) return 'Loading...';
          if (error) return `Error! ${error.message}`;
          console.log(data)
          return (
            <>
              <XYPlot
                width={320}
                height={320}>
                <HorizontalGridLines />
                <LineSeries
                  data={this.factorMeasurements(data.measurements)} />
                <XAxis />
                <YAxis />
              </XYPlot>
            </>
          )
        }}
      </Query>
    )
  }
}