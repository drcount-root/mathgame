"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

import Link from "next/link";

export const metadata = {
  title: "404 - MathMatrix",
  description: "Not Found - MathMatrix",
};

export default function FourZeroFour() {
  const router = useRouter();
  const [timeLeft, setTimeLeft] = useState(5);

  useEffect(() => {
    const countdown = setInterval(() => {
      setTimeLeft((prevTime) => {
        if (prevTime <= 1) {
          router.push("/");
          clearInterval(countdown);
          return 0;
        }
        return prevTime - 1;
      });
    }, 1000);

    return () => clearInterval(countdown);
  }, [router]);

  return (
    <div className="mx-auto max-w-3xl px-4 sm:px-9 xl:max-w-5xl xl:px-0">
      <div className="space-x-1 pt-20 pb-10 md:space-y-5 flex flex-col gap-10">
        <h1 className="text-6xl font-extrabold leading-9 tracking-tight text-gray-900 dark:text-gray-100 md:text-8xl md:leading-14">
          Oops...
        </h1>
        <h1 className="text-6xl font-extrabold leading-9 tracking-tight text-gray-900 dark:text-gray-100 md:text-8xl md:leading-14">
          404
        </h1>
      </div>
      <div className="max-w-xl">
        <p className="mb-4 text-xl font-bold leading-normal md:text-2xl">
          Sorry we couldn't find this page.
        </p>
        <p className="mb-8">
          But don't worry, you will be redirected to the homepage in {timeLeft}{" "}
          second
          {timeLeft === 1 ? "" : "s"}...
        </p>
        <Link href="/">Back to homepage</Link>
      </div>
    </div>
  );
}
