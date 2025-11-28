"use client";

import { motion } from "framer-motion";
import { Card } from "@/components/ui/Card";
import { ArrowRightIcon } from "@heroicons/react/24/solid";

interface PipelineStep {
  id: string;
  title: string;
  description: string;
  color: string;
}

interface PipelineVisualizationProps {
  steps: PipelineStep[];
  activeStep?: number;
}

export function PipelineVisualization({ steps, activeStep }: PipelineVisualizationProps) {
  return (
    <Card className="p-6 bg-gradient-to-br from-blue-50 to-indigo-50 dark:from-gray-800 dark:to-gray-900 border-2 border-blue-200 dark:border-gray-700">
      <div className="flex items-center gap-3 mb-6">
        <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center">
          <span className="text-white font-bold text-lg">→</span>
        </div>
        <div>
          <h3 className="text-xl font-bold text-gray-900 dark:text-white">
            Word to Vector Pipeline
          </h3>
          <p className="text-sm text-gray-600 dark:text-gray-400">
            Complete transformation process from text to embeddings
          </p>
        </div>
      </div>
      
      <div className="relative">
        {/* Pipeline Flow - Horizontal with better spacing */}
        <div className="flex flex-col md:flex-row items-stretch md:items-center justify-between gap-4 md:gap-3">
          {steps.map((step, index) => (
            <div key={step.id} className="flex items-center flex-1 md:flex-none">
              {/* Step Card */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ 
                  opacity: activeStep === undefined || activeStep >= index ? 1 : 0.4,
                  y: 0,
                  scale: activeStep === index ? 1.02 : 1
                }}
                transition={{ duration: 0.4, delay: index * 0.1 }}
                className={`relative flex-1 md:w-52 p-5 rounded-xl border-2 shadow-lg transition-all ${
                  activeStep === index
                    ? `${step.color} border-opacity-100 shadow-xl transform scale-105`
                    : "bg-white dark:bg-gray-800 border-gray-300 dark:border-gray-600 hover:shadow-md"
                }`}
              >
                {/* Step Number Badge */}
                <div className={`w-10 h-10 rounded-full flex items-center justify-center text-white font-bold mb-3 shadow-md ${
                  activeStep === undefined || activeStep >= index ? step.color : "bg-gray-400"
                }`}>
                  {index + 1}
                </div>
                
                {/* Step Content */}
                <h4 className={`font-bold text-base mb-2 ${
                  activeStep === index 
                    ? "text-white" 
                    : "text-gray-900 dark:text-white"
                }`}>
                  {step.title}
                </h4>
                <p className={`text-sm leading-relaxed ${
                  activeStep === index 
                    ? "text-white text-opacity-95" 
                    : "text-gray-600 dark:text-gray-400"
                }`}>
                  {step.description}
                </p>

                {/* Active Indicator */}
                {activeStep === index && (
                  <motion.div
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    className="absolute -top-2 -right-2 w-6 h-6 bg-green-500 rounded-full flex items-center justify-center shadow-lg"
                  >
                    <span className="text-white text-xs">✓</span>
                  </motion.div>
                )}
              </motion.div>

              {/* Arrow with animation */}
              {index < steps.length - 1 && (
                <motion.div
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: index * 0.1 + 0.3 }}
                  className="hidden md:flex items-center justify-center mx-2"
                >
                  <motion.div
                    animate={{ x: [0, 5, 0] }}
                    transition={{ duration: 1.5, repeat: Infinity, ease: "easeInOut" }}
                  >
                    <ArrowRightIcon className="w-8 h-8 text-blue-500 dark:text-blue-400" />
                  </motion.div>
                </motion.div>
              )}
            </div>
          ))}
        </div>

        {/* 3D Visualization Placeholder */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
          className="mt-8 p-6 bg-gradient-to-br from-blue-50 to-purple-50 dark:from-gray-800 dark:to-gray-900 rounded-lg border border-gray-200 dark:border-gray-700"
        >
          <h4 className="text-sm font-semibold text-gray-900 dark:text-white mb-4">
            3D Vector Space Visualization
          </h4>
          <div className="relative h-64 bg-white dark:bg-gray-800 rounded-md overflow-hidden">
            {/* Simple 3D-like visualization using CSS transforms */}
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="relative w-full h-full">
                {/* Vector points */}
                {[1, 2, 3, 4, 5].map((i) => (
                  <motion.div
                    key={i}
                    initial={{ opacity: 0, scale: 0 }}
                    animate={{ 
                      opacity: 1, 
                      scale: 1,
                      x: Math.cos((i * 2 * Math.PI) / 5) * 80,
                      y: Math.sin((i * 2 * Math.PI) / 5) * 80,
                      z: i * 20
                    }}
                    transition={{ 
                      delay: 0.6 + i * 0.1,
                      type: "spring",
                      stiffness: 100
                    }}
                    className="absolute w-4 h-4 bg-blue-500 rounded-full shadow-lg"
                    style={{
                      transform: `translate(${Math.cos((i * 2 * Math.PI) / 5) * 80}px, ${Math.sin((i * 2 * Math.PI) / 5) * 80}px)`,
                      transformStyle: "preserve-3d",
                    }}
                  />
                ))}
                
                {/* Center point */}
                <motion.div
                  initial={{ opacity: 0, scale: 0 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: 0.5 }}
                  className="absolute top-1/2 left-1/2 w-6 h-6 bg-purple-500 rounded-full shadow-lg transform -translate-x-1/2 -translate-y-1/2"
                />

                {/* Grid lines */}
                <svg className="absolute inset-0 w-full h-full opacity-20">
                  <defs>
                    <pattern id="grid" width="20" height="20" patternUnits="userSpaceOnUse">
                      <path d="M 20 0 L 0 0 0 20" fill="none" stroke="currentColor" strokeWidth="1"/>
                    </pattern>
                  </defs>
                  <rect width="100%" height="100%" fill="url(#grid)" className="text-gray-400" />
                </svg>
              </div>
            </div>
          </div>
          <p className="text-xs text-gray-600 dark:text-gray-400 mt-4 text-center">
            Interactive 3D visualization showing word vectors in embedding space
          </p>
        </motion.div>
      </div>
    </Card>
  );
}

