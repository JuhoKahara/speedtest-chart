import React from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend } from 'recharts';
import './App.css';
import results from './speedtest-results.json';

export default function App() {
  const BYTE_TO_MBIT = 125000;
  const data = [];
  for (let i = 0; i < results.length; i++) {
    data[i] = {
      "date": results[i].timestamp,
      "download": results[i].download.bandwidth / BYTE_TO_MBIT,
      "upload": results[i].upload.bandwidth / BYTE_TO_MBIT
    }
  }

  return (
    <LineChart
      width={ 500 }
      height={ 300 }
      data={ data }
      margin={{
        top:5,
        right:30,
        left: 20,
        bottom: 5,
      }}
    >
      <CartesianGrid strokeDasharray="3 3" />
      <XAxis dataKey="timestamp" />
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
