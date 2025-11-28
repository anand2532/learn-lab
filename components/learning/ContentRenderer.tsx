"use client";

import { useMemo } from "react";
import { MathEquation } from "./MathEquation";
import { FlowDiagram } from "./FlowDiagram";
import { Interactive3DVisualization } from "./Interactive3DVisualization";
import { CodeExecutor } from "./CodeExecutor";

interface ContentRendererProps {
  content: string;
}

/**
 * Enhanced content renderer with support for:
 * - Markdown syntax (headers, lists, paragraphs)
 * - Math equations (LaTeX via KaTeX)
 * - Flow diagrams (Mermaid)
 * - 3D visualizations (React Three Fiber)
 * - Code blocks with syntax highlighting
 * - Structured content like GeeksforGeeks
 */
export function ContentRenderer({ content }: ContentRendererProps) {
  const elements = useMemo(() => {
    const lines = content.split("\n");
    const elements: JSX.Element[] = [];
    let inList = false;
    let listItems: string[] = [];
    let listType: "ul" | "ol" | null = null;
    let inCodeBlock = false;
    let codeBlockLang = "";
    let codeBlockContent: string[] = [];
    let inMathBlock = false;
    let mathBlockContent = "";
    let inMermaidBlock = false;
    let mermaidContent = "";
    let in3DBlock = false;
    let threeDConfig: { type?: string; title?: string; description?: string } = {};

    const flushList = () => {
      if (listItems.length > 0 && listType) {
        const ListTag = listType === "ul" ? "ul" : "ol";
        elements.push(
          <ListTag key={`list-${elements.length}`} className="ml-6 mb-4 space-y-2 list-disc">
            {listItems.map((item, i) => (
              <li key={i} className="text-gray-700 dark:text-gray-300">
                {item}
              </li>
            ))}
          </ListTag>
        );
        listItems = [];
        listType = null;
        inList = false;
      }
    };

    const flushCodeBlock = () => {
      if (codeBlockContent.length > 0) {
        const code = codeBlockContent.join("\n");
        elements.push(
          <div key={`code-${elements.length}`} className="my-6">
            <CodeExecutor 
              initialCode={code}
              defaultLanguage={(codeBlockLang as "python" | "javascript" | "typescript") || "python"}
            />
          </div>
        );
        codeBlockContent = [];
        codeBlockLang = "";
      }
      inCodeBlock = false;
    };

    const flushMathBlock = () => {
      if (mathBlockContent.trim()) {
        elements.push(
          <MathEquation
            key={`math-${elements.length}`}
            equation={mathBlockContent.trim()}
            display="block"
          />
        );
        mathBlockContent = "";
      }
      inMathBlock = false;
    };

    const flushMermaidBlock = () => {
      if (mermaidContent.trim()) {
        elements.push(
          <FlowDiagram
            key={`mermaid-${elements.length}`}
            diagram={mermaidContent.trim()}
          />
        );
        mermaidContent = "";
      }
      inMermaidBlock = false;
    };

    const flush3DBlock = () => {
      if (threeDConfig.type) {
        elements.push(
          <Interactive3DVisualization
            key={`3d-${elements.length}`}
            type={(threeDConfig.type as "vectors" | "embedding-space" | "neural-network" | "transform") || "embedding-space"}
            title={threeDConfig.title}
            description={threeDConfig.description}
          />
        );
        threeDConfig = {};
      }
      in3DBlock = false;
    };

    lines.forEach((line, idx) => {
      const trimmed = line.trim();

      // Check for block delimiters first
      if (trimmed.startsWith("```")) {
        if (inCodeBlock) {
          flushCodeBlock();
        } else if (inMermaidBlock) {
          flushMermaidBlock();
        } else if (in3DBlock) {
          flush3DBlock();
        } else {
          flushList();
          // Check for special block types
          const match = trimmed.match(/^```(\w+)(?::(.+))?$/);
          if (match) {
            const blockType = match[1];
            const config = match[2] || "";
            
            if (blockType === "mermaid") {
              inMermaidBlock = true;
            } else if (blockType === "3d") {
              in3DBlock = true;
              // Parse config: type=embedding-space,title=Title,description=Desc
              config.split(",").forEach(part => {
                const [key, ...valueParts] = part.split("=");
                const value = valueParts.join("=");
                if (key === "type") threeDConfig.type = value;
                else if (key === "title") threeDConfig.title = value;
                else if (key === "description") threeDConfig.description = value;
              });
            } else {
              inCodeBlock = true;
              codeBlockLang = blockType || "python";
            }
          } else {
            inCodeBlock = true;
            codeBlockLang = "text";
          }
        }
        return;
      }

      if (inCodeBlock) {
        codeBlockContent.push(line);
        return;
      }

      if (inMermaidBlock) {
        mermaidContent += line + "\n";
        return;
      }

      if (in3DBlock) {
        // 3D blocks don't have content, just config
        return;
      }

      // Math block delimiters
      if (trimmed === "$$") {
        flushList();
        if (inMathBlock) {
          flushMathBlock();
        } else {
          inMathBlock = true;
        }
        return;
      }

      if (inMathBlock) {
        mathBlockContent += line + "\n";
        return;
      }

      // Inline math will be handled within paragraph rendering

      // Headers
      if (trimmed.startsWith("# ")) {
        flushList();
        elements.push(
          <h1 key={idx} className="text-3xl font-bold mt-8 mb-4 text-gray-900 dark:text-white border-b-2 border-gray-300 dark:border-gray-600 pb-2">
            {trimmed.slice(2)}
          </h1>
        );
      } else if (trimmed.startsWith("## ")) {
        flushList();
        elements.push(
          <h2 key={idx} className="text-2xl font-semibold mt-6 mb-3 text-gray-900 dark:text-white">
            {trimmed.slice(3)}
          </h2>
        );
      } else if (trimmed.startsWith("### ")) {
        flushList();
        elements.push(
          <h3 key={idx} className="text-xl font-semibold mt-4 mb-2 text-gray-900 dark:text-white">
            {trimmed.slice(4)}
          </h3>
        );
      }
      // Unordered lists
      else if (trimmed.startsWith("- ") || trimmed.startsWith("* ")) {
        if (!inList || listType !== "ul") {
          flushList();
          inList = true;
          listType = "ul";
        }
        listItems.push(trimmed.slice(2));
      }
      // Ordered lists
      else if (/^\d+\.\s/.test(trimmed)) {
        if (!inList || listType !== "ol") {
          flushList();
          inList = true;
          listType = "ol";
        }
        listItems.push(trimmed.replace(/^\d+\.\s/, ""));
      }
      // Definition lists (Term: Description)
      else if (/^[A-Z][^:]+:\s/.test(trimmed)) {
        flushList();
        const [term, ...descParts] = trimmed.split(":");
        const description = descParts.join(":").trim();
        elements.push(
          <div key={idx} className="mb-3 pl-4 border-l-4 border-blue-500">
            <dt className="font-semibold text-gray-900 dark:text-white mb-1">
              {term}
            </dt>
            <dd className="text-gray-700 dark:text-gray-300 ml-4">
              {description}
            </dd>
          </div>
        );
      }
      // Callout/Alert boxes
      else if (trimmed.startsWith("> ")) {
        flushList();
        const calloutText = trimmed.slice(2);
        elements.push(
          <div key={idx} className="my-4 p-4 bg-blue-50 dark:bg-blue-900/20 border-l-4 border-blue-500 rounded-r">
            <p className="text-gray-700 dark:text-gray-300">{calloutText}</p>
          </div>
        );
      }
      // Empty lines
      else if (trimmed === "") {
        flushList();
        if (elements.length > 0 && elements[elements.length - 1].type !== "br") {
          elements.push(<br key={idx} />);
        }
      }
      // Regular paragraphs (with inline math support)
      else if (trimmed) {
        flushList();
        // Check for inline math
        if (trimmed.includes("$")) {
          const mathRegex = /\$([^$]+)\$/g;
          const parts: (string | JSX.Element)[] = [];
          let lastIndex = 0;
          let match;
          
          while ((match = mathRegex.exec(trimmed)) !== null) {
            if (match.index > lastIndex) {
              parts.push(trimmed.substring(lastIndex, match.index));
            }
            parts.push(
              <MathEquation
                key={`inline-math-${idx}-${parts.length}`}
                equation={match[1]}
                display="inline"
                animate={false}
              />
            );
            lastIndex = match.index + match[0].length;
          }
          
          if (lastIndex < trimmed.length) {
            parts.push(trimmed.substring(lastIndex));
          }
          
          elements.push(
            <p key={idx} className="mb-4 text-gray-700 dark:text-gray-300 leading-relaxed">
              {parts.length > 0 ? parts : trimmed}
            </p>
          );
        } else {
          elements.push(
            <p key={idx} className="mb-4 text-gray-700 dark:text-gray-300 leading-relaxed">
              {trimmed}
            </p>
          );
        }
      }
    });

    // Flush any remaining blocks
    flushList();
    flushCodeBlock();
    flushMathBlock();
    flushMermaidBlock();
    flush3DBlock();

    return elements;
  }, [content]);

  return (
    <div className="prose prose-lg dark:prose-invert max-w-none">
      {elements}
    </div>
  );
}
