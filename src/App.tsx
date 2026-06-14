import { Header } from './components/Header'
import { BeansPanel } from './components/panels/BeansPanel'
import { GearPanel } from './components/panels/GearPanel'
import { GrindPanel } from './components/panels/GrindPanel'
import { RecipePanel } from './components/panels/RecipePanel'
import { WaterPanel } from './components/panels/WaterPanel'
import { ResultCards } from './components/results/ResultCards'
import { BrewTimer } from './components/timer/BrewTimer'
import { PresetBar } from './components/presets/PresetBar'
import { BrewLog } from './components/log/BrewLog'
import { useBrewStore } from './store/useBrewStore'

export default function App() {
  const store = useBrewStore()

  return (
    <div className="mx-auto max-w-6xl px-4 py-6">
      <Header />

      <div className="grid grid-cols-1 gap-4 lg:grid-cols-[1.2fr_1fr]">
        {/* Inputs */}
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <BeansPanel store={store} />
          <WaterPanel store={store} />
          <GrindPanel store={store} />
          <GearPanel store={store} />
          <div className="sm:col-span-2">
            <RecipePanel store={store} />
          </div>
        </div>

        {/* Results + tools */}
        <div className="grid grid-cols-1 gap-4">
          <ResultCards store={store} />
          <BrewTimer store={store} />
          <PresetBar store={store} />
        </div>
      </div>

      <div className="mt-4">
        <BrewLog store={store} />
      </div>

      <footer className="mt-8 text-center text-[11px] text-coffee-500">
        BrewLab · prediksi adalah estimasi heuristik — gunakan TDS terukur untuk hasil akurat ·
        data: SCA, Honest Coffee Guide, Third Wave Water
      </footer>
    </div>
  )
}
