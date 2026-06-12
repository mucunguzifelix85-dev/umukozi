export const PROVINCES = [
  'Kigali City (Umujyi wa Kigali)',
  'Northern Province (Amajyaruguru)',
  'Eastern Province (Iburasirazuba)',
  'Southern Province (Amajyepfo)',
  'Western Province (Iburengerazuba)'
];

export const DISTRICTS: Record<string, string[]> = {
  'Kigali City (Umujyi wa Kigali)': ['Gasabo', 'Kicukiro', 'Nyarugenge'],
  'Northern Province (Amajyaruguru)': ['Musanze', 'Gicumbi', 'Burera', 'Gakenke', 'Rulindo'],
  'Eastern Province (Iburasirazuba)': ['Rwamagana', 'Nyagatare', 'Kayonza', 'Gatsibo', 'Bugesera', 'Kirehe', 'Ngoma'],
  'Southern Province (Amajyepfo)': ['Huye', 'Muhanga', 'Kamonyi', 'Nyanza', 'Ruhango', 'Gisagara', 'Nyamagabe', 'Nyaruguru'],
  'Western Province (Iburengerazuba)': ['Rubavu', 'Rusizi', 'Karongi', 'Rutsiro', 'Nyabihu', 'Ngororero', 'Nyamasheke']
};

export const SECTORS: Record<string, string[]> = {
  // Gasabo
  'Gasabo': ['Kacyiru', 'Kimironko', 'Remera', 'Kinyinya', 'Gisozi', 'Bumbogo', 'Gatsata', 'Jabana'],
  // Kicukiro
  'Kicukiro': ['Kanombe', 'Gikondo', 'Kagarama', 'Nyarugunga', 'Kicukiro', 'Masaka', 'Niboye'],
  // Nyarugenge
  'Nyarugenge': ['Kiyovu', 'Nyarugenge', 'Nyamirambo', 'Kimisagara', 'Gitega', 'Malingati', 'Rwezamenyo'],
  // Musanze
  'Musanze': ['Muhoza', 'Kimonyi', 'Ruhengeri', 'Gacaca', 'Busogo', 'Cyuve'],
  // Gicumbi
  'Gicumbi': ['Byumba', 'Kageyo', 'Manyagiro', 'Muko'],
  // Burera
  'Burera': ['Cyeru', 'Gahunga', 'Rugarama'],
  // Rwamagana
  'Rwamagana': ['Kigabiro', 'Muhazi', 'Gishari', 'Fumbwe'],
  // Huye
  'Huye': ['Ngoma', 'Tumba', 'Mukura', 'Huye', 'Gishamvu'],
  // Muhanga
  'Muhanga': ['Nyamabuye', 'Shyogwe', 'Cyeza'],
  // Rubavu
  'Rubavu': ['Gisenyi', 'Rubavu', 'Rugerero', 'Nyamyumba'],
  // Rusizi
  'Rusizi': ['Kamembe', 'Gihundwe', 'Mururu']
};

export const CELLS: Record<string, string[]> = {
  // Gasabo - Kacyiru
  'Kacyiru': ['Kamatamu', 'Kamutwa', 'Kibaza'],
  // Gasabo - Kimironko
  'Kimironko': ['Kibagabaga', 'Nyagatovu', 'Bibare'],
  // Gasabo - Remera
  'Remera': ['Rukiri I', 'Rukiri II', 'Nyabisindu'],
  // Gasabo - Kinyinya
  'Kinyinya': ['Kagugu', 'Gasharu', 'Murama'],
  // Gasabo - Gisozi
  'Gisozi': ['Ruhango', 'Musezero'],
  
  // Kicukiro - Kanombe
  'Kanombe': ['Kabeza', 'Rubirizi', 'Karama'],
  // Kicukiro - Gikondo
  'Gikondo': ['Kanserege', 'Kiba', 'Mburabuturo'],
  // Kicukiro - Kagarama
  'Kagarama': ['Muyange', 'Kagarama'],
  
  // Nyarugenge - Kiyovu
  'Kiyovu': ['Kiyovu', 'Rugenge'],
  // Nyarugenge - Nyarugenge
  'Nyarugenge': ['Kiyovu', 'Agatare', 'Biryogo'],
  // Nyarugenge - Nyamirambo
  'Nyamirambo': ['Rutaraka', 'Kivugiza', 'Nyamirambo'],
  
  // Musanze - Muhoza
  'Muhoza': ['Ruhengeri', 'Mpenge', 'Kigombe'],
  'Kimonyi': ['Biryi', 'Buruba'],
  'Ruhengeri': ['Ruhengeri', 'Muhoza'],
  
  // Rwamagana - Kigabiro
  'Kigabiro': ['Sibagire', 'Kigabiro', 'Nyagasambu'],
  
  // Huye - Ngoma
  'Ngoma': ['Matyazo', 'Ngoma', 'Butare'],
  'Tumba': ['Gitwa', 'Cyarwa', 'Tumba'],
  
  // Rubavu - Gisenyi
  'Gisenyi': ['Bugoyi', 'Amahoro', 'Nengo'],
  'Rubavu': ['Murara', 'Rubavu', 'Gisa']
};

// Returns a deterministic list of sectors/cells for districts we didn't explicitly map above
// to guarantee the dropdowns are never empty.
export function getSectorsForDistrict(district: string): string[] {
  if (SECTORS[district]) {
    return SECTORS[district];
  }
  // Fallbacks based on typical Rwandan naming
  return [
    `${district} Central`,
    `${district} North`,
    `${district} South`,
    `Kavumu`,
    `Gatenga`
  ];
}

export function getCellsForSector(sector: string): string[] {
  if (CELLS[sector]) {
    return CELLS[sector];
  }
  // Dynamic fallback cells
  return [
    `${sector} Cell A`,
    `${sector} Cell B`,
    `Ubumwe`,
    `Amahoro`,
    `Iterambere`
  ];
}

