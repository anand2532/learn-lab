"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Card } from "@/components/ui/Card";
import { mockTracks } from "@/lib/mock-data";

interface CalendarEvent {
  date: Date;
  course: string;
  type: "lesson" | "deadline" | "live";
  title: string;
  intensity: number; // 0-4 for GitHub-style intensity
}

export function CourseCalendar() {
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);
  const [hoveredDate, setHoveredDate] = useState<Date | null>(null);

  // Generate events for the last 365 days (GitHub style)
  const generateEvents = (): Map<string, CalendarEvent[]> => {
    const eventsMap = new Map<string, CalendarEvent[]>();
    const today = new Date();
    
    // Generate activity for the past year
    for (let i = 0; i < 365; i++) {
      const date = new Date(today);
      date.setDate(today.getDate() - (365 - i));
      const dateKey = date.toISOString().split('T')[0];
      const events: CalendarEvent[] = [];

      // Random activity based on day of week (more on weekdays)
      const dayOfWeek = date.getDay();
      const isWeekday = dayOfWeek > 0 && dayOfWeek < 6;
      
      if (isWeekday && Math.random() > 0.3) {
        const intensity = Math.floor(Math.random() * 4) + 1;
        events.push({
          date,
          course: "Active Learning",
          type: "lesson",
          title: "Learning activity",
          intensity,
        });
      }

      // Add specific deadlines from mock data
      mockTracks.forEach((track) => {
        track.courses.forEach((course, index) => {
          if (course.progress > 0 && course.progress < 100) {
            const lessonDate = new Date(today);
            lessonDate.setDate(today.getDate() - (365 - i) + index);
            if (lessonDate.toDateString() === date.toDateString()) {
              events.push({
                date,
                course: course.title,
                type: "lesson",
                title: `Lesson ${course.completedLessons + 1}`,
                intensity: 3,
              });
            }
          }
        });
      });

      if (events.length > 0) {
        eventsMap.set(dateKey, events);
      }
    }

    return eventsMap;
  };

  const eventsMap = generateEvents();

  // Get weeks for the last year (GitHub style - 53 weeks)
  const getWeeks = () => {
    const weeks: Date[][] = [];
    const today = new Date();
    const startDate = new Date(today);
    startDate.setDate(today.getDate() - 365);

    // Find the Sunday of the week containing startDate
    const firstSunday = new Date(startDate);
    firstSunday.setDate(startDate.getDate() - startDate.getDay());

    for (let week = 0; week < 53; week++) {
      const weekDays: Date[] = [];
      for (let day = 0; day < 7; day++) {
        const date = new Date(firstSunday);
        date.setDate(firstSunday.getDate() + (week * 7) + day);
        if (date <= today) {
          weekDays.push(date);
        }
      }
      if (weekDays.length > 0) {
        weeks.push(weekDays);
      }
    }
    return weeks;
  };

  const weeks = getWeeks();
  const monthNames = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];

  // Generate month labels - improved algorithm
  interface MonthLabel {
    week: number;
    month: string;
  }
  const monthLabels: MonthLabel[] = [];
  let lastMonth = -1;
  weeks.forEach((week, weekIndex) => {
    if (week.length > 0) {
      const firstDay = week[0];
      const month = firstDay.getMonth();
      // Show month label at the start of each month or every 4-5 weeks
      if (month !== lastMonth) {
        monthLabels.push({ week: weekIndex, month: monthNames[month] });
        lastMonth = month;
      }
    }
  });

  const getIntensityColor = (intensity: number) => {
    switch (intensity) {
      case 0:
        return "bg-gray-100 dark:bg-gray-800";
      case 1:
        return "bg-blue-200 dark:bg-blue-900/40";
      case 2:
        return "bg-blue-400 dark:bg-blue-700";
      case 3:
        return "bg-blue-600 dark:bg-blue-600";
      case 4:
        return "bg-blue-800 dark:bg-blue-500";
      default:
        return "bg-gray-100 dark:bg-gray-800";
    }
  };

  const getDateKey = (date: Date) => date.toISOString().split('T')[0];
  const getEventsForDate = (date: Date) => eventsMap.get(getDateKey(date)) || [];

  const getTotalIntensity = (date: Date) => {
    const events = getEventsForDate(date);
    return Math.min(events.reduce((sum, e) => sum + e.intensity, 0), 4);
  };

  const isToday = (date: Date) => {
    const today = new Date();
    return (
      date.getDate() === today.getDate() &&
      date.getMonth() === today.getMonth() &&
      date.getFullYear() === today.getFullYear()
    );
  };

  return (
    <Card className="p-4 md:p-5">
      <div className="mb-4">
        <h2 className="text-lg font-bold text-gray-900 dark:text-white mb-1">
          Learning Activity
        </h2>
        <p className="text-xs text-gray-500 dark:text-gray-400">
          Your learning activity over the past year
        </p>
      </div>

      {/* GitHub-style Contribution Graph */}
      <div className="overflow-x-auto">
        <div className="inline-flex items-start gap-1">
          {/* Day labels column - Fixed width */}
          <div className="flex flex-col gap-1 pt-3.5 flex-shrink-0">
            {['', 'Mon', '', 'Wed', '', 'Fri', ''].map((day, index) => (
              <div 
                key={index} 
                className="text-xs text-gray-500 dark:text-gray-400 h-3 flex items-center justify-end pr-2"
                style={{ height: '11px', lineHeight: '11px' }}
              >
                {day}
              </div>
            ))}
          </div>

          {/* Calendar grid container */}
          <div className="flex flex-col">
            {/* Month labels row */}
            <div className="flex gap-0.5 mb-1">
              {weeks.map((week, weekIndex) => {
                const monthLabel = monthLabels.find(m => m.week === weekIndex);
                return (
                  <div 
                    key={weekIndex} 
                    className="w-3 flex-shrink-0"
                    style={{ minWidth: '11px' }}
                  >
                    {monthLabel && (
                      <div className="text-xs text-gray-500 dark:text-gray-400 text-left">
                        {monthLabel.month}
                      </div>
                    )}
                  </div>
                );
              })}
            </div>

            {/* Contribution grid */}
            <div className="flex gap-0.5">
              {weeks.map((week, weekIndex) => (
                <div key={weekIndex} className="flex flex-col gap-0.5 flex-shrink-0" style={{ width: '11px' }}>
                  {week.map((date, dayIndex) => {
                    const intensity = getTotalIntensity(date);
                    const events = getEventsForDate(date);
                    const isCurrentDay = isToday(date);
                    const isSelected = selectedDate && 
                      date.getDate() === selectedDate.getDate() &&
                      date.getMonth() === selectedDate.getMonth() &&
                      date.getFullYear() === selectedDate.getFullYear();
                    const isHovered = hoveredDate &&
                      date.getDate() === hoveredDate.getDate() &&
                      date.getMonth() === hoveredDate.getMonth() &&
                      date.getFullYear() === hoveredDate.getFullYear();

                    return (
                      <motion.div
                        key={dayIndex}
                        whileHover={{ scale: 1.3, zIndex: 10 }}
                        onHoverStart={() => setHoveredDate(date)}
                        onHoverEnd={() => setHoveredDate(null)}
                        onClick={() => setSelectedDate(date)}
                        className={`
                          w-3 h-3 rounded-sm cursor-pointer transition-all
                          ${getIntensityColor(intensity)}
                          ${isCurrentDay ? 'ring-2 ring-blue-500 ring-offset-1' : ''}
                          ${isSelected ? 'ring-2 ring-blue-600 ring-offset-1' : ''}
                          ${isHovered ? 'ring-2 ring-gray-400 ring-offset-1' : ''}
                        `}
                        title={events.length > 0 ? `${events.length} activities on ${date.toLocaleDateString()}` : `No activity on ${date.toLocaleDateString()}`}
                      />
                    );
                  })}
                  {/* Fill empty days in week */}
                  {Array.from({ length: 7 - week.length }).map((_, emptyIndex) => (
                    <div key={`empty-${emptyIndex}`} className="w-3 h-3" />
                  ))}
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Legend */}
      <div className="flex items-center justify-between mt-4 pt-4 border-t border-gray-200 dark:border-gray-700">
        <div className="flex items-center gap-2 text-xs text-gray-500 dark:text-gray-400">
          <span>Less</span>
          <div className="flex gap-0.5">
            <div className="w-3 h-3 rounded-sm bg-gray-100 dark:bg-gray-800" />
            <div className="w-3 h-3 rounded-sm bg-blue-200 dark:bg-blue-900/40" />
            <div className="w-3 h-3 rounded-sm bg-blue-400 dark:bg-blue-700" />
            <div className="w-3 h-3 rounded-sm bg-blue-600 dark:bg-blue-600" />
            <div className="w-3 h-3 rounded-sm bg-blue-800 dark:bg-blue-500" />
          </div>
          <span>More</span>
        </div>
        {selectedDate && (
          <motion.button
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            onClick={() => setSelectedDate(null)}
            className="text-xs text-blue-600 dark:text-blue-400 hover:underline"
          >
            Clear selection
          </motion.button>
        )}
      </div>

      {/* Selected Date Events */}
      <AnimatePresence>
        {selectedDate && getEventsForDate(selectedDate).length > 0 && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            className="mt-4 pt-4 border-t border-gray-200 dark:border-gray-700"
          >
            <h3 className="text-sm font-semibold text-gray-900 dark:text-white mb-2">
              {selectedDate.toLocaleDateString("en-US", {
                weekday: "long",
                month: "long",
                day: "numeric",
              })}
            </h3>
            <div className="space-y-2">
              {getEventsForDate(selectedDate).map((event, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: index * 0.05 }}
                  className="flex items-start space-x-2 p-2 rounded-lg bg-gray-50 dark:bg-gray-800"
                >
                  <div className={`w-2 h-2 rounded-full mt-1.5 ${
                    event.type === "lesson" ? "bg-blue-500" :
                    event.type === "deadline" ? "bg-red-500" : "bg-green-500"
                  }`} />
                  <div className="flex-1 min-w-0">
                    <p className="text-xs font-medium text-gray-900 dark:text-white">
                      {event.title}
                    </p>
                    <p className="text-xs text-gray-500 dark:text-gray-400 truncate">
                      {event.course}
                    </p>
                  </div>
                </motion.div>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </Card>
  );
}
