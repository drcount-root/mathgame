"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button"; // Adjust import based on your file structure
import { Input } from "@/components/ui/input"; // Adjust import based on your file structure
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"; // Adjust import based on your file structure

// Define the type for formType prop: "signup" or "login"
interface AuthFormComponentProps {
  formType: "signup" | "login";
}

const AuthFormComponent: React.FC<AuthFormComponentProps> = ({ formType }) => {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    country: "",
    age: "",
    password: "", // Added password for both login and signup
  });

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

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (formType === "signup") {
      console.log("Sign Up Data Submitted:", formData);
    } else {
      console.log("Login Data Submitted:", formData);
    }
    // Here, you would typically send formData to your backend or API
    setFormData({ name: "", email: "", country: "", age: "", password: "" }); // Reset form
  };

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

        <Button
          type="submit"
          className="bg-blue-500 text-white px-4 py-2 rounded"
        >
          {formType === "signup" ? "Sign Up" : "Login"}
        </Button>
      </form>
    </div>
  );
};

export default AuthFormComponent;