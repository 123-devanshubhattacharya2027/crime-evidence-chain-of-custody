import { useEffect, useState } from "react";
import { Users, Search, Shield } from "lucide-react";
import GlassCard from "../components/layout/GlassCard";
import { getUsers } from "../services/userService";

export default function UsersPage() {
  const [users, setUsers] = useState([]);
  const [filtered, setFiltered] = useState([]);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadUsers();
  }, []);

  useEffect(() => {
    const value = search.toLowerCase();

    setFiltered(
      users.filter(
        (u) =>
          u.name?.toLowerCase().includes(value) ||
          u.email?.toLowerCase().includes(value)
      )
    );
  }, [search, users]);

  async function loadUsers() {
    try {
      const data = await getUsers();
      setUsers(data);
      setFiltered(data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  }

  const roleBadge = (role) => {
    switch (role) {
      case "Admin":
        return "bg-red-500/15 border-red-500/30 text-red-300";
      case "Investigator":
        return "bg-cyan-500/15 border-cyan-500/30 text-cyan-300";
      case "Forensic":
        return "bg-purple-500/15 border-purple-500/30 text-purple-300";
      default:
        return "bg-gray-500/15 border-gray-500/30 text-gray-300";
    }
  };

  return (
    <div className="space-y-6">

      <div>
        <h1 className="text-3xl font-black text-white">
          User Management
        </h1>

        <p className="text-cyan-300 mt-1">
          Live users from ASP.NET Core
        </p>
      </div>

      <GlassCard className="p-4">
        <div className="relative">
          <Search
            className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
            size={18}
          />

          <input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search users..."
            className="w-full rounded-xl bg-[#071929] border border-white/10 pl-10 pr-4 py-3 outline-none focus:border-cyan-400"
          />
        </div>
      </GlassCard>

      <GlassCard className="overflow-hidden">

        {loading ? (
          <div className="p-8 text-center text-gray-400">
            Loading users...
          </div>
        ) : filtered.length === 0 ? (
          <div className="p-10 text-center">
            <Users className="mx-auto mb-3 text-cyan-400" size={40}/>
            <p className="text-gray-400">No users found.</p>
          </div>
        ) : (
          <div className="overflow-x-auto">

            <table className="w-full">

              <thead className="bg-white/5 text-left text-sm text-gray-300">
                <tr>
                  <th className="p-4">Officer</th>
                  <th className="p-4">Email</th>
                  <th className="p-4">Role</th>
                  <th className="p-4">Status</th>
                </tr>
              </thead>

              <tbody>

                {filtered.map((user) => (
                  <tr
                    key={user.id}
                    className="border-t border-white/10 hover:bg-white/5 transition"
                  >
                    <td className="p-4">
                      <div className="flex items-center gap-3">

                        <div className="w-10 h-10 rounded-full bg-cyan-600 flex items-center justify-center">
                          <Shield size={18}/>
                        </div>

                        <div>
                          <p className="font-semibold">{user.name}</p>

                          <p className="text-xs text-gray-400">
                            ID: {user.id}
                          </p>
                        </div>

                      </div>
                    </td>

                    <td className="p-4 text-gray-300">
                      {user.email}
                    </td>

                    <td className="p-4">
                      <span
                        className={`rounded-full border px-3 py-1 text-sm ${roleBadge(user.role)}`}
                      >
                        {user.role}
                      </span>
                    </td>

                    <td className="p-4">
                      <span className="rounded-full bg-emerald-500/15 border border-emerald-500/30 px-3 py-1 text-sm text-emerald-300">
                        Active
                      </span>
                    </td>

                  </tr>
                ))}

              </tbody>

            </table>

          </div>
        )}

      </GlassCard>

    </div>
  );
}