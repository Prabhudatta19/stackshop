// app/dashboard/customers/page.tsx
import { createServerComponentClient } from '@supabase/auth-helpers-nextjs';
import { cookies } from 'next/headers';
import Link from 'next/link';

export const dynamic = 'force-dynamic';

export default async function CustomersPage() {
  // Initialize Supabase client for Server Components
  const supabase = createServerComponentClient({ cookies });

  // 1. Get current session
  const {
    data: { session },
  } = await supabase.auth.getSession();

  if (!session?.user) {
    // Shouldn't happen thanks to middleware, but just in case:
    return (
      <div className="p-6 text-center">
        <p className="text-red-500">You must be logged in to view this page.</p>
        <Link href="/login" className="text-blue-600 underline">
          Go to Login
        </Link>
      </div>
    );
  }

  // 2. Look up the shop owned by this user
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

  // 3. Fetch customers for that shop
  const { data: customers, error: custError } = await supabase
    .from('customers')
    .select('id, name, phone, points')
    .eq('shop_id', shopData.id);

  if (custError) {
    return (
      <div className="p-6 text-center">
        <p className="text-red-500">Error loading customers: {custError.message}</p>
      </div>
    );
  }

  return (
    <div className="p-6">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold">Your Customers</h1>
        <Link
          href="/dashboard/customers/new"
          className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 transition"
        >
          + Add Customer
        </Link>
      </div>

      {customers && customers.length > 0 ? (
        <div className="overflow-x-auto">
          <table className="min-w-full rounded-lg shadow">
            <thead className="bg-gray-100 text-gray-600">
              <tr>
                <th className="px-4 py-2 text-left">Name</th>
                <th className="px-4 py-2 text-left">Phone</th>
                <th className="px-4 py-2 text-left">Points</th>
              </tr>
            </thead>
            <tbody>
              {customers.map((c) => (
                <tr key={c.id} className="border-t hover:bg-sky-500">
                  <td className="px-4 py-3">{c.name}</td>
                  <td className="px-4 py-3">{c.phone || '—'}</td>
                  <td className="px-4 py-3">{c.points}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      ) : (
        <p className="text-gray-500">No customers found. Click “Add Customer” to get started.</p>
      )}
    </div>
  );
}
