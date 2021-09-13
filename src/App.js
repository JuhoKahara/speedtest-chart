import React from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend } from 'recharts';
import './App.css';
import results from './speedtest-results.json';

// Rounds bytes to Mbit by multiplying it with 8 * 10^-6 with two decimal places
// (Byte = 8 bits, 1 Mbit = 1 000 000 bits)
const roundedByteToMbit = bandwidth => {
  bandwidth *= 8 * 10**-6;
  return bandwidth.toFixed(2)
}

// Converts the timestamp to a dictionary and calculates the timezone offset
// Offset is multiplied by 60 000 to convert it from minutes to milliseconds
const convertTime = timestamp => {
  const ms = Date.parse(timestamp)
  const offset = new Date().getTimezoneOffset();
  timestamp = new Date(ms - (offset * 60000));

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

    console.log(date.hour);

    data[i] = {
      "date": date.hour,
      "download": download,
      "upload": upload,
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
      <XAxis dataKey="date" />
      <YAxis />
      <Tooltip />
      <Legend />
      <Line 
        type="monotone" 
        dataKey="download" 
        stroke="#82ca9d" 
        activeDot={{ r: 8}} 
      />
      <Line 
        type="monotone" 
        dataKey="upload" 
        stroke="#8884d8" 
      />
    </LineChart>
  );
}
