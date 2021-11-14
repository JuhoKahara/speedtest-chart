import React from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import CustomTooltip from './components/CustomTooltip/CustomTooltip';
import results from './speedtest-results.json';
import './App.css';

// Converts bytes to Mbit by multiplying it with 8 * 10^-6 and rounds to two decimal places
// (Byte = 8 bits, 1 Mbit = 1 000 000 bits)
const roundedByteToMbit = bandwidth => {
  bandwidth *= 8 * 10**-6;
  return Number(bandwidth.toFixed(2));
}

// Calculates the average
const calculateAverage = (sum, total) => {
  return (sum / total).toFixed(2)
}

// Takes weekday in number format and returns it as a proper weekday
const getWeekday = day => {
  const weekdays = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];
  return weekdays[day];
}

const getMinutesWithLeadingZeroes = minutes => {
  return (minutes < 10 ? '0' : '') + minutes;
}

// Converts the timestamp to a dictionary
const convertTime = timestamp => {
  timestamp = new Date(timestamp);

  const date = {
    'year': timestamp.getFullYear(),
    'month': timestamp.getMonth() + 1,
    'day': timestamp.getDate(),
    'weekday': getWeekday(timestamp.getDay()),
    'hour': timestamp.getHours(),
    'minute': getMinutesWithLeadingZeroes(timestamp.getMinutes())
  };

  return date;
}

export default function App() {
  const data = [];
  let downloadSum = 0;
  let uploadSum = 0;
  let pingSum = 0;

  for (let i = 0; i < results.length; i++) {
    const download = roundedByteToMbit(results[i].download.bandwidth);
    const upload = roundedByteToMbit(results[i].upload.bandwidth);
    const timestamp = results[i].timestamp;
    const day = convertTime(timestamp);
    const ping = results[i].ping.latency;

    downloadSum += download;
    uploadSum += upload;
    pingSum += ping;

    data.push({
      date: day,
      download: download,
      averageDownload: calculateAverage(downloadSum, i+1),
      upload: upload,
      ping: ping.toFixed(2),
    });
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
          <Legend wrapperStyle={{ top: 0, left: 25 }} />
          <CartesianGrid strokeDasharray='3 3' stroke='darkgrey' />
          <XAxis 
            dataKey='date.hour' 
            stroke='darkgrey' 
            xAxisId={0}
          />
          <XAxis 
            dataKey='date.weekday' 
            stroke='darkgrey' 
            xAxisId={1} 
            allowDuplicatedCategory={false} 
          />
          <YAxis stroke='darkgrey' />
          <Tooltip content={<CustomTooltip />} />
          <Line 
            type='monotone' 
            dataKey='download' 
            stroke='turquoise' 
            dot={{ r: 0 }}
            activeDot={{ stroke: 'turquoise', fill: 'turquoise', r: 2 }} 
          />
          <Line 
            type='monotone' 
            dataKey='upload' 
            stroke='#bf71ff' 
            dot={{ r: 0 }}
            activeDot={{ stroke: '#bf71ff', fill: '#bf71ff', r: 2 }} 
          />
          <Line 
            type='monotone'
            dataKey='averageDownload'
            stroke='yellow'
            dot={{ r: 0 }}
            activeDot={{ r: 2 }} 
          />
        </LineChart>
      </ResponsiveContainer>
      <div>{`Average download speed: ${calculateAverage(downloadSum, results.length)} Mbps`}</div>
      <div>{`Average upload speed: ${calculateAverage(uploadSum, results.length)} Mbps`}</div>
      <div>{`Average ping: ${calculateAverage(pingSum, results.length)} ms`}</div>
    </div>
    
  );
}
