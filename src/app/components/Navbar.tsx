import Link from "next/link";
import { usePathname } from "next/navigation";
import Image from "next/image";
export default function Navbar({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  return (
    <div className="bg-gray-100 min-h-screen">
      <div className="w-[390px] mx-auto h-screen bg-white overflow-y-auto relative shadow-xl">
        <div className="">
          <div className="h-[120px] w-full bg-gradient-to-r from-[#1E90FF] to-[#000022] relative">
            {pathname === "/" ? (
              <div
                className="absolute -bottom-6 left-1/2 transform -translate-x-1/2 w-[120px] h-12 bg-white"
                style={{
                  borderTopRightRadius: "50px",
                  borderTopLeftRadius: "50px",
                }}
              ></div>
            ) : (
              <div></div>
            )}
          </div>

          <div className="absolute top-4 left-33">
            <Image src="/logo.png" alt="H8X Logo" width={50} height={50} className="h-25 w-25" />
          </div>
          {children}
          <nav className="fixed bottom-0 left-0 right-0 w-[390px] mx-auto bg-white border-t py-2">
            <div className="flex justify-around items-center px-6">
              <Link href="/" className={`${pathname === "/" ? "text-[#27005D]" : "text-gray-400"}`}>
                <svg className="w-6 h-6 " fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6"
                  />
                </svg>
              </Link>
              <Link href="/products" className={`${pathname === "/products" ? "text-[#27005D]" : "text-gray-400"}`}>
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                  />
                </svg>
              </Link>
              <Link
                href="/product-info"
                className={`${pathname === "/product-info" ? "text-[#27005D]" : "text-gray-400"}`}
              >
                <svg
                  className="w-6 h-6"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M5 8h14M5 8a2 2 0 110-4h14a2 2 0 110 4M5 8v10a2 2 0 002 2h10a2 2 0 002-2V8m-9 4h4"
                  ></path>
                </svg>
              </Link>
              <Link href="/favorites" className={`${pathname === "/favorites" ? "text-[#27005D]" : "text-gray-400"}`}>
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"
                  />
                </svg>
              </Link>
              <Link href="/profile" className={`${pathname === "/profile" ? "text-[#27005D]" : "text-gray-400"}`}>
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
                  />
                </svg>
              </Link>
            </div>
          </nav>
        </div>
      </div>
    </div>
  );
}
