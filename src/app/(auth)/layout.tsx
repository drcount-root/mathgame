import NavBar from "@/components/NavBar";
import { ReactNode } from "react";

const AuthLayout = ({
  children,
}: Readonly<{
  children: ReactNode;
}>) => {
  return (
    <main className="max-w-5xl mx-auto">
      <div className="flex flex-col justify-center items-center gap-10">
        <NavBar />
        {/* <h1 className="text-2xl">Auth routes Outlet</h1> */}
        {children}
      </div>
    </main>
  );
};

export default AuthLayout;
