'use client';
import { useRouter } from 'next/navigation';

export default function RoleSelect() {
  const router = useRouter();

  const handleSelect = (role) => {
    router.push(`/auth/register/${role.toLowerCase()}`);
  };

  return (
    <div className="p-6 text-center">
      <h2 className="text-2xl font-bold mb-4">Select Role to Register</h2>
      <div className="flex justify-center gap-6">
        <button onClick={() => handleSelect('STUDENT')} className="bg-blue-600 text-white px-6 py-2 rounded">Student</button>
        <button onClick={() => handleSelect('TEACHER')} className="bg-green-600 text-white px-6 py-2 rounded">Teacher</button>
      </div>
    </div>
  );
}
