"use client";

import { Home, User } from "lucide-react";
import { signOut, useSession } from "next-auth/react";
import Link from "next/link";
import { useNotification } from "./Notification";

function Header() {
  const { data: session } = useSession();
  const { show } = useNotification();

  const handleSignOut = async () => {
    try {
      await signOut();
      show("Signed out successfully", "success");
    } catch (error) {
      show("Failed to sign out", "error");
    }
  };

  return (
    <div className="navbar bg-base-300 sticky top-0 z-40 w-full">
      <div className="container mx-auto flex justify-center items-center px-4 py-3">
        <Link
          href="/"
          className="btn btn-ghost text-xl gap-2 normal-case font-bold absolute left-4 flex"
          onClick={() => show("Welcome to Vistoria", "info")}
        >
          <Home className="w-5 h-5" />
          Vistoria
        </Link>

        <div className="flex flex-row items-center gap-6">
          {session ? (
            <>
              <Link
                href="/upload"
                className="btn btn-primary px-4 py-2"
                onClick={() => show("Upload your files", "info")}
              >
                Upload
              </Link>

              <div className="dropdown dropdown-end flex">
                <div
                  tabIndex={0}
                  role="button"
                  aria-haspopup="true"
                  aria-expanded="false"
                  className="btn btn-ghost btn-circle flex"
                >
                  <User className="w-5 h-5" />
                </div>
                <ul
                  tabIndex={0}
                  className="dropdown-content z-[1] shadow-lg bg-base-100 rounded-box w-64 mt-4 py-2 flex"
                >
                  <li className="px-4 py-1">
                    <span className="text-sm opacity-70">
                      {session.user.email?.split("@")[0]}
                    </span>
                  </li>

                  <div className="divider my-1"></div>

                  <li>
                    <button
                      className="px-4 py-2 text-error w-full hover:bg-base-200 text-left"
                      onClick={handleSignOut}
                    >
                      Sign Out
                    </button>
                  </li>
                </ul>
              </div>
            </>
          ) : (
            <Link
              href="/login"
              className="btn btn-secondary px-4 py-2"
              onClick={() => show("Login to continue", "info")}
            >
              Login
            </Link>
          )}
        </div>
      </div>
    </div>
  );
}

export default Header;
