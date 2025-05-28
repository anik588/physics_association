'use client';
import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useParams, useRouter } from 'next/navigation';

export default function AccountPage() {
  const { username } = useParams();
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [pendingContent, setPendingContent] = useState([]);
  const router = useRouter();

  const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL;

  useEffect(() => {
    const fetchUserData = async () => {
      setLoading(true);
      try {
        const res = await fetch(`${API_BASE_URL}/auth/api/user/${username}/`, {
          credentials: 'include',
          cache: 'no-store',
        });

        if (!res.ok) {
          setError('User not found');
          setLoading(false);
          return;
        }

        const data = await res.json();
        setUser(data);

        if (data.role === 'TEACHER') {
          // Fetch unapproved content for teachers
          const pendingRes = await fetch(`${API_BASE_URL}/auth/api/teacher/pending/`, {
            credentials: 'include',
          });
          const pendingData = await pendingRes.json();
          setPendingContent(pendingData);
        }

      } catch (err) {
        setError('Failed to fetch user data');
      } finally {
        setLoading(false);
      }
    };

    fetchUserData();
  }, [username, API_BASE_URL]);

  const handleApprove = async (model, id) => {
    try {
      const res = await fetch(`${API_BASE_URL}/auth/api/teacher/approve/${model}/${id}/`, {
        method: 'POST',
        credentials: 'include', // Include session cookies for authentication
      });

      const data = await res.json();
      if (res.ok) {
        alert('Content approved');
        // Optionally, refetch or update pending content state
        setPendingContent(prev => ({
          ...prev,
          [model]: prev[model].filter(item => item.id !== id),
        }));
      } else {
        alert(data.error || 'Failed to approve content');
      }
    } catch (error) {
      alert('An error occurred while approving the content');
    }
  };

  if (loading) {
    return <div className="p-6 text-center">Loading user data...</div>;
  }

  if (error) {
    return <div className="p-6 text-center text-red-600">{error}</div>;
  }

  if (!user) {
    return <div className="p-6 text-center">No user data available.</div>;
  }

  return (
    <div className="min-h-screen bg-gray-50 py-10 px-4 sm:px-6 lg:px-8">
      {/* Profile Section */}
      <section className="max-w-4xl mx-auto bg-white shadow-lg rounded-xl p-8 flex flex-col md:flex-row items-center gap-8 mb-10">
        {/* Profile Image Placeholder */}
        <div className="w-32 h-32 rounded-full bg-gray-200 flex items-center justify-center text-gray-400 text-6xl font-bold select-none">
          {user.username?.charAt(0).toUpperCase()}
        </div>

        {/* User Info */}
        <div className="flex-1 text-center md:text-left">
          <h1 className="text-3xl font-extrabold text-gray-900 mb-2">👤 {user.username}</h1>
          <p className="text-gray-600 text-sm sm:text-base mb-1">📧 {user.email}</p>
          <p className="text-gray-600 text-sm sm:text-base mb-1">🎓 Role: {user.role}</p>
          {user.is_owner && <p className="text-green-600 font-semibold mt-2">✅ This is your profile</p>}
        </div>
      </section>

      {/* Teacher's Pending Approval Section */}
      {user.role === 'TEACHER' && (
        <section className="max-w-4xl mx-auto space-y-10 mb-12">
          <h2 className="text-2xl font-bold text-gray-800 mb-4">Pending Approvals</h2>
          {pendingContent && Object.keys(pendingContent).length > 0 ? (
            <div className="space-y-4">
              {Object.entries(pendingContent).map(([type, items]) => (
                <div key={type}>
                  <h3 className="text-xl font-semibold text-gray-800 mb-2 capitalize">{type}</h3>
                  <div className="space-y-3">
                    {items.map((item) => (
                      <div key={item.id} className="bg-white p-4 rounded-xl shadow-sm flex justify-between items-center">
                        <div>
                          <p className="font-medium">{item.title || item.name}</p>
                          <p className="text-sm text-gray-500">
                            Verified: {item.is_verified ? '✅' : '🕒'}
                          </p>
                        </div>

                        {/* Dynamic Approve Button */}
                        <button
                          onClick={() => handleApprove(type, item.id)}
                          className="text-green-600 hover:underline"
                        >
                          Approve
                        </button>
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <p>No pending content for approval</p>
          )}
        </section>
      )}
    </div>
  );
}
