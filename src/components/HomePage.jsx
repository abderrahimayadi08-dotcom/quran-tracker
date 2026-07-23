import { useState, useMemo } from 'react';
import { useStore } from '../store';
import { todayStr, getLastPosition, getMonthReadings, getMonthlyStatus, getChartData, getMonthlyChartData, getFirstDayOfMonth, getLastDayOfMonth, formatHizb, surahAyahStr, getDayName, getMonthName } from '../utils';
import Chart from './Chart';
import RecordModal from './RecordModal';
import ReadingCard from './ReadingCard';

export default function HomePage({ onSettings }) {
  const { state, dispatch } = useStore();
  const { readings, settings } = state;

  const now = new Date();
  const [selectedMonth, setSelectedMonth] = useState(now.getMonth() + 1);
  const [selectedYear, setSelectedYear] = useState(now.getFullYear());
  const [showModal, setShowModal] = useState(false);
  const [chartMode, setChartMode] = useState('daily');
  const [editingDate, setEditingDate] = useState(null);

  const lastPos = getLastPosition(readings);

  const lastReading = useMemo(() => {
    const dates = Object.keys(readings).sort();
    if (!dates.length) return null;
    return readings[dates[dates.length - 1]];
  }, [readings]);

  const monthReadings = useMemo(
    () => getMonthReadings(readings, selectedYear, selectedMonth),
    [readings, selectedYear, selectedMonth]
  );

  const monthStatus = useMemo(
    () => getMonthlyStatus(readings, selectedYear, selectedMonth, settings.targetHizb),
    [readings, selectedYear, selectedMonth, settings.targetHizb]
  );

  const chartData = useMemo(() => {
    if (chartMode === 'daily') {
      return getChartData(
        readings,
        getFirstDayOfMonth(selectedYear, selectedMonth),
        getLastDayOfMonth(selectedYear, selectedMonth),
        settings.targetHizb
      );
    }
    if (chartMode === 'monthly') {
      return getMonthlyChartData(readings, selectedYear, settings.targetHizb);
    }
    return [];
  }, [readings, chartMode, selectedYear, selectedMonth, settings.targetHizb]);

  function handleDelete(date) {
    if (window.confirm('هل أنت متأكد من حذف هذا الورد؟')) {
      dispatch({ type: 'DELETE_READING', date });
    }
  }

  function handleEdit(date) {
    setEditingDate(date);
    setShowModal(true);
  }

  function handleCloseModal() {
    setShowModal(false);
    setEditingDate(null);
  }

  const months = [];
  for (let m = 1; m <= 12; m++) months.push(m);

  return (
    <div>
      <div className="header">
        <div className="header-label">آخر ورد مسجل</div>
        {lastPos ? (
          <div className="header-position">{surahAyahStr(lastPos.surah, lastPos.ayah)}</div>
        ) : (
          <div className="header-position-empty">لم تسجل أي ورد بعد</div>
        )}
      </div>

      <div className="chart-container">
        <div className="chart-controls">
          <button className={`chart-btn ${chartMode === 'daily' ? 'active' : ''}`} onClick={() => setChartMode('daily')}>يومي</button>
          <button className={`chart-btn ${chartMode === 'monthly' ? 'active' : ''}`} onClick={() => setChartMode('monthly')}>شهري</button>
        </div>

        {chartMode === 'daily' && (
          <div className="year-nav">
            <button className="year-nav-btn" onClick={() => { if (selectedMonth === 1) { setSelectedMonth(12); setSelectedYear(y => y - 1); } else setSelectedMonth(m => m - 1); }}>◀</button>
            <span className="year-label">{getMonthName(selectedMonth)} {selectedYear}</span>
            <button className="year-nav-btn" onClick={() => { if (selectedMonth === 12) { setSelectedMonth(1); setSelectedYear(y => y + 1); } else setSelectedMonth(m => m + 1); }}>▶</button>
          </div>
        )}

        {chartMode === 'monthly' && (
          <div className="year-nav">
            <button className="year-nav-btn" onClick={() => setSelectedYear(y => y - 1)}>◀</button>
            <span className="year-label">{selectedYear}</span>
            <button className="year-nav-btn" onClick={() => setSelectedYear(y => y + 1)}>▶</button>
          </div>
        )}

        <Chart data={chartData} target={settings.targetHizb} mode={chartMode} />
      </div>

      {chartMode === 'daily' && (
        <>
          <div className={`month-status ${monthStatus > 0 ? 'positive' : monthStatus < 0 ? 'negative' : monthReadings.length ? 'zero' : 'empty'}`}>
            {monthReadings.length === 0 ? 'لا يوجد ورد مسجل' :
              monthStatus > 0 ? `تم +%${formatHizb(monthStatus)}` :
              monthStatus < 0 ? `بقي ${formatHizb(Math.abs(monthStatus))} حزب` :
              'تم الورد بالكامل'}
          </div>

          {monthReadings.length === 0 ? (
            <div className="empty-state">لا يوجد ورد مسجل في هذا الشهر</div>
          ) : (
            monthReadings.map(r => (
              <ReadingCard
                key={r.date}
                reading={r}
                target={settings.targetHizb}
                onEdit={() => handleEdit(r.date)}
                onDelete={() => handleDelete(r.date)}
              />
            ))
          )}
        </>
      )}

      <button className="fab" onClick={() => setShowModal(true)}>
        + تسجيل ورد اليوم
      </button>

      {showModal && (
        <RecordModal
          onClose={handleCloseModal}
          editDate={editingDate}
        />
      )}
    </div>
  );
}
