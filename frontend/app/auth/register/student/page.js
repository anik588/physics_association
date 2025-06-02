'use client';
import { useRouter } from 'next/navigation';
import { useState } from 'react';
import axios from 'axios'; // ✅ You forgot this import

export default function StudentRegister() {
  const router = useRouter();
  const [form, setForm] = useState({
    username: '', email: '', password: '',
    role: 'STUDENT', roll: '', gender: '', session: ''
  });

  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    try {
      await axios.post(`${process.env.NEXT_PUBLIC_API_BASE_URL}/auth/register/`, form, {
        withCredentials: true,
      });
      router.push('/auth/login'); // ✅ success redirect
    } catch (err) {
      setError(err.response?.data?.error || 'Registration failed');
    }
  };

  return (
    <div className="p-6 max-w-md mx-auto">
      <h2 className="text-xl font-bold mb-4">Student Registration</h2>
      {error && <p className="text-red-500">{error}</p>}
      <form onSubmit={handleSubmit} className="space-y-3">
        <input className="w-full p-2 border" placeholder="Username"
          onChange={e => setForm({ ...form, username: e.target.value })} />
        <input className="w-full p-2 border" type="email" placeholder="Email"
          onChange={e => setForm({ ...form, email: e.target.value })} />
        <input className="w-full p-2 border" type="password" placeholder="Password"
          onChange={e => setForm({ ...form, password: e.target.value })} />
        <input className="w-full p-2 border" placeholder="Roll"
          onChange={e => setForm({ ...form, roll: e.target.value })} />
        <select className="w-full p-2 border"
          onChange={e => setForm({ ...form, gender: e.target.value })}>
          <option value="">Select Gender</option>
          <option value="Male">Male</option>
          <option value="Female">Female</option>
        </select>
        <input className="w-full p-2 border" placeholder="Session"
          onChange={e => setForm({ ...form, session: e.target.value })} />
        <button className="w-full bg-blue-600 text-white py-2 rounded" type="submit">
          Register
        </button>
      </form>
    </div>
  );
}
