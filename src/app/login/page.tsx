"use client";

import { useNotification } from "@/src/components/Notification";
import { signIn } from "next-auth/react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

function Login() {
  const [email, setEmail] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const [loading, setLoading] = useState<boolean>(false);
  const [disabled, setDisabled] = useState<boolean>(true);
  const { show } = useNotification();
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (!email) {
      show("Email is required", "error");
      return;
    }

    if (!password) {
      show("Password is required", "error");
      return;
    }

    try {
      setLoading(true);
      const result = await signIn("credentials", {
        email,
        password,
        redirect: false,
      });

      if (result?.error) {
        show(result.error, "error");
        return;
      }

      show("Logged in successfully", "success");
      router.push("/");
    } catch {
      show("Failed to log in", "error");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    setDisabled(!email || !password);
  }, [email, password]);

  return (
    <div className="flex justify-center items-center h-[calc(100vh-7rem)] text-white">
      <div className="w-full max-w-md bg-white bg-gradient-to-br from-green-500 to-purple-600 p-8 rounded-lg shadow-xl">
        <h1 className="text-3xl font-bold text-center mb-6 text-white">
          Login
        </h1>
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
              className="w-full px-4 py-3 border border-gray-300 rounded-lg bg-transparent text-white placeholder-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-300"
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
              className="w-full px-4 py-3 border border-gray-300 rounded-lg bg-transparent text-white placeholder-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-300"
              placeholder="Enter your password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
          </div>
          <button
            type="submit"
            className={`w-full py-3 rounded-lg font-medium transition duration-200
              ${disabled || loading ? "bg-gray-500 opacity-50 cursor-not-allowed" : "bg-blue-500 hover:bg-blue-600 text-white"}
            `}
            disabled={disabled || loading}
          >
            {loading ? "Logging in..." : "Login"}
          </button>
          <p className="text-center mt-4 text-white">
            Don&apos;t have an account?{" "}
            <Link href="/register" className="text-blue-300 hover:underline">
              Register
            </Link>
          </p>
        </form>
      </div>
    </div>
  );
}

export default Login;
