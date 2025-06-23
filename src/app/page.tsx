"use client";
import React, { useEffect, useState } from 'react';

interface Item {
  id: number;
  name: string;
  price: number;
}

interface User {
  sub: string;
  name: string;
  email: string;
}

export default function ItemsPage() {
  const [items, setItems] = useState<Item[]>([]);
  const [name, setName] = useState('');
  const [price, setPrice] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [user, setUser] = useState<User | null>(null);

  useEffect(() => {
    // Check for user cookie
    const cookies = document.cookie.split(';');
    const userCookie = cookies.find(c => c.trim().startsWith('user='));
    
    if (userCookie) {
      try {
        const userValue = userCookie.split('=')[1];
        // The cookie might be URL encoded
        const decodedValue = decodeURIComponent(userValue);
        const userData = JSON.parse(decodedValue);
        console.log('User authenticated:', userData.name);
        setUser(userData);
      } catch (e) {
        console.error('Error parsing user cookie', e);
      }
    }

    // Fetch items
    fetchItems();
  }, []);

  const fetchItems = async () => {
    setError(null);
    try {
      const res = await fetch('/api/items');
      if (!res.ok) throw new Error('Failed to fetch items');
      setItems(await res.json());
    } catch (e: any) {
      setError(e.message || 'Unknown error');
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    try {
      const res = await fetch('/api/items', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name, price: parseFloat(price) }),
      });
      if (!res.ok) throw new Error('Failed to save item');
      setName('');
      setPrice('');
      await fetchItems();
    } catch (e: any) {
      setError(e.message || 'Unknown error');
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = () => {
    setLoading(true);
    window.location.href = '/api/auth/logout';
  };

  const isAdmin = user != null; // For demo: any logged-in user is considered admin

  return (
    <main className="max-w-xl mx-auto p-4">
      <header className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Shopping Items</h1>
        <div className="flex items-center gap-4">
          {user ? (
            <>
              <span className="font-medium">{user.name}</span>
              <button
                className="bg-gray-300 text-gray-800 px-3 py-1 rounded"
                onClick={handleLogout}
              >
                Sign Out
              </button>
            </>
          ) : (
            <a
              href="/signin"
              className="bg-blue-600 text-white px-3 py-1 rounded"
            >
              Sign In
            </a>
          )}
        </div>
      </header>
      {error && <div className="text-red-600 mb-4">{error}</div>}
      <ul className="mb-8">
        {items.length === 0 && <li className="text-gray-500">No items found.</li>}
        {items.map((item) => (
          <li key={item.id} className="flex justify-between border-b py-2">
            <span>{item.name}</span>
            <span>${item.price.toFixed(2)}</span>
          </li>
        ))}
      </ul>
      {isAdmin ? (
        <section className="bg-gray-50 p-4 rounded shadow mb-4">
          <h2 className="font-semibold mb-2">Add or Update Item</h2>
          <form onSubmit={handleSubmit} className="space-y-2">
            <input
              className="border p-2 w-full"
              placeholder="Item name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
            />
            <input
              className="border p-2 w-full"
              placeholder="Price"
              type="number"
              step="0.01"
              value={price}
              onChange={(e) => setPrice(e.target.value)}
              required
            />
            <button
              className="bg-blue-600 text-white px-4 py-2 rounded disabled:opacity-50"
              type="submit"
              disabled={loading}
            >
              {loading ? 'Saving...' : 'Add/Update Item'}
            </button>
          </form>
        </section>
      ) : (
        <div className="text-gray-500 text-sm">Sign in as admin to add or update items.</div>
      )}
    </main>
  );
}
