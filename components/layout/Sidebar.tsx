"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { mockTracks } from "@/lib/mock-data";
import { cn } from "@/lib/utils";

interface SidebarProps {
  isOpen: boolean;
  onClose: () => void;
  collapsed?: boolean;
  onToggleCollapse?: () => void;
}

export function Sidebar({ isOpen, onClose, collapsed = false, onToggleCollapse }: SidebarProps) {
  const pathname = usePathname();

  const isActive = (path: string) => pathname === path || pathname?.startsWith(path + "/");

  const navItems = [
    { href: "/dashboard", label: "Dashboard", icon: "📊" },
    { href: "/courses", label: "Courses", icon: "📚" },
    { href: "/leaderboard", label: "Leaderboard", icon: "🏆" },
    { href: "/community", label: "Community", icon: "💬" },
    { href: "/armory", label: "Armory", icon: "🔗" },
  ];

  return (
    <>
      {/* Mobile overlay */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-black/50 z-40 lg:hidden"
          />
        )}
      </AnimatePresence>

      {/* Sidebar */}
      <motion.aside
        initial={false}
        animate={{
          x: isOpen ? 0 : (collapsed ? -60 : -260),
        }}
        transition={{ type: "spring", stiffness: 300, damping: 30 }}
        className={cn(
          "fixed left-0 top-16 bottom-0 bg-white dark:bg-gray-900 border-r border-gray-200 dark:border-gray-800 z-50 overflow-y-auto transition-all duration-300",
          "lg:static lg:translate-x-0",
          collapsed ? "w-[60px] lg:w-[60px]" : "w-[260px] lg:w-[200px] xl:w-[220px]"
        )}
      >
        <div className={cn("p-4", collapsed && "px-2")}>
          {/* Collapse Toggle Button - Desktop Only */}
          {onToggleCollapse && (
            <motion.button
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
              onClick={onToggleCollapse}
              className="hidden lg:flex items-center justify-center w-full mb-4 p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
              aria-label={collapsed ? "Expand sidebar" : "Collapse sidebar"}
            >
              <svg 
                className={cn("w-5 h-5 text-gray-600 dark:text-gray-400 transition-transform", collapsed && "rotate-180")}
                fill="none" 
                viewBox="0 0 24 24" 
                stroke="currentColor"
              >
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            </motion.button>
          )}

          {/* Navigation Items */}
          <nav className={cn("space-y-1 mb-8", collapsed && "space-y-2")}>
            {navItems.map((item, index) => (
              <motion.div
                key={item.href}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: index * 0.1 }}
              >
                <Link
                  href={item.href}
                  onClick={() => onClose()}
                  className={cn(
                    "flex items-center rounded-lg transition-colors",
                    collapsed ? "justify-center px-2 py-3" : "space-x-3 px-4 py-3",
                    isActive(item.href)
                      ? "bg-blue-50 dark:bg-blue-900/20 text-blue-600 dark:text-blue-400 font-medium"
                      : "text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800"
                  )}
                  title={collapsed ? item.label : undefined}
                >
                  <span className="text-xl">{item.icon}</span>
                  {!collapsed && <span>{item.label}</span>}
                </Link>
              </motion.div>
            ))}
          </nav>

          {/* Course Tracks */}
          {!collapsed && (
          <div className="space-y-4">
            <h3 className="px-4 text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider">
              Learning Tracks
            </h3>
            
            {mockTracks.map((track, trackIndex) => (
              <motion.div
                key={track.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: trackIndex * 0.1 }}
                className="space-y-2"
              >
                <div className="px-4">
                  <h4 className="text-sm font-semibold text-gray-900 dark:text-white mb-1">
                    {track.name}
                  </h4>
                  <p className="text-xs text-gray-500 dark:text-gray-400 mb-2">
                    {track.description}
                  </p>
                  <div className="flex items-center space-x-2 mb-2">
                    <div className="flex-1 h-1.5 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden">
                      <motion.div
                        initial={{ width: 0 }}
                        animate={{ width: `${track.progress}%` }}
                        transition={{ duration: 0.5, delay: trackIndex * 0.1 }}
                        className="h-full bg-gradient-to-r from-blue-500 to-indigo-500"
                      />
                    </div>
                    <span className="text-xs text-gray-500 dark:text-gray-400">
                      {track.progress}%
                    </span>
                  </div>
                </div>

                <div className="space-y-1">
                  {track.courses.map((course, courseIndex) => (
                    <motion.div
                      key={course.id}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: (trackIndex * 0.1) + (courseIndex * 0.05) }}
                    >
                      <Link
                        href={`/learn/${course.id}`}
                        onClick={() => onClose()}
                        className={cn(
                          "block px-4 py-2 text-sm rounded-lg transition-colors",
                          isActive(`/learn/${course.id}`)
                            ? "bg-blue-50 dark:bg-blue-900/20 text-blue-600 dark:text-blue-400"
                            : "text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800"
                        )}
                      >
                        <div className="flex items-center justify-between">
                          <span className="truncate">{course.title}</span>
                          {course.progress > 0 && (
                            <span className="text-xs text-gray-500 dark:text-gray-400 ml-2">
                              {course.progress}%
                            </span>
                          )}
                        </div>
                      </Link>
                    </motion.div>
                  ))}
                </div>
              </motion.div>
            ))}
          </div>
          )}
        </div>
      </motion.aside>
    </>
  );
}

