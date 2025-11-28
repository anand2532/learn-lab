"use client";

import { motion } from "framer-motion";
import { Breadcrumb } from "@/components/layout/Breadcrumb";
import { Card } from "@/components/ui/Card";

export default function LeaderboardPage() {
  const mockLeaderboard = [
    { rank: 1, name: "Alex Chen", xp: 12500, level: 12, badge: "🥇" },
    { rank: 2, name: "Sarah Johnson", xp: 11800, level: 11, badge: "🥈" },
    { rank: 3, name: "Mike Zhang", xp: 11200, level: 11, badge: "🥉" },
    { rank: 4, name: "Demo User", xp: 2450, level: 3, badge: "" },
    { rank: 5, name: "Emma Wilson", xp: 2100, level: 2, badge: "" },
  ];

  return (
    <div className="space-y-4 md:space-y-6 lg:space-y-8">
      <Breadcrumb items={[
        { label: "Dashboard", href: "/dashboard" },
        { label: "Leaderboard" }
      ]} />

      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
      >
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-4">
          Leaderboard
        </h1>
        <p className="text-gray-600 dark:text-gray-400">
          See how you rank against other learners.
        </p>
      </motion.div>

      <Card className="p-4 md:p-6">
        <div className="space-y-4">
          {mockLeaderboard.map((user, index) => (
            <motion.div
              key={user.rank}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: index * 0.1 }}
              className={`flex items-center justify-between p-4 rounded-lg ${
                user.rank <= 3
                  ? "bg-gradient-to-r from-yellow-50 to-orange-50 dark:from-yellow-900/20 dark:to-orange-900/20"
                  : "bg-gray-50 dark:bg-gray-800"
              }`}
            >
              <div className="flex items-center space-x-4">
                <div className="flex items-center justify-center w-12 h-12 rounded-full bg-gradient-to-br from-blue-500 to-indigo-600 text-white font-bold">
                  {user.badge || user.rank}
                </div>
                <div>
                  <h3 className="font-semibold text-gray-900 dark:text-white">
                    {user.name}
                  </h3>
                  <p className="text-sm text-gray-500 dark:text-gray-400">
                    Level {user.level}
                  </p>
                </div>
              </div>
              <div className="text-right">
                <p className="font-bold text-gray-900 dark:text-white">
                  {user.xp.toLocaleString()} XP
                </p>
              </div>
            </motion.div>
          ))}
        </div>
      </Card>
    </div>
  );
}

