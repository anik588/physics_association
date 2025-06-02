export default function HomePage() {
  return (
    <main className="flex flex-col items-center justify-center min-h-screen text-center p-6">
      <h1 className="text-4xl font-bold mb-4">🎓 Welcome to the Portal</h1>
      <p className="mb-6 text-lg">Choose your role to continue</p>
      <div className="flex gap-6">
        <a href="/student" className="px-6 py-3 bg-blue-600 text-white rounded-lg">Student</a>
        <a href="/teacher" className="px-6 py-3 bg-green-600 text-white rounded-lg">Teacher</a>
      </div>
    </main>
  );
}
