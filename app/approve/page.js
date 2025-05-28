'use client';
import { useState, useEffect } from 'react';
import Link from 'next/link';
import axios from 'axios';

export default function ApproveDashboard() {
  const [activeTab, setActiveTab] = useState('blogs');
  const [data, setData] = useState({ blogs: [], notes: [], papers: [] });

  useEffect(() => {
    axios.get('/api/teacher/pending').then((res) => setData(res.data));
  }, []);

  const tabs = [
    { key: 'blogs', label: 'Blogs' },
    { key: 'notes', label: 'Notes' },
    { key: 'papers', label: 'Research Papers' },
  ];

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-4">Approval Dashboard</h1>
      <div className="flex space-x-4 mb-6">
        {tabs.map((tab) => (
          <button
            key={tab.key}
            onClick={() => setActiveTab(tab.key)}
            className={`relative px-4 py-2 rounded ${
              activeTab === tab.key ? 'bg-blue-600 text-white' : 'bg-gray-200'
            }`}
          >
            {tab.label}
            {data[tab.key]?.length > 0 && (
              <span className="absolute top-0 right-0 -mt-1 -mr-1 bg-red-500 text-white text-xs rounded-full px-2">
                {data[tab.key].length}
              </span>
            )}
          </button>
        ))}
      </div>
      <div>
        {data[activeTab]?.map((item) => (
          <div key={item.id} className="mb-4 p-4 border rounded shadow">
            <h2 className="text-lg font-semibold">{item.title}</h2>
            <Link href={`/approve/${activeTab}/${item.id}`}>
              <a className="text-blue-500 hover:underline">Review & Approve</a>
            </Link>
          </div>
        ))}
      </div>
    </div>
  );
}
