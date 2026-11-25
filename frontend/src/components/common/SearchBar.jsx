import { Search } from "lucide-react";

export default function SearchBar() {
  return (
    <div className="relative w-full max-w-[420px]">
      <Search
        size={20}
        className="absolute left-5 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none"
      />

      <input
        type="text"
        placeholder="Search cases..."
        className="
          w-full
          h-14
          rounded-full
          bg-[#13233A]/80
          backdrop-blur-xl
          border border-blue-500/20
          pl-14
          pr-5
          text-white
          text-base
          placeholder:text-slate-400
          placeholder:text-center
          focus:placeholder:text-left
          focus:outline-none
          focus:border-blue-400
          focus:ring-4
          focus:ring-blue-500/20
          transition-all
          duration-300
        "
      />
    </div>
  );
}