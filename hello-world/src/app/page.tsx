"use client";

import { createClient } from "@/app/utils/supabase/client";

export default function Home() {
  const handleSignIn = () => {
    const supabase = createClient();
    supabase.auth.signInWithOAuth({
      provider: "google",
      options: {
        redirectTo: `${window.location.origin}/auth/callback`,
      },
    });
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-500 to-purple-600 flex items-center justify-center">
      <div className="text-center">
        <h1 className="text-5xl font-bold text-white mb-8">
          University Majors
        </h1>
        <p className="text-white/80 mb-8">
          Sign in to view university majors
        </p>
        <button
          onClick={handleSignIn}
          className="bg-white text-purple-600 font-semibold px-6 py-3 rounded-lg hover:bg-white/90 transition-colors cursor-pointer"
        >
          Sign in with Google
        </button>
      </div>
    </div>
  );
}
