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
          description="Metaphase II oocytes"
        />

        <Arrow />

        <Step
          label="Fertilized (2PN)"
          value={formatNumber(results.fertilized)}
          subValue="(72%)"
          description="Successfully fertilized"
        />

        <Arrow />

        <Step
          label="Blastocysts"
          value={formatNumber(results.blastocysts)}
          description="Embryos reaching blastocyst stage"
        />

        <Arrow />

        <Step
          label="Euploid Blastocysts"
          value={formatNumber(results.euploidBlasts)}
          description="Chromosomally normal embryos"
        />

        <Arrow />

        <Step
          label="P(≥1 Euploid Embryo)"
          value={formatPercent(results.pAtLeastOneEuploid)}
          description="Chance of having at least one normal embryo"
        />

        <Arrow />

        <div className="grid grid-cols-2 gap-3">
          <Step
            label="LB Rate per Euploid"
            value={formatPercent(results.liveBirthPerEuploid)}
            description="Per transfer"
          />
          <Step
            label="Expected Live Births"
            value={formatNumber(results.expectedLiveBirths, 2)}
            description="Statistical expectation"
          />
        </div>

        <Arrow />

        <Step
          label="Healthy Baby Probability"
          value={formatPercent(results.healthyBaby)}
          description="Overall probability (includes cycle cancellation risk)"
          isHighlight
        />
      </div>
    </div>
  );
}
