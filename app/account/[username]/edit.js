'use client';
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';

export default function EditAccountPage() {
  const [userData, setUserData] = useState({
    email: '',
    bio: '',
    profile_picture: '',
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const router = useRouter();

 useEffect(() => {
  const fetchUser = async () => {
    setLoading(true);
    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/auth/api/user/`, {
        credentials: 'include',
        cache: 'no-store',
      });

      if (!res.ok) {
        setError('Failed to fetch user data');
        return;
      }

      const data = await res.json();
      setUserData({
        email: data.email || '',
        bio: data.bio || '',
        profile_picture: data.profile_picture || '',
      });
    } catch {
      setError('Failed to fetch user data');
    } finally {
      setLoading(false);
    }
  };

  fetchUser();
}, []);


  const handleSubmit = async (e) => {
    e.preventDefault();

    const formData = new FormData();
    formData.append('email', userData.email);
    formData.append('bio', userData.bio);
    if (userData.profile_picture) {
      formData.append('profile_picture', userData.profile_picture);
    }

    const res = await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/auth/api/user/edit/`, {
      method: 'POST',
      body: formData,
      credentials: 'include',
    });

    if (res.ok) {
      router.push(`/account/${userData.username}`);
    } else {
      setError('Failed to update profile');
    }
  };

  if (loading) return <div>Loading...</div>;
  if (error) return <div>{error}</div>;

  return (
    <div className="min-h-screen bg-gray-50 py-10 px-4 sm:px-6 lg:px-8">
      <form onSubmit={handleSubmit} className="max-w-4xl mx-auto bg-white shadow-lg rounded-xl p-8">
        <h2 className="text-3xl font-bold text-gray-900 mb-4">Edit Profile</h2>
        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700">Email</label>
          <input
            type="email"
            value={userData.email}
            onChange={(e) => setUserData({ ...userData, email: e.target.value })}
            className="mt-1 block w-full p-2 border border-gray-300 rounded-md"
            required
          />
        </div>
        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700">Bio</label>
          <textarea
            value={userData.bio}
            onChange={(e) => setUserData({ ...userData, bio: e.target.value })}
            className="mt-1 block w-full p-2 border border-gray-300 rounded-md"
          />
        </div>
        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700">Profile Picture</label>
          <input
            type="file"
            onChange={(e) => setUserData({ ...userData, profile_picture: e.target.files[0] })}
            className="mt-1 block w-full p-2 border border-gray-300 rounded-md"
          />
        </div>
        <button type="submit" className="w-full bg-blue-600 text-white py-2 rounded-md hover:bg-blue-700">
          Save Changes
        </button>
      </form>
    </div>
  );
}
