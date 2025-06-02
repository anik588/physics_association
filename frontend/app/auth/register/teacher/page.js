'use client';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import axios from 'axios';

export default function TeacherRegister() {
  const router = useRouter();
  const [form, setForm] = useState({
    username: '', email: '', password: '',
    role: 'TEACHER', position: '', university: ''
  });
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await axios.post(`${process.env.NEXT_PUBLIC_API_BASE_URL}/auth/register/`, form, { withCredentials: true });
      router.push('/auth/login');
    } catch (err) {
      setError(err.response?.data?.error || 'Registration failed');
    }
  };

  return (
    <div className="p-6 max-w-md mx-auto text-black">
      <h2 className="text-xl font-bold mb-4">Teacher Registration</h2>
      {error && <p className="text-red-500">{error}</p>}
      <form onSubmit={handleSubmit} className="space-y-3">
        <input className="w-full p-2 border" placeholder="Username" onChange={e => setForm({ ...form, username: e.target.value })} />
        <input className="w-full p-2 border" type="email" placeholder="Email" onChange={e => setForm({ ...form, email: e.target.value })} />
        <input className="w-full p-2 border" type="password" placeholder="Password" onChange={e => setForm({ ...form, password: e.target.value })} />
        <input className="w-full p-2 border" placeholder="Position" onChange={e => setForm({ ...form, position: e.target.value })} />
        <input className="w-full p-2 border" placeholder="University" onChange={e => setForm({ ...form, university: e.target.value })} />
        <button className="w-full bg-green-600 text-white py-2 rounded" type="submit">Register</button>
      </form>
    </div>
  );
}
