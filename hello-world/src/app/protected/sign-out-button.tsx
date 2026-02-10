"use client";

import { createClient } from "@/app/utils/supabase/client";
import { useRouter } from "next/navigation";

export default function SignOutButton() {
  const router = useRouter();

  const handleSignOut = async () => {
    const supabase = createClient();
    await supabase.auth.signOut();
    router.push("/");
  };

  return (
    <button
      onClick={handleSignOut}
      className="bg-white/20 hover:bg-white/30 text-white px-4 py-2 rounded-lg transition-colors cursor-pointer"
    >
      Sign Out
    </button>
  );
}
