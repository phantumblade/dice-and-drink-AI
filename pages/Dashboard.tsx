import React from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, LineChart, Line } from 'recharts';
import { TrendingUp, Users, DollarSign, Calendar } from 'lucide-react';
import { MOCK_REVENUE_DATA } from '../constants';

const Dashboard: React.FC = () => {
  const StatCard = ({ title, value, icon: Icon, colorClass }: { title: string; value: string; icon: any; colorClass: string }) => (
    <div className={`bg-white p-6 border-2 border-black shadow-neo hover:-translate-y-1 transition-transform`}>
      <div className="flex justify-between items-start">
        <div>
          <p className="text-black font-bold uppercase text-xs tracking-wider">{title}</p>
          <h3 className="text-4xl font-black mt-2">{value}</h3>
        </div>
        <div className={`p-3 border-2 border-black ${colorClass} shadow-neo-sm`}>
          <Icon className="w-6 h-6 text-black" />
        </div>
      </div>
    </div>
  );

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <h1 className="text-5xl font-black mb-8 uppercase italic">Command Center</h1>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
        <StatCard title="Total Loot" value="$12.4k" icon={DollarSign} colorClass="bg-neo-lime" />
        <StatCard title="Bookings" value="24" icon={Calendar} colorClass="bg-neo-violet text-white" />
        <StatCard title="New Players" value="+156" icon={Users} colorClass="bg-neo-pink text-white" />
        <StatCard title="Games Played" value="842" icon={TrendingUp} colorClass="bg-neo-cyan" />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Revenue Chart */}
        <div className="bg-white p-6 border-2 border-black shadow-neo">
          <h3 className="text-xl font-black mb-6 uppercase border-b-2 border-black pb-2">Weekly Revenue</h3>
          <div className="h-80 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={MOCK_REVENUE_DATA}>
                <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                <XAxis dataKey="name" stroke="#000" tick={{fontWeight: 'bold'}} />
                <YAxis stroke="#000" tick={{fontWeight: 'bold'}} />
                <Tooltip 
                    contentStyle={{ backgroundColor: '#fff', borderColor: '#000', borderWidth: '2px', color: '#000', fontFamily: 'Space Grotesk', fontWeight: 'bold' }}
                    cursor={{fill: '#facc15', opacity: 0.2}}
                />
                <Bar dataKey="value" fill="#8b5cf6" stroke="#000" strokeWidth={2} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Activity Chart */}
        <div className="bg-white p-6 border-2 border-black shadow-neo">
          <h3 className="text-xl font-black mb-6 uppercase border-b-2 border-black pb-2">User Activity</h3>
           <div className="h-80 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={MOCK_REVENUE_DATA}>
                <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                <XAxis dataKey="name" stroke="#000" tick={{fontWeight: 'bold'}} />
                <YAxis stroke="#000" tick={{fontWeight: 'bold'}} />
                <Tooltip 
                    contentStyle={{ backgroundColor: '#fff', borderColor: '#000', borderWidth: '2px', color: '#000', fontFamily: 'Space Grotesk', fontWeight: 'bold' }}
                />
                <Line type="monotone" dataKey="value" stroke="#ec4899" strokeWidth={4} dot={{ r: 6, strokeWidth: 2, stroke: '#000', fill: '#ec4899' }} />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;