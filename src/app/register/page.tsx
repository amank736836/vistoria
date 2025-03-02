"use client";

import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

function Register() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [disabled, setDisabled] = useState(true);

  const router = useRouter();

  useEffect(() => {
    setDisabled(
      !email || !password || !confirmPassword || password !== confirmPassword
    );

    if (
      password !== confirmPassword &&
      password.length > 0 &&
      confirmPassword.length > 0 &&
      (confirmPassword.length + 1 === password.length ||
        confirmPassword.length === password.length ||
        confirmPassword.length > password.length)
    ) {
      setError("Passwords do not match");
    } else {
      setError("");
    }
  }, [email, password, confirmPassword]);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    if (password !== confirmPassword) {
      setError("Passwords do not match");
      setLoading(false);
      return;
    }

    try {
      const response = await fetch("/api/auth/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });

      const data = await response.json();

      if (!response.ok) {
        setError(data.error || "Registration failed");
        setLoading(false);
        return;
      }

      router.push("/login");
    } catch {
      setError("An error occurred");
      setLoading(false);
    }
  };

  return (
    <div className="flex justify-center items-center h-[calc(100vh-7rem)]  text-white">
      <div className="w-full max-w-md bg-white bg-gradient-to-br from-green-500 to-blue-600 p-8 rounded-lg shadow-xl">
        <h1 className="text-3xl font-bold text-center mb-6 text-white">
          Register
        </h1>
        {error && (
          <p className="text-red-500  text-lg text-center text- mb-4">
            {error}
          </p>
        )}
        <form className="space-y-6" onSubmit={handleSubmit}>
          <div>
            <label
              htmlFor="email"
              className="block mb-2 font-medium text-white"
            >
              Email
            </label>
            <input
              type="email"
              id="email"
              className="w-full px-4 py-3 border border-gray-300 rounded-lg bg-transparent text-white placeholder-gray-300 focus:outline-none focus:ring-2 focus:ring-green-300"
              placeholder="Enter your email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </div>
          <div>
            <label
              htmlFor="password"
              className="block mb-2 font-medium text-white"
            >
              Password
            </label>
            <input
              type="password"
              id="password"
              className="w-full px-4 py-3 border border-gray-300 rounded-lg bg-transparent text-white placeholder-gray-300 focus:outline-none focus:ring-2 focus:ring-green-300"
              placeholder="Enter your password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
          </div>
          <div>
            <label
              htmlFor="confirmPassword"
              className="block mb-2 font-medium text-white"
            >
              Confirm Password
            </label>
            <input
              type="password"
              id="confirmPassword"
              className="w-full px-4 py-3 border border-gray-300 rounded-lg bg-transparent text-white placeholder-gray-300 focus:outline-none focus:ring-2 focus:ring-green-300"
              placeholder="Confirm your password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
            />
          </div>
          <button
            type="submit"
            className={`w-full py-3 rounded-lg font-medium transition duration-200 ${
              disabled
                ? "bg-gray-400 cursor-not-allowed"
                : "bg-green-500 hover:bg-green-600 text-white"
            }`}
            disabled={loading || disabled}
          >
            {loading ? "Registering..." : "Register"}
          </button>
          <p className="text-center mt-4 text-white">
            Already have an account?{" "}
            <a href="/login" className="text-green-300 hover:underline">
              Login
            </a>
          </p>
        </form>
      </div>
    </div>
  );
}

export default Register;
