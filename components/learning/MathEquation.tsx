"use client";

import { useMemo } from "react";
import { BlockMath, InlineMath } from "react-katex";
import "katex/dist/katex.min.css";
import { motion } from "framer-motion";

interface MathEquationProps {
  equation: string;
  display?: "inline" | "block";
  label?: string;
  animate?: boolean;
}

/**
 * Renders LaTeX math equations with KaTeX
 * Supports both inline and block (display) math
 */
export function MathEquation({ 
  equation, 
  display = "block", 
  label,
  animate = true 
}: MathEquationProps) {
  const content = useMemo(() => {
    if (display === "inline") {
      return <InlineMath math={equation} />;
    }
    return <BlockMath math={equation} />;
  }, [equation, display]);

  const wrappedContent = label ? (
    <div className="relative">
      <div className="text-right text-sm text-gray-500 dark:text-gray-400 mb-2">
        {label}
      </div>
      {content}
    </div>
  ) : content;

  if (!animate) {
    return (
      <div className={`my-4 ${display === "block" ? "overflow-x-auto" : ""}`}>
        {wrappedContent}
      </div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      className={`my-4 ${display === "block" ? "overflow-x-auto" : ""}`}
    >
      {wrappedContent}
    </motion.div>
  );
}

