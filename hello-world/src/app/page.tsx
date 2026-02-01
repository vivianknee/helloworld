import { supabase } from "./utils/supabase";

export default async function Home() {
  const { data: majors, error } = await supabase
    .from("university_majors")
    .select("*");

  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-500 to-purple-600 p-8">
      <h1 className="text-5xl font-bold text-white mb-8">University Majors</h1>
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
