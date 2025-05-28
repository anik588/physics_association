"use client";
import { useEffect, useState, useContext } from "react";
import { DataContext } from "@/context/DataContext";
import Link from "next/link";

export default function AccountPage() {
  const { userData, fetchUserData } = useContext(DataContext);
  const [isTeacher, setIsTeacher] = useState(false);

  useEffect(() => {
    fetchUserData();
  }, []);

  useEffect(() => {
    if (userData?.role === "TEACHER") {
      setIsTeacher(true);
    }
  }, [userData]);

  if (!userData) return <p className="text-center mt-10">Loading...</p>;

  return (
    <div className="p-6 max-w-6xl mx-auto">
      <h1 className="text-2xl font-semibold mb-4">My Account</h1>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {userData.blogs.map((b) => (
          <div key={b.id} className="p-4 border rounded-xl shadow">
            <h2 className="text-lg font-bold">{b.title}</h2>
            <p className="text-sm">Verified: {b.is_verified ? "Yes" : "No"}</p>
            <Link href={`/blogs/${b.id}`} className="text-blue-600 mt-2 inline-block">View</Link>
          </div>
        ))}
      </div>

      <div className="mt-10">
        <h2 className="text-xl font-semibold mb-2">Upload New</h2>
        {/* Forms for blog, notes, etc. */}
      </div>

      {isTeacher && (
        <div className="mt-10">
          <h2 className="text-xl font-semibold mb-2">Pending Approvals</h2>
          <Link href="/approve/blogs" className="text-blue-600">Blogs</Link>,
          <Link href="/approve/notes" className="text-blue-600 ml-2">Notes</Link>,
          <Link href="/approve/papers" className="text-blue-600 ml-2">Papers</Link>
        </div>
      )}
    </div>
  );
}