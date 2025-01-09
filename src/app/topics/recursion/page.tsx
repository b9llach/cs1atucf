"use client";

import { Card } from "@/components/ui/card";
import { motion, AnimatePresence } from "framer-motion";
import Link from "next/link";
import { AIChatBox } from "@/components/ai-chat";

export default function HashingPage() {
  return (
    <div className="min-h-screen p-8 bg-black">
      <div className="max-w-4xl mx-auto">
        <Link 
          href="/"
          className="inline-block mb-6 rounded-md px-4 py-2 bg-black text-white hover:bg-black/80 transition-all"
        >
          ← Back
        </Link>

        <h1 className="text-4xl font-bold mb-8 text-white">Recursion</h1>

        <AnimatePresence mode="wait">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.2 }}
          >
            <Card className="p-6 bg-zinc-800/50">
              <div className="flex flex-col items-center justify-center py-12">
                <h2 className="text-3xl font-bold text-white mb-4">coming soon</h2>
                <p className="text-zinc-400 text-center max-w-md mb-6">
                  im currently working on it.
                </p>
              </div>
            </Card>
          </motion.div>
        </AnimatePresence>
      </div>
    </div>
  );
}
