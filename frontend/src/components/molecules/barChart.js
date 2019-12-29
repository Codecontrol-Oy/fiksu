import React from 'react'
import PropTypes from 'prop-types';

import {
  XYPlot,
  XAxis,
  YAxis,
  VerticalGridLines,
  HorizontalGridLines,
  VerticalRectSeries,
  FlexibleXYPlot,
  FlexibleWidthXYPlot
} from 'react-vis';

const BarChart = props => {

  const createSeries = () => {
    let series = []
    let data = props.data
    data.map((serie) => {
      serie.data.forEach((v) => {
        v.x = new Date(v.x)
        v.x0 = new Date(v.x)
        v.x0.setDate(v.x.getDate() - 1)
      })
      series.push(<VerticalRectSeries data={serie.data} style={{ stroke: '#fff' }} />)
    })
    return series
  }

  const series = createSeries()
  return (
    <div>
      <h3 className={(props.primary ? 'text' : 'text-secondary')}>{props.title}</h3>
      <FlexibleWidthXYPlot height={320}
        xType="time"
        xDomain={[props.rangeA, props.rangeB]}
        xDistance={100}>
        <XAxis />
        <HorizontalGridLines />
        <VerticalGridLines />
        <YAxis />
        {series}

      </FlexibleWidthXYPlot>
    </div>
  )
}

BarChart.propTypes = {
  data: PropTypes.array.isRequired,
  title: PropTypes.string.isRequired,
}

export default BarChart