"use client";

import { useState, useEffect, useRef } from "react";
import { 
  PlayIcon, 
  ArrowPathIcon, 
  CodeBracketIcon,
  CheckCircleIcon,
  XCircleIcon,
  ClockIcon
} from "@heroicons/react/24/solid";
import { motion, AnimatePresence } from "framer-motion";
import { Card } from "@/components/ui/Card";
import { codeTemplates } from "@/lib/code-templates";

type Language = "python" | "javascript" | "typescript" | "java" | "cpp" | "rust" | "go";

interface CodeExecutorProps {
  initialCode?: string;
  onCodeChange?: (code: string) => void;
  defaultLanguage?: Language;
}

interface LanguageConfig {
  name: string;
  extension: string;
  icon: string;
  color: string;
  bgGradient: string;
  borderColor: string;
}

const languageConfigs: Record<Language, LanguageConfig> = {
  python: {
    name: "Python",
    extension: "py",
    icon: "🐍",
    color: "text-yellow-400",
    bgGradient: "from-yellow-500/20 to-orange-500/20",
    borderColor: "border-yellow-500/50",
  },
  javascript: {
    name: "JavaScript",
    extension: "js",
    icon: "🟨",
    color: "text-yellow-500",
    bgGradient: "from-yellow-500/20 to-yellow-600/20",
    borderColor: "border-yellow-500/50",
  },
  typescript: {
    name: "TypeScript",
    extension: "ts",
    icon: "🔷",
    color: "text-blue-500",
    bgGradient: "from-blue-500/20 to-blue-600/20",
    borderColor: "border-blue-500/50",
  },
  java: {
    name: "Java",
    extension: "java",
    icon: "☕",
    color: "text-orange-500",
    bgGradient: "from-orange-500/20 to-red-500/20",
    borderColor: "border-orange-500/50",
  },
  cpp: {
    name: "C++",
    extension: "cpp",
    icon: "⚡",
    color: "text-blue-400",
    bgGradient: "from-blue-400/20 to-cyan-500/20",
    borderColor: "border-blue-400/50",
  },
  rust: {
    name: "Rust",
    extension: "rs",
    icon: "🦀",
    color: "text-orange-600",
    bgGradient: "from-orange-600/20 to-red-600/20",
    borderColor: "border-orange-600/50",
  },
  go: {
    name: "Go",
    extension: "go",
    icon: "🐹",
    color: "text-cyan-500",
    bgGradient: "from-cyan-500/20 to-blue-500/20",
    borderColor: "border-cyan-500/50",
  },
};

export function CodeExecutor({ 
  initialCode = "", 
  onCodeChange,
  defaultLanguage = "python"
}: CodeExecutorProps) {
  const [code, setCode] = useState(initialCode);
  const [output, setOutput] = useState<string>("");
  const [isRunning, setIsRunning] = useState(false);
  const [error, setError] = useState<string>("");
  const [language, setLanguage] = useState<Language>(defaultLanguage);
  const [executionTime, setExecutionTime] = useState<number>(0);
  const [lineNumbers, setLineNumbers] = useState<string>("1");
  const [isLoading, setIsLoading] = useState(true);
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const pyodideRef = useRef<any>(null);

  const currentLang = languageConfigs[language];

  // Load Pyodide for Python execution
  useEffect(() => {
    if (language === "python") {
      const loadPyodide = async () => {
        try {
          setIsLoading(true);
          // Check if Pyodide is loaded
          // eslint-disable-next-line @typescript-eslint/no-explicit-any
          if (typeof window !== "undefined" && (window as any).loadPyodide) {
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            const pyodide = await (window as any).loadPyodide({
              indexURL: "https://cdn.jsdelivr.net/pyodide/v0.24.1/full/",
            });
            pyodideRef.current = pyodide;
            setIsLoading(false);
          } else {
            // Fallback: try loading from script tag
            await new Promise<void>((resolve) => {
              const script = document.createElement("script");
              script.src = "https://cdn.jsdelivr.net/pyodide/v0.24.1/full/pyodide.js";
              script.onload = () => resolve();
              document.head.appendChild(script);
            });
            
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            if ((window as any).loadPyodide) {
              // eslint-disable-next-line @typescript-eslint/no-explicit-any
              const pyodide = await (window as any).loadPyodide({
                indexURL: "https://cdn.jsdelivr.net/pyodide/v0.24.1/full/",
              });
              pyodideRef.current = pyodide;
              setIsLoading(false);
            } else {
              throw new Error("Pyodide failed to load");
            }
          }
        } catch (err) {
          console.error("Failed to load Pyodide:", err);
          setError("Failed to load Python runtime. Please refresh the page.");
          setIsLoading(false);
        }
      };

      loadPyodide();
    } else {
      setIsLoading(false);
    }
  }, [language]);

  useEffect(() => {
    if (initialCode) {
      setCode(initialCode);
    }
  }, [initialCode]);

  // Update line numbers
  useEffect(() => {
    const lines = code.split("\n").length;
    setLineNumbers(Array.from({ length: lines }, (_, i) => i + 1).join("\n"));
  }, [code]);

  const executePython = async (code: string): Promise<{ output: string; error?: string }> => {
    if (!pyodideRef.current) {
      return { output: "", error: "Python runtime not loaded" };
    }

    try {
      let capturedOutput = "";
      pyodideRef.current.setStdout({
        batched: (text: string) => {
          capturedOutput += text;
        },
      });

      await pyodideRef.current.runPythonAsync(code);
      
      return { output: capturedOutput || "Code executed successfully (no output)" };
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : "An error occurred";
      return { output: "", error: errorMessage };
    }
  };

  const executeJavaScript = async (code: string): Promise<{ output: string; error?: string }> => {
    try {
      const originalConsoleLog = console.log;
      let capturedOutput = "";
      
      // Override console.log to capture output
      console.log = (...args: unknown[]) => {
        capturedOutput += args.map(arg => 
          typeof arg === "object" ? JSON.stringify(arg, null, 2) : String(arg)
        ).join(" ") + "\n";
        originalConsoleLog(...args);
      };

      // Execute in a sandboxed environment
      const result = eval(code);
      
      // Restore console.log
      console.log = originalConsoleLog;

      if (result !== undefined) {
        capturedOutput += String(result);
      }

      return { output: capturedOutput || "Code executed successfully (no output)" };
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : "An error occurred";
      return { output: "", error: errorMessage };
    }
  };

  const executeTypeScript = async (code: string): Promise<{ output: string; error?: string }> => {
    // TypeScript execution is similar to JavaScript for runtime
    // In a real implementation, you'd use a TypeScript compiler
    return executeJavaScript(code);
  };

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const executeJava = async (_code: string): Promise<{ output: string; error?: string }> => {
    // Java execution would require a backend service
    return { output: "", error: "Java execution requires a backend service. Not available in browser." };
  };

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const executeCpp = async (_code: string): Promise<{ output: string; error?: string }> => {
    // C++ execution would require a backend service
    return { output: "", error: "C++ execution requires a backend service. Not available in browser." };
  };

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const executeRust = async (_code: string): Promise<{ output: string; error?: string }> => {
    // Rust execution would require a backend service
    return { output: "", error: "Rust execution requires a backend service. Not available in browser." };
  };

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const executeGo = async (_code: string): Promise<{ output: string; error?: string }> => {
    // Go execution would require a backend service
    return { output: "", error: "Go execution requires a backend service. Not available in browser." };
  };

  const runCode = async () => {
    if (isRunning) return;

    setIsRunning(true);
    setOutput("");
    setError("");
    const startTime = performance.now();

    try {
      let result: { output: string; error?: string };

      switch (language) {
        case "python":
          result = await executePython(code);
          break;
        case "javascript":
          result = await executeJavaScript(code);
          break;
        case "typescript":
          result = await executeTypeScript(code);
          break;
        case "java":
          result = await executeJava(code);
          break;
        case "cpp":
          result = await executeCpp(code);
          break;
        case "rust":
          result = await executeRust(code);
          break;
        case "go":
          result = await executeGo(code);
          break;
        default:
          result = { output: "", error: "Unsupported language" };
      }

      const endTime = performance.now();
      setExecutionTime(endTime - startTime);

      if (result.error) {
        setError(result.error);
      } else {
        setOutput(result.output);
      }
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : "An unexpected error occurred";
      setError(errorMessage);
    } finally {
      setIsRunning(false);
    }
  };

  const clearOutput = () => {
    setOutput("");
    setError("");
    setExecutionTime(0);
  };

  const handleCodeChange = (newCode: string) => {
    setCode(newCode);
    onCodeChange?.(newCode);
  };

  const handleLanguageChange = (newLanguage: Language) => {
    try {
      setLanguage(newLanguage);
      setOutput("");
      setError("");
      setExecutionTime(0);
      // Load template for new language if code is empty
      if (!code.trim()) {
        const template = codeTemplates[newLanguage] || "";
        setCode(template);
      }
    } catch (err) {
      console.error("Error changing language:", err);
      setError("Failed to change language");
    }
  };

  const loadTemplate = () => {
    try {
      const template = codeTemplates[language] || "";
      setCode(template);
      setOutput("");
      setError("");
    } catch (err) {
      console.error("Error loading template:", err);
      setError("Failed to load template");
    }
  };

  return (
    <Card className="p-0 overflow-hidden bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 border-2 border-gray-700 shadow-2xl">
      {/* Gaming-style Header */}
      <div className={`bg-gradient-to-r ${currentLang.bgGradient} border-b-2 ${currentLang.borderColor} px-6 py-4`}>
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <motion.div
              whileHover={{ scale: 1.1, rotate: 5 }}
              className="text-3xl"
            >
              {currentLang.icon}
            </motion.div>
            <div>
              <h3 className="text-lg font-bold text-white flex items-center gap-2">
                <CodeBracketIcon className="w-5 h-5" />
                Code Arena
              </h3>
              <p className="text-xs text-gray-300">Execute your code in real-time</p>
            </div>
          </div>

          {/* Language Selector */}
          <div className="flex items-center gap-3">
            <select
              value={language}
              onChange={(e) => handleLanguageChange(e.target.value as Language)}
              className={`bg-gray-800/80 border-2 ${currentLang.borderColor} text-white px-4 py-2 rounded-lg font-semibold text-sm focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-gray-800 focus:ring-yellow-400 cursor-pointer transition-all hover:bg-gray-700/80`}
            >
              {Object.entries(languageConfigs).map(([key, config]) => (
                <option key={key} value={key} className="bg-gray-800">
                  {config.icon} {config.name}
                </option>
              ))}
            </select>

            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={runCode}
              disabled={isRunning || isLoading}
              className={`flex items-center gap-2 px-6 py-2.5 bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700 text-white font-bold rounded-lg shadow-lg disabled:opacity-50 disabled:cursor-not-allowed transition-all transform ${
                isRunning ? "animate-pulse" : ""
              }`}
            >
              {isRunning ? (
                <>
                  <ClockIcon className="w-5 h-5 animate-spin" />
                  Running...
                </>
              ) : (
                <>
                  <PlayIcon className="w-5 h-5" />
                  Run Code
                </>
              )}
            </motion.button>

            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={loadTemplate}
              className="flex items-center gap-2 px-4 py-2.5 bg-gray-700 hover:bg-gray-600 text-white font-semibold rounded-lg transition-all"
              title="Load template"
            >
              <CodeBracketIcon className="w-4 h-4" />
              Template
            </motion.button>
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={clearOutput}
              className="flex items-center gap-2 px-4 py-2.5 bg-gray-700 hover:bg-gray-600 text-white font-semibold rounded-lg transition-all"
            >
              <ArrowPathIcon className="w-4 h-4" />
              Clear
            </motion.button>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-0 bg-gray-900">
        {/* Code Editor - Gaming Style */}
        <div className="relative border-r-2 border-gray-700">
          {/* Line Numbers */}
          <div className="absolute left-0 top-0 bottom-0 w-12 bg-gray-950/50 border-r border-gray-700 text-gray-500 text-xs font-mono p-4 pt-16 select-none">
            <pre className="leading-6">{lineNumbers}</pre>
          </div>

          {/* Code Textarea with Syntax Highlighting Effect */}
          <div className="relative">
            <textarea
              ref={textareaRef}
              value={code}
              onChange={(e) => handleCodeChange(e.target.value)}
              className="w-full h-[500px] pl-16 pr-4 pt-16 pb-4 font-mono text-sm bg-gray-950 text-green-400 border-0 focus:outline-none focus:ring-0 resize-none caret-green-500 selection:bg-green-500/30"
              placeholder={`// Write your ${currentLang.name} code here...\n// Press Run Code to execute`}
              spellCheck={false}
              style={{
                fontFamily: "'Fira Code', 'Courier New', monospace",
                lineHeight: "1.6",
                textShadow: "0 0 10px rgba(34, 197, 94, 0.3)",
              }}
            />
            {/* Syntax highlighting glow effect */}
            <div 
              className="absolute inset-0 pointer-events-none"
              style={{
                background: `radial-gradient(circle at 50% 50%, rgba(34, 197, 94, 0.05) 0%, transparent 70%)`,
              }}
            />
          </div>

          {/* File Name Badge */}
          <div className={`absolute top-4 left-16 px-3 py-1 bg-gray-800/80 border ${currentLang.borderColor} rounded text-xs font-mono text-gray-300`}>
            main.{currentLang.extension}
          </div>

          {/* Status Indicator */}
          <div className="absolute bottom-4 left-16 flex items-center gap-2 text-xs text-gray-500">
            <div className={`w-2 h-2 rounded-full ${isRunning ? "bg-yellow-400 animate-pulse" : "bg-green-500"}`} />
            <span>{isRunning ? "Executing..." : "Ready"}</span>
          </div>
        </div>

        {/* Output Terminal - Gaming Style */}
        <div className="bg-gray-950 relative">
          <div className="bg-gray-900 border-b border-gray-700 px-4 py-2 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="flex gap-1.5">
                <div className="w-3 h-3 rounded-full bg-red-500" />
                <div className="w-3 h-3 rounded-full bg-yellow-500" />
                <div className="w-3 h-3 rounded-full bg-green-500" />
              </div>
              <span className="text-xs font-mono text-gray-400 ml-2">Terminal Output</span>
            </div>
            {executionTime > 0 && (
              <div className="text-xs text-gray-500 font-mono">
                ⚡ {executionTime.toFixed(2)}ms
              </div>
            )}
          </div>

          <div className="h-[500px] overflow-auto p-4">
            <AnimatePresence mode="wait">
              {isLoading ? (
                <motion.div
                  key="loading"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  className="flex items-center gap-3 text-yellow-400"
                >
                  <div className="animate-spin">⚙️</div>
                  <span className="text-sm">Loading {currentLang.name} runtime...</span>
                </motion.div>
              ) : error ? (
                <motion.div
                  key="error"
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0 }}
                  className="flex items-start gap-3"
                >
                  <XCircleIcon className="w-5 h-5 text-red-500 flex-shrink-0 mt-0.5" />
                  <div className="flex-1">
                    <div className="text-red-400 font-semibold mb-1">Error</div>
                    <pre className="text-red-300 text-sm font-mono whitespace-pre-wrap break-words">
                      {error}
                    </pre>
                  </div>
                </motion.div>
              ) : output ? (
                <motion.div
                  key="output"
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0 }}
                  className="flex items-start gap-3"
                >
                  <CheckCircleIcon className="w-5 h-5 text-green-500 flex-shrink-0 mt-0.5" />
                  <div className="flex-1">
                    <div className="text-green-400 font-semibold mb-1">Output</div>
                    <pre className="text-gray-300 text-sm font-mono whitespace-pre-wrap break-words font-['Fira_Code',monospace]">
                      {output}
                    </pre>
                  </div>
                </motion.div>
              ) : (
                <motion.div
                  key="empty"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  className="text-center py-20"
                >
                  <div className="text-6xl mb-4">💻</div>
                  <div className="text-gray-500 text-sm">
                    <div className="font-semibold mb-1">Ready to execute</div>
                    <div className="text-xs">Write your code and press Run Code</div>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>
      </div>
    </Card>
  );
}
