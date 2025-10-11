"use client";
import React from "react";
import { useRouter } from "next/navigation";
import { LampDemo, LampContainer } from "../../components/ui/lamp";
import { motion } from "motion/react";
import {
  Modal,
  ModalBody,
  ModalContent,
  ModalFooter,
  ModalTrigger,
} from "../../components/ui/animated-modal";

export default function RootPage() {
  const router = useRouter();

  return (
    <>
      <LampContainer>
        <motion.h1
          initial={{ opacity: 0.5, y: 100 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{
            delay: 0.3,
            duration: 0.8,
            ease: "easeInOut",
          }}
          className="mt-8 bg-gradient-to-br from-slate-300 to-slate-500 py-4 bg-clip-text text-center text-4xl font-medium tracking-tight text-transparent md:text-7xl"
        >
          Insider
        </motion.h1>
        
        <motion.p
          initial={{ opacity: 0, y: 50 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{
            delay: 0.6,
            duration: 0.8,
            ease: "easeInOut",
          }}
          className="mt-6 text-center text-lg md:text-xl text-slate-400 max-w-2xl mx-auto px-4"
        >
        </motion.p>

        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{
            delay: 0.9,
            duration: 0.8,
            ease: "easeInOut",
          }}
          className="mt-12 flex flex-col sm:flex-row gap-4 justify-center items-center px-4"
        >
        <button
          onClick={() => router.push("/auth/login")}
          className="w-full md:w-48 py-4 rounded-lg font-semibold bg-gradient-to-r from-cyan-400 to-blue-600 text-black hover:brightness-110 transition"
        >
          I'm a Customer (Business)
        </button>
          
        <button
          onClick={() => router.push("/interview/start")}
          className="w-full md:w-48 py-4 rounded-lg font-semibold border-2 border-cyan-400 text-cyan-400 hover:bg-cyan-400 hover:text-black transition"
        >
          I'm a Respondent (Interviewee)
        </button>
        </motion.div>
      </LampContainer>
    </>
  );
}
