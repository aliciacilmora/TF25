"use client";

import { useState, useEffect } from "react";
import { motion } from "motion/react";
import { useSession } from "next-auth/react";
import {
  TrendingUp,
  Users,
  BarChart3,
  Link2,
  ArrowRight,
} from "lucide-react";
import { useRouter } from "next/navigation";

interface Survey {
  id: string;
  questions: any[];
  status: string;
  createdAt: string;
  responses?: any[];
}

export default function DashboardPage() {
  const { data: session } = useSession();
  const router = useRouter();

  // Stats state
  const [summary, setSummary] = useState({
    completed_surveys: 0,
    in_progress_surveys: 0,
    total_participants: 0,
  });
  const [surveys, setSurveys] = useState<Survey[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchSummary = async () => {
      const surveyId = sessionStorage.getItem("surveyId");

      if (!surveyId) {
        console.error("No surveyId found in sessionStorage");
        setError("No surveyId found in sessionStorage");
        setLoading(false);
        return;
      }

      try {
        const res = await fetch(`http://34.132.25.152:5001/api/surveys/${surveyId}/ai-summary`);
        if (!res.ok) throw new Error(`HTTP error! Status: ${res.status}`);
        const json = await res.json();

        if (json?.data?.summary) {
          setSummary(json.data.summary);
        }

        if (json?.data?.surveys) {
          setSurveys(json.data.surveys);
        }
      } catch (err: any) {
        console.error(err);
        setError(err.message || "Unknown error");
      } finally {
        setLoading(false);
      }
    };

    fetchSummary();
  }, []);
  // Fetch surveys list
  useEffect(() => {
    const fetchSurveys = async () => {
      try {
        const response = await fetch("/api/surveys");
        if (response.ok) {
          const data = await response.json();
          setSurveys(data.surveys || []);
        }
      } catch (error) {
        console.error("Error fetching surveys:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchSurveys();
  }, []);

  const totalSurveys = summary.completed_surveys;
  const activeLinks = summary.completed_surveys + summary.in_progress_surveys;
  const totalResponses = summary.total_participants;

  const stats = [
    {
      title: "Total Surveys",
      value: totalSurveys.toString(),
      icon: BarChart3,
      color: "from-cyan-400 to-blue-500",
    },
    {
      title: "Active Links",
      value: activeLinks.toString(),
      icon: Link2,
      color: "from-blue-500 to-purple-500",
    },
    {
      title: "Responses",
      value: totalResponses.toString(),
      icon: Users,
      color: "from-purple-500 to-pink-500",
    },
    {
      title: "Insights",
      value: totalResponses > 0 ? "Available" : "0",
      icon: TrendingUp,
      color: "from-pink-500 to-red-500",
    },
  ];

  const quickActions = [
    {
      title: "Generate New Survey Link",
      description: "Create a new survey and get a shareable link",
      href: "/dashboard/generate-survey",
      icon: Link2,
      color: "from-cyan-400 to-blue-500",
    },
    {
      title: "View Insights",
      description: "Analyze your survey responses and trends",
      href: "/dashboard/insights",
      icon: TrendingUp,
      color: "from-blue-500 to-purple-500",
    },
  ];

  return (
    <div className="max-w-7xl mx-auto p-6">
      {/* Welcome Header */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="mb-8"
      >
        <h1 className="text-4xl font-bold text-white mb-2">Welcome!</h1>
        <p className="text-slate-400 text-lg">
          Ready to gather insights and analyze your data?
        </p>
      </motion.div>

      {/* Stats Grid */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.2 }}
        className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8"
      >
        {stats.map((stat, index) => {
          const Icon = stat.icon;
          return (
            <motion.div
              key={stat.title}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.3 + index * 0.1 }}
              className="bg-slate-800 rounded-xl p-6 border border-slate-700 hover:border-slate-600 transition-all duration-300"
            >
              <div className="flex items-center justify-between mb-4">
                <div
                  className={`w-12 h-12 bg-gradient-to-r ${stat.color} rounded-lg flex items-center justify-center`}
                >
                  <Icon className="w-6 h-6 text-black" />
                </div>
                <div className="text-right">
                  <div className="text-2xl font-bold text-white">
                    {stat.value}
                  </div>
                  <div className="text-sm text-slate-400">{stat.title}</div>
                </div>
              </div>
            </motion.div>
          );
        })}
      </motion.div>

      {/* Quick Actions */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.4 }}
        className="mb-8"
      >
        <h2 className="text-2xl font-bold text-white mb-6">Quick Actions</h2>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {quickActions.map((action, index) => {
            const Icon = action.icon;
            return (
              <motion.button
                key={action.title}
                onClick={() => router.push(action.href)}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.5 + index * 0.1 }}
                className="bg-slate-800 rounded-xl p-6 border border-slate-700 hover:border-slate-600 transition-all duration-300 text-left group"
              >
                <div className="flex items-start gap-4">
                  <div
                    className={`w-12 h-12 bg-gradient-to-r ${action.color} rounded-lg flex items-center justify-center flex-shrink-0`}
                  >
                    <Icon className="w-6 h-6 text-black" />
                  </div>
                  <div className="flex-1">
                    <h3 className="text-lg font-semibold text-white mb-2 group-hover:text-cyan-400 transition-colors">
                      {action.title}
                    </h3>
                    <p className="text-slate-400 mb-4">{action.description}</p>
                    <div className="flex items-center text-cyan-400 group-hover:text-cyan-300 transition-colors">
                      <span className="text-sm font-medium">Get Started</span>
                      <ArrowRight className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform" />
                    </div>
                  </div>
                </div>
              </motion.button>
            );
          })}
        </div>
      </motion.div>

      {/* Recent Surveys */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.6 }}
        className="bg-slate-800 rounded-xl p-6 border border-slate-700"
      >
        <h2 className="text-xl font-bold text-white mb-4">Recent Surveys</h2>

        {loading ? (
          <div className="text-center py-12">
            <div className="w-8 h-8 border-2 border-cyan-400 border-t-transparent rounded-full animate-spin mx-auto mb-4" />
            <p className="text-slate-400">Loading surveys...</p>
          </div>
        ) : surveys.length === 0 ? (
          <div className="text-center py-12">
            <BarChart3 className="w-16 h-16 text-slate-600 mx-auto mb-4" />
            <p className="text-slate-400 mb-4">No surveys yet</p>
            <p className="text-sm text-slate-500">
              Start by generating your first survey link to see activity here.
            </p>
          </div>
        ) : (
          <div className="space-y-4">
            {surveys.slice(0, 3).map((survey, index) => (
              <motion.div
                key={survey.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4, delay: 0.7 + index * 0.1 }}
                className="bg-slate-900 rounded-lg p-4 border border-slate-700 hover:border-slate-600 transition-colors"
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-gradient-to-r from-cyan-400 to-blue-500 rounded-lg flex items-center justify-center">
                      <BarChart3 className="w-5 h-5 text-black" />
                    </div>
                    <div>
                      <h3 className="text-white font-medium">
                        Survey #{survey.id.slice(0, 8)}
                      </h3>
                      <p className="text-sm text-slate-400">
                        {survey.questions.length} questions • Created{" "}
                        {new Date(survey.createdAt).toLocaleDateString()}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <span
                      className={`px-2 py-1 rounded-full text-xs font-medium ${
                        survey.status === "active"
                          ? "bg-green-500/20 text-green-400"
                          : "bg-slate-500/20 text-slate-400"
                      }`}
                    >
                      {survey.status}
                    </span>
                    <motion.button
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      onClick={() => {
                        navigator.clipboard.writeText(
                          `${window.location.origin}/survey/${survey.id}`
                        );
                        // You can add a toast notification here for user feedback
                      }}
                      className="p-2 text-slate-400 hover:text-cyan-400 hover:bg-cyan-400/10 rounded-lg transition-colors"
                    >
                      <Link2 size={16} />
                    </motion.button>
                  </div>
                </div>
              </motion.div>
            ))}

            {surveys.length > 3 && (
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={() => router.push("/dashboard/insights")}
                className="w-full py-3 text-cyan-400 hover:text-cyan-300 hover:bg-cyan-400/10 rounded-lg transition-colors"
              >
                View All Surveys ({surveys.length})
              </motion.button>
            )}
          </div>
        )}
      </motion.div>
    </div>
  );
}
