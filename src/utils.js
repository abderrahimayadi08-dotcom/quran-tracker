import { AYAT_COUNT, CUM_AYAT, HIZB_CUM_AYAT, SURAH_NAMES } from './data/quran';

export function todayStr() {
  const d = new Date();
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`;
}

export function cumAyah(surah, ayah) {
  if (surah < 1 || surah > 114) return 0;
  return CUM_AYAT[surah - 1] + ayah;
}

export function positionFromCumAyah(cum) {
  for (let s = 1; s <= 114; s++) {
    if (cum <= CUM_AYAT[s]) {
      return { surah: s, ayah: cum - CUM_AYAT[s - 1] };
    }
  }
  return { surah: 114, ayah: 6 };
}

export function hizbFromCumAyah(cum) {
  for (let i = HIZB_CUM_AYAT.length - 1; i >= 0; i--) {
    if (cum >= HIZB_CUM_AYAT[i]) {
      return i + (cum - HIZB_CUM_AYAT[i]) / (
        (i < HIZB_CUM_AYAT.length - 1 ? HIZB_CUM_AYAT[i + 1] : 6237) - HIZB_CUM_AYAT[i]
      );
    }
  }
  return 0;
}

export function calculateHizb(s1, a1, s2, a2) {
  const start = cumAyah(s1, a1);
  const end = cumAyah(s2, a2);
  if (end <= start) return 0;
  return hizbFromCumAyah(end) - hizbFromCumAyah(start);
}

export function formatHizb(n) {
  if (n === 0) return '0';
  const intPart = Math.floor(n);
  const frac = n - intPart;
  if (frac < 0.01) return String(intPart);
  const quarters = Math.round(frac * 4);
  if (quarters === 1) return `${intPart} ١/٤`;
  if (quarters === 2) return `${intPart} ١/٢`;
  if (quarters === 3) return `${intPart} ٣/٤`;
  return n % 1 === 0 ? String(intPart) : n.toFixed(1);
}

export function surahAyahStr(surah, ayah) {
  return `سورة ${SURAH_NAMES[surah]} الآية ${ayah}`;
}

export function getLastPosition(readings) {
  const dates = Object.keys(readings).sort();
  if (!dates.length) return null;
  const last = readings[dates[dates.length - 1]];
  if (last.isZero) return { surah: last.startSurah, ayah: last.startAyah };
  return { surah: last.endSurah, ayah: last.endAyah };
}

export function getMonthReadings(readings, year, month) {
  const prefix = `${year}-${String(month).padStart(2, '0')}`;
  return Object.keys(readings)
    .filter(d => d.startsWith(prefix))
    .sort()
    .map(d => ({ date: d, ...readings[d] }));
}

export function getMonthlyStatus(readings, year, month, target) {
  const items = getMonthReadings(readings, year, month);
  if (!items.length) return 0;
  let sum = 0;
  for (const r of items) sum += (r.hizb - target);
  return sum;
}

export function getChartData(readings, startDate, endDate, target) {
  const data = [];
  const start = new Date(startDate);
  const end = new Date(endDate);
  for (let d = new Date(start); d <= end; d.setDate(d.getDate() + 1)) {
    const key = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`;
    const r = readings[key];
    data.push({
      date: `${d.getMonth() + 1}/${d.getDate()}`,
      hizb: r ? r.hizb : 0,
      target
    });
  }
  return data;
}

export function getMonthlyChartData(readings, year, target) {
  const data = [];
  for (let m = 1; m <= 12; m++) {
    const status = getMonthlyStatus(readings, year, m, target);
    data.push({
      month: m,
      name: ['', 'يناير', 'فبراير', 'مارس', 'أبريل', 'مايو', 'يونيو',
        'يوليو', 'أغسطس', 'سبتمبر', 'أكتوبر', 'نوفمبر', 'ديسمبر'][m],
      status,
      target: 0
    });
  }
  return data;
}

export function getFirstDayOfMonth(year, month) {
  return `${year}-${String(month).padStart(2, '0')}-01`;
}

export function getLastDayOfMonth(year, month) {
  const last = new Date(year, month, 0).getDate();
  return `${year}-${String(month).padStart(2, '0')}-${String(last).padStart(2, '0')}`;
}

export function validatePosition(surah, ayah) {
  if (surah < 1 || surah > 114) return false;
  if (ayah < 1 || ayah > AYAT_COUNT[surah]) return false;
  return true;
}

export function getDayName(dateStr) {
  const days = ['الأحد', 'الإثنين', 'الثلاثاء', 'الأربعاء', 'الخميس', 'الجمعة', 'السبت'];
  return days[new Date(dateStr).getDay()];
}

export function getMonthName(m) {
  return ['', 'يناير', 'فبراير', 'مارس', 'أبريل', 'مايو', 'يونيو',
    'يوليو', 'أغسطس', 'سبتمبر', 'أكتوبر', 'نوفمبر', 'ديسمبر'][m];
}
