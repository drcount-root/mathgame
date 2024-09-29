"use client";

import React from "react";
import { ModeToggle } from "./ModeToggle";
import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";
import Link from "next/link";

const NavBar = () => {
  const router = useRouter();

  return (
    <>
      <header className="flex justify-between items-center my-6 w-full">
        <Link href={"/"} className="text-2xl font-bold dark:text-yellow-500">
          MathMatrix
        </Link>
        <nav className="flex gap-4">
          <Button
            variant="outline"
            className="dark:text-yellow-500"
            onClick={() => router.push("/signup")}
          >
            SignUp
          </Button>
          <Button
            variant="outline"
            className="dark:text-yellow-500"
            onClick={() => router.push("/login")}
          >
            Login
          </Button>

          <ModeToggle />
        </nav>
      </header>
    </>
  );
};

export default NavBar;
