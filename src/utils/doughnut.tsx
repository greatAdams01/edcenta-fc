import React from 'react';

const Doughnut = () => {
  const radius = 40; 
  const dashArray = radius * Math.PI * 2
  const dashOffset = dashArray - (dashArray * 40 ) /100


  return (
    <div>
      <svg width={100} height={100} viewBox="0 0 100 100">
        <circle cx={50} cy={50} strokeWidth={10} r={radius} fill="transparent" stroke="#ddd" />
        <circle cx={50} cy={50} strokeWidth={10} r={radius} fill="transparent" stroke="#0075BC" style={{ strokeDasharray : dashArray, strokeDashoffset : dashOffset}} transform={`rotate(-90 50 50)`} strokeLinecap='round' strokeLinejoin='round'/>
        <text x="50%" y="50%" dy="0.3em" textAnchor='middle' className='font-bold '>{radius}%</text>
      </svg>
    </div>
  );
};

export default Doughnut;
