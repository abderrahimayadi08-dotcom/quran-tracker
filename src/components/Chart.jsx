import { BarChart, Bar, XAxis, YAxis, ReferenceLine, ResponsiveContainer, Cell, Tooltip } from 'recharts';

export default function Chart({ data, target, mode }) {
  if (!data.length) return <div className="no-readings">لا توجد بيانات</div>;

  const maxVal = Math.max(...data.map(d => Math.max(d.hizb || 0, d.status || 0, target)), target + 1);

  if (mode === 'monthly') {
    return (
      <ResponsiveContainer width="100%" height={200}>
        <BarChart data={data} margin={{ top: 5, right: 5, bottom: 5, left: -15 }}>
          <XAxis dataKey="name" tick={{ fontSize: 10, fill: '#8E8E8E' }} />
          <YAxis tick={{ fontSize: 10, fill: '#8E8E8E' }} domain={[Math.min(0, ...data.map(d => d.status)) - 2, maxVal]} />
          <Tooltip formatter={(v) => [`${v >= 0 ? '+' : ''}${v}`, 'الحالة']} />
          <ReferenceLine y={0} stroke="#8E8E8E" strokeDasharray="3 3" />
          <Bar dataKey="status" radius={[4, 4, 0, 0]}>
            {data.map((entry, i) => (
              <Cell key={i} fill={entry.status >= 0 ? '#2D6A4F' : '#9B3B3B'} />
            ))}
          </Bar>
        </BarChart>
      </ResponsiveContainer>
    );
  }

  return (
    <ResponsiveContainer width="100%" height={200}>
      <BarChart data={data} margin={{ top: 5, right: 5, bottom: 5, left: -15 }}>
        <XAxis
          dataKey="date"
          tick={{ fontSize: 9, fill: '#8E8E8E' }}
          interval={Math.max(0, Math.floor(data.length / 8) - 1)}
        />
        <YAxis tick={{ fontSize: 10, fill: '#8E8E8E' }} domain={[0, maxVal]} />
        <Tooltip formatter={(v) => [`${v} حزب`, 'الورد']} />
        <ReferenceLine y={target} stroke="#B8953E" strokeDasharray="4 2" label={{ value: 'المعدل', position: 'right', fontSize: 9, fill: '#B8953E' }} />
        <Bar dataKey="hizb" radius={[4, 4, 0, 0]}>
          {data.map((entry, i) => (
            <Cell key={i} fill={entry.hizb >= target ? '#2D6A4F' : entry.hizb > 0 ? '#9B3B3B' : '#E0DDD6'} />
          ))}
        </Bar>
      </BarChart>
    </ResponsiveContainer>
  );
}
