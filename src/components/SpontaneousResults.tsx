import type { SpontaneousResults as SpontaneousResultsType } from '../lib/types';
import { formatPercent } from '../lib/calculations';

interface SpontaneousResultsProps {
  results: SpontaneousResultsType;
  timeHorizon: number;
}

interface StepProps {
  label: string;
  value: string;
  description?: string;
  isHighlight?: boolean;
}

function Step({ label, value, description, isHighlight }: StepProps) {
  return (
    <div
      className={`p-4 rounded-lg ${
        isHighlight ? 'bg-emerald-50 border-2 border-emerald-200' : 'bg-gray-50'
      }`}
    >
      <div className="flex justify-between items-start">
        <span className={`text-sm ${isHighlight ? 'font-semibold text-emerald-800' : 'text-gray-600'}`}>
          {label}
        </span>
        <span className={`text-lg font-bold ${isHighlight ? 'text-emerald-600' : 'text-gray-800'}`}>
          {value}
        </span>
      </div>
      {description && <p className="mt-1 text-xs text-gray-400">{description}</p>}
    </div>
  );
}

export function SpontaneousResults({ results, timeHorizon }: SpontaneousResultsProps) {
  return (
    <div className="bg-white rounded-xl shadow-sm p-6">
      <div className="flex items-center gap-3 mb-6">
        <div className="w-10 h-10 rounded-full bg-purple-100 flex items-center justify-center">
          <span className="text-purple-600 font-bold">A</span>
        </div>
        <div>
          <h2 className="text-lg font-semibold text-gray-800">Spontaneous Conception</h2>
          <p className="text-sm text-gray-500">Natural conception over {timeHorizon} months</p>
        </div>
      </div>

      <div className="space-y-3">
        <Step
          label="Monthly Fecundability"
          value={formatPercent(results.fecundability)}
          description="Chance of pregnancy per menstrual cycle"
        />

        <div className="flex items-center justify-center">
          <svg className="w-4 h-4 text-gray-300" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 14l-7 7m0 0l-7-7m7 7V3" />
          </svg>
        </div>

        <Step
          label="Cumulative Pregnancy"
          value={formatPercent(results.cumulativePregnancy)}
          description={`After ${timeHorizon} months of trying`}
        />

        <div className="flex items-center justify-center">
          <svg className="w-4 h-4 text-gray-300" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 14l-7 7m0 0l-7-7m7 7V3" />
          </svg>
        </div>

        <Step
          label="Miscarriage Rate"
          value={formatPercent(results.miscarriageRate)}
          description="If pregnancy is achieved"
        />

        <div className="flex items-center justify-center">
          <svg className="w-4 h-4 text-gray-300" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 14l-7 7m0 0l-7-7m7 7V3" />
          </svg>
        </div>

        <Step
          label="Ongoing Pregnancy"
          value={formatPercent(results.ongoingPregnancy)}
          description="Pregnancy that continues past first trimester"
        />

        <div className="flex items-center justify-center">
          <svg className="w-4 h-4 text-gray-300" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 14l-7 7m0 0l-7-7m7 7V3" />
          </svg>
        </div>

        <Step
          label="Aneuploidy Risk"
          value={formatPercent(results.aneuploidyRisk)}
          description="Any chromosomal anomaly at delivery"
        />

        <div className="flex items-center justify-center">
          <svg className="w-4 h-4 text-gray-300" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 14l-7 7m0 0l-7-7m7 7V3" />
          </svg>
        </div>

        <Step
          label="Healthy Baby Probability"
          value={formatPercent(results.healthyBaby)}
          isHighlight
        />
      </div>
    </div>
  );
}
