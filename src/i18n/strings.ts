export type Lang = 'id' | 'en'

type Dict = Record<string, { id: string; en: string }>

export const STR: Dict = {
  appTitle: { id: 'MENOOWEL', en: 'MENOOWEL' },
  appTagline: {
    id: 'BrewLab Studio — atur variabel, prediksi hasil, catat seduhan.',
    en: 'BrewLab Studio — tune variables, predict results, log your brews.',
  },

  // sections
  secWater: { id: 'Air & Suhu', en: 'Water & Temp' },
  secGrind: { id: 'Gilingan', en: 'Grind' },
  secBeans: { id: 'Biji Kopi', en: 'Beans' },
  secDripper: { id: 'Dripper', en: 'Dripper' },
  secFilter: { id: 'Kertas Filter', en: 'Paper Filter' },
  secRecipe: { id: 'Resep & Tuangan', en: 'Recipe & Pours' },
  secResults: { id: 'Prediksi Hasil', en: 'Predicted Results' },
  secChart: { id: 'SCA Brewing Control Chart', en: 'SCA Brewing Control Chart' },
  secTimer: { id: 'Timer Seduh', en: 'Brew Timer' },
  secPresets: { id: 'Preset', en: 'Presets' },
  secLog: { id: 'Riwayat Seduh', en: 'Brew Log' },

  // water
  waterBrand: { id: 'Merek air', en: 'Water brand' },
  waterTemp: { id: 'Suhu air', en: 'Water temperature' },
  mineralProfile: { id: 'Profil mineral (SCA)', en: 'Mineral profile (SCA)' },
  totalHardness: { id: 'Kesadahan total', en: 'Total hardness' },
  alkalinity: { id: 'Alkalinitas', en: 'Alkalinity' },
  tdsWater: { id: 'TDS air', en: 'Water TDS' },
  tempHintLight: {
    id: 'Roast terang butuh suhu lebih tinggi untuk ekstraksi cukup.',
    en: 'Lighter roasts need higher temps for adequate extraction.',
  },
  tempHintDark: {
    id: 'Roast gelap lebih larut — turunkan suhu agar tidak pahit.',
    en: 'Dark roasts dissolve faster — lower the temp to avoid bitterness.',
  },

  // grind
  grinderType: { id: 'Jenis grinder', en: 'Grinder type' },
  hand: { id: 'Manual', en: 'Hand' },
  electric: { id: 'Elektrik', en: 'Electric' },
  grinderModel: { id: 'Model grinder', en: 'Grinder model' },
  targetMicron: { id: 'Target micron', en: 'Target micron' },
  suggestedSetting: { id: 'Saran klik/setelan', en: 'Suggested setting' },
  micron: { id: 'micron', en: 'micron' },
  category: { id: 'Kategori', en: 'Category' },
  clicks: { id: 'Klik', en: 'Clicks' },
  stepless: { id: 'Stepless', en: 'Stepless' },
  range: { id: 'Rentang', en: 'Range' },

  // beans
  origin: { id: 'Asal (origin)', en: 'Origin' },
  region: { id: 'Region', en: 'Region' },
  variety: { id: 'Varietas', en: 'Variety' },
  process: { id: 'Proses pasca panen', en: 'Post-harvest process' },
  roastLevel: { id: 'Roast (Agtron)', en: 'Roast (Agtron)' },
  flavorTendency: { id: 'Kecenderungan rasa', en: 'Flavor tendency' },
  elevation: { id: 'Elevasi', en: 'Elevation' },
  roastIdeal: { id: 'Roast ideal', en: 'Ideal roast' },

  // dripper / filter
  dripperType: { id: 'Tipe', en: 'Type' },
  conical: { id: 'Conical', en: 'Conical' },
  flat: { id: 'Flat bottom', en: 'Flat bottom' },
  hybrid: { id: 'Hybrid/lainnya', en: 'Hybrid/other' },
  flowSpeed: { id: 'Kecepatan aliran', en: 'Flow speed' },
  characteristics: { id: 'Karakteristik', en: 'Characteristics' },
  thickness: { id: 'Ketebalan', en: 'Thickness' },
  immersion: { id: 'Immersion', en: 'Immersion' },

  // recipe
  dose: { id: 'Dosis kopi', en: 'Coffee dose' },
  ratio: { id: 'Rasio', en: 'Ratio' },
  totalWater: { id: 'Total air', en: 'Total water' },
  flowRate: { id: 'Flow rate target', en: 'Target flow rate' },
  pours: { id: 'Tuangan', en: 'Pours' },
  pourStyle: { id: 'Gaya tuang', en: 'Pour style' },
  pourTime: { id: 'Waktu (s)', en: 'Time (s)' },
  pourWater: { id: 'Air (g)', en: 'Water (g)' },
  switchTiming: { id: 'Timing switch (immersion)', en: 'Switch timing (immersion)' },
  switchClose: { id: 'Tutup switch', en: 'Close switch' },
  switchOpen: { id: 'Buka switch', en: 'Open switch' },
  switchHint: {
    id: 'Tutup = steep/immersion; buka = mulai drawdown. Kosongkan bila tidak dipakai.',
    en: 'Close = steep/immersion; open = start drawdown. Leave empty if unused.',
  },
  addPour: { id: '+ Tambah tuangan', en: '+ Add pour' },
  resetPours: { id: 'Reset bagi rata', en: 'Reset even split' },
  fixedRecipe: { id: 'Resep tetap (preset juara)', en: 'Fixed recipe (champion preset)' },
  editableRecipe: { id: 'Resep custom — tuangan bisa diubah', en: 'Custom recipe — pours editable' },
  pourAt: { id: 'pada', en: 'at' },
  cumulative: { id: 'kumulatif', en: 'cumulative' },

  // results
  yield: { id: 'Yield (hasil)', en: 'Yield' },
  tds: { id: 'TDS', en: 'TDS' },
  ey: { id: 'Extraction Yield', en: 'Extraction Yield' },
  predicted: { id: 'Prediksi', en: 'Predicted' },
  measured: { id: 'Terukur', en: 'Measured' },
  estimateNote: {
    id: '⚠︎ Angka prediksi masih estimasi sementara — menunggu kalibrasi dari pendekar. Pakai TDS terukur untuk hasil akurat.',
    en: '⚠︎ Predicted values are provisional estimates — pending expert calibration. Use measured TDS for accurate results.',
  },
  measuredTds: { id: 'TDS terukur (refraktometer)', en: 'Measured TDS (refractometer)' },
  measuredYield: { id: 'Yield terukur', en: 'Measured yield' },
  useMeasured: { id: 'Pakai data terukur', en: 'Use measured data' },
  brewTime: { id: 'Estimasi waktu', en: 'Estimated time' },
  verdict: { id: 'Penilaian', en: 'Verdict' },
  underExtracted: { id: 'Under-extracted', en: 'Under-extracted' },
  ideal: { id: 'Ideal (gold cup)', en: 'Ideal (gold cup)' },
  overExtracted: { id: 'Over-extracted', en: 'Over-extracted' },
  weak: { id: 'Encer', en: 'Weak' },
  strong: { id: 'Kuat', en: 'Strong' },

  // timer
  start: { id: 'Mulai', en: 'Start' },
  pause: { id: 'Jeda', en: 'Pause' },
  reset: { id: 'Reset', en: 'Reset' },
  now: { id: 'Sekarang', en: 'Now' },
  nextPour: { id: 'Tuangan berikutnya', en: 'Next pour' },
  done: { id: 'Selesai', en: 'Done' },

  // presets
  savePreset: { id: 'Simpan sebagai preset', en: 'Save as preset' },
  presetName: { id: 'Nama preset', en: 'Preset name' },
  save: { id: 'Simpan', en: 'Save' },
  load: { id: 'Muat', en: 'Load' },
  delete: { id: 'Hapus', en: 'Delete' },
  builtIn: { id: 'Bawaan', en: 'Built-in' },
  myPresets: { id: 'Preset saya', en: 'My presets' },
  championPresets: { id: 'Resep juara/influencer', en: 'Champion / influencer recipes' },
  noPresets: { id: 'Belum ada preset tersimpan.', en: 'No saved presets yet.' },

  // log
  logBrew: { id: 'Catat seduhan ini', en: 'Log this brew' },
  rating: { id: 'Skor keseluruhan', en: 'Overall rating' },
  tastingNotes: { id: 'Tasting notes', en: 'Tasting notes' },
  tastingNotesPh: {
    id: 'mis. floral, citrus, cokelat, juicy...',
    en: 'e.g. floral, citrus, chocolate, juicy...',
  },
  body: { id: 'Body', en: 'Body' },
  acidity: { id: 'Asiditas', en: 'Acidity' },
  sweetness: { id: 'Manis', en: 'Sweetness' },
  notes: { id: 'Catatan & ide perbaikan', en: 'Notes & improvement ideas' },
  notesPh: {
    id: 'Apa yang bisa diubah agar lebih enak? (giling, suhu, rasio...)',
    en: 'What to change next time? (grind, temp, ratio...)',
  },
  suggestions: { id: 'Saran otomatis', en: 'Auto suggestions' },
  saveLog: { id: 'Simpan catatan', en: 'Save log' },
  noLogs: { id: 'Belum ada riwayat seduh.', en: 'No brews logged yet.' },
  loadConfig: { id: 'Muat setelan', en: 'Load setup' },

  low: { id: 'rendah', en: 'low' },
  high: { id: 'tinggi', en: 'high' },
  cancel: { id: 'Batal', en: 'Cancel' },

  // mobile bottom-nav tabs
  navBeans: { id: 'Biji', en: 'Beans' },
  navSetup: { id: 'Setup', en: 'Setup' },
  navRecipe: { id: 'Resep', en: 'Recipe' },
  navBrew: { id: 'Seduh', en: 'Brew' },
  navLog: { id: 'Riwayat', en: 'Log' },
}
