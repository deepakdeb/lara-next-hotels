"use client";
import Link from "next/link";
import { useSession, signOut } from "next-auth/react";
import { usePathname } from "next/navigation";

export default function Navbar() {
  const { data: session } = useSession();
  const pathname = usePathname();

  return (
    <nav className="navbar navbar-expand-lg navbar-dark bg-dark px-3">
      <Link className="navbar-brand" href="/">
        Hotel Manager
      </Link>
      <div className="collapse navbar-collapse">
        <ul className="navbar-nav me-auto">
          <li className="nav-item">
            <Link className="nav-link" href="/hotels">
              Manage Hotels
            </Link>
          </li>
        </ul>
        <div className="d-flex">
          {session ? (
            <>
              <span className="navbar-text me-3">Welcome, {session.user.name}</span>
              <button className="btn btn-outline-light" onClick={() => signOut()}>
                Logout
              </button>
            </>
          ) : (
            <>
              <Link
                className="btn btn-outline-light me-2"
                href="/login"
              >
                Login
              </Link>
              <Link
                className="btn btn-outline-light"
                href="/register"
              >
                Register
              </Link>
            </>
          )}
        </div>
      </div>
    </nav>
  );
}
