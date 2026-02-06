import { lookupAMHPercentile, calculateAMHPercentile } from '../lib/lookupTables';

interface AMHPercentileProps {
  age: number;
  amh: number;
}

export function AMHPercentile({ age, amh }: AMHPercentileProps) {
  const data = lookupAMHPercentile(age);
  const percentileRange = calculateAMHPercentile(amh, age);

  if (!data) {
    return null;
  }

  // Fixed positions for percentile markers on the bar
  const p25Position = 25;
  const medianPosition = 50;
  const p75Position = 75;

  // Calculate marker position by interpolating between percentile values
  const getMarkerPosition = (value: number): number => {
    if (value <= 0) return 0;

    // Below 25th percentile: interpolate from 0 to 25
    if (value < data.p25) {
      // Assume minimum is ~0, scale from 0-25%
      const minVal = 0;
      const ratio = (value - minVal) / (data.p25 - minVal);
      return Math.max(0, ratio * 25);
    }

    // Between 25th and median: interpolate from 25 to 50
    if (value <= data.median) {
      const ratio = (value - data.p25) / (data.median - data.p25);
      return 25 + ratio * 25;
    }

    // Between median and 75th: interpolate from 50 to 75
    if (value <= data.p75) {
      const ratio = (value - data.median) / (data.p75 - data.median);
      return 50 + ratio * 25;
    }

    // Above 75th percentile: interpolate from 75 to 100
    // Assume max is roughly 2x the 75th percentile
    const maxVal = data.p75 * 2;
    const ratio = (value - data.p75) / (maxVal - data.p75);
    return Math.min(100, 75 + ratio * 25);
  };

  const markerPosition = getMarkerPosition(amh);

  // Determine color based on percentile
  const getStatusColor = () => {
    if (amh < data.p25) return 'text-orange-600';
    if (amh <= data.median) return 'text-yellow-600';
    if (amh <= data.p75) return 'text-green-600';
    return 'text-blue-600';
  };

  const getStatusBg = () => {
    if (amh < data.p25) return 'bg-orange-50';
    if (amh <= data.median) return 'bg-yellow-50';
    if (amh <= data.p75) return 'bg-green-50';
    return 'bg-blue-50';
  };

  return (
    <div className={`rounded-lg p-4 ${getStatusBg()}`}>
      <div className="flex items-center justify-between mb-3">
        <span className="text-sm font-medium text-gray-700">AMH Percentile</span>
      </div>

      {/* Visual bar */}
      <div className="relative h-3 bg-gradient-to-r from-orange-200 via-yellow-200 via-green-200 to-blue-200 rounded-full">
        {/* Percentile markers */}
        <div
          className="absolute top-0 w-0.5 h-3 bg-gray-400"
          style={{ left: `${p25Position}%` }}
          title="25th percentile"
        />
        <div
          className="absolute top-0 w-0.5 h-3 bg-gray-600"
          style={{ left: `${medianPosition}%` }}
          title="Median"
        />
        <div
          className="absolute top-0 w-0.5 h-3 bg-gray-400"
          style={{ left: `${p75Position}%` }}
          title="75th percentile"
        />

        {/* Patient marker */}
        <div
          className="absolute -top-1 w-4 h-5 bg-blue-600 rounded-sm transform -translate-x-1/2 shadow-sm"
          style={{ left: `${markerPosition}%` }}
        >
          <div className="absolute -bottom-5 left-1/2 transform -translate-x-1/2 text-xs font-medium text-blue-600 whitespace-nowrap">
            {amh}
          </div>
        </div>
      </div>

      {/* Reference values - positioned to align with markers */}
      <div className="relative mt-6 h-8 text-xs text-gray-500">
        <div className="absolute text-center" style={{ left: '25%', transform: 'translateX(-50%)' }}>
          <div className="font-medium">{data.p25}</div>
          <div>25th</div>
        </div>
        <div className="absolute text-center" style={{ left: '50%', transform: 'translateX(-50%)' }}>
          <div className="font-medium">{data.median}</div>
          <div>Median</div>
        </div>
        <div className="absolute text-center" style={{ left: '75%', transform: 'translateX(-50%)' }}>
          <div className="font-medium">{data.p75}</div>
          <div>75th</div>
        </div>
      </div>

      <p className="mt-3 text-xs text-gray-400">
        Age-matched reference data (Aslan 2025, n=22,920)
      </p>
    </div>
  );
}
