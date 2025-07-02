'use client';

import { useEffect, useState } from 'react';
import { supabase } from '@/lib/supabaseClient';

export default function DashboardHome() {
  const [shopName, setShopName] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchShop = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session?.user) return;

      const { data, error } = await supabase
        .from('shops')
        .select('name')
        .eq('owner_id', session.user.id)
        .single();

      if (data) setShopName(data.name);
      setLoading(false);
    };

    fetchShop();
  }, []);

  if (loading) return <p>Loading dashboard...</p>;

  return (
    <div>
      <h2 className="text-2xl font-semibold mb-4">Welcome back!</h2>
      <p className="text-lg">Managing: <strong>{shopName}</strong></p>

      <div className="mt-8 grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-white rounded-lg p-6 shadow border">
          <h3 className="text-sm text-gray-500">Total Customers</h3>
          <p className="text-2xl font-bold">–</p>
        </div>
        <div className="bg-white rounded-lg p-6 shadow border">
          <h3 className="text-sm text-gray-500">Points Distributed</h3>
          <p className="text-2xl font-bold">–</p>
        </div>
        <div className="bg-white rounded-lg p-6 shadow border">
          <h3 className="text-sm text-gray-500">Recent Transactions</h3>
          <p className="text-2xl font-bold">–</p>
        </div>
      </div>
    </div>
  );
}
