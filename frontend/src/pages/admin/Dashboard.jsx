import React, { useState, useEffect } from 'react';
import AuthService from '../../services/auth.service';
import {
  BorrowReturnTrendChart,
  MonthlyActivityChart,
  CategoryPieChart,
  TopBooksChart
} from '../../components/admin/charts';
import { Users, BookOpen, BookMarked, CheckCircle, Clock, ArrowRight, Book } from 'lucide-react';

function Dashboard() {
  const [stats, setStats] = useState(null);
  const [analytics, setAnalytics] = useState(null);
  const [loading, setLoading] = useState(true);
  const user = AuthService.getUser();

  useEffect(() => {
    fetchDashboardStats();
    fetchAnalytics();
  }, []);

  const fetchDashboardStats = async () => {
    try {
      const response = await fetch('/api/admin/dashboard', {
        headers: { Authorization: `Bearer ${AuthService.getToken()}` }
      });
      const data = await response.json();
      setStats(data);
    } catch (error) {
      console.error('Failed to fetch stats:', error);
    } finally {
      setLoading(false);
    }
  };

  const fetchAnalytics = async () => {
    try {
      const response = await fetch('/api/admin/analytics', {
        headers: { Authorization: `Bearer ${AuthService.getToken()}` }
      });
      const data = await response.json();
      setAnalytics(data);
    } catch (error) {
      console.error('Failed to fetch analytics:', error);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-gold-400"></div>
      </div>
    );
  }

  const statCards = [
    { label: 'Total Users', value: stats?.total_users || 0, icon: Users, color: 'bg-gold-400/20 text-gold-400' },
    { label: 'Total Books', value: stats?.total_books || 0, icon: BookOpen, color: 'bg-emerald-500/20 text-emerald-400' },
    { label: 'Borrowed', value: stats?.currently_borrowed || 0, icon: BookMarked, color: 'bg-amber-500/20 text-amber-400' },
    { label: 'Returned', value: stats?.total_returned || 0, icon: CheckCircle, color: 'bg-purple-500/20 text-purple-400' },
    { label: 'Pending Requests', value: stats?.pending_requests || 0, icon: Clock, color: 'bg-orange-500/20 text-orange-400' }
  ];

  // Merge borrow and return trends for the chart
  const trendData = analytics?.borrow_trends?.map((b, i) => ({
    date: b.date,
    borrows: b.borrows,
    returns: analytics?.return_trends?.[i]?.returns || 0
  })) || [];

  return (
    <div className="max-w-7xl mx-auto px-8 py-8">

      {/* Summary Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
        {statCards.map((stat, index) => (
          <div key={index} className="card border border-gold-400/20 hover:border-gold-400/40 hover:shadow-lg hover:shadow-gold-400/5 transition-all duration-300">
            <div className="flex items-center gap-4">
              <div className={`w-14 h-14 ${stat.color} rounded-xl flex items-center justify-center`}>
                <stat.icon size={28} />
              </div>
              <div>
                <p className="text-gold-400/60 text-sm font-cinzel">{stat.label}</p>
                <p className="text-3xl font-bold text-white font-cinzel">{stat.value}</p>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Charts Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
        {/* Borrow/Return Trend Chart */}
        <div className="card border border-gold-400/20">
          <h2 className="text-lg font-semibold mb-4 text-gold-400 font-cinzel">Borrow & Return Trends (30 Days)</h2>
          <BorrowReturnTrendChart data={trendData} />
        </div>

        {/* Monthly Activity Chart */}
        <div className="card border border-gold-400/20">
          <h2 className="text-lg font-semibold mb-4 text-gold-400 font-cinzel">Monthly Activity (6 Months)</h2>
          <MonthlyActivityChart data={analytics?.monthly_activity || []} />
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
        {/* Category Distribution */}
        <div className="card border border-gold-400/20">
          <h2 className="text-lg font-semibold mb-4 text-gold-400 font-cinzel">Books by Category</h2>
          <CategoryPieChart data={analytics?.category_distribution || []} />
        </div>

        {/* Top Borrowed Books */}
        <div className="card border border-gold-400/20">
          <h2 className="text-lg font-semibold mb-4 text-gold-400 font-cinzel">Top Borrowed Books</h2>
          <TopBooksChart data={analytics?.top_books || []} />
        </div>
      </div>

      {/* Recent Activity & Quick Actions */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Recent Activity */}
        <div className="card border border-gold-400/20">
          <h2 className="text-lg font-semibold mb-4 text-gold-400 font-cinzel">Recent Activity</h2>
          {analytics?.recent_activity?.length > 0 ? (
            <div className="space-y-3">
              {analytics.recent_activity.slice(0, 8).map((activity, index) => (
                <div key={index} className="flex items-start gap-3 pb-3 border-b border-gold-400/10 last:border-0">
                  <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${
                    activity.type === 'borrow' ? 'bg-magical-teal/20 text-magical-teal' : 'bg-emerald-500/20 text-emerald-400'
                  }`}>
                    {activity.type === 'borrow' ? <BookMarked size={18} /> : <CheckCircle size={18} />}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm text-white">
                      <span className="font-medium text-gold-400">{activity.user}</span>
                      <span className="text-gold-400/60"> {activity.type === 'borrow' ? 'borrowed' : 'returned'} </span>
                      <span className="font-medium text-gold-400">{activity.book}</span>
                    </p>
                    <p className="text-xs text-gold-400/40 mt-1 font-cinzel">
                      {new Date(activity.date).toLocaleDateString('en-US', {
                        month: 'short',
                        day: 'numeric',
                        hour: '2-digit',
                        minute: '2-digit'
                      })}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-8 text-gold-400/40 font-cinzel">
              No recent activity
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default Dashboard;