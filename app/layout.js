// app/layout.js
import "./globals.css";
import Navber from "../components/Navber";
import { PublicContentProvider } from '../context/PublicContentContext';
import { DataProvider } from '../context/DataContext';

import { Inter, Roboto_Mono } from 'next/font/google';

// Load fonts with CSS variables for consistent usage
const inter = Inter({ subsets: ['latin'], variable: '--font-inter' });
const robotoMono = Roboto_Mono({ subsets: ['latin'], variable: '--font-roboto-mono' });

export const metadata = {
  title: 'Your App',
  description: 'SSR Model Preloading',
};

export default async function RootLayout({ children }) {
  let publicData = {
    blogs: [],
    notes: [],
    papers: [],
    videos: [],
    events: [],
  };

  const models = ['blogs', 'notes', 'papers', 'videos', 'events'];

  try {
    const results = await Promise.all(
      models.map(async model => {
        try {
          const res = await fetch(`http://localhost:8000/auth/api/public/${model}/`, {
            cache: 'no-store',
          });
          if (!res.ok) {
            console.error(`Fetch failed for ${model} with status ${res.status}`);
            return [];
          }
          return await res.json();
        } catch (err) {
          console.error(`Fetch error for ${model}:`, err);
          return [];
        }
      })
    );
    models.forEach((model, idx) => (publicData[model] = results[idx]));
  } catch (e) {
    console.error('Public preload failed:', e);
  }

  // Compose className from loaded fonts + tailwind classes
  const bodyClass = `${inter.variable} ${robotoMono.variable} antialiased`;

  // **Important:** Avoid adding inline styles to <html> or <body> that change between server and client

  return (
    <html lang="en">
      <body className={bodyClass}>
        <DataProvider>
          <PublicContentProvider initialData={publicData}>
            <div className="min-h-screen flex flex-col">
              <Navber />
              <main className="flex-1 pt-20">
                {children}
              </main>
            </div>
          </PublicContentProvider>
        </DataProvider>
      </body>
    </html>
  );
}
