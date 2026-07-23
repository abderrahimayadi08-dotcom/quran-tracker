import { useState, useRef } from 'react';
import { useStore } from '../store';

export default function SettingsPage({ onBack }) {
  const { state, dispatch } = useStore();
  const { settings } = state;
  const [target, setTarget] = useState(settings.targetHizb);
  const fileRef = useRef();

  function handleSaveTarget() {
    const val = parseFloat(target);
    if (isNaN(val) || val <= 0) {
      alert('أدخل صيغة حزب صحيحة');
      return;
    }
    dispatch({ type: 'SET_TARGET', targetHizb: val });
    alert('تم الحفظ');
  }

  function handleExport() {
    const data = JSON.stringify({ readings: state.readings, settings: state.settings }, null, 2);
    const blob = new Blob([data], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `quran-tracker-backup-${new Date().toISOString().slice(0, 10)}.json`;
    a.click();
    URL.revokeObjectURL(url);
  }

  function handleImport(e) {
    const file = e.target.files[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (ev) => {
      try {
        const data = JSON.parse(ev.target.result);
        if (!data.readings || !data.settings) throw new Error('Invalid');
        dispatch({ type: 'IMPORT_DATA', data });
        alert('تم الاستيراد بنجاح');
        setTarget(data.settings.targetHizb);
      } catch {
        alert('الملف غير صالح');
      }
    };
    reader.readAsText(file);
    e.target.value = '';
  }

  return (
    <div style={{ marginBottom: 80 }}>
      <div className="settings-group">
        <label className="settings-label">معدل الورد اليومي (حزب)</label>
        <div style={{ display: 'flex', gap: 8 }}>
          <input
            type="number"
            className="settings-input"
            value={target}
            onChange={e => setTarget(e.target.value)}
            step="0.5"
            min="0.5"
          />
          <button className="btn btn-primary" style={{ width: 'auto', padding: '10px 20px' }} onClick={handleSaveTarget}>حفظ</button>
        </div>
      </div>

      <div className="settings-group">
        <button className="settings-btn primary" onClick={handleExport}>تصدير نسخة احتياطية (JSON)</button>
        <button className="settings-btn" onClick={() => fileRef.current.click()}>استيراد نسخة احتياطية</button>
        <input ref={fileRef} type="file" accept=".json" style={{ display: 'none' }} onChange={handleImport} />
      </div>
    </div>
  );
}
