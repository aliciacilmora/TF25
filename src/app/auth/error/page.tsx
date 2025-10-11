"use client";
import { useSearchParams } from "next/navigation";
import { motion } from "motion/react";
import { AlertCircle, ArrowLeft } from "lucide-react";
import { useRouter } from "next/navigation";

export default function AuthErrorPage() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const error = searchParams.get("error");

  const getErrorMessage = (error: string | null) => {
    switch (error) {
      case "Configuration":
        return "There is a problem with the server configuration.";
      case "AccessDenied":
        return "Access denied. You do not have permission to sign in.";
      case "Verification":
        return "The verification token has expired or has already been used.";
      case "Default":
        return "An error occurred during authentication.";
      default:
        return "Something went wrong. Please try again.";
    }
  };

  return (
    <div className="min-h-screen bg-black flex items-center justify-center px-4">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
        className="max-w-md w-full bg-slate-800 rounded-lg p-8 text-center"
      >
        <div className="flex justify-center mb-6">
          <AlertCircle className="w-16 h-16 text-red-400" />
        </div>
        
        <h1 className="text-2xl font-bold text-white mb-4">
          Authentication Error
        </h1>
        
        <p className="text-slate-300 mb-8">
          {getErrorMessage(error)}
        </p>
        
        <div className="space-y-4">
          <button
            onClick={() => router.push("/auth/login")}
            className="w-full py-3 bg-gradient-to-r from-cyan-400 to-blue-600 text-black font-semibold rounded-lg hover:brightness-110 transition-all duration-300"
          >
            Try Again
          </button>
          
          <button
            onClick={() => router.push("/")}
            className="w-full flex items-center justify-center gap-2 py-3 text-slate-400 hover:text-white transition-colors"
          >
            <ArrowLeft size={20} />
            Back to Home
          </button>
        </div>
      </motion.div>
    </div>
  );
}
