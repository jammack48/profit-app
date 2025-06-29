import React from 'react';

interface VerticalSliderProps {
  label: string;
  value: number;
  onChange: (value: number) => void;
  min?: number;
  max?: number;
  step?: number;
}

export const VerticalSlider: React.FC<VerticalSliderProps> = ({
  label,
  value,
  onChange,
  min = 0,
  max = 150,
  step = 0.5
}) => {
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    onChange(Number(e.target.value));
  };

  return (
    <div className="flex flex-col items-center h-full">
      <div className="text-xs font-medium text-gray-300 mb-2 text-center">
        {label}
      </div>
      
      <div className="flex-1 flex items-center justify-center py-4">
        <input
          type="range"
          min={min}
          max={max}
          step={step}
          value={value}
          onChange={handleChange}
          className="vertical-slider h-32 accent-blue-400"
          style={{
            writingMode: 'bt-lr',
            WebkitAppearance: 'slider-vertical',
            width: '8px',
            height: '128px'
          }}
        />
      </div>
      
      <div className="text-lg font-bold text-blue-400 mb-1">
        {value.toFixed(1)}%
      </div>
    </div>
  );
};