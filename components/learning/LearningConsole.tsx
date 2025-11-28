"use client";

import { useState, ReactNode } from "react";
import { Panel, PanelGroup, PanelResizeHandle } from "react-resizable-panels";
import { motion } from "framer-motion";
import { 
  ChevronLeftIcon,
  ChevronRightIcon 
} from "@heroicons/react/24/outline";
import { Card } from "@/components/ui/Card";

interface LearningConsoleProps {
  leftContent: ReactNode;
  rightContent: ReactNode;
  leftTitle?: string;
  rightTitle?: string;
  defaultLeftWidth?: number; // Percentage (0-100)
  minLeftWidth?: number;
  maxLeftWidth?: number;
}

/**
 * Split-screen learning console with resizable panels
 * Left panel: Content (theory, diagrams, visualizations)
 * Right panel: Code executor
 */
export function LearningConsole({
  leftContent,
  rightContent,
  leftTitle = "Learning Content",
  rightTitle = "Code Arena",
  defaultLeftWidth = 50,
  minLeftWidth = 30,
  maxLeftWidth = 70,
}: LearningConsoleProps) {
  const [isLeftCollapsed, setIsLeftCollapsed] = useState(false);
  const [isRightCollapsed, setIsRightCollapsed] = useState(false);

  return (
    <div className="w-full h-[calc(100vh-200px)] min-h-[600px] flex flex-col bg-gray-50 dark:bg-gray-900 rounded-lg overflow-hidden border border-gray-200 dark:border-gray-700 shadow-lg">
      <PanelGroup direction="horizontal" className="flex-1">
        {/* Left Panel - Content */}
        <Panel
          defaultSize={defaultLeftWidth}
          minSize={minLeftWidth}
          maxSize={maxLeftWidth}
          collapsible={true}
          onCollapse={() => setIsLeftCollapsed(true)}
          className="flex flex-col"
        >
          <Card className="h-full flex flex-col m-2 overflow-hidden">
            {/* Left Panel Header */}
            <div className="flex items-center justify-between px-6 py-4 border-b border-gray-200 dark:border-gray-700 bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-gray-800 dark:to-gray-800">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-blue-500 animate-pulse"></span>
                {leftTitle}
              </h3>
              <button
                onClick={() => setIsLeftCollapsed(true)}
                className="p-1.5 rounded-md hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors"
                title="Collapse panel"
              >
                <ChevronLeftIcon className="w-5 h-5 text-gray-600 dark:text-gray-400" />
              </button>
            </div>

            {/* Left Panel Content */}
            <div className="flex-1 overflow-y-auto p-6 bg-white dark:bg-gray-800">
              <motion.div
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.3 }}
              >
                {leftContent}
              </motion.div>
            </div>
          </Card>
        </Panel>

        {/* Resize Handle */}
        <PanelResizeHandle className="w-2 bg-gray-200 dark:bg-gray-700 hover:bg-blue-500 dark:hover:bg-blue-600 transition-colors relative group">
          <div className="absolute inset-y-0 left-1/2 transform -translate-x-1/2 w-1 bg-gray-300 dark:bg-gray-600 group-hover:bg-blue-500 dark:group-hover:bg-blue-600 transition-colors" />
          <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 opacity-0 group-hover:opacity-100 transition-opacity">
            <div className="flex flex-col gap-1">
              <div className="w-1 h-1 rounded-full bg-blue-500" />
              <div className="w-1 h-1 rounded-full bg-blue-500" />
              <div className="w-1 h-1 rounded-full bg-blue-500" />
            </div>
          </div>
        </PanelResizeHandle>

        {/* Right Panel - Code Executor */}
        <Panel
          defaultSize={100 - defaultLeftWidth}
          minSize={30}
          maxSize={70}
          collapsible={true}
          onCollapse={() => setIsRightCollapsed(true)}
          className="flex flex-col"
        >
          <Card className="h-full flex flex-col m-2 overflow-hidden">
            {/* Right Panel Header */}
            <div className="flex items-center justify-between px-6 py-4 border-b border-gray-200 dark:border-gray-700 bg-gradient-to-r from-gray-900 to-gray-800">
              <h3 className="text-lg font-semibold text-white flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-green-500 animate-pulse"></span>
                {rightTitle}
              </h3>
              <button
                onClick={() => setIsRightCollapsed(true)}
                className="p-1.5 rounded-md hover:bg-gray-700 transition-colors"
                title="Collapse panel"
              >
                <ChevronRightIcon className="w-5 h-5 text-gray-400" />
              </button>
            </div>

            {/* Right Panel Content */}
            <div className="flex-1 overflow-hidden">
              <motion.div
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.3 }}
                className="h-full"
              >
                {rightContent}
              </motion.div>
            </div>
          </Card>
        </Panel>
      </PanelGroup>

      {/* Collapsed Panel Overlays */}
      {isLeftCollapsed && (
        <motion.button
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          onClick={() => setIsLeftCollapsed(false)}
          className="fixed left-4 top-1/2 transform -translate-y-1/2 z-50 p-3 bg-blue-600 text-white rounded-r-lg shadow-lg hover:bg-blue-700 transition-colors"
          title="Expand content panel"
        >
          <ChevronRightIcon className="w-5 h-5" />
        </motion.button>
      )}

      {isRightCollapsed && (
        <motion.button
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          onClick={() => setIsRightCollapsed(false)}
          className="fixed right-4 top-1/2 transform -translate-y-1/2 z-50 p-3 bg-gray-900 text-white rounded-l-lg shadow-lg hover:bg-gray-800 transition-colors"
          title="Expand code panel"
        >
          <ChevronLeftIcon className="w-5 h-5" />
        </motion.button>
      )}
    </div>
  );
}

