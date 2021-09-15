import React from 'react';

const CustomTooltip = ({ active, payload }) => {
    if (active && payload && payload.length) {
      console.log(payload);
        return (
            <div className="custom-tooltip">
              <p className="download">{`download: ${payload[0].payload.download}`}</p>
              <p className="upload">{`upload: ${payload[0].payload.upload}`}</p>
              <p className="ping">{`ping: ${payload[0].payload.ping}`}</p>
            </div>
        );
    }
    return null;
  }

export default CustomTooltip;
