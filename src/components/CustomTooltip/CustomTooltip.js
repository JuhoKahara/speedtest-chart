import React from 'react';
import './CustomTooltip.css';

const CustomTooltip = ({ active, payload }) => {
    if (active && payload && payload.length) {
        payload = payload[0].payload;
        const date = payload.date;
        return (
            <div className="tooltip">
              <p className="tooltip-item download">{`download: ${payload.download}`}</p>
              <p className="tooltip-item upload">{`upload: ${payload.upload}`}</p>
              <p className="tooltip-item ping">{`ping: ${payload.ping}`}</p>
              <p className="tooltip-item date">{`date: ${date.day}.${date.month}.${date.year}`}</p>
              <p className="tooltip-item time">{`time: ${date.hour}:${date.minute}`}</p>
            </div>
        );
    }
    return <div className="download">asdf</div>;
  }

export default CustomTooltip;
