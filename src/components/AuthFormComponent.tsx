"use client";

import { useState } from "react";
import { signIn, useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

interface AuthFormComponentProps {
  formType: "signup" | "login";
}

const AuthFormComponent: React.FC<AuthFormComponentProps> = ({ formType }) => {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    country: "",
    age: "",
    password: "",
  });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const router = useRouter();
  const { data: session, status } = useSession();

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const handleCountryChange = (value: string) => {
    setFormData((prevData) => ({
      ...prevData,
      country: value,
    }));
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    if (formType === "login") {
      try {
        const result = await signIn("credentials", {
          redirect: false,
          email: formData.email,
          password: formData.password,
        });

        if (result?.error) {
          setError(result.error);
        } else {
          router.push("/dashboard"); // Redirect to dashboard after successful login
        }
      } catch (error) {
        setError("An unexpected error occurred. Please try again.");
      }
    } else {
      try {
        const response = await fetch("/api/auth/signup", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(formData),
        });

        if (!response.ok) {
          const data = await response.json();
          setError(data.error || "Something went wrong");
        } else {
          alert("Signup successful! Please log in.");
          router.push("/login");
        }
      } catch (error) {
        setError("An unexpected error occurred. Please try again.");
      }
    }

    setLoading(false);
  };

  // Show loading state while session status is being determined
  if (status === "loading") {
    return <div>Loading...</div>;
  }

  // Redirect if already logged in
  if (status === "authenticated") {
    router.push("/dashboard");
    return null;
  }

  return (
        <div className="flex flex-col items-center justify-center h-screen">
      <h1 className="text-3xl font-bold mb-6">
        {formType === "signup" ? "Sign Up" : "Login"}
      </h1>
      <form onSubmit={handleSubmit} className="flex flex-col w-80">
        {/* Conditionally render name, country, and age fields only for SignUp */}
        {formType === "signup" && (
          <>
            <Input
              type="text"
              name="name"
              placeholder="Name"
              value={formData.name}
              onChange={handleChange}
              required
              className="mb-4"
            />
            <Select
              value={formData.country}
              onValueChange={handleCountryChange}
              required
            >
              <SelectTrigger>
                <SelectValue placeholder="Select your country" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="INDIA">INDIA</SelectItem>
                <SelectItem value="USA">USA</SelectItem>
                <SelectItem value="Canada">Canada</SelectItem>
                <SelectItem value="UK">UK</SelectItem>
                <SelectItem value="Australia">Australia</SelectItem>
                {/* Add more countries as needed */}
              </SelectContent>
            </Select>
            <Input
              type="number"
              name="age"
              placeholder="Age"
              value={formData.age}
              onChange={handleChange}
              required
              className="my-4"
            />
          </>
        )}

        {/* Email and password fields for both login and signup */}
        <Input
          type="email"
          name="email"
          placeholder="Email"
          value={formData.email}
          onChange={handleChange}
          required
          className="mb-4"
        />
        <Input
          type="password"
          name="password"
          placeholder="Password"
          value={formData.password}
          onChange={handleChange}
          required
          className="mb-4"
        />

        {error && <p className="text-red-500">{error}</p>}

        <Button
          type="submit"
          className={`bg-blue-500 text-white px-4 py-2 rounded ${
            loading ? "opacity-50 cursor-not-allowed" : ""
          }`}
          disabled={loading}
        >
          {loading ? "Loading..." : formType === "signup" ? "Sign Up" : "Login"}
        </Button>
      </form>
    </div>
    // <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100">
    //   <div className="w-full max-w-md p-8 space-y-8 bg-white rounded-xl shadow-md">
    //     <h1 className="text-3xl font-bold text-center text-gray-900">
    //       {formType === "signup" ? "Sign Up" : "Login"}
    //     </h1>
    //     <form onSubmit={handleSubmit} className="space-y-6">
    //       {formType === "signup" && (
    //         <>
    //           <Input
    //             type="text"
    //             name="name"
    //             placeholder="Name"
    //             value={formData.name}
    //             onChange={handleChange}
    //             required
    //           />
    //           <Select
    //             value={formData.country}
    //             onValueChange={handleCountryChange}
    //             required
    //           >
    //             <SelectTrigger>
    //               <SelectValue placeholder="Select your country" />
    //             </SelectTrigger>
    //             <SelectContent>
    //               <SelectItem value="INDIA">INDIA</SelectItem>
    //               <SelectItem value="USA">USA</SelectItem>
    //               <SelectItem value="Canada">Canada</SelectItem>
    //               <SelectItem value="UK">UK</SelectItem>
    //               <SelectItem value="Australia">Australia</SelectItem>
    //             </SelectContent>
    //           </Select>
    //           <Input
    //             type="number"
    //             name="age"
    //             placeholder="Age"
    //             value={formData.age}
    //             onChange={handleChange}
    //             required
    //           />
    //         </>
    //       )}

    //       <Input
    //         type="email"
    //         name="email"
    //         placeholder="Email"
    //         value={formData.email}
    //         onChange={handleChange}
    //         required
    //       />
    //       <Input
    //         type="password"
    //         name="password"
    //         placeholder="Password"
    //         value={formData.password}
    //         onChange={handleChange}
    //         required
    //       />

    //       {error && <p className="text-sm text-red-600">{error}</p>}

    //       <Button type="submit" className="w-full" disabled={loading}>
    //         {loading
    //           ? "Processing..."
    //           : formType === "signup"
    //           ? "Sign Up"
    //           : "Login"}
    //       </Button>
    //     </form>
    //   </div>
    // </div>
  );
};

export default AuthFormComponent;