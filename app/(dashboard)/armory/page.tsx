"use client";

import { motion } from "framer-motion";
import { Breadcrumb } from "@/components/layout/Breadcrumb";
import { Card } from "@/components/ui/Card";

export default function ArmoryPage() {
  return (
    <div className="space-y-8">
      <Breadcrumb items={[
        { label: "Dashboard", href: "/dashboard" },
        { label: "Armory" }
      ]} />

      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
      >
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-4">
          The Armory
        </h1>
        <p className="text-gray-600 dark:text-gray-400">
          Curated resources, papers, notebooks, and tools for every course.
        </p>
      </motion.div>

      <Card className="p-6">
        <p className="text-gray-600 dark:text-gray-400">
          Resource library coming soon! This will include HuggingFace Spaces, arXiv papers, Colab notebooks, and more.
        </p>
      </Card>
    </div>
  );
}

