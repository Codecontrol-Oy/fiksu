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

class StackedBarChart extends React.Component {

  createSeries = () => {
    let series = []
    let data = this.props.data
    data.map((serie) => {
      series.push(<VerticalBarSeries data={serie} style={{stroke: '#fff'}} />)
    })
    return series
  }

  render() {
    const series = this.createSeries()
    return (
      <div>
        <h3 className={(this.props.primary ? 'text' :'text-secondary')}>{this.props.title}</h3>
        <XYPlot
          xType="ordinal"
          width={320}
          stackBy="y"
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

StackedBarChart.propTypes = {
  data: PropTypes.array.isRequired,
  title: PropTypes.string.isRequired,
}

export default StackedBarChart