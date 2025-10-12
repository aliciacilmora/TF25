"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useSession } from "next-auth/react";

export default function OnboardingPage() {
  const router = useRouter();
  const { data: session, status } = useSession();
  const [companyUuid, setCompanyUuid] = useState<string | null>(null);
  const [formData, setFormData] = useState({
    name: "",
    sector: "",
    products: "",
    details: "",
  });
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (status === "unauthenticated") {
      router.push("/auth/login"); // Redirect if no session
    } else if (status === "authenticated") {
      const uuid = sessionStorage.getItem("companyUuid");
      if (uuid) {
        setCompanyUuid(uuid);
      } else {
        const newUuid = crypto.randomUUID();
        sessionStorage.setItem("companyUuid", newUuid);
        setCompanyUuid(newUuid);
        console.log("Generated fallback UUID:", newUuid);
      }
    }
  }, [status, router]);

  function handleChange(e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();

    if (status !== "authenticated") {
      setError("You must be logged in to submit.");
      return;
    }

    setSubmitting(true);
    setError(null);

    if (!companyUuid) {
      setError("Could not find company UUID. Please try logging in again.");
      setSubmitting(false);
      return;
    }

    const payload = {
      uuid: companyUuid,
      name: formData.name,
      sector: formData.sector,
      products: formData.products,
      details: formData.details,
    };

    //TODO: Send data to backend
    try {
      const res = await fetch("http://34.132.25.152:5001/api/companies", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      if (!res.ok) {
        throw new Error(`HTTP error! status: ${res.status}`);
      }

      router.push("/dashboard");
    } catch (err) {
      setError("Failed to submit data. Please try again.");
      setSubmitting(false);
    }
  }

  if (status === "loading") {
    return <div className="text-center mt-20 text-white">Loading session...</div>;
  }

  return (
    <div className="min-h-screen bg-black">
      {/* Header */}
      <div className="bg-gradient-to-r from-slate-900 to-slate-800 border-b border-slate-700">
        <div className="max-w-6xl mx-auto px-6 py-12">
          <div className="text-center">
            <h1 className="text-5xl font-bold text-white mb-4">Welcome to Insider</h1>
            <p className="text-xl text-slate-300 max-w-2xl mx-auto">
              Let's get to know your company better so we can provide you with the best insights
            </p>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-6xl mx-auto px-6 py-12">
        <form onSubmit={handleSubmit} className="space-y-12">
          {/* Company Information */}
          <div className="bg-gradient-to-br from-slate-800 to-slate-900 rounded-2xl p-8 border border-slate-700 shadow-xl">
            <div className="flex items-center gap-4 mb-8">
              <div className="w-12 h-12 bg-cyan-500 rounded-xl flex items-center justify-center">
                <svg
                  className="w-6 h-6 text-black"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4"
                  />
                </svg>
              </div>
              <h2 className="text-3xl font-bold text-white">Company Information</h2>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <label className="block text-lg font-semibold text-white">Company Name *</label>
                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  className="w-full px-6 py-4 bg-slate-900 border border-slate-600 rounded-xl text-white placeholder-slate-400 focus:outline-none focus:border-cyan-400 focus:ring-2 focus:ring-cyan-400/20 transition-all text-lg"
                  placeholder="Enter your company name"
                  required
                />
              </div>

              <div className="space-y-2">
                <label className="block text-lg font-semibold text-white">Details *</label>
                <input
                  type="text"
                  name="details"
                  value={formData.details}
                  onChange={handleChange}
                  className="w-full px-6 py-4 bg-slate-900 border border-slate-600 rounded-xl text-white placeholder-slate-400 focus:outline-none focus:border-cyan-400 focus:ring-2 focus:ring-cyan-400/20 transition-all text-lg"
                  placeholder="Enter your company details"
                  required
                />
              </div>

              <div className="space-y-2">
                <label className="block text-lg font-semibold text-white">Sector *</label>
                <input
                  type="text"
                  name="sector"
                  value={formData.sector}
                  onChange={handleChange}
                  className="w-full px-6 py-4 bg-slate-900 border border-slate-600 rounded-xl text-white placeholder-slate-400 focus:outline-none focus:border-cyan-400 focus:ring-2 focus:ring-cyan-400/20 transition-all text-lg"
                  placeholder="Sector"
                  required
                />
              </div>

              <div className="space-y-2">
                <label className="block text-lg font-semibold text-white">Products *</label>
                <input
                  type="text"
                  name="products"
                  value={formData.products}
                  onChange={handleChange}
                  className="w-full px-6 py-4 bg-slate-900 border border-slate-600 rounded-xl text-white placeholder-slate-400 focus:outline-none focus:border-cyan-400 focus:ring-2 focus:ring-cyan-400/20 transition-all text-lg"
                  placeholder="Type of products"
                  required
                />
              </div>
            </div>
          </div>

          {/* Submit Button */}
          <div className="flex justify-center pt-8">
            <button
              type="submit"
              disabled={submitting}
              className="px-12 py-6 bg-gradient-to-r from-cyan-400 to-blue-500 text-black font-bold text-xl rounded-2xl hover:brightness-110 hover:scale-105 transition-all disabled:opacity-50 disabled:cursor-not-allowed shadow-2xl"
            >
              {submitting ? (
                <div className="flex items-center gap-3">
                  <div className="w-5 h-5 border-2 border-black border-t-transparent rounded-full animate-spin"></div>
                  Submitting...
                </div>
              ) : (
                "Complete Onboarding"
              )}
            </button>
          </div>

          {error && (
            <div className="mt-8 p-6 bg-red-500/10 border border-red-500/30 rounded-2xl">
              <div className="flex items-center gap-3">
                <svg
                  className="w-6 h-6 text-red-400 flex-shrink-0"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                  />
                </svg>
                <p className="text-red-400 text-lg font-medium">{error}</p>
              </div>
            </div>
          )}
        </form>
      </div>
    </div>
  );
}
