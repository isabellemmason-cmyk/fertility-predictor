import type { IVFResults as IVFResultsType } from '../lib/types';
import { formatPercent, formatNumber } from '../lib/calculations';

interface IVFResultsProps {
  results: IVFResultsType;
}

interface StepProps {
  label: string;
  value: string;
  subValue?: string;
  description?: string;
  isHighlight?: boolean;
  isWarning?: boolean;
}

function Step({ label, value, subValue, description, isHighlight, isWarning }: StepProps) {
  return (
    <div
      className={`p-4 rounded-lg ${
        isWarning
          ? 'bg-orange-50 border-2 border-orange-200'
          : isHighlight
          ? 'bg-blue-50 border-2 border-blue-200'
          : 'bg-gray-50'
      }`}
    >
      <div className="flex justify-between items-start">
        <span
          className={`text-sm ${
            isWarning
              ? 'font-semibold text-orange-800'
              : isHighlight
              ? 'font-semibold text-blue-800'
              : 'text-gray-600'
          }`}
        >
          {label}
        </span>
        <div className="text-right">
          <span
            className={`text-lg font-bold ${
              isWarning ? 'text-orange-600' : isHighlight ? 'text-blue-600' : 'text-gray-800'
            }`}
          >
            {value}
          </span>
          {subValue && <span className="text-sm text-gray-400 ml-1">{subValue}</span>}
        </div>
      </div>
      {description && <p className="mt-1 text-xs text-gray-400">{description}</p>}
    </div>
  );
}

function Arrow() {
  return (
    <div className="flex items-center justify-center">
      <svg className="w-4 h-4 text-gray-300" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 14l-7 7m0 0l-7-7m7 7V3" />
      </svg>
    </div>
  );
}

export function IVFResults({ results }: IVFResultsProps) {
  return (
    <div className="bg-white rounded-xl shadow-sm p-6">
      <div className="flex items-center gap-3 mb-6">
        <div className="w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center">
          <span className="text-blue-600 font-bold">B</span>
        </div>
        <div>
          <h2 className="text-lg font-semibold text-gray-800">IVF + PGT-A</h2>
          <p className="text-sm text-gray-500">Single cycle with genetic testing</p>
        </div>
      </div>

      <div className="space-y-3">
        <Step
          label="Risk of Cycle Cancellation"
          value={formatPercent(results.cycleCancellationRisk)}
          description="Risk of not making it to oocyte retrieval"
          isWarning
        />

        <Arrow />

        <Step
          label="Predicted Oocytes"
          value={formatNumber(results.oocytes)}
          description={`Range: ${formatNumber(results.oocytesLowerQuartile, 0)}–${formatNumber(results.oocytesUpperQuartile, 0)} (IQR)`}
        />

        <Arrow />

        <Step
          label="Mature Oocytes (MII)"
          value={formatNumber(results.matureOocytes)}
          subValue="(82%)"
          description={`Range: ${formatNumber(results.matureOocytesLowerQuartile, 1)}–${formatNumber(results.matureOocytesUpperQuartile, 1)} (IQR)`}
        />

        <Arrow />

        <Step
          label="Fertilized (2PN)"
          value={formatNumber(results.fertilized)}
          subValue="(72%)"
          description={`Range: ${formatNumber(results.fertilizedLowerQuartile, 1)}–${formatNumber(results.fertilizedUpperQuartile, 1)} (IQR)`}
        />

        <Arrow />

        <Step
          label="Blastocysts"
          value={formatNumber(results.blastocysts)}
          description={`Range: ${formatNumber(results.blastocystsLowerQuartile, 1)}–${formatNumber(results.blastocystsUpperQuartile, 1)} (IQR)`}
        />

        <Arrow />

        <Step
          label="Euploid Blastocysts"
          value={formatNumber(results.euploidBlasts)}
          description={`Range: ${formatNumber(results.euploidBlastsLowerQuartile, 1)}–${formatNumber(results.euploidBlastsUpperQuartile, 1)} (IQR)`}
        />

        {results.cyclesNeededForOneEuploid && (
          <div className="p-4 rounded-lg bg-amber-50 border-2 border-amber-200">
            <div className="flex items-start gap-2">
              <svg className="w-5 h-5 text-amber-600 mt-0.5 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
              </svg>
              <div>
                <p className="text-sm font-semibold text-amber-800">
                  Multiple Cycles May Be Needed
                </p>
                <p className="text-sm text-amber-700 mt-1">
                  {(() => {
                    const lower = Math.floor(results.cyclesNeededForOneEuploid);
                    const upper = Math.ceil(results.cyclesNeededForOneEuploid);
                    const cycleText = lower === upper
                      ? `Approximately ${lower} cycle${lower === 1 ? '' : 's'}`
                      : `${lower}-${upper} cycles`;
                    return `${cycleText} to obtain 1 euploid embryo`;
                  })()}
                </p>
              </div>
            </div>
          </div>
        )}

        <Arrow />

        <Step
          label="LB Rate per Euploid"
          value={formatPercent(results.liveBirthPerEuploid)}
          description="Per transfer"
        />

        <Arrow />

        <Step
          label="Euploid Live Birth"
          value={formatPercent(results.healthyBaby)}
          description="Overall probability (includes cycle cancellation risk)"
          isHighlight
        />
      </div>
    </div>
  );
}
