"use client";
import { motion } from "motion/react";
import { useRouter } from "next/navigation";
import { ArrowLeft, BarChart3, TrendingUp, Users, Clock } from "lucide-react";

export default function InsidersPage() {
  const router = useRouter();

  return (
    <div className="max-w-7xl mx-auto">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="mb-8"
      >
        <button
          onClick={() => router.push("/dashboard")}
          className="mb-6 flex items-center gap-2 text-slate-400 hover:text-white transition-colors"
        >
          <ArrowLeft size={20} />
          Back to Dashboard
        </button>
        
        <h1 className="text-4xl font-bold text-white mb-2">
          Insiders & Analytics
        </h1>
        <p className="text-slate-400 text-lg">
          Analyze your survey responses and discover patterns in your data.
        </p>
      </motion.div>

      {/* Coming Soon Content */}
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.6, delay: 0.2 }}
        className="bg-slate-800 rounded-xl p-12 border border-slate-700 text-center"
      >
        <div className="max-w-2xl mx-auto">
          <div className="w-24 h-24 bg-gradient-to-r from-cyan-400 to-blue-500 rounded-full flex items-center justify-center mx-auto mb-8">
            <BarChart3 className="w-12 h-12 text-black" />
          </div>
          
          <h2 className="text-3xl font-bold text-white mb-4">
            Insiders Coming Soon! 🚀
          </h2>
          
          <p className="text-slate-400 text-lg mb-8">
            We're working on powerful analytics features to help you understand your survey data better.
          </p>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
            <div className="bg-slate-900 rounded-lg p-6">
              <TrendingUp className="w-8 h-8 text-cyan-400 mx-auto mb-4" />
              <h3 className="text-lg font-semibold text-white mb-2">Trend Analysis</h3>
              <p className="text-slate-400 text-sm">
                Track response patterns over time
              </p>
            </div>
            
            <div className="bg-slate-900 rounded-lg p-6">
              <Users className="w-8 h-8 text-blue-400 mx-auto mb-4" />
              <h3 className="text-lg font-semibold text-white mb-2">Demographics</h3>
              <p className="text-slate-400 text-sm">
                Understand your audience better
              </p>
            </div>
            
            <div className="bg-slate-900 rounded-lg p-6">
              <Clock className="w-8 h-8 text-purple-400 mx-auto mb-4" />
              <h3 className="text-lg font-semibold text-white mb-2">Real-time Data</h3>
              <p className="text-slate-400 text-sm">
                Live updates as responses come in
              </p>
            </div>
          </div>

          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={() => router.push("/dashboard/generate-survey")}
            className="px-8 py-4 bg-gradient-to-r from-cyan-400 to-blue-500 text-black font-semibold rounded-lg hover:brightness-110 transition-all"
          >
            Create Your First Survey
          </motion.button>
        </div>
      </motion.div>
    </div>
  );
}
