import {
  Bean,
  Droplets,
  Settings2,
  Cog,
  FlaskConical,
  ScrollText,
  LineChart,
  Timer,
  Star,
  BookOpen,
  Sun,
  Moon,
  type LucideIcon,
} from 'lucide-react'

/**
 * Line-art (sketch-style) icons from Lucide (ISC licensed, free).
 * Centralized so panels/nav share one consistent set.
 */
export const Icons = {
  beans: Bean,
  water: Droplets,
  grind: Settings2,
  gear: Cog,
  recipe: ScrollText,
  results: LineChart,
  timer: Timer,
  presets: Star,
  log: BookOpen,
  flask: FlaskConical,
  sun: Sun,
  moon: Moon,
} satisfies Record<string, LucideIcon>

export type { LucideIcon }
