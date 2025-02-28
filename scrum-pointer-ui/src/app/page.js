'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';

export default function Home() {
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const createRoom = async () => {
    setLoading(true);
    const response = await fetch('http://localhost:5000/api/rooms', { method: 'POST' });
    const { roomId } = await response.json();
    router.push(`/room/${roomId}`);
  };

  return (
      <div className="flex flex-col items-center justify-center min-h-screen bg-gradient-to-r from-blue-600 to-indigo-800 text-white">
        <h1 className="text-5xl font-bold mb-8">🚀 Agile Pointer</h1>
        <p className="text-lg mb-6">Collaborate, Estimate, and Align with Your Team Effortlessly!</p>
        <button
          onClick={createRoom}
          disabled={loading}
          className={`px-6 py-3 text-lg font-semibold rounded-lg transition-all duration-300 text-blue-900 ${
            loading ? 'bg-gray-400' : 'bg-white hover:bg-white-600'
          }`}
        >
          {loading ? 'Creating Room...' : 'Create a New Room'}
        </button>
    </div>
  );
}
