"use client";

import { useEffect, useState } from "react";
import { motion } from "motion/react";
import { useRouter } from "next/navigation";
import {
  ArrowLeft,
  Users,
  Clock,
  BarChart3,
  TrendingUp,
  AlertTriangle,
  Cpu,
  Clipboard,
  Gift,
} from "lucide-react";

import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  Legend,
} from "recharts";

import { CircularProgressbar, buildStyles } from "react-circular-progressbar";
import "react-circular-progressbar/dist/styles.css";

interface SurveySummary {
  analysis_date: string | null;
  company: string;
  schema_validated: boolean;
  summary: {
    budget_insights: string;
    common_workflows: string[];
    completed_surveys: number;
    completion_rate_percentage: number;
    deployment_preferences: string[];
    in_progress_surveys: number;
    key_insights: string;
    key_pain_points: string[];
    main_bottlenecks: string[];
    negative_indicators: number;
    positive_indicators: number;
    recommendations: string;
    security_concerns: string[];
    technology_trends: string[];
    top_keywords: string[];
    total_participants: number;
  };
  survey_title: string;
}

export default function InsidersPage() {
  const router = useRouter();
  const [data, setData] = useState<SurveySummary | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  

  useEffect(() => {
    const fetchData = async () => {
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
        setData(json.data);
      } catch (err: any) {
        console.error(err);
        setError(err.message || "Unknown error");
      } finally {
        setLoading(false);
      }
    };
  // TODO
  // useEffect(() => {
  //   const fetchData = async () => {
  //     try {
  //       const res = await fetch("http://34.132.25.152:5001/api/survey");
  //       if (!res.ok) throw new Error(`HTTP error! Status: ${res.status}`);
  //       const json = await res.json();
  //       setData(json.data);
  //     } catch (err: any) {
  //       setError(err.message || "Unknown error");
  //     } finally {
  //       setLoading(false);
  //     }
  //   };

    fetchData();
  }, []);

  if (loading)
    return (
      <div className="text-white p-8 text-center text-lg font-medium">
        Loading survey data...
      </div>
    );

  if (error)
    return (
      <div className="text-red-400 p-8 text-center">
        <h2 className="text-2xl font-bold mb-2">Error fetching data</h2>
        <p>{error}</p>
      </div>
    );

  if (!data)
    return (
      <div className="text-yellow-400 p-8 text-center text-lg font-medium">
        No data received from server.
      </div>
    );

  const summary = data.summary;

  // Data for bar chart of surveys status
  const surveyStatusData = [
    {
      name: "Completed",
      value: summary.completed_surveys,
      color: "#22c55e",
    },
    {
      name: "In Progress",
      value: summary.in_progress_surveys,
      color: "#facc15",
    },
  ];

  // Pie chart for key pain points
  const painPointsData = summary.key_pain_points.map((point, i) => ({
    name: point,
    value: 1,
    color: ["#ef4444", "#f97316", "#f59e0b"][i % 3], // red, orange, yellow
  }));

  // Pie chart for positive vs negative indicators
  const indicatorsData = [
    {
      name: "Positive",
      value: summary.positive_indicators,
      color: "#22c55e",
    },
    {
      name: "Negative",
      value: summary.negative_indicators,
      color: "#ef4444",
    },
  ];

  return (
    <div className="max-w-6xl mx-auto p-6 space-y-10 text-white">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="space-y-2"
      >
        <button
          onClick={() => router.push("/dashboard")}
          className="mb-4 flex items-center gap-2 text-slate-400 hover:text-white transition-colors"
        >
          <ArrowLeft size={20} />
          Back to Dashboard
        </button>
        <h1 className="text-5xl font-extrabold">{data.survey_title}</h1>
        <p className="text-slate-300 text-xl max-w-3xl">{summary.key_insights}</p>
      </motion.div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-8">
        <div className="bg-slate-900 p-6 rounded-xl shadow-lg flex flex-col items-center gap-3">
          <Users className="text-cyan-400" size={32} />
          <div className="text-center">
            <div className="text-xs uppercase font-semibold text-slate-400">
              Participants
            </div>
            <div className="text-3xl font-bold text-cyan-400">
              {summary.total_participants}
            </div>
          </div>
        </div>
        <div className="bg-slate-900 p-6 rounded-xl shadow-lg flex flex-col items-center gap-3">
          <Clock className="text-blue-400" size={32} />
          <div className="text-center">
            <div className="text-xs uppercase font-semibold text-slate-400">
              Completion Rate
            </div>
            <div style={{ width: 80, height: 80 }}>
              <CircularProgressbar
                value={summary.completion_rate_percentage}
                text={`${summary.completion_rate_percentage}%`}
                strokeWidth={10}
                styles={buildStyles({
                  pathColor: "#3b82f6",
                  textColor: "#3b82f6",
                  trailColor: "#1e293b",
                  backgroundColor: "#047857",
                  textSize: "24px",
                })}
              />
            </div>
          </div>
        </div>
        <div className="bg-slate-900 p-6 rounded-xl shadow-lg flex flex-col items-center gap-3">
          <BarChart3 className="text-purple-400" size={32} />
          <div className="text-center">
            <div className="text-xs uppercase font-semibold text-slate-400">
              Deployment
            </div>
            <div className="text-lg font-semibold text-purple-400">
              {summary.deployment_preferences.join(", ")}
            </div>
          </div>
        </div>
        <div className="bg-slate-900 p-6 rounded-xl shadow-lg flex flex-col items-center gap-3">
          <TrendingUp className="text-yellow-400" size={32} />
          <div className="text-center">
            <div className="text-xs uppercase font-semibold text-slate-400">
              Workflows
            </div>
            <div className="text-lg font-semibold text-yellow-400">
              {summary.common_workflows.join(", ")}
            </div>
          </div>
        </div>
      </div>

      {/* Charts & Pain Points */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-10">
        {/* Survey Status Bar Chart */}
        <div className="bg-slate-800 rounded-xl p-6 shadow-lg border border-slate-700">
          <h2 className="text-xl font-bold text-white mb-4 flex items-center gap-2">
            <BarChart3 size={24} /> Survey Status
          </h2>
          <ResponsiveContainer width="100%" height={220}>
            <BarChart data={surveyStatusData} margin={{ top: 15, right: 30, left: 0, bottom: 0 }}>
              <XAxis dataKey="name" stroke="#94a3b8" />
              <YAxis />
              <Tooltip />
              <Bar dataKey="value" barSize={40}>
                {surveyStatusData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.color} />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>

        {/* Key Pain Points Pie Chart */}
        <div className="bg-slate-800 rounded-xl p-6 shadow-lg border border-slate-700">
          <h2 className="text-xl font-bold text-red-400 mb-4 flex items-center gap-2">
            <AlertTriangle size={24} /> Key Pain Points
          </h2>
          <ResponsiveContainer width="100%" height={220}>
            <PieChart>
              <Pie
                data={painPointsData}
                dataKey="value"
                nameKey="name"
                cx="50%"
                cy="50%"
                outerRadius={80}
                label
              >
                {painPointsData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.color} />
                ))}
              </Pie>
              <Legend verticalAlign="bottom" height={36} />
            </PieChart>
          </ResponsiveContainer>
        </div>

        {/* Indicators Pie Chart */}
        <div className="bg-slate-800 rounded-xl p-6 shadow-lg border border-slate-700">
          <h2 className="text-xl font-bold text-green-400 mb-4 flex items-center gap-2">
            <Gift size={24} /> Positive / Negative Indicators
          </h2>
          <ResponsiveContainer width="100%" height={220}>
            <PieChart>
              <Pie
                data={indicatorsData}
                dataKey="value"
                nameKey="name"
                cx="50%"
                cy="50%"
                outerRadius={80}
                label
              >
                {indicatorsData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.color} />
                ))}
              </Pie>
              <Legend verticalAlign="bottom" height={36} />
            </PieChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Text Sections */}
      <div className="space-y-8">
        <section className="bg-slate-800 p-6 rounded-xl shadow-lg border border-slate-700">
          <h2 className="text-xl font-bold text-purple-300 mb-3 flex items-center gap-2">
            <Cpu size={24} /> Technology Trends & Keywords
          </h2>
          <p className="mb-2">
            <strong>Technology Trends: </strong>
            {summary.technology_trends.join(", ")}
          </p>
          <p>
            <strong>Top Keywords: </strong>
            {summary.top_keywords.join(", ")}
          </p>
        </section>

        <section className="bg-slate-800 p-6 rounded-xl shadow-lg border border-slate-700">
          <h2 className="text-xl font-bold text-blue-400 mb-3 flex items-center gap-2">
            <BarChart3 size={24} /> Budget Insights
          </h2>
          <p>{summary.budget_insights}</p>
        </section>

        <section className="bg-slate-900 p-6 rounded-xl shadow-lg border border-slate-600">
          <h2 className="text-xl font-bold text-teal-300 mb-3 flex items-center gap-2">
            <Gift size={24} /> Recommendations
          </h2>
          <p>{summary.recommendations}</p>
        </section>
      </div>
    </div>
  );
}
