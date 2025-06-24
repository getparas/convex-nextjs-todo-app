import Link from "next/link";
import { isAuthenticatedNextjs } from "@convex-dev/auth/nextjs/server";
import UserDetails from "./user-details";
import { Square } from "lucide-react";

export default async function Navbar() {
  return (
    <header className="w-full bg-gradient-to-r from-black via-gray-900 to-black border-b-4 border-black">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-20">
          <Link href="/" className="group flex items-center gap-3">
            <div className="w-8 h-8 bg-white border-2 border-black transform group-hover:rotate-45 transition-transform duration-200">
              <Square className="w-full h-full text-black p-1" />
            </div>
            <h1 className="text-3xl font-black text-white tracking-tight group-hover:tracking-wide transition-all duration-200">
              TODO
            </h1>
          </Link>

          <div className="flex items-center gap-4">
            {(await isAuthenticatedNextjs()) && <UserDetails />}
          </div>
        </div>
      </div>
    </header>
  );
}
