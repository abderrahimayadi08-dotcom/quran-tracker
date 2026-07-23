import { BarChart, Bar, XAxis, YAxis, ReferenceLine, ResponsiveContainer, Cell, Tooltip } from 'recharts';
import { formatHizb } from '../utils';

export default function Chart({ data, target, mode }) {
  if (!data.length) return <div className="no-readings">لا توجد بيانات</div>;

  const maxVal = Math.max(...data.map(d => Math.max(d.hizb || 0, d.status || 0, target)), target + 1);

  const tipStyle = { contentStyle: { fontFamily: "'Tajawal', sans-serif", fontSize: 12, borderRadius: 8, border: '1px solid #E6E2DB', background: '#fff' } };

  if (mode === 'monthly') {
    return (
      <ResponsiveContainer width="100%" height={200}>
        <BarChart data={data} margin={{ top: 5, right: 5, bottom: 5, left: -15 }}>
          <XAxis dataKey="name" tick={{ fontSize: 10, fill: '#82878C', fontFamily: "'Tajawal'" }} />
          <YAxis tick={{ fontSize: 10, fill: '#82878C', fontFamily: "'Tajawal'" }} domain={[Math.min(0, ...data.map(d => d.status)) - 2, maxVal]} tickFormatter={(v) => Number.isInteger(v) ? v : ''} />
          <Tooltip labelFormatter={(label) => label} formatter={(v) => [formatHizb(Math.abs(v)), v >= 0 ? 'قراءة فوق وردك' : 'تبقى على تمام وردك']} {...tipStyle} />
          <ReferenceLine y={0} stroke="#E6E2DB" strokeDasharray="3 3" />
          <Bar dataKey="status" radius={[6, 6, 0, 0]}>
            {data.map((entry, i) => (
              <Cell key={i} fill={entry.status >= 0 ? '#2A6B4F' : '#A63D40'} />
            ))}
          </Bar>
        </BarChart>
      </ResponsiveContainer>
    );
  }

  return (
    <ResponsiveContainer width="100%" height={200}>
      <BarChart data={data} margin={{ top: 5, right: 10, bottom: 5, left: -15 }}>
        <XAxis
          dataKey="date"
          tick={{ fontSize: 9, fill: '#82878C', fontFamily: "'Tajawal'" }}
          interval={Math.max(0, Math.floor(data.length / 8) - 1)}
        />
        <YAxis tick={{ fontSize: 10, fill: '#82878C', fontFamily: "'Tajawal'" }} domain={[0, maxVal]} />
        <Tooltip formatter={(v) => [formatHizb(v), 'الورد']} {...tipStyle} />
        <ReferenceLine y={target} stroke="#C0942A" strokeDasharray="4 2" label={{ value: 'المعدل', position: 'right', offset: 10, fontSize: 10, fill: '#C0942A', fontFamily: "'Tajawal'", fontWeight: 600 }} />
        <Bar dataKey="hizb" radius={[6, 6, 0, 0]}>
          {data.map((entry, i) => (
            <Cell key={i} fill={entry.hizb >= target ? '#2A6B4F' : entry.hizb > 0 ? '#A63D40' : '#E6E2DB'} />
          ))}
        </Bar>
      </BarChart>
    </ResponsiveContainer>
  );
}
