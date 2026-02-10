import { redirect } from "next/navigation";
import { createClient } from "@/app/utils/supabase/server";
import SignOutButton from "./sign-out-button";

export default async function ProtectedPage() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) {
    redirect("/");
  }

  const { data: majors, error } = await supabase
    .from("university_majors")
    .select("*");

  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-500 to-purple-600 p-8">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-5xl font-bold text-white">University Majors</h1>
        <div className="flex items-center gap-4">
          <span className="text-white/80 text-sm">{user.email}</span>
          <SignOutButton />
        </div>
      </div>

      {error ? (
        <p className="text-red-200">Failed to load majors.</p>
      ) : (
        <ul className="space-y-2 max-w-md">
          {majors?.map((major) => (
            <li
              key={major.id}
              className="bg-white/10 text-white rounded-lg px-4 py-3"
            >
              {major.name}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
