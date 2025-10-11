"use client";
import { useState, useEffect } from "react";
import { motion } from "motion/react";
import { useRouter } from "next/navigation";
import { CheckCircle, ArrowLeft, Send } from "lucide-react";
import { PrismaClient } from "@prisma/client";

interface Question {
  text: string;
  type: "text" | "textarea" | "select" | "radio" | "checkbox";
  required: boolean;
  options?: string[];
}

interface Survey {
  id: string;
  questions: Question[];
  status: string;
}

export default function SurveyPage({ params }: { params: { id: string } }) {
  const router = useRouter();
  const [survey, setSurvey] = useState<Survey | null>(null);
  const [loading, setLoading] = useState(true);
  const [answers, setAnswers] = useState<Record<string, any>>({});
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  useEffect(() => {
    fetchSurvey();
  }, [params.id]);

  const fetchSurvey = async () => {
    try {
      const response = await fetch(`/api/surveys/${params.id}`);
      if (response.ok) {
        const data = await response.json();
        setSurvey(data.survey);
      } else {
        router.push("/");
      }
    } catch (error) {
      console.error("Error fetching survey:", error);
      router.push("/");
    } finally {
      setLoading(false);
    }
  };

  const handleAnswerChange = (questionIndex: number, value: any) => {
    setAnswers({
      ...answers,
      [questionIndex]: value,
    });
  };

  const handleSubmit = async () => {
    // Check required questions
    const requiredQuestions = survey?.questions.filter((q, index) => q.required && !answers[index]);
    if (requiredQuestions && requiredQuestions.length > 0) {
      alert("Please answer all required questions.");
      return;
    }

    setSubmitting(true);
    try {
      const response = await fetch(`/api/surveys/${params.id}/responses`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ answers }),
      });

      if (response.ok) {
        setSubmitted(true);
      } else {
        alert("Failed to submit response. Please try again.");
      }
    } catch (error) {
      console.error("Error submitting response:", error);
      alert("Failed to submit response. Please try again.");
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center">
        <div className="w-8 h-8 border-2 border-cyan-400 border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  if (!survey) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-white mb-4">Survey Not Found</h1>
          <p className="text-slate-400 mb-6">This survey link is invalid or has expired.</p>
          <button
            onClick={() => router.push("/")}
            className="px-6 py-3 bg-cyan-500 text-black rounded-lg hover:bg-cyan-400 transition-colors"
          >
            Go Home
          </button>
        </div>
      </div>
    );
  }

  if (submitted) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center">
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5 }}
          className="bg-slate-800 rounded-xl p-8 border border-slate-700 text-center max-w-md mx-4"
        >
          <CheckCircle className="w-16 h-16 text-green-400 mx-auto mb-6" />
          <h1 className="text-3xl font-bold text-white mb-4">
            Thank You! 🎉
          </h1>
          <p className="text-slate-400 mb-8">
            Your response has been submitted successfully.
          </p>
          <button
            onClick={() => router.push("/")}
            className="px-6 py-3 bg-gradient-to-r from-cyan-400 to-blue-500 text-black font-semibold rounded-lg hover:brightness-110 transition-all"
          >
            Done
          </button>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-black">
      <div className="max-w-4xl mx-auto px-4 py-8">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-center mb-8"
        >
          <button
            onClick={() => router.push("/")}
            className="mb-6 flex items-center gap-2 text-slate-400 hover:text-white transition-colors"
          >
            <ArrowLeft size={20} />
            Back to Home
          </button>
          
          <h1 className="text-4xl font-bold text-white mb-2">
            Survey Response
          </h1>
          <p className="text-slate-400">
            Please answer the following questions
          </p>
        </motion.div>

        {/* Form */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="bg-slate-800 rounded-xl p-8 border border-slate-700"
        >
          <div className="space-y-8">
            {survey.questions.map((question, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4, delay: 0.3 + index * 0.1 }}
                className="bg-slate-900 rounded-lg p-6 border border-slate-700"
              >
                <h3 className="text-lg font-semibold text-white mb-4">
                  {index + 1}. {question.text}
                  {question.required && <span className="text-red-400 ml-1">*</span>}
                </h3>

                {question.type === "text" && (
                  <input
                    type="text"
                    value={answers[index] || ""}
                    onChange={(e) => handleAnswerChange(index, e.target.value)}
                    className="w-full px-4 py-3 bg-slate-800 border border-slate-700 rounded-lg text-white placeholder-slate-400 focus:outline-none focus:border-cyan-400 focus:ring-1 focus:ring-cyan-400 transition-colors"
                    placeholder="Enter your answer..."
                  />
                )}

                {question.type === "textarea" && (
                  <textarea
                    value={answers[index] || ""}
                    onChange={(e) => handleAnswerChange(index, e.target.value)}
                    className="w-full px-4 py-3 bg-slate-800 border border-slate-700 rounded-lg text-white placeholder-slate-400 focus:outline-none focus:border-cyan-400 focus:ring-1 focus:ring-cyan-400 transition-colors"
                    placeholder="Enter your answer..."
                    rows={4}
                  />
                )}

                {question.type === "select" && question.options && (
                  <select
                    value={answers[index] || ""}
                    onChange={(e) => handleAnswerChange(index, e.target.value)}
                    className="w-full px-4 py-3 bg-slate-800 border border-slate-700 rounded-lg text-white focus:outline-none focus:border-cyan-400 focus:ring-1 focus:ring-cyan-400 transition-colors"
                  >
                    <option value="">Select an option...</option>
                    {question.options.map((option, optionIndex) => (
                      <option key={optionIndex} value={option}>
                        {option}
                      </option>
                    ))}
                  </select>
                )}

                {question.type === "radio" && question.options && (
                  <div className="space-y-3">
                    {question.options.map((option, optionIndex) => (
                      <label key={optionIndex} className="flex items-center gap-3 cursor-pointer">
                        <input
                          type="radio"
                          name={`question-${index}`}
                          value={option}
                          checked={answers[index] === option}
                          onChange={(e) => handleAnswerChange(index, e.target.value)}
                          className="w-4 h-4 text-cyan-400 bg-slate-800 border-slate-700 focus:ring-cyan-400"
                        />
                        <span className="text-white">{option}</span>
                      </label>
                    ))}
                  </div>
                )}

                {question.type === "checkbox" && question.options && (
                  <div className="space-y-3">
                    {question.options.map((option, optionIndex) => (
                      <label key={optionIndex} className="flex items-center gap-3 cursor-pointer">
                        <input
                          type="checkbox"
                          checked={(answers[index] || []).includes(option)}
                          onChange={(e) => {
                            const currentAnswers = answers[index] || [];
                            if (e.target.checked) {
                              handleAnswerChange(index, [...currentAnswers, option]);
                            } else {
                              handleAnswerChange(index, currentAnswers.filter((a: string) => a !== option));
                            }
                          }}
                          className="w-4 h-4 text-cyan-400 bg-slate-800 border-slate-700 rounded focus:ring-cyan-400"
                        />
                        <span className="text-white">{option}</span>
                      </label>
                    ))}
                  </div>
                )}
              </motion.div>
            ))}
          </div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.5 }}
            className="mt-8 pt-6 border-t border-slate-700"
          >
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={handleSubmit}
              disabled={submitting}
              className="w-full py-4 bg-gradient-to-r from-cyan-400 to-blue-500 text-black font-semibold rounded-lg hover:brightness-110 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
            >
              {submitting ? (
                <>
                  <div className="w-5 h-5 border-2 border-black border-t-transparent rounded-full animate-spin" />
                  Submitting...
                </>
              ) : (
                <>
                  <Send size={20} />
                  Submit Response
                </>
              )}
            </motion.button>
          </motion.div>
        </motion.div>
      </div>
    </div>
  );
}
