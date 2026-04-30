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

            <p className="font-medium text-gray-700 pt-3">References</p>

            <div className="space-y-2">
              <p className="text-xs font-semibold text-gray-600 uppercase tracking-wide">Spontaneous Conception</p>
              <ol className="space-y-1 list-decimal list-inside">
                <li>Steiner AZ, Jukic AM. Impact of female age and nulligravidity on fecundity in an older reproductive age cohort. <em>Fertil Steril.</em> 2016;105(6):1584–1588.e1. doi:10.1016/j.fertnstert.2016.02.028</li>
                <li>Magnus MC, Wilcox AJ, Morken NH, Weinberg CR, Håberg SE. Role of maternal age and pregnancy history in risk of miscarriage: prospective register based study. <em>BMJ.</em> 2019;364:l869. doi:10.1136/bmj.l869</li>
                <li>Cuckle H, Morris J. Maternal age in the epidemiology of common autosomal trisomies. <em>Prenat Diagn.</em> 2021;41:573–583. doi:10.1002/pd.5840</li>
                <li>Snijders RJ, Sundberg K, Holzgreve W, Henry G, Nicolaides KH. Maternal age- and gestation-specific risk for trisomy 21. <em>Ultrasound Obstet Gynecol.</em> 1999;13(3):167–170. doi:10.1046/j.1469-0823.1999.13030167.x</li>
              </ol>
            </div>

            <div className="space-y-2 pt-2">
              <p className="text-xs font-semibold text-gray-600 uppercase tracking-wide">IVF + PGT-A (Published Data)</p>
              <ol className="space-y-1 list-decimal list-inside" start={5}>
                <li>Reichman DE, Goldschlag D, Rosenwaks Z. Value of antimüllerian hormone as a prognostic indicator of in vitro fertilization outcome. <em>Fertil Steril.</em> 2014;101(4):1034–1040.e1. doi:10.1016/j.fertnstert.2013.12.039</li>
                <li>Romanski P, Aluko A, Bortoletto P, et al. Age-specific blastocyst conversion rates in embryo cryopreservation cycles. <em>Reprod Biomed Online.</em> 2022;45:432–439. doi:10.1016/j.rbmo.2022.04.009</li>
                <li>Franasiak JM, Forman EJ, Hong KH, et al. The nature of aneuploidy with increasing age of the female partner: a review of 15,169 consecutive trophectoderm biopsies evaluated with comprehensive chromosomal screening. <em>Fertil Steril.</em> 2014;101(3):656–663.e1. doi:10.1016/j.fertnstert.2013.11.004</li>
                <li>Yan J, Qin Y, Zhao H, et al. Live birth with or without preimplantation genetic testing for aneuploidy. <em>N Engl J Med.</em> 2021;385(22):2047–2058. doi:10.1056/NEJMoa2103613</li>
                <li>Lindner P, Flannagan K, Li HJ, et al. Live birth outcomes after euploid transfer: autologous vs. donor oocyte embryos in patients aged &gt; 35 years. <em>F S Rep.</em> 2025;6(4):462–469. doi:10.1016/j.xfre.2025.08.006</li>
              </ol>
            </div>

            <div className="space-y-2 pt-2">
              <p className="text-xs font-semibold text-gray-600 uppercase tracking-wide">IVF + PGT-A (UHFC Clinical Data)</p>
              <p className="text-xs text-gray-500">Oocyte retrieval and embryo development: University Hospitals Fertility Center clinical cohort, 2021–2025.</p>
            </div>

            <div className="space-y-2 pt-2">
              <p className="text-xs font-semibold text-gray-600 uppercase tracking-wide">AMH Reference</p>
              <ol className="space-y-1 list-decimal list-inside" start={10}>
                <li>Aslan K, Kasapoglu I, Kosan B, Tunali A, Tellioglu I, Uncu G. Age-stratified anti-Müllerian hormone (AMH) nomogram: a comprehensive cohort study including 22,920 women. <em>Front Endocrinol (Lausanne).</em> 2025;16:1612194. doi:10.3389/fendo.2025.1612194</li>
              </ol>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}

export default App;
