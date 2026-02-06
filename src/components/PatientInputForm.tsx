import { useState, useEffect } from 'react';
import type { PatientInputs, Gravidity } from '../lib/types';

interface PatientInputFormProps {
  inputs: PatientInputs;
  onChange: (inputs: PatientInputs) => void;
}

export function PatientInputForm({ inputs, onChange }: PatientInputFormProps) {
  const [amhInput, setAmhInput] = useState(inputs.amh.toString());

  // Sync local state with parent state
  useEffect(() => {
    setAmhInput(inputs.amh.toString());
  }, [inputs.amh]);

  const handleChange = (field: keyof PatientInputs, value: number | Gravidity) => {
    onChange({ ...inputs, [field]: value });
  };

  return (
    <div className="bg-white rounded-xl shadow-sm p-6 space-y-6">
      <h2 className="text-lg font-semibold text-gray-800">Patient Parameters</h2>

      {/* Age */}
      <div className="space-y-2">
        <div className="flex justify-between items-center">
          <label htmlFor="age" className="text-sm font-medium text-gray-700">
            Age
          </label>
          <span className="text-sm font-semibold text-blue-600">{inputs.age} years</span>
        </div>
        <input
          id="age"
          type="range"
          min={20}
          max={45}
          step={1}
          value={inputs.age}
          onChange={(e) => handleChange('age', Number(e.target.value))}
          className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-blue-600"
        />
        <div className="flex justify-between text-xs text-gray-400">
          <span>20</span>
          <span>45</span>
        </div>
      </div>

      {/* AMH */}
      <div className="space-y-2">
        <div className="flex justify-between items-center">
          <label htmlFor="amh" className="text-sm font-medium text-gray-700">
            AMH
          </label>
          <span className="text-sm text-gray-500">ng/mL</span>
        </div>
        <input
          id="amh"
          type="number"
          min={0.01}
          max={15}
          step={0.01}
          value={amhInput}
          onChange={(e) => {
            setAmhInput(e.target.value);
            if (e.target.value !== '') {
              handleChange('amh', Number(e.target.value));
            }
          }}
          onBlur={(e) => {
            const value = e.target.value === '' ? 0.01 : Number(e.target.value);
            const validValue = value < 0.01 ? 0.01 : value;
            setAmhInput(validValue.toString());
            handleChange('amh', validValue);
          }}
          className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
        />
        <p className="text-xs text-gray-400">Used for IVF oocyte prediction</p>
      </div>

      {/* Gravidity */}
      <div className="space-y-2">
        <label className="text-sm font-medium text-gray-700">Gravidity Status</label>
        <div className="grid grid-cols-2 gap-2">
          <button
            type="button"
            onClick={() => handleChange('gravidity', 'nulligravid')}
            className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
              inputs.gravidity === 'nulligravid'
                ? 'bg-blue-600 text-white'
                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
            }`}
          >
            Nulligravid
          </button>
          <button
            type="button"
            onClick={() => handleChange('gravidity', 'prior_pregnancy')}
            className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
              inputs.gravidity === 'prior_pregnancy'
                ? 'bg-blue-600 text-white'
                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
            }`}
          >
            Prior Pregnancy
          </button>
        </div>
      </div>

      {/* Time Horizon */}
      <div className="space-y-2">
        <div className="flex justify-between items-center">
          <label htmlFor="timeHorizon" className="text-sm font-medium text-gray-700">
            Time Horizon
          </label>
          <span className="text-sm font-semibold text-blue-600">{inputs.timeHorizon} months</span>
        </div>
        <input
          id="timeHorizon"
          type="range"
          min={1}
          max={24}
          step={1}
          value={inputs.timeHorizon}
          onChange={(e) => handleChange('timeHorizon', Number(e.target.value))}
          className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-blue-600"
        />
        <div className="flex justify-between text-xs text-gray-400">
          <span>1 month</span>
          <span>24 months</span>
        </div>
        <p className="text-xs text-gray-400">For spontaneous conception probability</p>
      </div>
    </div>
  );
}
