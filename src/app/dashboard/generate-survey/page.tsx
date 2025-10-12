"use client";

import { useState } from "react";
import { motion } from "motion/react";
import { useRouter } from "next/navigation";
import { v4 as uuidv4 } from "uuid";
import { ArrowLeft, Send, CheckCircle, Copy, Link2 } from "lucide-react";

export default function GenerateLinkPage() {
  const router = useRouter();
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [status, setStatus] = useState<"active" | "inactive">("active");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [generatedLink, setGeneratedLink] = useState("");
  const [copied, setCopied] = useState(false);

  const handleSubmit = async () => {
    if (!title.trim() || !description.trim()) {
      alert("Please fill in title and description");
      return;
    }
    const companyUuid = sessionStorage.getItem("companyUuid");
    if (!companyUuid) {
      alert("Company ID not found in session storage. Please log in again.");
      return;
    }
    const surveyId = uuidv4();
    setIsSubmitting(true);
    

    try {
      const response = await fetch(`https://e9555883258a.ngrok-free.app/api/companies/${companyUuid}/surveys`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ uuid: surveyId, title: title, description: description, status: status }),
      });
      if (!response.ok) throw new Error("Failed to create survey");

      sessionStorage.setItem("surveyId", surveyId);
      
      setGeneratedLink(`http://localhost:3000/interview/start/${surveyId}`);
      setSubmitted(true);
    } catch (e) {
      alert("Failed to create survey. Please try again.");
      console.error(e);
    } finally {
      setIsSubmitting(false);
    }
  };

  const copyToClipboard = async () => {
    try {
      await navigator.clipboard.writeText(generatedLink);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      // ignore
    }
  };

  if (submitted) {
    return (
      <div className="max-w-4xl mx-auto">
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5 }}
          className="bg-slate-800 rounded-xl p-8 border border-slate-700 text-center"
        >
          {/* <CheckCircle className="w-16 h-16 text-green-400 mx-auto mb-6" /> */}
          <h1 className="text-3xl font-bold text-white mb-4">
            Survey Created Successfully!
          </h1>
          <p className="text-slate-400 mb-8">Your survey link has been generated and is ready to share.</p>

          <div className="bg-slate-900 rounded-lg p-6 mb-8">
            <h3 className="text-lg font-semibold text-white mb-4">Your Survey Link:</h3>
            <div className="flex items-center gap-4 bg-slate-800 rounded-lg p-4">
              <Link2 className="w-5 h-5 text-cyan-400 flex-shrink-0" />
              <code className="flex-1 text-cyan-400 break-all">{generatedLink}</code>
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={copyToClipboard}
                className={`px-4 py-2 rounded-lg font-medium transition-all ${
                  copied ? "bg-green-500 text-black" : "bg-cyan-500 text-black hover:bg-cyan-400"
                }`}
              >
                {copied ? "Copied!" : "Copy"}
              </motion.button>
            </div>
          </div>

          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={() => router.push("/dashboard")}
            className="px-6 py-3 bg-slate-700 text-white rounded-lg hover:bg-slate-600 transition-colors"
          >
            Back to Dashboard
          </motion.button>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto">
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }} className="mb-8">
        <button onClick={() => router.push("/dashboard")} className="mb-6 flex items-center gap-2 text-slate-400 hover:text-white transition-colors">
          <ArrowLeft size={20} />
          Back to Dashboard
        </button>

        <h1 className="text-4xl font-bold text-white mb-2">Generate Survey Link</h1>
        <p className="text-slate-400 text-lg">Create a survey with title, description, and status.</p>
      </motion.div>

      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6, delay: 0.2 }} className="bg-slate-800 rounded-xl p-8 border border-slate-700">
        <div className="space-y-6">
          <div>
            <label className="block text-sm font-medium text-slate-300 mb-2">Title</label>
            <input
              type="text"
              value={title}
              onChange={e => setTitle(e.target.value)}
              placeholder="Enter survey title"
              required
              className="w-full px-4 py-3 bg-slate-800 border border-slate-700 rounded-lg text-white placeholder-slate-400 focus:outline-none focus:border-cyan-400 focus:ring-1 focus:ring-cyan-400 transition-colors"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-300 mb-2">Description</label>
            <textarea
              value={description}
              onChange={e => setDescription(e.target.value)}
              placeholder="Enter survey description"
              rows={4}
              required
              className="w-full px-4 py-3 bg-slate-800 border border-slate-700 rounded-lg text-white placeholder-slate-400 focus:outline-none focus:border-cyan-400 focus:ring-1 focus:ring-cyan-400 transition-colors"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-300 mb-2">Status</label>
            <select
              value={status}
              onChange={e => setStatus(e.target.value as "active" | "inactive")}
              className="w-full px-4 py-3 bg-slate-800 border border-slate-700 rounded-lg text-white focus:outline-none focus:border-cyan-400 focus:ring-1 focus:ring-cyan-400 transition-colors"
            >
              <option value="active">Active</option>
              <option value="inactive">Inactive</option>
            </select>
          </div>
        </div>

        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6, delay: 0.4 }} className="mt-8 pt-6 border-t border-slate-700">
          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={handleSubmit}
            disabled={isSubmitting}
            className="w-full py-4 bg-gradient-to-r from-cyan-400 to-blue-500 text-black font-semibold rounded-lg hover:brightness-110 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
          >
            {isSubmitting ? (
              <>
                <div className="w-5 h-5 border-2 border-black border-t-transparent rounded-full animate-spin" />
                Creating Survey...
              </>
            ) : (
              <>
                <Send size={20} />
                Generate Survey Link
              </>
            )}
          </motion.button>
        </motion.div>
      </motion.div>
    </div>
  );
}
