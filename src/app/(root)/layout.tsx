import NavBar from "@/components/NavBar";
import { ReactNode } from "react";

const SubRootLayout = ({
  children,
}: Readonly<{
  children: ReactNode;
}>) => {
  return (
    <main className="max-w-5xl mx-auto">
      <div className="flex flex-col justify-center items-center gap-10">
        <NavBar />
        {/* <h1 className="text-2xl">Root routes Outlet</h1>
        <div>Sidebar</div> */}
        {children}
      </div>
    </main>
  );
};

export default SubRootLayout;
