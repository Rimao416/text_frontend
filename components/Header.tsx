import { useAppSelector } from "@/store/store";
import Link from "next/link";

const Header = () => {
  const user=useAppSelector((state) => state.auth.user);  
  const handleSignOut = () => {
    console.log("object")
  }
  return (
    <header className="bg-gray-800 text-white p-4 flex justify-between items-center">
      <Link href="/" className="flex items-center">
        <h1 className="text-xl font-bold">Kodschul Management Hub</h1>
      </Link>
      <div className="flex items-center space-x-4">
        <span className="text-sm">Welcome, {user?.name}</span>
        <Link
          href="/login"
          className="bg-red-500 text-white px-4 py-2 rounded-lg shadow-md hover:bg-red-600"
        >
          Sign Out
        </Link>
      </div>
    </header>
  );
};

export default Header;
