// app/dashboard/page.tsx
'use client';

import Link from 'next/link';
import { useEffect, useState } from 'react';
import { supabase } from '@/lib/supabaseClient';

export default function DashboardHome() {
  const [shopName, setShopName] = useState<string>('');
  const [totalCustomers, setTotalCustomers] = useState<number | null>(null);
  const [totalTransactions, setTotalTransactions] = useState<number>(0);

  const [loading, setLoading] = useState(true);

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

      // 1. Fetch shop (must exist)
      const { data: shopData, error: shopError } = await supabase
        .from('shops')
        .select('id, name')
        .eq('owner_id', ownerId)
        .single();

      if (shopError || !shopData) {
        console.error('Failed to load shop:', shopError);
        setLoading(false);
        return;
      }

      setShopName(shopData.name);

      // 2. Fetch customer count safely
      const { count, error: countError } = await supabase
        .from('customers')
        .select('id', { count: 'exact', head: true })
        .eq('shop_id', shopData.id);

      if (countError) {
        console.error('Failed to count customers:', countError);
      } else {
        setTotalCustomers(count ?? 0);
      }

      const { count: txCount, error: txError } = await supabase
        .from('transactions')
        .select('id', { count: 'exact', head: true })
        .eq('shop_id', shopData.id);
      if (txError) console.error('Transaction count error:', txError);
      setTotalTransactions(txCount ?? 0);

      setLoading(false);
    }

    loadData();
  }, []);

  if (loading) return <p>Loading dashboard…</p>;

  return (
    <div className="space-y-6">
      <header>
        <p className="text-2xl font-semibold"><strong>{shopName}</strong></p>
      </header>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Total Customers Card */}
        <Link href="/dashboard/customers" className="group">
          <div className="cursor-pointer bg-white rounded-lg p-6 shadow hover:shadow-lg border transition">
            <h3 className="text-sm text-gray-500 group-hover:text-gray-700">Total Customers</h3>
            <p className="mt-2 text-3xl font-bold text-gray-900">
              {totalCustomers}
            </p>
            <p className="mt-1 text-blue-600 text-sm group-hover:underline">
              View all
            </p>
          </div>
        </Link>

        {/* Points Distributed Card */}
        <div className="bg-white rounded-lg p-6 shadow border">
          <h3 className="text-sm text-gray-500">Points Distributed</h3>
          <p className="mt-2 text-3xl font-bold text-gray-900">–</p>
        </div>

        {/* Recent Transactions Card */}
        <Link href="/dashboard/transactions" className="group">
          <div className="cursor-pointer bg-white rounded-lg p-6 shadow hover:shadow-lg border transition">
            <h3 className="text-sm text-gray-500 group-hover:text-gray-700">
              Total Transactions
            </h3>
            <p className="mt-2 text-3xl font-bold text-gray-900">
              {totalTransactions}
            </p>
            <p className="mt-1 text-blue-600 text-sm group-hover:underline">
              View all
            </p>
          </div>
        </Link>
      </div>
    </div>
  );
}
