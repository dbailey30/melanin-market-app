import React, { useState, useEffect } from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, LineChart, Line, PieChart, Pie, Cell } from 'recharts';

const BusinessAnalytics = ({ businessId, userId }) => {
  const [analytics, setAnalytics] = useState(null);
  const [performance, setPerformance] = useState(null);
  const [loading, setLoading] = useState(true);
  const [timeRange, setTimeRange] = useState(30);
  const [hasAccess, setHasAccess] = useState(false);

  useEffect(() => {
    checkAnalyticsAccess();
  }, [userId]);

  useEffect(() => {
    if (hasAccess && businessId) {
      fetchAnalytics();
      fetchPerformance();
    }
  }, [businessId, timeRange, hasAccess]);

  const checkAnalyticsAccess = async () => {
    try {
      const response = await fetch(`/api/user/${userId}/has-feature`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ feature_type: 'analytics' }),
      });
      const data = await response.json();
      setHasAccess(data.has_access);
    } catch (error) {
      console.error('Error checking analytics access:', error);
    }
  };

  const fetchAnalytics = async () => {
    try {
      setLoading(true);
      const response = await fetch(`/api/business/${businessId}/analytics?days=${timeRange}`);
      const data = await response.json();
      if (data.success) {
        setAnalytics(data);
      }
    } catch (error) {
      console.error('Error fetching analytics:', error);
    } finally {
      setLoading(false);
    }
  };

  const fetchPerformance = async () => {
    try {
      const response = await fetch(`/api/business/${businessId}/performance`);
      const data = await response.json();
      if (data.success) {
        setPerformance(data);
      }
    } catch (error) {
      console.error('Error fetching performance:', error);
    }
  };

  if (!hasAccess) {
    return (
      <div className="bg-white rounded-lg shadow-lg p-8 text-center">
        <div className="mb-4">
          <svg className="w-16 h-16 text-gray-400 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
          </svg>
        </div>
        <h3 className="text-xl font-semibold text-gray-900 mb-2">Analytics Premium Feature</h3>
        <p className="text-gray-600 mb-6">
          Upgrade to a Business plan to access detailed analytics and insights about your business performance.
        </p>
        <button className="bg-blue-600 text-white px-6 py-3 rounded-lg font-semibold hover:bg-blue-700 transition-colors">
          Upgrade Now
        </button>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="flex justify-center items-center p-8">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  const chartData = analytics?.daily_analytics?.map(day => ({
    date: new Date(day.date).toLocaleDateString(),
    views: day.profile_views,
    searches: day.search_appearances,
    clicks: day.phone_clicks + day.website_clicks + day.direction_requests
  })) || [];

  const activityData = [
    { name: 'Profile Views', value: analytics?.totals?.profile_views || 0, color: '#3B82F6' },
    { name: 'Phone Clicks', value: analytics?.totals?.phone_clicks || 0, color: '#10B981' },
    { name: 'Website Clicks', value: analytics?.totals?.website_clicks || 0, color: '#F59E0B' },
    { name: 'Direction Requests', value: analytics?.totals?.direction_requests || 0, color: '#EF4444' }
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-white rounded-lg shadow-lg p-6">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-2xl font-bold text-gray-900">Business Analytics</h2>
          <select
            value={timeRange}
            onChange={(e) => setTimeRange(parseInt(e.target.value))}
            className="border border-gray-300 rounded-md px-3 py-2"
          >
            <option value={7}>Last 7 days</option>
            <option value={30}>Last 30 days</option>
            <option value={90}>Last 90 days</option>
          </select>
        </div>

        {/* Key Metrics */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div className="bg-blue-50 p-4 rounded-lg">
            <div className="text-2xl font-bold text-blue-600">
              {analytics?.totals?.profile_views || 0}
            </div>
            <div className="text-sm text-gray-600">Profile Views</div>
            {performance?.performance?.profile_views && (
              <div className={`text-xs ${performance.performance.profile_views.change_percent >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                {performance.performance.profile_views.change_percent >= 0 ? '+' : ''}
                {performance.performance.profile_views.change_percent}% vs last period
              </div>
            )}
          </div>

          <div className="bg-green-50 p-4 rounded-lg">
            <div className="text-2xl font-bold text-green-600">
              {analytics?.totals?.unique_visitors || 0}
            </div>
            <div className="text-sm text-gray-600">Unique Visitors</div>
          </div>

          <div className="bg-yellow-50 p-4 rounded-lg">
            <div className="text-2xl font-bold text-yellow-600">
              {analytics?.totals?.search_appearances || 0}
            </div>
            <div className="text-sm text-gray-600">Search Appearances</div>
            {performance?.performance?.search_appearances && (
              <div className={`text-xs ${performance.performance.search_appearances.change_percent >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                {performance.performance.search_appearances.change_percent >= 0 ? '+' : ''}
                {performance.performance.search_appearances.change_percent}% vs last period
              </div>
            )}
          </div>

          <div className="bg-purple-50 p-4 rounded-lg">
            <div className="text-2xl font-bold text-purple-600">
              {performance?.performance?.category_ranking?.rank || 'N/A'}
            </div>
            <div className="text-sm text-gray-600">Category Rank</div>
            {performance?.performance?.category_ranking && (
              <div className="text-xs text-gray-500">
                of {performance.performance.category_ranking.total_in_category} in {performance.performance.category_ranking.category}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Charts */}
      <div className="grid md:grid-cols-2 gap-6">
        {/* Views Over Time */}
        <div className="bg-white rounded-lg shadow-lg p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Views Over Time</h3>
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={chartData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="date" />
              <YAxis />
              <Tooltip />
              <Line type="monotone" dataKey="views" stroke="#3B82F6" strokeWidth={2} />
            </LineChart>
          </ResponsiveContainer>
        </div>

        {/* Activity Breakdown */}
        <div className="bg-white rounded-lg shadow-lg p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Activity Breakdown</h3>
          <ResponsiveContainer width="100%" height={300}>
            <PieChart>
              <Pie
                data={activityData}
                cx="50%"
                cy="50%"
                outerRadius={80}
                fill="#8884d8"
                dataKey="value"
                label={({ name, value }) => `${name}: ${value}`}
              >
                {activityData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.color} />
                ))}
              </Pie>
              <Tooltip />
            </PieChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Engagement Metrics */}
      <div className="bg-white rounded-lg shadow-lg p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Engagement Metrics</h3>
        <ResponsiveContainer width="100%" height={300}>
          <BarChart data={chartData}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="date" />
            <YAxis />
            <Tooltip />
            <Bar dataKey="views" fill="#3B82F6" name="Views" />
            <Bar dataKey="searches" fill="#10B981" name="Search Appearances" />
            <Bar dataKey="clicks" fill="#F59E0B" name="Total Clicks" />
          </BarChart>
        </ResponsiveContainer>
      </div>

      {/* Top Search Queries */}
      <div className="bg-white rounded-lg shadow-lg p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Top Search Queries</h3>
        <div className="space-y-3">
          {analytics?.top_search_queries?.slice(0, 10).map((query, index) => (
            <div key={index} className="flex justify-between items-center py-2 border-b border-gray-100">
              <span className="text-gray-700">"{query.query}"</span>
              <span className="text-sm text-gray-500">{query.count} searches</span>
            </div>
          )) || (
            <p className="text-gray-500">No search data available</p>
          )}
        </div>
      </div>

      {/* Insights */}
      {performance?.insights && performance.insights.length > 0 && (
        <div className="bg-white rounded-lg shadow-lg p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Insights & Recommendations</h3>
          <div className="space-y-4">
            {performance.insights.map((insight, index) => (
              <div key={index} className={`p-4 rounded-lg border-l-4 ${
                insight.type === 'positive' ? 'bg-green-50 border-green-400' :
                insight.type === 'suggestion' ? 'bg-yellow-50 border-yellow-400' :
                'bg-blue-50 border-blue-400'
              }`}>
                <h4 className="font-semibold text-gray-900">{insight.title}</h4>
                <p className="text-gray-700 mt-1">{insight.message}</p>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default BusinessAnalytics;

