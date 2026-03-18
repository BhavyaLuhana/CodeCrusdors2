import { UserButton } from "@clerk/clerk-react";
import { Bell, Search } from "lucide-react";

function Navbar() {
  return (
    <div className="flex justify-between items-center px-6 py-4 bg-neutral-900 text-white">
      <h1 className="text-xl font-semibold">SignApp</h1>

      <div className="flex items-center gap-6">
        <Search className="cursor-pointer" />
        <Bell className="cursor-pointer" />
        <UserButton />
      </div>
    </div>
  );
}

export default Navbar;