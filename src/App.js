import React from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend } from 'recharts';
import CustomTooltip from './components/CustomTooltip/CustomTooltip';
import results from './speedtest-results.json';
import './App.css';

// Rounds bytes to Mbit by multiplying it with 8 * 10^-6 with two decimal places
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

    data[i] = {
      date: date,
      download: download,
      upload: upload,
      ping: ping,
    }
  }

  return (
    <LineChart
      width={ 1000 }
      height={ 300 }
      data={ data }
      margin={{
        top: 20,
        right: 30,
        left: 20,
        bottom: 5,
      }}
    >
      <CartesianGrid strokeDasharray="3 3" />
      <XAxis dataKey="date.hour" />
      <YAxis />
      <Tooltip content={<CustomTooltip />} />
      <Legend />
      <Line 
        type="monotone" 
        dataKey="download" 
        stroke="#6afff3" 
        activeDot={{ r: 5 }} 
      />
      <Line 
        type="monotone" 
        dataKey="upload" 
        stroke="#bf71ff" 
        activeDot={{ r: 5 }} 
      />
    </LineChart>
  );
}
