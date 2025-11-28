"use client";

import { motion, HTMLMotionProps } from "framer-motion";
import { cn } from "@/lib/utils";

interface CardProps extends Omit<HTMLMotionProps<"div">, "ref"> {
  hover?: boolean;
}

export function Card({ className, hover = false, children, ...props }: CardProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3, ease: [0.4, 0, 0.2, 1] }}
      whileHover={hover ? { 
        y: -2, 
        transition: { duration: 0.2, ease: [0.4, 0, 0.2, 1] }
      } : {}}
      className={cn(
        "bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 transition-all duration-200",
        hover && "cursor-pointer hover:shadow-md hover:border-gray-300 dark:hover:border-gray-600",
        className
      )}
      {...props}
    >
      {children}
    </motion.div>
  );
}

