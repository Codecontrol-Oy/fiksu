import React from 'react'
import PropTypes from 'prop-types';
import {
  RadialChart
} from 'react-vis';

class DonutChart extends React.Component {

  render() {
    return (
      <div>
        <h3 className="text-secondary">{this.props.title}</h3>
        <RadialChart
          width={320}
          height={320}
          data={this.props.data} />
      </div>
    )
  }
}

DonutChart.propTypes = {
  data: PropTypes.array.isRequired,
  title: PropTypes.string.isRequired,
}

export default DonutChart