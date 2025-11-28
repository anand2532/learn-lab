"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { CheckCircleIcon as CheckCircleSolid, ChevronDownIcon, ChevronRightIcon } from "@heroicons/react/24/solid";

interface Subtopic {
  id: string;
  title: string;
  completed?: boolean;
}

interface Topic {
  id: string;
  title: string;
  description?: string;
  subtopics?: Subtopic[];
  completed?: boolean;
}

interface CourseTopicsProps {
  topics: Topic[];
  activeTopic?: string;
  activeSubtopic?: string;
  onTopicClick?: (topicId: string) => void;
  onSubtopicClick?: (topicId: string, subtopicId: string) => void;
}

export function CourseTopics({ 
  topics, 
  activeTopic, 
  activeSubtopic,
  onTopicClick, 
  onSubtopicClick 
}: CourseTopicsProps) {
  const [expandedTopics, setExpandedTopics] = useState<Set<string>>(
    new Set(activeTopic ? [activeTopic] : [])
  );

  const toggleTopic = (topicId: string) => {
    setExpandedTopics(prev => {
      const newSet = new Set(prev);
      if (newSet.has(topicId)) {
        newSet.delete(topicId);
      } else {
        newSet.add(topicId);
      }
      return newSet;
    });
  };

  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 p-4 sticky top-4 max-h-[calc(100vh-120px)] overflow-y-auto">
      <h3 className="text-sm font-semibold text-gray-900 dark:text-white mb-4">
        Course Topics
      </h3>
      <nav className="space-y-1">
        {topics.map((topic, index) => {
          const hasSubtopics = topic.subtopics && topic.subtopics.length > 0;
          const isExpanded = expandedTopics.has(topic.id);
          const isActive = activeTopic === topic.id;

          return (
            <div key={topic.id}>
              <motion.button
                onClick={() => {
                  if (hasSubtopics) {
                    toggleTopic(topic.id);
                  }
                  onTopicClick?.(topic.id);
                }}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: index * 0.05 }}
                className={`w-full text-left px-3 py-2 rounded-md text-sm transition-colors ${
                  isActive && !activeSubtopic
                    ? "bg-blue-50 dark:bg-blue-900/20 text-blue-700 dark:text-blue-300 font-medium"
                    : "text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700"
                }`}
              >
                <div className="flex items-center gap-2">
                  {hasSubtopics && (
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        toggleTopic(topic.id);
                      }}
                      className="p-0.5 hover:bg-gray-200 dark:hover:bg-gray-600 rounded"
                    >
                      {isExpanded ? (
                        <ChevronDownIcon className="w-4 h-4" />
                      ) : (
                        <ChevronRightIcon className="w-4 h-4" />
                      )}
                    </button>
                  )}
                  {topic.completed ? (
                    <CheckCircleSolid className="w-5 h-5 text-green-500 flex-shrink-0" />
                  ) : (
                    <div className="w-5 h-5 rounded-full border-2 border-gray-400 flex-shrink-0" />
                  )}
                  <span className="flex-1">{topic.title}</span>
                </div>
                {topic.description && (
                  <p className="text-xs text-gray-500 dark:text-gray-400 mt-1 ml-7">
                    {topic.description}
                  </p>
                )}
              </motion.button>

              {/* Subtopics */}
              <AnimatePresence>
                {hasSubtopics && isExpanded && (
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: "auto", opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    transition={{ duration: 0.2 }}
                    className="overflow-hidden"
                  >
                    <div className="ml-4 pl-4 border-l-2 border-gray-200 dark:border-gray-700 space-y-1 mt-1">
                      {topic.subtopics!.map((subtopic, subIndex) => {
                        const isSubtopicActive = activeTopic === topic.id && activeSubtopic === subtopic.id;
                        return (
                          <motion.button
                            key={subtopic.id}
                            onClick={() => onSubtopicClick?.(topic.id, subtopic.id)}
                            initial={{ opacity: 0, x: -10 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ delay: subIndex * 0.03 }}
                            className={`w-full text-left px-3 py-1.5 rounded-md text-xs transition-colors ${
                              isSubtopicActive
                                ? "bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300 font-medium"
                                : "text-gray-600 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-gray-700"
                            }`}
                          >
                            <div className="flex items-center gap-2">
                              {subtopic.completed ? (
                                <CheckCircleSolid className="w-4 h-4 text-green-500 flex-shrink-0" />
                              ) : (
                                <div className="w-4 h-4 rounded-full border-2 border-gray-400 flex-shrink-0" />
                              )}
                              <span>{subtopic.title}</span>
                            </div>
                          </motion.button>
                        );
                      })}
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          );
        })}
      </nav>
    </div>
  );
}

