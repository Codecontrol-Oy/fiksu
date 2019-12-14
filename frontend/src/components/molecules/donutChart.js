import React, {useState} from 'react'
import PropTypes from 'prop-types';
import {
  RadialChart,
  Hint
} from 'react-vis';

const DonutChart = props => {
    const [radialValue, setRadialValue] = useState(false)

    return (
      <div>
        <h3 className="text-secondary">{props.title}</h3>
        <RadialChart
          width={320}
          padAngle={0.1}
          height={320}
          innerRadius={100}
          radius={140}
          onValueMouseOver={v => setRadialValue(v)}
          onSeriesMouseOut={v => setRadialValue(false)}
          getAngle={d => d.angle}
          data={props.data}>
            {radialValue !== false && <Hint value={radialValue}>
              <div style={{background: 'rgb(39, 140, 180)', padding: '5px', display: 'block'}}>
                <h4>{radialValue.subLabel}</h4>
                <p>{radialValue.y}</p>
            </div>
              </Hint>}
              <div style={{
              position: 'absolute',
              top: '36%',
              left: '43%',
              padding: '5px',
            }}>
            <span style={{color: 'rgb(39, 140, 180)', fontSize: '72px'}}>{props.data.reduce(function (a, b) {return a.angle + b.angle})}</span>
            </div>
          </RadialChart>
      </div>
)}

export default DonutChart