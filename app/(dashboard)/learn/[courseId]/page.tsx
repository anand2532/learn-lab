"use client";

import { useState, useEffect, useMemo } from "react";
import { useParams } from "next/navigation";
import { motion } from "framer-motion";
import { Breadcrumb } from "@/components/layout/Breadcrumb";
import { Card } from "@/components/ui/Card";
import { CodeExecutor } from "@/components/learning/CodeExecutor";
import { PipelineVisualization } from "@/components/learning/PipelineVisualization";
import { CourseTopics } from "@/components/learning/CourseTopics";
import { ContentRenderer } from "@/components/learning/ContentRenderer";
import { LearningConsole } from "@/components/learning/LearningConsole";
import { courseContent, type CourseData } from "@/lib/course-data";

export default function CoursePage() {
  const params = useParams();
  const [activeTopic, setActiveTopic] = useState<string>("intro");
  const [activeSubtopic, setActiveSubtopic] = useState<string | null>(null);
  const [activeContent, setActiveContent] = useState<{ title: string; content: string; code?: string; has3D?: boolean; hasPipeline?: boolean } | null>(null);

  const courseId = (params?.courseId as string) || "";
  const course: CourseData | undefined = useMemo(
    () => courseContent[courseId],
    [courseId]
  );

  // Initialize content when course loads or topic/subtopic changes
  useEffect(() => {
    if (course && activeTopic) {
      const topic = course.topics.find(t => t.id === activeTopic);
      
      if (activeSubtopic && topic?.subtopics) {
        // Show subtopic content
        const subtopic = topic.subtopics.find(st => st.id === activeSubtopic);
        if (subtopic) {
          setActiveContent({
            title: subtopic.title,
            content: subtopic.content,
            code: subtopic.code,
            has3D: subtopic.has3D,
          });
        } else {
          setActiveContent(null);
        }
      } else if (topic) {
        // Show topic content or first subtopic
        if (topic.subtopics && topic.subtopics.length > 0) {
          // Show first subtopic by default
          const firstSubtopic = topic.subtopics[0];
          setActiveSubtopic(firstSubtopic.id);
          setActiveContent({
            title: firstSubtopic.title,
            content: firstSubtopic.content,
            code: firstSubtopic.code,
            has3D: firstSubtopic.has3D,
          });
        } else if (topic.content) {
          // Topic has direct content
          setActiveContent({
            title: topic.title,
            content: topic.content,
            code: topic.code,
            has3D: topic.has3D,
            hasPipeline: topic.hasPipeline,
          });
        } else {
          // Fallback to segments
          const segment = course.segments[activeTopic];
          if (segment) {
            setActiveContent({
              title: segment.title,
              content: segment.content,
              code: segment.code,
              has3D: segment.has3D,
              hasPipeline: segment.hasPipeline,
            });
          } else {
            setActiveContent(null);
          }
        }
      } else {
        // Fallback to segments
        const segment = course.segments[activeTopic];
        if (segment) {
          setActiveContent({
            title: segment.title,
            content: segment.content,
            code: segment.code,
            has3D: segment.has3D,
            hasPipeline: segment.hasPipeline,
          });
        } else {
          setActiveContent(null);
        }
      }
    }
  }, [activeTopic, activeSubtopic, course]);

  const handleTopicClick = (topicId: string) => {
    setActiveTopic(topicId);
    setActiveSubtopic(null); // Reset subtopic when topic changes
    // Scroll to top of content
    if (typeof window !== "undefined") {
      window.scrollTo({ top: 0, behavior: "smooth" });
    }
  };

  const handleSubtopicClick = (topicId: string, subtopicId: string) => {
    setActiveTopic(topicId);
    setActiveSubtopic(subtopicId);
    // Scroll to top of content
    if (typeof window !== "undefined") {
      window.scrollTo({ top: 0, behavior: "smooth" });
    }
  };

  // Loading state
  if (!courseId) {
    return (
      <div className="space-y-8">
        <Breadcrumb items={[
          { label: "Dashboard", href: "/dashboard" },
          { label: "Courses", href: "/courses" },
          { label: "Loading..." }
        ]} />
        <Card className="p-6">
          <p className="text-gray-600 dark:text-gray-400">Loading course...</p>
        </Card>
      </div>
    );
  }

  // Course not found
  if (!course) {
    return (
      <div className="space-y-8">
        <Breadcrumb items={[
          { label: "Dashboard", href: "/dashboard" },
          { label: "Courses", href: "/courses" },
          { label: "Course Not Found" }
        ]} />
        <Card className="p-6">
          <p className="text-gray-600 dark:text-gray-400">
            Course not found. Please select a valid course. (ID: {courseId})
          </p>
        </Card>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      <Breadcrumb items={[
        { label: "Dashboard", href: "/dashboard" },
        { label: "Courses", href: "/courses" },
        { label: course.title }
      ]} />

      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
      >
        <h1 className="text-4xl font-bold text-gray-900 dark:text-white mb-2">
          {course.title}
        </h1>
        <p className="text-lg text-gray-600 dark:text-gray-400">
          {course.description}
        </p>
      </motion.div>

      {/* Main Content Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Sidebar - Topics */}
        <div className="lg:col-span-3">
          <CourseTopics
            topics={course.topics}
            activeTopic={activeTopic}
            activeSubtopic={activeSubtopic || undefined}
            onTopicClick={handleTopicClick}
            onSubtopicClick={handleSubtopicClick}
          />
        </div>

        {/* Main Content - Split Screen Learning Console */}
        <div className="lg:col-span-9">
          {activeContent ? (
            <LearningConsole
              leftTitle={activeContent.title}
              rightTitle="Code Arena"
              defaultLeftWidth={55}
              minLeftWidth={35}
              maxLeftWidth={70}
              leftContent={
                <div className="space-y-6">
                  {/* Pipeline Visualization */}
                  {activeContent.hasPipeline && course.pipelineSteps && (
                    <PipelineVisualization
                      steps={course.pipelineSteps}
                      activeStep={undefined}
                    />
                  )}

                  {/* Enhanced Content Renderer with Math, Diagrams, 3D */}
                  <ContentRenderer content={activeContent.content} />
                </div>
              }
              rightContent={
                <CodeExecutor 
                  initialCode={activeContent.code || ""}
                  defaultLanguage="python"
                />
              }
            />
          ) : (
            <Card className="p-8">
              <div className="text-center py-12">
                <p className="text-gray-500 dark:text-gray-400">
                  Loading course content...
                </p>
              </div>
            </Card>
          )}
        </div>
      </div>
    </div>
  );
}
