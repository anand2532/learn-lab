"use client";

import { useEffect, useRef, useState } from "react";
import mermaid from "mermaid";
import { motion } from "framer-motion";

interface FlowDiagramProps {
  diagram: string;
  title?: string;
  animate?: boolean;
}

/**
 * Renders Mermaid diagrams (flowcharts, sequence diagrams, etc.)
 * Supports various Mermaid diagram types
 */
export function FlowDiagram({ diagram, title, animate = true }: FlowDiagramProps) {
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const diagramRef = useRef<HTMLDivElement>(null);
  const idRef = useRef(`mermaid-${Math.random().toString(36).substr(2, 9)}`);

  useEffect(() => {
    if (!diagramRef.current) return;

    // Initialize Mermaid
    mermaid.initialize({
      startOnLoad: true,
      theme: "default",
      themeVariables: {
        primaryColor: "#3b82f6",
        primaryTextColor: "#fff",
        primaryBorderColor: "#2563eb",
        lineColor: "#6b7280",
        secondaryColor: "#60a5fa",
        tertiaryColor: "#93c5fd",
        background: "#ffffff",
        mainBkgColor: "#ffffff",
        textColor: "#1f2937",
        fontFamily: "Inter, system-ui, sans-serif",
      },
      darkMode: false,
      securityLevel: "loose",
    });

    const renderDiagram = async () => {
      try {
        setIsLoading(true);
        setError(null);
        
        // Clear previous content
        if (diagramRef.current) {
          diagramRef.current.innerHTML = "";
        }

        // Render the diagram
        await mermaid.render(idRef.current, diagram);
        
        // Get the SVG from mermaid
        const svg = document.querySelector(`#${idRef.current}`)?.innerHTML;
        if (svg && diagramRef.current) {
          diagramRef.current.innerHTML = svg;
        }
        
        setIsLoading(false);
      } catch (err) {
        console.error("Mermaid render error:", err);
        setError(err instanceof Error ? err.message : "Failed to render diagram");
        setIsLoading(false);
      }
    };

    renderDiagram();
  }, [diagram]);

  const content = (
    <div className="w-full">
      {title && (
        <h4 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
          {title}
        </h4>
      )}
      <div className="overflow-x-auto bg-white dark:bg-gray-800 rounded-lg p-6 border border-gray-200 dark:border-gray-700">
        {isLoading && (
          <div className="flex items-center justify-center h-64">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
          </div>
        )}
        {error && (
          <div className="text-red-500 text-center py-8">
            <p className="font-semibold">Error rendering diagram</p>
            <p className="text-sm mt-2">{error}</p>
          </div>
        )}
        {!isLoading && !error && (
          <div
            ref={diagramRef}
            className="flex items-center justify-center mermaid-container"
            style={{ minHeight: "200px" }}
          />
        )}
      </div>
    </div>
  );

  if (!animate) {
    return <div className="my-6">{content}</div>;
  }

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.4 }}
      className="my-6"
    >
      {content}
    </motion.div>
  );
}

