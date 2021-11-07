import React from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import CustomTooltip from './components/CustomTooltip/CustomTooltip';
import results from './speedtest-results.json';
import './App.css';

// Converts bytes to Mbit by multiplying it with 8 * 10^-6 and rounds to two decimal places
// (Byte = 8 bits, 1 Mbit = 1 000 000 bits)
const roundedByteToMbit = bandwidth => {
  bandwidth *= 8 * 10**-6;
  return bandwidth.toFixed(2)
}

// Converts the timestamp to a dictionary
const convertTime = timestamp => {
  timestamp = new Date(timestamp)

  const date = {
    'year': timestamp.getFullYear(),
    'month': timestamp.getMonth(),
    'day': timestamp.getDate(),
    'weekday': timestamp.getDay(),
    'hour': timestamp.getHours(),
    'minute': timestamp.getMinutes()
  }

  return date;
}

export default function App() {
  const data = [];

  for (let i = 0; i < results.length; i++) {
    const download = roundedByteToMbit(results[i].download.bandwidth);
    const upload = roundedByteToMbit(results[i].upload.bandwidth);
    const timestamp = results[i].timestamp;
    const date = convertTime(timestamp);
    const ping = results[i].ping.latency.toFixed(2);

    if (date.day === 12) {
      console.log(typeof(download));
      data.push({
        date: date,
        download: Number(download),
        upload: Number(upload),
        ping: ping,
      })
    } 
  }

  return (
    <div className='chart-container'>
      <ResponsiveContainer>
        <LineChart
          data={ data }
          margin={{
            top: 20,
            right: 30,
            left: 20,
            bottom: 5,
          }}
        >
          <Legend />
          <CartesianGrid strokeDasharray='3 3' stroke='darkgrey' />
          <XAxis dataKey='date.hour' stroke='darkgrey' />
          <YAxis stroke='darkgrey' />
          <Tooltip content={<CustomTooltip />} />
          <Line 
            type='monotone' 
            dataKey='download' 
            stroke='#6afff3' 
            dot={{ stroke: '#6afff3', fill: '#6afff3' }}
            activeDot={{ r: 4 }} 
          />
          <Line 
            type='monotone' 
            dataKey='upload' 
            stroke='#bf71ff' 
            dot={{ stroke: '#bf71ff', fill: '#bf71ff' }}
            activeDot={{ r: 4 }} 
          />
        </LineChart>
      </ResponsiveContainer>
    </div>
    
  );
}
