import type { SpontaneousResults as SpontaneousResultsType } from '../lib/types';
import { formatPercent } from '../lib/calculations';

interface SpontaneousResultsProps {
  results: SpontaneousResultsType;
  timeHorizon: number;
  age: number;
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

export function SpontaneousResults({ results, timeHorizon, age }: SpontaneousResultsProps) {
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
          description={
            age < 30
              ? "Chance of pregnancy per menstrual cycle · estimate based on ages 30–31 reference group (Steiner 2016 cohort ages 30–44)"
              : "Chance of pregnancy per menstrual cycle"
          }
        />

        {age >= 42 && (
          <div className="p-4 rounded-lg bg-amber-50 border-2 border-amber-200">
            <div className="flex items-start gap-2">
              <svg className="w-5 h-5 text-amber-600 mt-0.5 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
              </svg>
              <p className="text-sm text-amber-700">
                At this age, spontaneous conception estimates are based on limited data and individual variation is high.
              </p>
            </div>
          </div>
        )}

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
          value={formatPercent(results.adjustedMiscarriageRate)}
          description={
            results.miscarriageRecurrenceOR > 1
              ? `If pregnancy is achieved · adjusted for recurrence risk (OR ${results.miscarriageRecurrenceOR.toFixed(2)}, Magnus 2019)`
              : 'If pregnancy is achieved'
          }
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
          label="Trisomy 13, 18, or 21 Risk at Birth"
          value={formatPercent(results.aneuploidyRisk, 2)}
          description="Risk of any one of T13, T18, or T21 at live birth (Cuckle & Morris 2021)"
        />

        {/* Trisomy 21 Risk Details */}
        <div className="mt-4 p-4 bg-blue-50 rounded-lg border border-blue-100">
          <h3 className="text-sm font-semibold text-blue-800 mb-3">Trisomy 21 (Down Syndrome) Risk</h3>
          <div className="space-y-2">
            <div className="flex justify-between items-center">
              <span className="text-xs text-blue-700">1st trimester</span>
              <span className="text-sm font-semibold text-blue-900">
                1 in {results.trisomy21FirstTrimester} ({formatPercent(1 / results.trisomy21FirstTrimester)})
              </span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-xs text-blue-700">2nd trimester</span>
              <span className="text-sm font-semibold text-blue-900">
                1 in {results.trisomy21SecondTrimester} ({formatPercent(1 / results.trisomy21SecondTrimester)})
              </span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-xs text-blue-700">At delivery</span>
              <span className="text-sm font-semibold text-blue-900">
                1 in {results.trisomy21Delivery} ({formatPercent(1 / results.trisomy21Delivery)})
              </span>
            </div>
          </div>
        </div>

        <div className="flex items-center justify-center">
          <svg className="w-4 h-4 text-gray-300" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 14l-7 7m0 0l-7-7m7 7V3" />
          </svg>
        </div>

        <Step
          label="Live Birth without Trisomy 13, 18, or 21"
          value={formatPercent(results.healthyBaby)}
          isHighlight
        />
      </div>
    </div>
  );
}
