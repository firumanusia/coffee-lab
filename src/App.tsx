import { useState } from 'react'
import { Header } from './components/Header'
import { BottomNav, type TabDef } from './components/BottomNav'
import { MobileResultBar } from './components/MobileResultBar'
import { BeansPanel } from './components/panels/BeansPanel'
import { GearPanel } from './components/panels/GearPanel'
import { GrindPanel } from './components/panels/GrindPanel'
import { RecipePanel } from './components/panels/RecipePanel'
import { WaterPanel } from './components/panels/WaterPanel'
import { ResultCards } from './components/results/ResultCards'
import { BrewTimer } from './components/timer/BrewTimer'
import { PresetBar } from './components/presets/PresetBar'
import { BrewLog } from './components/log/BrewLog'
import { useMediaQuery } from './hooks/useMediaQuery'
import { useBrewStore, type BrewStore } from './store/useBrewStore'

const TABS: TabDef[] = [
  { id: 'beans', icon: '🌱', label: 'navBeans' },
  { id: 'setup', icon: '⚙️', label: 'navSetup' },
  { id: 'recipe', icon: '📋', label: 'navRecipe' },
  { id: 'brew', icon: '📈', label: 'navBrew' },
  { id: 'log', icon: '📖', label: 'navLog' },
]

function TabContent({ tab, store }: { tab: string; store: BrewStore }) {
  switch (tab) {
    case 'beans':
      return <BeansPanel store={store} />
    case 'setup':
      return (
        <div className="space-y-4">
          <WaterPanel store={store} />
          <GrindPanel store={store} />
          <GearPanel store={store} />
        </div>
      )
    case 'recipe':
      return (
        <div className="space-y-4">
          <RecipePanel store={store} />
          <PresetBar store={store} />
        </div>
      )
    case 'brew':
      return (
        <div className="space-y-4">
          <ResultCards store={store} />
          <BrewTimer store={store} />
        </div>
      )
    case 'log':
      return <BrewLog store={store} />
    default:
      return null
  }
}

export default function App() {
  const store = useBrewStore()
  const isDesktop = useMediaQuery('(min-width: 1024px)')
  const [tab, setTab] = useState('beans')

  return (
    <div className="mx-auto max-w-6xl px-4 py-6">
      <Header />

      {isDesktop ? (
        <>
          <div className="grid grid-cols-1 gap-4 lg:grid-cols-[1.2fr_1fr]">
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              <BeansPanel store={store} />
              <WaterPanel store={store} />
              <GrindPanel store={store} />
              <GearPanel store={store} />
              <div className="sm:col-span-2">
                <RecipePanel store={store} />
              </div>
            </div>
            <div className="grid grid-cols-1 gap-4">
              <ResultCards store={store} />
              <BrewTimer store={store} />
              <PresetBar store={store} />
            </div>
          </div>
          <div className="mt-4">
            <BrewLog store={store} />
          </div>
        </>
      ) : (
        <div className="pb-32">
          <TabContent tab={tab} store={store} />
        </div>
      )}

      <footer className="mt-8 pb-28 text-center text-[11px] text-coffee-500 lg:pb-0">
        BrewLab · prediksi adalah estimasi heuristik — gunakan TDS terukur untuk hasil akurat ·
        data: SCA, Honest Coffee Guide, Third Wave Water
      </footer>

      {!isDesktop && (
        <div className="fixed inset-x-0 bottom-0 z-40 mx-auto max-w-6xl">
          <MobileResultBar store={store} active={tab === 'brew'} onOpen={() => setTab('brew')} />
          <BottomNav tabs={TABS} active={tab} onSelect={setTab} />
        </div>
      )}
    </div>
  )
}
