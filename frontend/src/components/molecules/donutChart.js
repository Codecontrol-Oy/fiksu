import React, { useState } from 'react'
import PropTypes from 'prop-types';
import {
  RadialChart,
  Hint
} from 'react-vis';

const DonutChart = props => {
  const [radialValue, setRadialValue] = useState(false)

  return (
    <div>
      <h3 className={(props.primary ? 'text' :'text-secondary')}>{props.title}</h3>
      <RadialChart
        width={320}
        padAngle={0.1}
        height={320}
        innerRadius={90}
        radius={120}
        onValueMouseOver={(v) => {setRadialValue(v)}}
        onSeriesMouseOut={v => setRadialValue(false)}
        getAngle={d => d.angle}
        data={props.data}>
        {radialValue !== false && <Hint value={radialValue}>
          <div style={{ background: 'rgb(39, 140, 180)', padding: '5px', display: 'block' }}>
            <h4>{radialValue.subLabel}</h4>
            <p>{radialValue.label}</p>
          </div>
        </Hint>}
        <div style={{
          position: 'absolute',
          top: '36%',
          marginleft: 'auto',
          marginright: 'auto',
          left: 0,
          right: 0,
          padding: '5px',
        }}>
          <span style={{ color: `${(props.primary ? props.primary : 'rgb(39, 140, 180')}`, fontSize: '72px' }}>{props.data.length > 1 ? props.data.reduce((a, b) => typeof(a) == 'object' ? a.angle + b.angle : a + b.angle).toFixed(1) : props.data[0].angle.toFixed(1)}</span>
        </div>
      </RadialChart>
    </div>
  )
}

export default DonutChart