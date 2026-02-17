import { redirect } from "next/navigation";
import { createClient } from "../utils/supabase/server";
import SignOutButton from "./sign-out-button";
import CaptionList from "./caption-list";

export default async function ProtectedPage() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) {
    redirect("/");
  }

  const { data: captions, error } = await supabase
    .from("captions")
    .select("id, content, like_count, images(url)");

  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-500 to-purple-600 p-8">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-5xl font-bold text-white">Captions</h1>
        <div className="flex items-center gap-4">
          <span className="text-white/80 text-sm">{user.email}</span>
          <SignOutButton />
        </div>
      </div>

      {error ? (
        <p className="text-red-200">Failed to load captions.</p>
      ) : (
        <CaptionList captions={captions ?? []} userId={user.id} />
      )}
    </div>
  );
}
