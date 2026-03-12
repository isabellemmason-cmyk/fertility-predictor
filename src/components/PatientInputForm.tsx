import { useState, useEffect } from 'react';
import type { PatientInputs, Gravidity, DataSource } from '../lib/types';

interface PatientInputFormProps {
  inputs: PatientInputs;
  onChange: (inputs: PatientInputs) => void;
}

export function PatientInputForm({ inputs, onChange }: PatientInputFormProps) {
  const [amhInput, setAmhInput] = useState(inputs.amh.toString());
  const [isAdvancedOpen, setIsAdvancedOpen] = useState(false);

  // Sync local state with parent state
  useEffect(() => {
    setAmhInput(inputs.amh.toString());
  }, [inputs.amh]);

  const handleChange = (field: keyof PatientInputs, value: number | Gravidity | DataSource) => {
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

      {/* Horizontal Divider */}
      <div className="border-t border-gray-200" style={{ borderColor: '#f0f0f4' }} />

      {/* Advanced Collapsible Section */}
      <div>
        {/* Trigger */}
        <button
          type="button"
          onClick={() => setIsAdvancedOpen(!isAdvancedOpen)}
          aria-expanded={isAdvancedOpen}
          className="w-full flex items-center gap-2 py-2 transition-colors hover:bg-gray-50 rounded"
        >
          <svg
            className="w-4 h-4 text-gray-400 transition-transform duration-300"
            style={{ transform: isAdvancedOpen ? 'rotate(180deg)' : 'rotate(0deg)' }}
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
          </svg>
          <span className="text-xs uppercase tracking-wider font-medium text-gray-500">
            Advanced
          </span>
        </button>

        {/* Accordion Body */}
        <div
          className="overflow-hidden transition-all duration-300"
          style={{
            maxHeight: isAdvancedOpen ? '200px' : '0',
            opacity: isAdvancedOpen ? 1 : 0,
          }}
        >
          <div className="pt-3 space-y-3">
            {/* Data Source Toggle */}
            <div className="space-y-2">
              <label className="text-sm font-medium text-gray-700">
                Egg Yield & Embryo Development Source
              </label>

              {/* Segmented Toggle */}
              <div className="bg-gray-100 p-1 rounded-lg inline-flex w-full">
                <button
                  type="button"
                  onClick={() => handleChange('dataSource', 'published')}
                  className={`flex-1 px-3 py-2 text-sm font-medium rounded-lg transition-all ${
                    inputs.dataSource === 'published'
                      ? 'bg-white shadow-sm text-gray-900'
                      : 'text-gray-600 hover:text-gray-900'
                  }`}
                >
                  Published Data
                </button>
                <button
                  type="button"
                  onClick={() => handleChange('dataSource', 'uhfc')}
                  className={`flex-1 px-3 py-2 text-sm font-medium rounded-lg transition-all ${
                    inputs.dataSource === 'uhfc'
                      ? 'bg-white shadow-sm text-gray-900'
                      : 'text-gray-600 hover:text-gray-900'
                  }`}
                >
                  UHFC Data
                </button>
              </div>

              {/* Info Callout */}
              <div
                className="flex items-start gap-2 p-2 rounded-r-md"
                style={{
                  borderLeft: '3px solid #5b6af0',
                  backgroundColor: '#f0f4ff',
                }}
              >
                <svg
                  className="w-4 h-4 text-blue-600 flex-shrink-0 mt-0.5"
                  fill="currentColor"
                  viewBox="0 0 20 20"
                >
                  <path
                    fillRule="evenodd"
                    d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z"
                    clipRule="evenodd"
                  />
                </svg>
                <p className="text-xs text-blue-800">
                  {inputs.dataSource === 'published'
                    ? 'Published averages for oocyte yield prediction and embryo development.'
                    : 'Clinical cohort data from University Hospitals Fertility Center.'}
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
