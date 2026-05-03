import { Bell, Gear, Person } from "@gravity-ui/icons";
import SearchBar from "../components/SearchBar";

function Navbar() {
  return (
    <nav className="h-16 bg-slate-50 border-b border-slate-200 py-2 px-6 flex items-center justify-between">
      <div>
        <h1 className="text-2xl font-bold tracking-tight text-blue-900">
          BuildData
        </h1>
      </div>

      <SearchBar />

      <ul className="flex gap-4">
        <li className="text-md">
          <Bell className="h-8 text-slate-500 hover:text-slate-700 duration-200 cursor-pointer" />
        </li>
        <li className="text-md">
          <Gear className="h-8 text-slate-500 hover:text-slate-blue-700 duration-200 cursor-pointer" />
        </li>
        <li className="text-md">
          <Person className="h-8 text-slate-500 hover:text-slate-700 duration-200 cursor-pointer" />
        </li>
      </ul>
    </nav>
  );
}

export default Navbar;
