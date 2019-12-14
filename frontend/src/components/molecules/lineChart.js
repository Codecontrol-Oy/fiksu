import React from 'react'
import PropTypes from 'prop-types';
import {
  XYPlot,
  XAxis,
  YAxis,
  Hint,
  LineMarkSeries
} from 'react-vis';

class LineChart extends React.Component {

  createSeries = () => {
    let series = []
    let index = 0
    if(this.props.data && this.props.data.length > 0) {
      this.props.data.map((serie) => {
        serie.data.forEach((v) => {
          v.x = new Date(v.x)
        })
        series.push(<LineMarkSeries key={(`lineChart-${index}`)} style={{strokeWidth: 3}} curve={'curveMonotoneX'} data={serie.data} />)
        index++
      })
    }
    return series
  }

  createRange = () => {
    let range = []
    if(this.props.data && this.props.data.length > 0) { 
      this.props.data.map((rdata) => {
        rdata.data.map((r) => {
          range.push(r.y)
        })
      })
    }
    return range
  }

  render() {
    const series = this.createSeries()
    const YRange = this.createRange()
    return (
      <div>
        <h3 style={{textAlign: 'center'}} className="text-secondary">{this.props.title}</h3>
        <XYPlot
          xType="time"
          width={320}
          yDomain={[Math.min(...YRange) - 100, Math.max(...YRange) + 100]}
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