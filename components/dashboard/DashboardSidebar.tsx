"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import { Card } from "@/components/ui/Card";
import { mockUser, mockTracks } from "@/lib/mock-data";

export function DashboardSidebar() {
  const user = mockUser;
  const upcomingDeadlines = [
    { course: "The Limits of Static Embeddings", days: 5, type: "assignment" },
    { course: "Recurrent Neural Networks", days: 10, type: "project" },
  ];

  const quickStats = [
    { label: "Courses Enrolled", value: mockTracks.reduce((sum, track) => sum + track.courses.length, 0), icon: "📚" },
    { label: "Lessons Completed", value: mockTracks.reduce((sum, track) => 
      sum + track.courses.reduce((courseSum, course) => courseSum + course.completedLessons, 0), 0), icon: "✅" },
    { label: "Avg. Progress", value: `${Math.round(mockTracks[0].courses.reduce((sum, c) => sum + c.progress, 0) / mockTracks[0].courses.length)}%`, icon: "📊" },
  ];

  return (
    <div className="space-y-4 md:space-y-6">
      {/* Quick Stats - Compact */}
      <motion.div
        initial={{ opacity: 0, x: -20 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ delay: 0.1 }}
      >
        <Card className="p-3">
          <h3 className="text-xs font-semibold text-gray-900 dark:text-white mb-3">
            Quick Stats
          </h3>
          <div className="space-y-2">
            {quickStats.map((stat, index) => (
              <motion.div
                key={stat.label}
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.2 + index * 0.1 }}
                className="flex items-center justify-between p-1.5 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors"
              >
                <div className="flex items-center space-x-1.5">
                  <span className="text-sm">{stat.icon}</span>
                  <span className="text-xs text-gray-600 dark:text-gray-400 truncate">{stat.label}</span>
                </div>
                <span className="text-xs font-semibold text-gray-900 dark:text-white">
                  {stat.value}
                </span>
              </motion.div>
            ))}
          </div>
        </Card>
      </motion.div>

      {/* Upcoming Deadlines - Compact */}
      <motion.div
        initial={{ opacity: 0, x: -20 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ delay: 0.2 }}
      >
        <Card className="p-3">
          <div className="flex items-center justify-between mb-3">
            <h3 className="text-xs font-semibold text-gray-900 dark:text-white">
              Deadlines
            </h3>
            <Link href="/courses" className="text-xs text-blue-600 dark:text-blue-400 hover:underline">
              All
            </Link>
          </div>
          <div className="space-y-2">
            {upcomingDeadlines.map((deadline, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.3 + index * 0.1 }}
                className="p-2 rounded-lg bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800"
              >
                <div className="flex items-start justify-between mb-1">
                  <p className="text-xs font-medium text-red-900 dark:text-red-300">
                    {deadline.type === "assignment" ? "📝" : "📋"}
                  </p>
                  <span className="text-xs font-semibold text-red-700 dark:text-red-400">
                    {deadline.days}d
                  </span>
                </div>
                <p className="text-xs text-gray-700 dark:text-gray-300 line-clamp-2">
                  {deadline.course}
                </p>
              </motion.div>
            ))}
          </div>
        </Card>
      </motion.div>

      {/* Learning Streak - Compact */}
      <motion.div
        initial={{ opacity: 0, x: -20 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ delay: 0.3 }}
      >
        <Card className="p-3 bg-gradient-to-br from-orange-50 to-yellow-50 dark:from-orange-900/20 dark:to-yellow-900/20 border-orange-200 dark:border-orange-800">
          <div className="flex items-center space-x-2 mb-2">
            <div className="text-lg">🔥</div>
            <div>
              <p className="text-xs font-semibold text-gray-900 dark:text-white">
                Streak
              </p>
            </div>
          </div>
          <div className="flex items-center justify-between mb-2">
            <motion.span
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ type: "spring", delay: 0.4 }}
              className="text-xl font-bold text-orange-600 dark:text-orange-400"
            >
              {user.streak}
            </motion.span>
            <span className="text-xs text-gray-600 dark:text-gray-400">
              days
            </span>
          </div>
          <div className="h-1 bg-orange-200 dark:bg-orange-900/50 rounded-full overflow-hidden">
            <motion.div
              initial={{ width: 0 }}
              animate={{ width: `${(user.streak / 30) * 100}%` }}
              transition={{ duration: 0.5, delay: 0.5 }}
              className="h-full bg-gradient-to-r from-orange-500 to-yellow-500"
            />
          </div>
        </Card>
      </motion.div>

      {/* Recent Badges - Compact */}
      <motion.div
        initial={{ opacity: 0, x: -20 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ delay: 0.4 }}
      >
        <Card className="p-3">
          <h3 className="text-xs font-semibold text-gray-900 dark:text-white mb-3">
            Badges
          </h3>
          <div className="space-y-1.5">
            {user.badges.map((badge, index) => (
              <motion.div
                key={badge}
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.5 + index * 0.1, type: "spring" }}
                className="flex items-center space-x-1.5 p-1.5 rounded-lg bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-800"
              >
                <span className="text-sm">🏆</span>
                <span className="text-xs text-gray-900 dark:text-white truncate">{badge}</span>
              </motion.div>
            ))}
            {user.badges.length === 0 && (
              <p className="text-xs text-gray-500 dark:text-gray-400 text-center py-1">
                No badges yet
              </p>
            )}
          </div>
        </Card>
      </motion.div>
    </div>
  );
}

