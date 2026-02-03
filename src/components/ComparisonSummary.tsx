import type { SpontaneousResults, IVFResults } from '../lib/types';
import { formatPercent } from '../lib/calculations';

interface ComparisonSummaryProps {
  spontaneous: SpontaneousResults;
  ivf: IVFResults;
  timeHorizon: number;
}

export function ComparisonSummary({ spontaneous, ivf, timeHorizon }: ComparisonSummaryProps) {
  const difference = ivf.healthyBaby - spontaneous.healthyBaby;
  const differencePercent = difference * 100;
  const relativeDifference = spontaneous.healthyBaby > 0
    ? ((ivf.healthyBaby - spontaneous.healthyBaby) / spontaneous.healthyBaby) * 100
    : 0;

  return (
    <div className="bg-white rounded-xl shadow-sm p-6">
      <h2 className="text-lg font-semibold text-gray-800 mb-6">Outcome Comparison</h2>

      <div className="grid grid-cols-2 gap-4 mb-6">
        {/* Spontaneous Card */}
        <div className="bg-purple-50 rounded-lg p-4 text-center">
          <div className="w-8 h-8 rounded-full bg-purple-100 flex items-center justify-center mx-auto mb-2">
            <span className="text-purple-600 font-bold text-sm">A</span>
          </div>
          <p className="text-xs text-purple-600 font-medium mb-1">Spontaneous</p>
          <p className="text-2xl font-bold text-purple-700">
            {formatPercent(spontaneous.healthyBaby)}
          </p>
          <p className="text-xs text-purple-500 mt-1">{timeHorizon} months</p>
        </div>

        {/* IVF Card */}
        <div className="bg-blue-50 rounded-lg p-4 text-center">
          <div className="w-8 h-8 rounded-full bg-blue-100 flex items-center justify-center mx-auto mb-2">
            <span className="text-blue-600 font-bold text-sm">B</span>
          </div>
          <p className="text-xs text-blue-600 font-medium mb-1">IVF + PGT-A</p>
          <p className="text-2xl font-bold text-blue-700">
            {formatPercent(ivf.healthyBaby)}
          </p>
          <p className="text-xs text-blue-500 mt-1">Single cycle</p>
        </div>
      </div>

      {/* Difference */}
      <div className={`rounded-lg p-4 ${difference >= 0 ? 'bg-green-50' : 'bg-orange-50'}`}>
        <div className="flex items-center justify-between">
          <span className="text-sm text-gray-600">IVF Advantage</span>
          <div className="text-right">
            <span className={`text-lg font-bold ${difference >= 0 ? 'text-green-600' : 'text-orange-600'}`}>
              {difference >= 0 ? '+' : ''}{differencePercent.toFixed(1)}%
            </span>
            <span className="text-sm text-gray-400 ml-2">
              ({relativeDifference >= 0 ? '+' : ''}{relativeDifference.toFixed(0)}% relative)
            </span>
          </div>
        </div>
        <p className="mt-2 text-xs text-gray-500">
          {difference > 0.05
            ? 'IVF + PGT-A shows meaningfully higher success probability for this patient profile.'
            : difference < -0.05
            ? 'Spontaneous conception may be the preferred approach for this patient profile.'
            : 'Both pathways show similar success probabilities for this patient profile.'}
        </p>
      </div>

      {/* Additional context */}
      <div className="mt-4 p-4 bg-gray-50 rounded-lg">
        <h3 className="text-sm font-medium text-gray-700 mb-2">Key Considerations</h3>
        <ul className="text-xs text-gray-500 space-y-1">
          <li>• IVF probability is for a single cycle; multiple cycles increase cumulative success</li>
          <li>• Spontaneous timeframe can be extended beyond {timeHorizon} months</li>
          <li>• PGT-A reduces aneuploidy risk but adds cost and complexity</li>
          <li>• Individual results may vary based on factors not captured in this model</li>
        </ul>
      </div>
    </div>
  );
}
