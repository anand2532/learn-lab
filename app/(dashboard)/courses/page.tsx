"use client";

import { motion } from "framer-motion";
import { Breadcrumb } from "@/components/layout/Breadcrumb";
import { Card } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import Link from "next/link";
import { mockTracks } from "@/lib/mock-data";

export default function CoursesPage() {
  return (
    <div className="space-y-4 md:space-y-6 lg:space-y-8">
      <Breadcrumb items={[
        { label: "Dashboard", href: "/dashboard" },
        { label: "Courses" }
      ]} />

      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
      >
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-4">
          All Courses
        </h1>
        <p className="text-gray-600 dark:text-gray-400">
          Explore our comprehensive curriculum on Generative AI and Agentic AI.
        </p>
      </motion.div>

      {mockTracks.map((track, trackIndex) => (
        <motion.div
          key={track.id}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: trackIndex * 0.1 }}
          className="space-y-4"
        >
          <div>
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
              {track.name}
            </h2>
            <p className="text-gray-600 dark:text-gray-400 mb-4">{track.description}</p>
            <div className="flex items-center space-x-2 mb-4">
              <div className="flex-1 h-2 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden">
                <motion.div
                  initial={{ width: 0 }}
                  animate={{ width: `${track.progress}%` }}
                  transition={{ duration: 0.5, delay: trackIndex * 0.1 }}
                  className="h-full bg-gradient-to-r from-blue-500 to-indigo-500"
                />
              </div>
              <span className="text-sm text-gray-500 dark:text-gray-400">{track.progress}%</span>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 2xl:grid-cols-6 gap-4 md:gap-6">
            {track.courses.map((course, courseIndex) => (
              <motion.div
                key={course.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: (trackIndex * 0.1) + (courseIndex * 0.05) }}
              >
                <Card hover className="p-4 md:p-6 h-full flex flex-col">
                  <div className="flex-1">
                    <h3 className="font-semibold text-gray-900 dark:text-white mb-2">
                      {course.title}
                    </h3>
                    <p className="text-sm text-gray-600 dark:text-gray-400 mb-4">
                      {course.description}
                    </p>
                    <div className="space-y-2 mb-4">
                      <div className="flex items-center justify-between text-xs text-gray-500 dark:text-gray-400">
                        <span>{course.lessons} lessons</span>
                        <span>{course.duration} min</span>
                      </div>
                      {course.progress > 0 && (
                        <div className="h-1.5 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden">
                          <motion.div
                            initial={{ width: 0 }}
                            animate={{ width: `${course.progress}%` }}
                            transition={{ duration: 0.5, delay: 0.5 + (trackIndex * 0.1) + (courseIndex * 0.05) }}
                            className="h-full bg-blue-500"
                          />
                        </div>
                      )}
                    </div>
                  </div>
                  <Link href={`/learn/${course.id}`}>
                    <Button variant="primary" size="sm" className="w-full">
                      {course.progress > 0 ? "Continue" : "Start Course"}
                    </Button>
                  </Link>
                </Card>
              </motion.div>
            ))}
          </div>
        </motion.div>
      ))}
    </div>
  );
}

