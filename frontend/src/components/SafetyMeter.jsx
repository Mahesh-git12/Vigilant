import React from 'react';

const SafetyMeter = ({ score, status, color }) => {
    return (
        <div style={{ padding: '20px', textAlign: 'center', border: `2px solid ${color}`, borderRadius: '10px' }}>
            <h3 style={{ color: color }}>Status: {status}</h3>
            <div style={{ background: '#eee', borderRadius: '5px', height: '25px', width: '100%' }}>
                <div style={{ 
                    width: `${score}%`, 
                    background: color, 
                    height: '100%', 
                    borderRadius: '5px',
                    transition: 'width 1s ease-in-out' 
                }} />
            </div>
            <p>Safety Confidence: {score}%</p>
        </div>
    );
};

export default SafetyMeter;