"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { signIn } from "next-auth/react";
import { Eye, EyeOff, Check, X } from "lucide-react";

const departments = ["CS", "CU", "MECH", "EC", "EEE", "EV", "EB"];

const years = ["2026", "2027", "2028", "2029"];

export default function RegisterPage() {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const [showPassword, setShowPassword] = useState(false);

  const [formData, setFormData] = useState({
    fullName: "",
    username: "",
    email: "",
    password: "",
    confirmPassword: "",
    year: "",
    department: "",
    mobile: "",
  });

  const [passwordStrength, setPasswordStrength] = useState({
    length: false,
    uppercase: false,
    number: false,
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    setError("");

    if (name === "password") {
      setPasswordStrength({
        length: value.length >= 8,
        uppercase: /[A-Z]/.test(value),
        number: /\d/.test(value),
      });
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError("");

    try {
      const response = await fetch("/api/auth/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.error || "Registration failed");
      }

      // Auto sign in
      await signIn("credentials", {
        email: formData.email,
        password: formData.password,
        redirect: false,
      });

      router.push("/matches");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Registration failed");
    } finally {
      setIsLoading(false);
    }
  };

  const isPasswordValid = passwordStrength.length && passwordStrength.uppercase && passwordStrength.number;
  const isFormValid =
    isPasswordValid &&
    formData.confirmPassword === formData.password &&
    formData.fullName &&
    formData.username &&
    formData.email &&
    formData.year &&
    formData.department &&
    formData.mobile;

  return (
    <div className="min-h-screen px-4 py-12 bg-blue-deep">
      <div className="w-full max-w-2xl mx-auto card-dark p-8 space-y-8">
        <div className="text-center">
          <h1 className="font-display text-3xl text-gold-gradient">Join Trivela</h1>
          <p className="text-blue-border text-sm mt-2">Create your contest account</p>
        </div>

        {error && (
          <div className="bg-red-500/10 border border-red-500/50 rounded-lg p-3 text-red-400 text-sm font-heading">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-8">
          {/* Personal Info */}
          <div className="space-y-4">
            <h3 className="font-heading font-bold text-gold">Personal Information</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <label className="block text-sm font-heading font-bold">Full Name</label>
                <input
                  type="text"
                  name="fullName"
                  value={formData.fullName}
                  onChange={handleChange}
                  className="input-dark w-full"
                  placeholder="John Doe"
                  required
                />
              </div>

              <div className="space-y-2">
                <label className="block text-sm font-heading font-bold">Year</label>
                <select
                  name="year"
                  value={formData.year}
                  onChange={handleChange}
                  className="input-dark w-full"
                  required
                >
                  <option value="">Select Year</option>
                  {years.map((y) => (
                    <option key={y} value={y}>
                      {y}
                    </option>
                  ))}
                </select>
              </div>

              <div className="space-y-2">
                <label className="block text-sm font-heading font-bold">Department</label>
                <select
                  name="department"
                  value={formData.department}
                  onChange={handleChange}
                  className="input-dark w-full"
                  required
                >
                  <option value="">Select Department</option>
                  {departments.map((dept) => (
                    <option key={dept} value={dept}>
                      {dept}
                    </option>
                  ))}
                </select>
              </div>

              <div className="space-y-2">
                <label className="block text-sm font-heading font-bold">Mobile (+91)</label>
                <input
                  type="tel"
                  name="mobile"
                  value={formData.mobile}
                  onChange={handleChange}
                  className="input-dark w-full"
                  placeholder="9876543210"
                  pattern="[6-9]\d{9}"
                  required
                />
              </div>
            </div>
          </div>

          {/* Account Info */}
          <div className="space-y-4">
            <h3 className="font-heading font-bold text-gold">Account Information</h3>
            <div className="space-y-4">
              <div className="space-y-2">
                <label className="block text-sm font-heading font-bold">Username</label>
                <input
                  type="text"
                  name="username"
                  value={formData.username}
                  onChange={handleChange}
                  className="input-dark w-full"
                  placeholder="john_doe"
                  pattern="[a-zA-Z0-9_]{3,20}"
                  required
                />
                <p className="text-xs text-blue-border">3-20 characters, alphanumeric and underscore only</p>
              </div>

              <div className="space-y-2">
                <label className="block text-sm font-heading font-bold">Email</label>
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  className="input-dark w-full"
                  placeholder="you@example.com"
                  required
                />
              </div>

              <div className="space-y-2">
                <label className="block text-sm font-heading font-bold">Password</label>
                <div className="relative">
                  <input
                    type={showPassword ? "text" : "password"}
                    name="password"
                    value={formData.password}
                    onChange={handleChange}
                    className="input-dark w-full pr-10"
                    placeholder="••••••••"
                    required
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-blue-border hover:text-gold"
                  >
                    {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                  </button>
                </div>
                <div className="space-y-2 mt-3">
                  {[
                    { met: passwordStrength.length, label: "At least 8 characters" },
                    { met: passwordStrength.uppercase, label: "One uppercase letter" },
                    { met: passwordStrength.number, label: "One number" },
                  ].map((req, i) => (
                    <div key={i} className="flex items-center gap-2 text-xs">
                      {req.met ? (
                        <Check size={16} className="text-green-500" />
                      ) : (
                        <X size={16} className="text-red-500" />
                      )}
                      <span className={req.met ? "text-green-500" : "text-blue-border"}>
                        {req.label}
                      </span>
                    </div>
                  ))}
                </div>
              </div>

              <div className="space-y-2">
                <label className="block text-sm font-heading font-bold">Confirm Password</label>
                <input
                  type="password"
                  name="confirmPassword"
                  value={formData.confirmPassword}
                  onChange={handleChange}
                  className="input-dark w-full"
                  placeholder="••••••••"
                  required
                />
              </div>
            </div>
          </div>

          <button
            type="submit"
            disabled={!isFormValid || isLoading}
            className="btn-gold w-full py-3 disabled:opacity-50"
          >
            {isLoading ? "Creating Account..." : "Create Account"}
          </button>
        </form>

        <p className="text-center text-sm text-blue-border">
          Already have an account?{" "}
          <Link href="/auth/login" className="text-gold hover:text-gold-light transition-colors font-bold">
            Sign in
          </Link>
        </p>
      </div>
    </div>
  );
}
