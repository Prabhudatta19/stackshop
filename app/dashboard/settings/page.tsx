'use client';

import { useEffect, useState } from 'react';
import { supabase } from '@/lib/supabaseClient';

type ShopSettings = {
  name: string;
  points_earned_per_100: number;
  min_points_to_redeem: number;
  redeem_value_per_100_points: number;
};

export default function SettingsPage() {
  const [settings, setSettings] = useState<ShopSettings>({
    name: '',
    points_earned_per_100: 1,
    min_points_to_redeem: 100,
    redeem_value_per_100_points: 10,
  });
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState<string | null>(null);

  // Load existing settings
  useEffect(() => {
    (async () => {
      setLoading(true);
      const {
        data: { session },
      } = await supabase.auth.getSession();
      if (!session?.user) {
        setLoading(false);
        return;
      }

      const { data: shop, error } = await supabase
        .from('shops')
        .select(
          'name, points_earned_per_100, min_points_to_redeem, redeem_value_per_100_points'
        )
        .eq('owner_id', session.user.id)
        .single();

      if (error) {
        console.error('Error loading settings:', error);
      } else if (shop) {
        setSettings({
          name: shop.name,
          points_earned_per_100: shop.points_earned_per_100,
          min_points_to_redeem: shop.min_points_to_redeem,
          redeem_value_per_100_points: shop.redeem_value_per_100_points,
        });
      }
      setLoading(false);
    })();
  }, []);

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setMessage(null);

    const {
      data: { session },
    } = await supabase.auth.getSession();
    if (!session?.user) {
      setMessage('You must be logged in to save settings.');
      setSaving(false);
      return;
    }

    const { error } = await supabase
      .from('shops')
      .update({
        name: settings.name,
        points_earned_per_100: settings.points_earned_per_100,
        min_points_to_redeem: settings.min_points_to_redeem,
        redeem_value_per_100_points: settings.redeem_value_per_100_points,
      })
      .eq('owner_id', session.user.id);

    if (error) {
      setMessage(`Error: ${error.message}`);
    } else {
      setMessage('Settings saved successfully.');
    }

    setSaving(false);
  };

  if (loading) {
    return <p className="p-6">Loading settings…</p>;
  }

  return (
    <div className="p-6 max-w-lg mx-auto">
      <h1 className="text-2xl font-bold mb-4">Shop Settings</h1>
      <form
        onSubmit={handleSave}
        className="glass-bg p-6 rounded-lg shadow space-y-5"
      >
        {/* Shop Name */}
        <div>
          <label className="block text-sm font-medium mb-1">Shop Name</label>
          <input
            type="text"
            value={settings.name}
            onChange={(e) =>
              setSettings(s => ({ ...s, name: e.target.value }))
            }
            className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:border-blue-500"
            required
          />
        </div>

        {/* Points per ₹100 */}
        <div>
          <label className="block text-sm font-medium mb-1">
            Points Earned per ₹100 Spent
          </label>
          <input
            type="number"
            min={0}
            value={settings.points_earned_per_100}
            onChange={(e) =>
              setSettings(s => ({
                ...s,
                points_earned_per_100: Number(e.target.value),
              }))
            }
            className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:border-blue-500"
            required
          />
        </div>

        {/* Minimum Points to Redeem */}
        <div>
          <label className="block text-sm font-medium mb-1">
            Minimum Points Needed for Redemption
          </label>
          <input
            type="number"
            min={1}
            value={settings.min_points_to_redeem}
            onChange={(e) =>
              setSettings(s => ({
                ...s,
                min_points_to_redeem: Number(e.target.value),
              }))
            }
            className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:border-blue-500"
            required
          />
        </div>

        {/* Redemption Value */}
        <div>
          <label className="block text-sm font-medium mb-1">
            Redemption Value (₹ for {settings.min_points_to_redeem} points)
          </label>
          <input
            type="number"
            min={0}
            value={settings.redeem_value_per_100_points}
            onChange={(e) =>
              setSettings(s => ({
                ...s,
                redeem_value_per_100_points: Number(e.target.value),
              }))
            }
            className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:border-blue-500"
            required
          />
        </div>

        {/* Save Button */}
        <button
          type="submit"
          disabled={saving}
          className="w-full bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700 transition"
        >
          {saving ? 'Saving…' : 'Save Settings'}
        </button>

        {message && (
          <p className="mt-2 text-center text-sm text-gray-700">{message}</p>
        )}
      </form>
    </div>
  );
}
