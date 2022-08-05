import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import CustomTooltip from './components/CustomTooltip/CustomTooltip';
import results from './speedtest-results';
import './App.css';

const WEEK = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

// Converts bytes to Mbit by multiplying it with 8 * 10^-6 and rounds to two decimal places
// (Byte = 8 bits, 1 Mbit = 1 000 000 bits)
const roundedByteToMbit = bandwidth => {
  bandwidth *= 8 * 10**-6;
  return Number(bandwidth.toFixed(2));
}

// Calculates the average
const calculateAverage = (sum, divider) => {
  return (sum / divider).toFixed(2)
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
    'weekday': WEEK[timestamp.getDay()],
    'hour': timestamp.getHours(),
    'minute': getMinutesWithLeadingZeroes(timestamp.getMinutes())
  };

  return date;
}

const weeklyView = () => {
  const data = [];
  const pastWeek = new Date();
  let averageDownload = 0;
  let averageUpload = 0;
  let averagePing = 0;

  pastWeek.setDate(pastWeek.getDate()-7);

  let i = 0;
  while (i < results.length && new Date(results[results.length - 1 - i].timestamp) > pastWeek) {
    i++;
  }

  results.splice(0, results.length - i)
  let weekday = WEEK.indexOf(convertTime(results[0].timestamp).weekday);
  let dailyResultCounter = 0;

  for (let i = 0; i < results.length; i++) {
    const download = roundedByteToMbit(results[i].download.bandwidth);
    const upload = roundedByteToMbit(results[i].upload.bandwidth);
    const timestamp = results[i].timestamp;
    const date = convertTime(timestamp);
    const ping = results[i].ping.latency;

    if (weekday !== WEEK.indexOf(date.weekday)) {
      weekday === 6 ? weekday = 0 : weekday++;
      averageDownload = download;
      averageUpload = upload;
      averagePing = ping;
      dailyResultCounter = 1;
    } else {
      averageDownload += download;
      averageUpload += upload;
      averagePing += ping;
      dailyResultCounter++;
    }

    data.push({
      'date': date,
      'download': download,
      'upload': upload,
      'ping': ping.toFixed(2),
      'daily average download': calculateAverage(averageDownload, dailyResultCounter),
      'daily average upload': calculateAverage(averageUpload, dailyResultCounter),
      'daily average ping': calculateAverage(averagePing, dailyResultCounter)
    });
  }

  return data;
}

export default function App() {
  const data = weeklyView();

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
            dataKey='daily average download'
            stroke='yellow'
            dot={{ r: 0 }}
            activeDot={{ r: 2 }} 
          />
        </LineChart>
      </ResponsiveContainer>
    </div>
    
  );
}
