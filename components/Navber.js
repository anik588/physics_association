'use client';
import { useEffect, useState } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import Link from 'next/link';
import { Menu, X } from 'lucide-react';
import Image from 'next/image';
import { useDataContext } from '../context/DataContext';

export default function Navber() {
  const { userData, logoutUser, fetchUserData } = useDataContext();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    fetchUserData(); // refresh user on route change
  }, [pathname]);

  const handleLogout = async () => {
    await logoutUser();
    router.push('/auth/login');
  };

  return (
    <>
      <nav className="fixed w-full top-0 z-50 bg-black/60 backdrop-blur shadow-sm">
        <div className="max-w-7xl mx-auto px-4 py-3 flex items-center justify-between relative">

          {/* Left side - hamburger on mobile */}
          <div className="md:hidden">
            <button
              onClick={() => setSidebarOpen(!sidebarOpen)}
              aria-label="Toggle Menu"
              className="text-white"
            >
              {sidebarOpen ? <X size={28} /> : <Menu size={28} />}
            </button>
          </div>

          {/* Center - Logo always centered */}
          <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-12 h-12 relative">
            <Image
              src="https://upload.wikimedia.org/wikipedia/en/3/35/Kabi_Nazrul_Government_College_Monogram.svg"
              alt="Kabi Nazrul Government College Monogram"
              fill
              className="object-contain"
            />
          </div>

          {/* Right side - desktop nav + user */}
          <div className="hidden md:flex items-center gap-6">

            <Link href="/" className="hover:text-gray-300">Home</Link>
            <Link href="/about" className="hover:text-gray-300">About</Link>
            <Link href="/contact" className="hover:text-gray-300">Contact</Link>

            {userData ? (
              <div className="flex items-center gap-4">
                              <button onClick={() => router.push(`/account/${userData.username}`)} className="text-blue-400 hover:text-blue-600">
                <span className="text-white font-semibold">👤 {userData.username}</span>
              </button>

                <button
                  onClick={handleLogout}
                  className="text-red-400 hover:text-red-600"
                >
                  Logout
                </button>
              </div>
            ) : (
              <button
                onClick={() => router.push('/auth/login')}
                className="text-blue-400 hover:text-blue-600"
              >
                Login
              </button>
            )}

          </div>
        </div>
      </nav>

      {/* Sidebar for mobile */}
      <div className={`fixed top-0 left-0 z-40 w-64 h-full bg-black text-white transform transition-transform duration-300 ${sidebarOpen ? 'translate-x-0' : '-translate-x-full'}`}>
        <div className="p-6">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-xl font-semibold">Menu</h2>
            <button onClick={() => setSidebarOpen(false)} aria-label="Close Menu">
              <X size={20} />
            </button>
          </div>

          <div className="mb-6">
            {userData ? (
              <div>
                <p className="font-semibold">👤 {userData.username}</p>
                <button onClick={handleLogout} className="mt-2 text-sm text-red-400 hover:text-red-600">
                  Logout
                </button>
              </div>
            ) : (
              <button onClick={() => router.push('/auth/login')} className="text-blue-400 hover:text-blue-600">
                Login
              </button>
            )}
          </div>

          <Link href="/" className="block w-full text-left py-2 hover:bg-gray-800">Home</Link>
          <Link href="/about" className="block w-full text-left py-2 hover:bg-gray-800">About</Link>
          <Link href="/contact" className="block w-full text-left py-2 hover:bg-gray-800">Contact</Link>
        </div>
      </div>
    </>
  );
}
