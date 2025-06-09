"use client";

import Navbar from "./components/Navbar";
import { useSession } from "@/lib/auth-client";

const App = ({ children }: { children: React.ReactNode }) => {
  const session = useSession();
  console.log(session);
  return (
    <>
      <Navbar>{children}</Navbar>
    </>
  );
};

export default App;
