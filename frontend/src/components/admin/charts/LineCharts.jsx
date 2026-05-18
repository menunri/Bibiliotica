import React from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from 'recharts';

export function BorrowReturnTrendChart({ data }) {
  if (!data || data.length === 0) {
    return (
      <div className="h-64 flex items-center justify-center text-gray-400">
        No trend data available
      </div>
    );
  }

  const formattedData = data.map(item => ({
    ...item,
    date: new Date(item.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })
  }));

  return (
    <ResponsiveContainer width="100%" height={280}>
      <LineChart data={formattedData} margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
        <CartesianGrid strokeDasharray="3 3" stroke="#E5E7EB" />
        <XAxis 
          dataKey="date" 
          tick={{ fontSize: 12 }}
          stroke="#6B7280"
        />
        <YAxis 
          tick={{ fontSize: 12 }}
          stroke="#6B7280"
          allowDecimals={false}
        />
        <Tooltip 
          contentStyle={{ 
            backgroundColor: '#fff',
            border: '1px solid #E5E7EB',
            borderRadius: '8px',
            boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)'
          }}
        />
        <Legend />
        <Line 
          type="monotone" 
          dataKey="borrows" 
          name="Borrowed" 
          stroke="#4F46E5" 
          strokeWidth={2}
          activeDot={{ r: 6 }}
          dot={{ r: 3 }}
        />
        <Line 
          type="monotone" 
          dataKey="returns" 
          name="Returned" 
          stroke="#10B981" 
          strokeWidth={2}
          activeDot={{ r: 6 }}
          dot={{ r: 3 }}
        />
      </LineChart>
    </ResponsiveContainer>
  );
}

export function MonthlyActivityChart({ data }) {
  if (!data || data.length === 0) {
    return (
      <div className="h-64 flex items-center justify-center text-gray-400">
        No monthly data available
      </div>
    );
  }

  return (
    <ResponsiveContainer width="100%" height={280}>
      <LineChart data={data} margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
        <CartesianGrid strokeDasharray="3 3" stroke="#E5E7EB" />
        <XAxis 
          dataKey="month" 
          tick={{ fontSize: 12 }}
          stroke="#6B7280"
        />
        <YAxis 
          tick={{ fontSize: 12 }}
          stroke="#6B7280"
          allowDecimals={false}
        />
        <Tooltip 
          contentStyle={{ 
            backgroundColor: '#fff',
            border: '1px solid #E5E7EB',
            borderRadius: '8px',
            boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)'
          }}
        />
        <Legend />
        <Line 
          type="monotone" 
          dataKey="borrows" 
          name="Borrows" 
          stroke="#4F46E5" 
          strokeWidth={2}
          activeDot={{ r: 6 }}
          dot={{ r: 3 }}
        />
        <Line 
          type="monotone" 
          dataKey="returns" 
          name="Returns" 
          stroke="#10B981" 
          strokeWidth={2}
          activeDot={{ r: 6 }}
          dot={{ r: 3 }}
        />
      </LineChart>
    </ResponsiveContainer>
  );
}

export function CategoryPieChart({ data }) {
  if (!data || data.length === 0) {
    return (
      <div className="h-64 flex items-center justify-center text-gray-400">
        No category data available
      </div>
    );
  }

  const COLORS = ['#4F46E5', '#10B981', '#F59E0B', '#EF4444', '#8B5CF6', '#EC4899', '#06B6D4', '#84CC16'];

  return (
    <ResponsiveContainer width="100%" height={280}>
      <LineChart data={data} margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
        <Line 
          type="monotone" 
          dataKey="value" 
          stroke="#4F46E5" 
          strokeWidth={2}
          dot={{ r: 4 }}
        />
        <XAxis 
          dataKey="name" 
          tick={{ fontSize: 11 }}
          stroke="#6B7280"
        />
        <YAxis 
          tick={{ fontSize: 12 }}
          stroke="#6B7280"
          allowDecimals={false}
        />
        <Tooltip 
          contentStyle={{ 
            backgroundColor: '#fff',
            border: '1px solid #E5E7EB',
            borderRadius: '8px',
            boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)'
          }}
        />
      </LineChart>
    </ResponsiveContainer>
  );
}