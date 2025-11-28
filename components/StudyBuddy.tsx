"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";

interface StudyBuddyProps {
  className?: string;
}

export function StudyBuddy({ className }: StudyBuddyProps) {
  const [tip, setTip] = useState<string>("Loading tips...");
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchTip = async () => {
      try {
        const response = await fetch("/api/ai/help");
        const data = await response.json();
        setTip(data.tip);
      } catch {
        setTip("Sign in to unlock personalized learning insights!");
      } finally {
        setIsLoading(false);
      }
    };

    fetchTip();
  }, []);

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.3, duration: 0.5 }}
      className={`bg-gradient-to-br from-blue-50 to-indigo-50 dark:from-blue-900/20 dark:to-indigo-900/20 rounded-lg p-4 border border-blue-200 dark:border-blue-800 ${className}`}
    >
      <div className="flex items-start gap-3">
        <div className="flex-shrink-0 w-10 h-10 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-lg flex items-center justify-center">
          <span className="text-white text-lg font-bold">🤖</span>
        </div>
        <div className="flex-1 min-w-0">
          <h3 className="text-sm font-semibold text-gray-900 dark:text-white mb-1">
            Study Buddy
          </h3>
          <p className="text-xs text-gray-600 dark:text-gray-300 leading-relaxed">
            {isLoading ? (
              <span className="inline-block animate-pulse">Loading...</span>
            ) : (
              tip
            )}
          </p>
        </div>
      </div>
    </motion.div>
  );
}

