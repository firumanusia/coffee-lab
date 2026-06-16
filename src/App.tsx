import { useState, type ReactNode } from 'react'
import { Header } from './components/Header'
import { Modal } from './components/Modal'
import { BottomNav, type TabDef } from './components/BottomNav'
import { MobileResultBar } from './components/MobileResultBar'
import { Icons } from './components/icons'
import { useT } from './i18n/LanguageContext'
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
  { id: 'beans', icon: Icons.beans, label: 'navBeans' },
  { id: 'setup', icon: Icons.gear, label: 'navSetup' },
  { id: 'recipe', icon: Icons.recipe, label: 'navRecipe' },
  { id: 'brew', icon: Icons.results, label: 'navBrew' },
  { id: 'log', icon: Icons.log, label: 'navLog' },
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

/** A dashboard column that scrolls internally so the page itself never scrolls. */
function Col({ children }: { children: ReactNode }) {
  return <div className="flex min-h-0 flex-col gap-3 overflow-y-auto pr-1">{children}</div>
}

function DesktopDashboard({ store }: { store: BrewStore }) {
  const { t } = useT()
  const [modal, setModal] = useState<null | 'presets' | 'log'>(null)

  const actions = (
    <>
      <button className="btn-ghost px-3 py-1.5 text-xs" onClick={() => setModal('presets')}>
        <Icons.presets size={15} /> {t('secPresets')}
      </button>
      <button className="btn-ghost px-3 py-1.5 text-xs" onClick={() => setModal('log')}>
        <Icons.log size={15} /> {t('secLog')}
      </button>
    </>
  )

  return (
    <div className="flex h-screen flex-col overflow-hidden px-4 py-3">
      <Header compact actions={actions} />
      <main className="grid min-h-0 flex-1 grid-cols-2 grid-rows-2 gap-3 xl:grid-cols-4 xl:grid-rows-1">
        <Col>
          <BeansPanel store={store} />
          <WaterPanel store={store} />
        </Col>
        <Col>
          <GrindPanel store={store} />
          <GearPanel store={store} />
        </Col>
        <Col>
          <RecipePanel store={store} />
          <BrewTimer store={store} />
        </Col>
        <Col>
          <ResultCards store={store} />
        </Col>
      </main>

      {modal === 'presets' && (
        <Modal label={t('secPresets')} onClose={() => setModal(null)}>
          <PresetBar store={store} />
        </Modal>
      )}
      {modal === 'log' && (
        <Modal label={t('secLog')} onClose={() => setModal(null)}>
          <BrewLog store={store} />
        </Modal>
      )}
    </div>
  )
}

export default function App() {
  const store = useBrewStore()
  const isDesktop = useMediaQuery('(min-width: 1024px)')
  const [tab, setTab] = useState('beans')

  if (isDesktop) return <DesktopDashboard store={store} />

  return (
    <div className="mx-auto max-w-6xl px-4 py-6">
      <Header />
      <div className="pb-32">
        <TabContent tab={tab} store={store} />
      </div>

      <footer className="mt-8 pb-28 text-center text-[11px] text-coffee-500">
        <span className="font-semibold text-brand-red">MENOOWEL</span>{' '}
        <span className="text-brand-teal">BrewLab Studio</span> · prediksi adalah estimasi heuristik —
        gunakan TDS terukur untuk hasil akurat · data: SCA, Honest Coffee Guide, Third Wave Water
      </footer>

      <div className="fixed inset-x-0 bottom-0 z-40 mx-auto max-w-6xl">
        <MobileResultBar store={store} active={tab === 'brew'} onOpen={() => setTab('brew')} />
        <BottomNav tabs={TABS} active={tab} onSelect={setTab} />
      </div>
    </div>
  )
}
