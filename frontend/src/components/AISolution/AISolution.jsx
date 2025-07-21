// src/components/AISolution.jsx
import React, { useEffect, useRef, useState } from "react";
import ReactMarkdown from "react-markdown";
import rehypeHighlight from "rehype-highlight";
import remarkGfm from "remark-gfm";
import { X } from "lucide-react";
import "./AISolution.css";

const AISolution = ({ slug, email, lang = "C++", onClose }) => {
  const [markdown, setMarkdown] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const containerRef = useRef();

  // Handle outside click to close modal
  const handleOutsideClick = (e) => {
    if (containerRef.current && !containerRef.current.contains(e.target)) {
      onClose();
    }
  };

  // Setup modal behavior
  useEffect(() => {
    document.body.style.overflow = "hidden";
    document.addEventListener("mousedown", handleOutsideClick);

    return () => {
      document.body.style.overflow = "unset";
      document.removeEventListener("mousedown", handleOutsideClick);
    };
  }, []);

  // Stream response from backend
  useEffect(() => {
    const controller = new AbortController();
    const signal = controller.signal;

    const fetchStream = async () => {
      try {
        const response = await fetch("http://localhost:8000/questions/stream_output/", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ slug, email, lang }),
          signal,
        });

        if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);

        const reader = response.body.getReader();
        const decoder = new TextDecoder();

        while (true) {
          const { done, value } = await reader.read();
          if (done) break;

          const chunk = decoder.decode(value, { stream: true });
          const lines = chunk.split("\n");

          for (let line of lines) {
            if (line.startsWith("data: ")) {
              const jsonText = line.replace("data: ", "").trim();
              if (!jsonText) continue;
              try {
                const data = JSON.parse(jsonText);
                if (data.type === "content") {
                  setMarkdown((prev) => prev + data.content);
                } else if (data.type === "complete") {
                  setIsLoading(false);
                } else if (data.type === "error") {
                  setMarkdown("❌ Error: " + data.content);
                  setIsLoading(false);
                }
              } catch (err) {
                console.warn("Failed to parse streaming chunk:", err.message);
              }
            }
          }
        }
      } catch (err) {
        // Only show error if it's not an abort signal
        if (err.name !== 'AbortError') {
          console.error("Streaming error:", err.message);
          setMarkdown((prev) => `${prev}\n\n❌ Streaming failed: ${err.message}`);
          setIsLoading(false);
        }
      }
    };

    fetchStream();

    return () => {
      controller.abort();
    };
  }, [slug, email, lang]);

  return (
    <div className="ai-solution-overlay">
      <div className="ai-solution-container" ref={containerRef}>
        <button className="ai-close-button" onClick={onClose}>
          <X size={20} color="#ccc" />
        </button>

        {isLoading && (
          <div className="ai-loading">
            <span className="spinner" />
            <span>Generating Solution...</span>
          </div>
        )}

        <div className="ai-markdown">
          <ReactMarkdown
            children={markdown}
            remarkPlugins={[remarkGfm]}
            rehypePlugins={[rehypeHighlight]}
          />
        </div>
      </div>
    </div>
  );
};

export default AISolution;