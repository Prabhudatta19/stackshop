// app/dashboard/transactions/page.tsx
import { createServerComponentClient } from '@supabase/auth-helpers-nextjs';
import { cookies } from 'next/headers';
import Link from 'next/link';

export const dynamic = 'force-dynamic';

export default async function TransactionsPage() {
  const supabase = createServerComponentClient({ cookies });

  // 1. Get session
  const {
    data: { session },
  } = await supabase.auth.getSession();
  if (!session?.user) {
    return (
      <div className="p-6 text-center">
        <p className="text-red-500">You must be logged in to view this page.</p>
        <Link href="/login" className="text-blue-600 underline">
          Go to Login
        </Link>
      </div>
    );
  }

  // 2. Lookup shop
  const { data: shopData, error: shopError } = await supabase
    .from('shops')
    .select('id')
    .eq('owner_id', session.user.id)
    .single();
  if (shopError || !shopData) {
    return (
      <div className="p-6 text-center">
        <p className="text-red-500">Failed to load your shop data.</p>
      </div>
    );
  }

  // 3. Fetch transactions with customer name
  const { data: transactions, error: txError } = await supabase
    .from('transactions')
    .select(`
      id,
      type,
      points,
      description,
      created_at,
      customers ( name )
    `)
    .eq('shop_id', shopData.id)
    .order('created_at', { ascending: false });

  if (txError) {
    return (
      <div className="p-6 text-center">
        <p className="text-red-500">Error loading transactions: {txError.message}</p>
      </div>
    );
  }

  return (
    <div className="p-6">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold">Transactions</h1>
        <Link
          href="/dashboard/transactions/new"
          className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 transition"
        >
          + Add Transaction
        </Link>
      </div>

      {transactions && transactions.length > 0 ? (
        <div className="overflow-x-auto">
          <table className="min-w-full  rounded-lg shadow">
            <thead className="bg-gray-100 text-gray-600">
              <tr>
                <th className="px-4 py-2 text-left">Date</th>
                <th className="px-4 py-2 text-left">Customer</th>
                <th className="px-4 py-2 text-left">Type</th>
                <th className="px-4 py-2 text-left">Points</th>
                <th className="px-4 py-2 text-left">Description</th>
              </tr>
            </thead>
            <tbody>
              {transactions.map((tx) => (
                <tr key={tx.id} className="border-t hover:bg-sky-500">
                  <td className="px-4 py-3">
                    {tx.created_at
                      ? new Date(tx.created_at).toLocaleDateString('en-IN', {
                          day: 'numeric',
                          month: 'short',
                          year: 'numeric',
                          hour: '2-digit',
                          minute: '2-digit',
                        })
                      : '—'}
                  </td>
                  <td className="px-4 py-3">{tx.customers?.name || '—'}</td>
                  <td className="px-4 py-3 capitalize">{tx.type}</td>
                  <td className="px-4 py-3">{tx.points}</td>
                  <td className="px-4 py-3">{tx.description || '—'}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      ) : (
        <p className="text-gray-500">No transactions yet. Click “Add Transaction” to get started.</p>
      )}
    </div>
  );
}
