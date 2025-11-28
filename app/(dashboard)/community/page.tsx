"use client";

import { motion } from "framer-motion";
import { Breadcrumb } from "@/components/layout/Breadcrumb";
import { Card } from "@/components/ui/Card";

export default function CommunityPage() {
  return (
    <div className="space-y-8">
      <Breadcrumb items={[
        { label: "Dashboard", href: "/dashboard" },
        { label: "Community" }
      ]} />

      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
      >
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-4">
          Community Hub
        </h1>
        <p className="text-gray-600 dark:text-gray-400">
          Connect with fellow learners, share your projects, and get help.
        </p>
      </motion.div>

      <Card className="p-6">
        <p className="text-gray-600 dark:text-gray-400">
          Community features coming soon! This will include forums, showcase, and peer reviews.
        </p>
      </Card>
    </div>
  );
}

