import { useState, useMemo } from 'react';
import type { PatientInputs } from './lib/types';
import { calculateSpontaneous, calculateIVF } from './lib/calculations';
import { PatientInputForm } from './components/PatientInputForm';
import { AMHPercentile } from './components/AMHPercentile';
import { SpontaneousResults } from './components/SpontaneousResults';
import { IVFResults } from './components/IVFResults';
import { ComparisonSummary } from './components/ComparisonSummary';

const DEFAULT_INPUTS: PatientInputs = {
  age: 35,
  amh: 2.0,
  priorPregnancy: false,
  priorMiscarriages: 0,
  timeHorizon: 12,
  dataSource: 'uhfc',
};

function App() {
  const [inputs, setInputs] = useState<PatientInputs>(DEFAULT_INPUTS);

  const spontaneousResults = useMemo(
    () => calculateSpontaneous(inputs),
    [inputs]
  );

  const ivfResults = useMemo(
    () => calculateIVF(inputs),
    [inputs]
  );

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 py-6">
          <h1 className="text-2xl font-bold text-gray-900">
            REI Fertility Calculator
          </h1>
          <p className="mt-1 text-sm text-gray-500">
            Compare outcomes: Spontaneous Conception vs. IVF + PGT-A
          </p>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          {/* Left Column - Inputs */}
          <div className="lg:col-span-3 space-y-6">
            <PatientInputForm inputs={inputs} onChange={setInputs} />
            <AMHPercentile age={inputs.age} amh={inputs.amh} />
          </div>

          {/* Middle Columns - Results */}
          <div className="lg:col-span-9">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
              <SpontaneousResults
                results={spontaneousResults}
                timeHorizon={inputs.timeHorizon}
                age={inputs.age}
              />
              <IVFResults results={ivfResults} />
            </div>

            <ComparisonSummary
              spontaneous={spontaneousResults}
              ivf={ivfResults}
              timeHorizon={inputs.timeHorizon}
            />
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="bg-white border-t border-gray-200 mt-12">
        <div className="max-w-7xl mx-auto px-4 py-6">
          <div className="text-sm text-gray-500 space-y-3">
            <p className="font-medium text-gray-700">Disclaimer</p>
            <p>
              This calculator is for educational and counseling purposes only. Results are estimates
              based on population-level data and may not reflect individual outcomes. Always discuss
              fertility options with a qualified reproductive endocrinologist.
            </p>

            <p className="font-medium text-gray-700 pt-3">Data Sources</p>

            <div className="space-y-2">
              <p className="text-xs font-semibold text-gray-600 uppercase tracking-wide">IVF - Published Data</p>
              <ul className="grid grid-cols-1 md:grid-cols-2 gap-1">
                <li>• Oocyte retrieval: Reichman et al.</li>
                <li>• Embryo development: Romanski 2022</li>
              </ul>
            </div>

            <div className="space-y-2 pt-2">
              <p className="text-xs font-semibold text-gray-600 uppercase tracking-wide">IVF - UHFC Clinical Data</p>
              <ul className="grid grid-cols-1 md:grid-cols-2 gap-1">
                <li>• Oocyte retrieval: UHFC 2021-2025</li>
                <li>• Embryo development: UHFC 2021-2025</li>
              </ul>
            </div>

            <div className="space-y-2 pt-2">
              <p className="text-xs font-semibold text-gray-600 uppercase tracking-wide">Shared Data Sources</p>
              <ul className="grid grid-cols-1 md:grid-cols-2 gap-1">
                <li>• Spontaneous fecundability: Steiner 2016</li>
                <li>• Miscarriage rates: Magnus 2019</li>
                <li>• Aneuploidy risk: ACOG 2020</li>
                <li>• Euploidy rates: Franasiak 2014</li>
                <li>• Live birth per euploid: Yan 2021, Linder 2025</li>
                <li>• AMH reference: Aslan 2025</li>
              </ul>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}

export default App;
