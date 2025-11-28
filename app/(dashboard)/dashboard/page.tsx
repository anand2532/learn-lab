"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import { Card } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { Breadcrumb } from "@/components/layout/Breadcrumb";
import { CourseCalendar } from "@/components/dashboard/CourseCalendar";
import { DashboardSidebar } from "@/components/dashboard/DashboardSidebar";
import { mockUser, mockTracks } from "@/lib/mock-data";

export default function DashboardPage() {
  const user = mockUser;
  const continueLearning = mockTracks[0].courses.find(c => c.progress > 0 && c.progress < 100) || mockTracks[0].courses[0];
  const recommendedCourses = mockTracks[0].courses.slice(0, 3);

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0 },
  };

  return (
    <div className="space-y-3 md:space-y-4 lg:space-y-6">
      <Breadcrumb items={[{ label: "Dashboard", href: "/dashboard" }]} />

      {/* Welcome Section */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="space-y-4"
      >
        <div className="flex items-center justify-between flex-wrap gap-4">
          <div>
            <h1 className="text-2xl md:text-3xl font-bold text-gray-900 dark:text-white">
              Welcome back, {user.name}! 👋
            </h1>
            <p className="text-gray-600 dark:text-gray-400">
              Continue your learning journey and unlock new achievements.
            </p>
          </div>
          {/* Quick Stats Summary - Visible on larger screens */}
          <div className="hidden lg:flex items-center gap-4">
            <div className="text-center">
              <div className="text-lg font-bold text-gray-900 dark:text-white">{user.xp.toLocaleString()}</div>
              <div className="text-xs text-gray-500 dark:text-gray-400">XP</div>
            </div>
            <div className="text-center">
              <div className="text-lg font-bold text-gray-900 dark:text-white">Lv {user.level}</div>
              <div className="text-xs text-gray-500 dark:text-gray-400">Level</div>
            </div>
            <div className="text-center">
              <div className="text-lg font-bold text-orange-600 dark:text-orange-400">🔥 {user.streak}</div>
              <div className="text-xs text-gray-500 dark:text-gray-400">Streak</div>
            </div>
          </div>
        </div>
      </motion.div>

      {/* Dashboard Layout - Two Column with Sidebar */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-4 md:gap-6">
        {/* Left Sidebar - Dashboard Widgets */}
        <motion.aside
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.1 }}
          className="lg:col-span-3 xl:col-span-2 space-y-4 md:space-y-6"
        >
          <DashboardSidebar />
        </motion.aside>

        {/* Main Content Area */}
        <div className="lg:col-span-9 xl:col-span-10 space-y-4 md:space-y-6">

          {/* Stats Grid */}
          <motion.div
            variants={containerVariants}
            initial="hidden"
            animate="visible"
            className="grid grid-cols-2 sm:grid-cols-4 gap-3 md:gap-4"
          >
        <motion.div variants={itemVariants}>
          <Card className="p-4 md:p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600 dark:text-gray-400">Total XP</p>
                <motion.p
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.2 }}
                  className="text-2xl font-bold text-gray-900 dark:text-white"
                >
                  {user.xp.toLocaleString()}
                </motion.p>
              </div>
              <div className="text-3xl">⭐</div>
            </div>
          </Card>
        </motion.div>

        <motion.div variants={itemVariants}>
          <Card className="p-4 md:p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600 dark:text-gray-400">Level</p>
                <motion.p
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.3 }}
                  className="text-2xl font-bold text-gray-900 dark:text-white"
                >
                  {user.level}
                </motion.p>
              </div>
              <div className="text-3xl">🎯</div>
            </div>
          </Card>
        </motion.div>

        <motion.div variants={itemVariants}>
          <Card className="p-4 md:p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600 dark:text-gray-400">Streak</p>
                <motion.p
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.4 }}
                  className="text-2xl font-bold text-gray-900 dark:text-white"
                >
                  {user.streak} days
                </motion.p>
              </div>
              <div className="text-3xl">🔥</div>
            </div>
          </Card>
        </motion.div>

        <motion.div variants={itemVariants}>
          <Card className="p-4 md:p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600 dark:text-gray-400">Badges</p>
                <motion.p
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.5 }}
                  className="text-2xl font-bold text-gray-900 dark:text-white"
                >
                  {user.badges.length}
                </motion.p>
              </div>
              <div className="text-3xl">🏆</div>
            </div>
          </Card>
            </motion.div>
          </motion.div>

          {/* Continue Learning */}
          {continueLearning && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
            >
          <Card hover className="p-6">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-xl font-bold text-gray-900 dark:text-white">
                Continue Learning
              </h2>
              <Link href={`/learn/${continueLearning.id}`}>
                <Button variant="primary" size="sm">Continue</Button>
              </Link>
            </div>
            <div>
              <div className="flex items-center justify-between mb-2">
                <h3 className="font-semibold text-gray-900 dark:text-white">
                  {continueLearning.title}
                </h3>
                <span className="text-sm text-gray-500 dark:text-gray-400">
                  {continueLearning.progress}%
                </span>
              </div>
              <div className="h-2 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden">
                <motion.div
                  initial={{ width: 0 }}
                  animate={{ width: `${continueLearning.progress}%` }}
                  transition={{ duration: 0.5, ease: "easeOut" }}
                  className="h-full bg-gradient-to-r from-blue-500 to-indigo-500"
                />
              </div>
              <p className="text-sm text-gray-600 dark:text-gray-400 mt-2">
                {continueLearning.completedLessons} of {continueLearning.lessons} lessons completed
              </p>
            </div>
              </Card>
            </motion.div>
          )}

          {/* Two Column Layout: Calendar and Courses */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 md:gap-6">
            {/* Course Calendar */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
            >
              <CourseCalendar />
            </motion.div>

            {/* Recommended Courses */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 }}
            >
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-xl font-bold text-gray-900 dark:text-white">
                  Recommended Courses
                </h2>
                <Link href="/courses">
                  <Button variant="ghost" size="sm">View All</Button>
                </Link>
              </div>
              <div className="space-y-4">
                {recommendedCourses.map((course, index) => (
                  <motion.div
                    key={course.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.5 + index * 0.1 }}
                  >
                    <Card hover className="p-4">
                      <div className="flex items-start justify-between mb-2">
                        <h3 className="font-semibold text-sm text-gray-900 dark:text-white flex-1">
                          {course.title}
                        </h3>
                        {course.progress > 0 && (
                          <span className="text-xs text-gray-500 dark:text-gray-400 ml-2">
                            {course.progress}%
                          </span>
                        )}
                      </div>
                      <p className="text-xs text-gray-600 dark:text-gray-400 mb-3 line-clamp-2">
                        {course.description}
                      </p>
                      <div className="flex items-center justify-between mb-3">
                        <div className="flex items-center gap-3 text-xs text-gray-500 dark:text-gray-400">
                          <span>{course.lessons} lessons</span>
                          <span>{course.duration} min</span>
                        </div>
                      </div>
                      {course.progress > 0 && (
                        <div className="h-1 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden mb-3">
                          <motion.div
                            initial={{ width: 0 }}
                            animate={{ width: `${course.progress}%` }}
                            transition={{ duration: 0.5, delay: 0.6 + index * 0.1 }}
                            className="h-full bg-blue-500"
                          />
                        </div>
                      )}
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
          </div>

          {/* Recent Activity */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 }}
          >
            <Card className="p-4 md:p-6">
              <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-4">
                Recent Activity
              </h2>
              <div className="space-y-3">
                {[
                  { action: "Completed", item: "From Words to Vectors", time: "2 hours ago" },
                  { action: "Earned", item: "Week Warrior badge", time: "1 day ago" },
                  { action: "Started", item: "The Limits of Static Embeddings", time: "2 days ago" },
                ].map((activity, index) => (
                  <motion.div
                    key={index}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.4 + index * 0.1 }}
                    className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-800 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
                  >
                    <div>
                      <p className="text-sm text-gray-900 dark:text-white">
                        <span className="font-medium">{activity.action}</span> {activity.item}
                      </p>
                      <p className="text-xs text-gray-500 dark:text-gray-400">{activity.time}</p>
                    </div>
                  </motion.div>
                ))}
              </div>
            </Card>
          </motion.div>
        </div>
      </div>
    </div>
  );
}

