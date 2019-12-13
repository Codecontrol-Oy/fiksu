import React from 'react'
import PropTypes from 'prop-types';

import {
  XYPlot,
  XAxis,
  YAxis,
  LineMarkSeries
} from 'react-vis';

class LineChart extends React.Component {

  createSeries = () => {
    let series = []
    this.props.data.map((serie) => {
      series.push(<LineMarkSeries style={{strokeWidth: 3}} curve={'curveMonotoneX'} data={serie.data} />)
    })
    return series
  }

  render() {
    const series = this.createSeries()
    return (
      <div>
        <h3 style={{textAlign: 'center'}}>{this.props.title}</h3>
        <XYPlot
          xType="time"
          width={320}
          height={320}>
          <XAxis />
          <YAxis />
          {series}
        </XYPlot>
      </div>
    )
  }
}

LineChart.propTypes = {
  data: PropTypes.array.isRequired,
  title: PropTypes.string.isRequired,
}

export default LineChart