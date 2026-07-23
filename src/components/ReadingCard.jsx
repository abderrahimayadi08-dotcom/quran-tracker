import { formatHizb, surahAyahStr, getDayName } from '../utils';

export default function ReadingCard({ reading, target, onEdit, onDelete }) {
  const diff = reading.hizb - target;
  const statusClass = diff > 0 ? 'over' : diff < 0 ? 'short' : 'done';
  const statusText = reading.isZero
    ? 'لم يُقرأ شيء'
    : diff > 0 ? `قراءة فوق وردك: ${formatHizb(diff)}`
    : diff < 0 ? `تبقى على تمام وردك: ${formatHizb(Math.abs(diff))}`
    : 'تم الورد بالكامل';

  return (
    <div className="reading-card" onClick={onEdit} style={{ cursor: 'pointer' }}>
      <div className="reading-card-date">
        <div className="reading-card-day">{getDayName(reading.date)}</div>
        <div>{reading.date.slice(5)}</div>
      </div>
      <div className="reading-card-info">
        <div className={`reading-card-hizb ${statusClass}`}>
          {reading.isZero ? '0 حزب' : formatHizb(reading.hizb)}
        </div>
        <div className="reading-card-detail">{statusText}</div>
        {!reading.isZero && (
          <div className="reading-card-detail">
            {surahAyahStr(reading.startSurah, reading.startAyah)} → {surahAyahStr(reading.endSurah, reading.endAyah)}
          </div>
        )}
      </div>
      <button className="reading-card-delete" onClick={(e) => { e.stopPropagation(); onDelete(); }}>✕</button>
    </div>
  );
}
