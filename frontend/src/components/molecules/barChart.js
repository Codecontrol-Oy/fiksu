import React from 'react'
import PropTypes from 'prop-types';

import {
  XYPlot,
  XAxis,
  YAxis,
  VerticalGridLines,
  HorizontalGridLines,
  VerticalRectSeries
} from 'react-vis';

class BarChart extends React.Component {

  createSeries = () => {
    let series = []
    let data = this.props.data
    data.map((serie) => {
      serie.data.forEach((v) => {
        v.x = new Date(v.x)
        v.x0 = new Date(v.x)
        v.x0.setDate(v.x.getDate() - 1)
      })
      series.push(<VerticalRectSeries data={serie.data} style={{stroke: '#fff'}} />)
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
          height={320}
          xDomain={[this.props.rangeA, this.props.rangeB]}
          xDistance={100}>
          <XAxis />
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