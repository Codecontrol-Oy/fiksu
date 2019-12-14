import React from 'react'
import PropTypes from 'prop-types';

import {
  XYPlot,
  XAxis,
  YAxis,
  VerticalGridLines,
  HorizontalGridLines,
  VerticalBarSeries
} from 'react-vis';

class BarChart extends React.Component {

  createSeries = () => {
    let series = []
    this.props.data.map((serie) => {
      series.push(<VerticalBarSeries data={serie.data} />)
    })
    return series
  }

  render() {
    const series = this.createSeries()
    return (
      <div>
        <h3 style={{textAlign: 'center'}}>{this.props.title}</h3>
        <XYPlot
          xType="ordinal"
          width={320}
          height={320}
          xDistance={100}>
          <XAxis tickLabelAngle={-45} />
          <HorizontalGridLines />
          <VerticalGridLines />
          <YAxis />
          {series}
          
        </XYPlot>
      </div>
    )
  }
}

BarChart.propTypes = {
  data: PropTypes.array.isRequired,
  title: PropTypes.string.isRequired,
}

export default BarChart