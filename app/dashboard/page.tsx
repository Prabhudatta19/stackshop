'use client';

import Link from 'next/link';
import { useEffect, useState } from 'react';
import { supabase } from '@/lib/supabaseClient';
import { Users, FileText, Package, ArrowRightCircle, Gift } from 'lucide-react';
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from 'recharts';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';

export default function DashboardHome() {
  const [shopName, setShopName] = useState('');
  const [totalCustomers, setTotalCustomers] = useState(null);
  const [totalTransactions, setTotalTransactions] = useState(0);
  const [loading, setLoading] = useState(true);
  const [selectedDate, setSelectedDate] = useState(new Date());

  useEffect(() => {
    async function loadData() {
      setLoading(true);

      const {
        data: { session },
      } = await supabase.auth.getSession();

      if (!session?.user) {
        setLoading(false);
        return;
      }

      const ownerId = session.user.id;

      const { data: shopData } = await supabase
        .from('shops')
        .select('id, name')
        .eq('owner_id', ownerId)
        .single();

      if (shopData) {
        setShopName(shopData.name);

        const { count: customerCount } = await supabase
          .from('customers')
          .select('id', { count: 'exact', head: true })
          .eq('shop_id', shopData.id);

        const { count: transactionCount } = await supabase
          .from('transactions')
          .select('id', { count: 'exact', head: true })
          .eq('shop_id', shopData.id);

        setTotalCustomers(customerCount ?? 0);
        setTotalTransactions(transactionCount ?? 0);
      }

      setLoading(false);
    }

    loadData();
  }, []);

  const activityData = [
    { date: 'Mon', value: 30 },
    { date: 'Tue', value: 45 },
    { date: 'Wed', value: 60 },
    { date: 'Thu', value: 50 },
    { date: 'Fri', value: 80 },
    { date: 'Sat', value: 40 },
    { date: 'Sun', value: 70 },
  ];

  if (loading) return <p className="text-white">Loading dashboard…</p>;

  return (
    <div className="space-y-10 ">
      <header>
  <p className="text-2xl font-normal text-white pl-10 md:pl-0">
    <strong>{shopName}</strong>
  </p>
</header>

      <div className="hidden md:grid grid-cols-1 md:grid-cols-4 gap-7">
        <Link href="/dashboard/customers">
          <div className="bg-white rounded-xl p-6 shadow hover:shadow-lg border flex flex-col justify-between h-full transition group cursor-pointer">
            <div className="flex justify-between items-start text-lg text-gray-500 group-hover:text-gray-700">
              <span>Total Customers</span>
              <ArrowRightCircle className="w-5 h-6 text-violet-600 group-hover:scale-110 transition" />
            </div>
            <div className="mt-6 flex items-center gap-4">
              <Users className="w-6 h-6 text-violet-700" />
              <p className="text-3xl font-normal text-gray-900">{totalCustomers}</p>
            </div>
          </div>
        </Link>

        <div className="bg-white rounded-xl p-6 shadow border flex flex-col justify-between h-full">
          <div className="flex justify-between items-start text-lg text-gray-500">
            <span>Points Distributed</span>
            <ArrowRightCircle className="w-5 h-6 text-gray-400" />
          </div>
          <div className="mt-6 flex items-center gap-4">
            <Gift className="w-6 h-6 text-purple-600" />
            <p className="text-3xl font-normal text-gray-900">–</p>
          </div>
        </div>

        <Link href="/dashboard/transactions">
          <div className="bg-white rounded-xl p-6 shadow hover:shadow-lg border flex flex-col justify-between h-full transition group cursor-pointer">
            <div className="flex justify-between items-start text-lg text-gray-500 group-hover:text-gray-700">
              <span>Total Transactions</span>
              <ArrowRightCircle className="w-5 h-6 text-violet-600 group-hover:scale-110 transition" />
            </div>
            <div className="mt-6 flex items-center gap-4">
              <FileText className="w-6 h-6 text-green-700" />
              <p className="text-3xl font-normal text-gray-900">{totalTransactions}</p>
            </div>
          </div>
        </Link>

        <Link href="/dashboard/products">
          <div className="bg-white rounded-xl p-6 shadow hover:shadow-lg border flex flex-col justify-between h-full transition group cursor-pointer">
            <div className="flex justify-between items-start text-lg text-gray-500 group-hover:text-gray-700">
              <span>Products</span>
              <ArrowRightCircle className="w-5 h-6 text-violet-600 group-hover:scale-110 transition" />
            </div>
            <div className="mt-6 flex items-center gap-4">
              <Package className="w-6 h-6 text-yellow-600" />
              <p className="text-3xl font-normal text-gray-900">–</p>
            </div>
          </div>
        </Link>
      </div>

      <div className="md:hidden grid grid-cols-2 gap-4">
        <Link href="/dashboard/customers">
          <div className="bg-white rounded-xl p-4 shadow border flex flex-col justify-between h-full transition group cursor-pointer">
            <div className="flex justify-between items-start text-xs text-gray-500">
              <span>Total Customers</span>
              <ArrowRightCircle className="w-4 h-4 text-violet-600" />
            </div>
            <div className="mt-4 flex items-center gap-3">
              <Users className="w-6 h-6 text-violet-700" />
              <p className="text-xl font-bold text-gray-900">{totalCustomers}</p>
            </div>
          </div>
        </Link>

        <div className="bg-white rounded-xl p-4 shadow border flex flex-col justify-between h-full">
          <div className="flex justify-between items-start text-xs text-gray-500">
            <span>Points</span>
            <ArrowRightCircle className="w-4 h-4 text-gray-400" />
          </div>
          <div className="mt-4 flex items-center gap-3">
            <Gift className="w-6 h-6 text-purple-600" />
            <p className="text-xl font-bold text-gray-900">–</p>
          </div>
        </div>

        <Link href="/dashboard/transactions">
          <div className="bg-white rounded-xl p-4 shadow border flex flex-col justify-between h-full transition group cursor-pointer">
            <div className="flex justify-between items-start text-xs text-gray-500">
              <span>Transactions</span>
              <ArrowRightCircle className="w-4 h-4 text-violet-600" />
            </div>
            <div className="mt-4 flex items-center gap-3">
              <FileText className="w-6 h-6 text-green-700" />
              <p className="text-xl font-bold text-gray-900">{totalTransactions}</p>
            </div>
          </div>
        </Link>

        <Link href="/dashboard/products">
          <div className="bg-white rounded-xl p-4 shadow border flex flex-col justify-between h-full transition group cursor-pointer">
            <div className="flex justify-between items-start text-xs text-gray-500">
              <span>Products</span>
              <ArrowRightCircle className="w-4 h-4 text-violet-600" />
            </div>
            <div className="mt-4 flex items-center gap-3">
              <Package className="w-6 h-6 text-yellow-600" />
              <p className="text-xl font-bold text-gray-900">–</p>
            </div>
          </div>
        </Link>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 items-start">
        <div className="bg-white p-6 rounded-2xl shadow-lg border col-span-1 md:col-span-2 h-80 flex flex-col">
  <h3 className="text-xl font-semibold text-gray-800 mb-4">Daily Activity</h3>
  
  <div className="flex-1">
    <ResponsiveContainer width="100%" height="100%">
      <AreaChart
        data={activityData}
        margin={{ top: 10, right: 20, left: 0, bottom: 0 }}
      >
        <defs>
          <linearGradient id="colorViolet" x1="0" y1="0" x2="0" y2="1">
            <stop offset="5%" stopColor="#8b5cf6" stopOpacity={0.4} />
            <stop offset="95%" stopColor="#8b5cf6" stopOpacity={0} />
          </linearGradient>
        </defs>

        <CartesianGrid strokeDasharray="3 3" vertical={false} />
        <XAxis dataKey="date" tick={{ fontSize: 12, fill: '#6b7280' }} />
        <YAxis tick={{ fontSize: 12, fill: '#6b7280' }} />
        <Tooltip
          contentStyle={{ borderRadius: '8px', backgroundColor: '#fff', borderColor: '#e5e7eb' }}
          itemStyle={{ color: '#4b5563', fontSize: '12px' }}
        />
        <Area
          type="monotone"
          dataKey="value"
          stroke="#8b5cf6"
          strokeWidth={3}
          fillOpacity={1}
          fill="url(#colorViolet)"
          dot={{ r: 3, strokeWidth: 1, fill: '#8b5cf6' }}
        />
      </AreaChart>
    </ResponsiveContainer>
  </div>
</div>


        <div className="bg-white p-6 rounded-xl shadow border">
          <h3 className="text-lg font-semibold text-gray-700 mb-4">Select Date</h3>
          <DatePicker
            selected={selectedDate}
            onChange={(date) => setSelectedDate(date)}
            className="border px-3 py-2 rounded w-full focus:outline-none focus:ring-2 focus:ring-violet-500"
            calendarClassName="rounded shadow-lg"
          />
        </div>
      </div>
    </div>
  );
}
