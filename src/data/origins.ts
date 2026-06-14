import type { Origin } from './types'

/** Reference starter set — easily extendable. */
export const ORIGINS: Origin[] = [
  { id: 'ethiopia', name: 'Ethiopia', varieties: ['Heirloom', 'Wolisho', 'Dega', 'Kurume', '74110', '74158'], flavor: { id: 'Floral, citrus, teh, bergamot.', en: 'Floral, citrus, tea-like, bergamot.' } },
  { id: 'kenya', name: 'Kenya', varieties: ['SL28', 'SL34', 'Ruiru 11', 'Batian'], flavor: { id: 'Blackcurrant, tomat, asam tajam.', en: 'Blackcurrant, tomato, sharp acidity.' } },
  { id: 'colombia', name: 'Colombia', varieties: ['Caturra', 'Castillo', 'Pink Bourbon', 'Geisha', 'Tabi'], flavor: { id: 'Karamel, jeruk, body seimbang.', en: 'Caramel, citrus, balanced body.' } },
  { id: 'panama', name: 'Panama', varieties: ['Geisha', 'Caturra', 'Catuai'], flavor: { id: 'Jasmine, bergamot, sangat floral.', en: 'Jasmine, bergamot, intensely floral.' } },
  { id: 'guatemala', name: 'Guatemala', varieties: ['Bourbon', 'Caturra', 'Pacamara', 'Catuai'], flavor: { id: 'Cokelat, rempah, apel.', en: 'Chocolate, spice, apple.' } },
  { id: 'brazil', name: 'Brazil', varieties: ['Yellow Bourbon', 'Catuai', 'Mundo Novo', 'Acaia'], flavor: { id: 'Kacang, cokelat, low acid, nutty.', en: 'Nutty, chocolate, low acid.' } },
  { id: 'costa-rica', name: 'Costa Rica', varieties: ['Caturra', 'Catuai', 'Villa Sarchi'], flavor: { id: 'Manis, jeruk, clean.', en: 'Sweet, citrus, clean.' } },
  { id: 'indonesia', name: 'Indonesia', varieties: ['Sigararutang', 'Ateng', 'Typica', 'Andungsari', 'Lini S', 'Gayo'], flavor: { id: 'Earthy, herbal, body tebal (Sumatra); manis cerah (Java Preanger).', en: 'Earthy, herbal, full body (Sumatra); bright sweet (Java).' } },
  { id: 'rwanda', name: 'Rwanda', varieties: ['Red Bourbon', 'Jackson'], flavor: { id: 'Red fruit, floral, juicy.', en: 'Red fruit, floral, juicy.' } },
  { id: 'yemen', name: 'Yemen', varieties: ['Udaini', 'Dawairi', 'Tuffahi'], flavor: { id: 'Buah kering, cokelat, rempah, wine.', en: 'Dried fruit, chocolate, spice, wine.' } },
  { id: 'burundi', name: 'Burundi', varieties: ['Red Bourbon', 'Jackson', 'Mibirizi'], flavor: { id: 'Floral, jeruk, juicy, clean.', en: 'Floral, citrus, juicy, clean.' } },
  { id: 'tanzania', name: 'Tanzania', varieties: ['Bourbon', 'Kent', 'N39', 'Blue Mountain'], flavor: { id: 'Blackcurrant, jeruk, body sirup.', en: 'Blackcurrant, citrus, syrupy body.' } },
  { id: 'el-salvador', name: 'El Salvador', varieties: ['Bourbon', 'Pacas', 'Pacamara'], flavor: { id: 'Manis, karamel, almond, lembut.', en: 'Sweet, caramel, almond, soft.' } },
  { id: 'honduras', name: 'Honduras', varieties: ['Catuai', 'Lempira', 'Parainema', 'IHCAFE 90'], flavor: { id: 'Cokelat, kacang, buah merah.', en: 'Chocolate, nutty, red fruit.' } },
  { id: 'peru', name: 'Peru', varieties: ['Typica', 'Bourbon', 'Caturra'], flavor: { id: 'Manis lembut, cokelat susu, mild.', en: 'Soft sweetness, milk chocolate, mild.' } },
  { id: 'mexico', name: 'Mexico', varieties: ['Typica', 'Bourbon', 'Mundo Novo', 'Garnica'], flavor: { id: 'Cokelat, kacang, gula merah.', en: 'Chocolate, nutty, brown sugar.' } },
  { id: 'bolivia', name: 'Bolivia', varieties: ['Caturra', 'Catuai', 'Java', 'Geisha'], flavor: { id: 'Floral lembut, manis, clean.', en: 'Soft floral, sweet, clean.' } },
  { id: 'india', name: 'India', varieties: ['S795', 'Kent', 'Cauvery', 'SLN 9'], flavor: { id: 'Rempah, body tebal, low acid (monsooned).', en: 'Spice, full body, low acid (monsooned).' } },
  { id: 'china', name: 'China (Yunnan)', varieties: ['Catimor', 'Typica', 'Bourbon'], flavor: { id: 'Cokelat, kacang, buah lembut.', en: 'Chocolate, nutty, soft fruit.' } },
  { id: 'thailand', name: 'Thailand', varieties: ['Catimor', 'Typica', 'Chiang Mai'], flavor: { id: 'Cokelat, jeruk, manis bunga.', en: 'Chocolate, citrus, floral sweetness.' } },
  { id: 'png', name: 'Papua New Guinea', varieties: ['Typica', 'Bourbon', 'Arusha'], flavor: { id: 'Buah tropis, herbal, body penuh.', en: 'Tropical fruit, herbal, full body.' } },
  { id: 'other', name: 'Other / Lainnya', varieties: ['Unknown', 'Blend'], flavor: { id: 'Bervariasi.', en: 'Varies.' } },
]
