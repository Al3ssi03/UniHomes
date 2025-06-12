import React, { useState, useEffect } from 'react';

export default function PriceRangeSlider({ min = 0, max = 2000, step = 50, value, onChange }) {
  const [localValue, setLocalValue] = useState(value || [min, max]);

  useEffect(() => {
    if (value) {
      setLocalValue(value);
    }
  }, [value]);

  const handleChange = (index, newValue) => {
    const newRange = [...localValue];
    newRange[index] = parseInt(newValue);
    
    // Ensure min <= max
    if (index === 0 && newRange[0] > newRange[1]) {
      newRange[1] = newRange[0];
    } else if (index === 1 && newRange[1] < newRange[0]) {
      newRange[0] = newRange[1];
    }
    
    setLocalValue(newRange);
    onChange(newRange);
  };

  const getPercentage = (value) => ((value - min) / (max - min)) * 100;

  return (
    <div className="space-y-4">
      <div className="flex justify-between text-sm text-gray-600">
        <span>€{localValue[0]}/mese</span>
        <span>€{localValue[1]}/mese</span>
      </div>
      
      <div className="relative">
        {/* Track */}
        <div className="h-2 bg-gray-200 rounded-lg relative">
          {/* Active range */}
          <div 
            className="absolute h-2 bg-gradient-to-r from-blue-500 to-purple-500 rounded-lg"
            style={{
              left: `${getPercentage(localValue[0])}%`,
              width: `${getPercentage(localValue[1]) - getPercentage(localValue[0])}%`
            }}
          />
        </div>
        
        {/* Min thumb */}
        <input
          type="range"
          min={min}
          max={max}
          step={step}
          value={localValue[0]}
          onChange={(e) => handleChange(0, e.target.value)}
          className="absolute w-full h-2 bg-transparent appearance-none cursor-pointer slider-thumb"
          style={{ top: 0 }}
        />
        
        {/* Max thumb */}
        <input
          type="range"
          min={min}
          max={max}
          step={step}
          value={localValue[1]}
          onChange={(e) => handleChange(1, e.target.value)}
          className="absolute w-full h-2 bg-transparent appearance-none cursor-pointer slider-thumb"
          style={{ top: 0 }}
        />
      </div>
      
      <div className="flex justify-between text-xs text-gray-500">
        <span>€{min}</span>
        <span>€{max}</span>
      </div>
      
      <style jsx>{`
        .slider-thumb::-webkit-slider-thumb {
          appearance: none;
          width: 20px;
          height: 20px;
          border-radius: 50%;
          background: #2563eb;
          border: 3px solid white;
          box-shadow: 0 2px 6px rgba(0,0,0,0.2);
          cursor: pointer;
          position: relative;
          z-index: 2;
        }
        
        .slider-thumb::-moz-range-thumb {
          width: 20px;
          height: 20px;
          border-radius: 50%;
          background: #2563eb;
          border: 3px solid white;
          box-shadow: 0 2px 6px rgba(0,0,0,0.2);
          cursor: pointer;
          border: none;
        }
        
        .slider-thumb::-webkit-slider-track {
          background: transparent;
        }
        
        .slider-thumb::-moz-range-track {
          background: transparent;
        }
      `}</style>
    </div>
  );
}
