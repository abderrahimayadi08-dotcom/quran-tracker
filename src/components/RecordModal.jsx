import { useState, useEffect } from 'react';
import { useStore } from '../store';
import { todayStr, getLastPosition, calculateHizb, formatHizb, surahAyahStr, validatePosition } from '../utils';
import { AYAT_COUNT, SURAH_NAMES } from '../data/quran';

export default function RecordModal({ onClose, editDate }) {
  const { state, dispatch } = useStore();
  const { readings } = state;

  const existing = editDate ? readings[editDate] : null;

  const [date, setDate] = useState(editDate || todayStr());
  const [startSurah, setStartSurah] = useState(1);
  const [startAyah, setStartAyah] = useState(1);
  const [endSurah, setEndSurah] = useState(1);
  const [endAyah, setEndAyah] = useState(1);
  const [isZero, setIsZero] = useState(false);

  useEffect(() => {
    if (existing) {
      setStartSurah(existing.startSurah);
      setStartAyah(existing.startAyah);
      setEndSurah(existing.endSurah);
      setEndAyah(existing.endAyah);
      setIsZero(existing.isZero || false);
    } else {
      const last = getLastPosition(readings);
      if (last) {
        setStartSurah(last.surah);
        setStartAyah(last.ayah);
        setEndSurah(last.surah);
        setEndAyah(last.ayah);
      }
    }
  }, [editDate, existing]);

  useEffect(() => {
    if (existing) return;
    const existingForDate = readings[date];
    if (existingForDate) {
      setStartSurah(existingForDate.startSurah);
      setStartAyah(existingForDate.startAyah);
      setEndSurah(existingForDate.endSurah);
      setEndAyah(existingForDate.endAyah);
      setIsZero(existingForDate.isZero || false);
    } else {
      const last = getLastPosition(readings);
      if (last) {
        setStartSurah(last.surah);
        setStartAyah(last.ayah);
        setEndSurah(last.surah);
        setEndAyah(last.ayah);
      }
    }
  }, [date]);

  const hizb = isZero ? 0 : calculateHizb(startSurah, startAyah, endSurah, endAyah);

  function handleSave() {
    if (!isZero) {
      if (!validatePosition(startSurah, startAyah) || !validatePosition(endSurah, endAyah)) {
        alert('تأكد من صحة بيانات السورة والآية');
        return;
      }
      const start = startSurah * 1000 + startAyah;
      const end = endSurah * 1000 + endAyah;
      if (end < start) {
        alert('نهاية الورد يجب أن تكون بعد بدايته');
        return;
      }
    }
    dispatch({
      type: 'SET_READING',
      date,
      data: {
        date,
        startSurah,
        startAyah,
        endSurah,
        endAyah,
        hizb,
        isZero
      }
    });
    onClose();
  }

  function handleZero() {
    const newVal = !isZero;
    setIsZero(newVal);
    if (newVal) {
      const last = getLastPosition(readings);
      if (last) {
        setStartSurah(last.surah);
        setStartAyah(last.ayah);
        setEndSurah(last.surah);
        setEndAyah(last.ayah);
      }
    }
  }

  const surahOptions = [];
  for (let i = 1; i <= 114; i++) surahOptions.push(i);

  function ayahOptions(surah) {
    const count = AYAT_COUNT[surah] || 7;
    const opts = [];
    for (let i = 1; i <= count; i++) opts.push(i);
    return opts;
  }

  return (
    <div className="modal-overlay" onClick={(e) => { if (e.target === e.currentTarget) onClose(); }}>
      <div className="modal">
        <div className="modal-title">{editDate ? 'تعديل الورد' : 'تسجيل ورد'}</div>

        <div className="form-group">
          <label className="form-label">التاريخ</label>
          <input
            type="date"
            className="form-input"
            value={date}
            onChange={e => setDate(e.target.value)}
          />
        </div>

        <button className={`btn btn-zero ${isZero ? 'active' : ''}`} onClick={handleZero}>
          {isZero ? '✓ لم أقرأ (0 حزب)' : 'لم أقرأ'}
        </button>

        <div className="form-row">
          <div className="form-group">
            <label className="form-label">بداية الورد</label>
            <select className="form-input" value={startSurah} onChange={e => { setStartSurah(Number(e.target.value)); setStartAyah(1); }} disabled={isZero}>
              {surahOptions.map(s => <option key={s} value={s}>{SURAH_NAMES[s]}</option>)}
            </select>
            <select className="form-input" style={{ marginTop: 6 }} value={startAyah} onChange={e => setStartAyah(Number(e.target.value))} disabled={isZero}>
              {ayahOptions(startSurah).map(a => <option key={a} value={a}>{a}</option>)}
            </select>
          </div>

          <div className="form-group">
            <label className="form-label">نهاية الورد</label>
            <select className="form-input" value={endSurah} onChange={e => { setEndSurah(Number(e.target.value)); setEndAyah(1); }} disabled={isZero}>
              {surahOptions.map(s => <option key={s} value={s}>{SURAH_NAMES[s]}</option>)}
            </select>
            <select className="form-input" style={{ marginTop: 6 }} value={endAyah} onChange={e => setEndAyah(Number(e.target.value))} disabled={isZero}>
              {ayahOptions(endSurah).map(a => <option key={a} value={a}>{a}</option>)}
            </select>
          </div>
        </div>

        <div className="hizb-preview">
          {isZero ? '0 حزب' : `${formatHizb(hizb)} حزب`}
        </div>

        {!isZero && (
          <div style={{ fontSize: 'var(--text-xs)', color: 'var(--muted)', textAlign: 'center', marginBottom: 12 }}>
            من {surahAyahStr(startSurah, startAyah)} إلى {surahAyahStr(endSurah, endAyah)}
          </div>
        )}

        <button className="btn btn-primary" onClick={handleSave}>حفظ</button>
      </div>
    </div>
  );
}
