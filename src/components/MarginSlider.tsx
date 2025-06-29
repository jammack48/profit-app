import React from 'react';
import { Sliders as Slider } from 'lucide-react';

interface MarginSliderProps {
  label: string;
  value: number;
  onChange: (value: number) => void;
  min?: number;
  max?: number;
  step?: number;
  warning?: string;
  disabled?: boolean;
}

export const MarginSlider: React.FC<MarginSliderProps> = ({
  label,
  value,
  onChange,
  min = 0,
  max = 200,
  step = 1,
  warning,
  disabled = false
}) => {
  const handleSliderChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    onChange(Number(e.target.value));
  };

  const getSliderColor = () => {
    if (disabled) return 'opacity-50';
    if (warning) return 'accent-amber-500';
    return 'accent-blue-500';
  };

  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Slider className="w-4 h-4 text-gray-500" />
          <label className="text-sm font-medium text-gray-700">{label}</label>
        </div>
        <div className="flex items-center gap-2">
          <span className={`text-lg font-bold ${warning ? 'text-amber-600' : 'text-blue-600'}`}>
            {value.toFixed(1)}%
          </span>
          {warning && (
            <span className="text-xs text-amber-600 bg-amber-50 px-2 py-1 rounded">
              {warning}
            </span>
          )}
        </div>
      </div>
      
      <div className="relative">
        <input
          type="range"
          min={min}
          max={max}
          step={step}
          value={value}
          onChange={handleSliderChange}
          disabled={disabled}
          className={`w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer slider ${getSliderColor()}`}
        />
        <div className="flex justify-between text-xs text-gray-500 mt-1">
          <span>{min}%</span>
          <span>{max}%</span>
        </div>
      </div>
    </div>
  );
};