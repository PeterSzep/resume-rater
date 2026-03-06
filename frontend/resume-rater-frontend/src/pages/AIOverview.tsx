import { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import { Document, Page, pdfjs } from "react-pdf";
import "react-pdf/dist/Page/AnnotationLayer.css";
import "react-pdf/dist/Page/TextLayer.css";
import CollapsibleInsight from "../components/CollapsibleInsight";
import Navbar from "../components/Navbar";
import ScoreCard from "../components/ScoreCard";
import { useUser } from "../context/UserContext";
import { BASE_URL } from "../api/index";
import { getResumeById } from "../api/resumes";
import type { Resume } from "../types/resumeTypes";

pdfjs.GlobalWorkerOptions.workerSrc = new URL(
  "pdfjs-dist/build/pdf.worker.min.mjs",
  import.meta.url
).toString();

const AIOverview = () => {
  const { user } = useUser();

  const [isRating, setIsRating] = useState(true);
  const { resumeId } = useParams<{ resumeId: string }>();
  const [resume, setResume] = useState<Resume | null>(null);
  const [numPages, setNumPages] = useState<number | null>(null);
  const [pageNumber, setPageNumber] = useState(1);
  const [scale, setScale] = useState(1);

  const pdfUrl = `${BASE_URL}/resumes/${resumeId}/file`;

  useEffect(() => {
    if (!resumeId) return;
    getResumeById(Number(resumeId)).then(setResume);

    
  }, [resumeId]);

  if (isRating) {
    return (
      <div className="font-display text-slate-900 antialiased min-h-screen flex flex-col items-center justify-center gap-6">
        <span className="material-symbols-outlined text-6xl text-primary animate-spin">progress_activity</span>
        <div className="text-center">
          <h2 className="text-2xl font-bold text-slate-800">Analyzing your resume...</h2>
          <p className="text-slate-500 mt-1">Claude is reviewing your resume. This may take a moment.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="font-display text-slate-900 antialiased min-h-screen">
      <Navbar user={user} />

      {/* Main */}
      <main className="max-w-[1440px] mx-auto px-4 md:px-10 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* Left: PDF Viewer */}
          <div className="lg:col-span-8 flex flex-col gap-6">
            <div className="flex items-center justify-between">
              <div>
                <h1 className="text-3xl font-extrabold text-slate-900 tracking-tight">Interactive Analysis</h1>
                <p className="text-slate-500 mt-1">
                  Reviewing:
                  <span className="font-medium text-slate-700">
                    {resume?.original_filename ?? "Loading..."}
                  </span>
                </p>
              </div>
              <div className="flex gap-2">
                <button
                  onClick={() => setScale((s) => Math.min(s + 0.2, 2))}
                  className="flex items-center gap-2 px-4 py-2 rounded-lg bg-white border border-slate-200 text-slate-700 font-medium hover:bg-slate-50 transition-all shadow-sm"
                >
                  <span className="material-symbols-outlined text-lg">zoom_in</span>
                </button>
                <button
                  onClick={() => setScale((s) => Math.max(s - 0.2, 0.5))}
                  className="flex items-center gap-2 px-4 py-2 rounded-lg bg-white border border-slate-200 text-slate-700 font-medium hover:bg-slate-50 transition-all shadow-sm"
                >
                  <span className="material-symbols-outlined text-lg">zoom_out</span>
                </button>
              </div>
            </div>

            {/* PDF Canvas */}
            <div
              className="relative bg-slate-100 rounded-xl border border-slate-200 overflow-auto"
              style={{ boxShadow: "0 10px 25px -5px rgba(0,0,0,0.1)", minHeight: "900px" }}
            >
              <div className="flex flex-col items-center py-8 gap-4">
                <Document
                  file={pdfUrl}
                  onLoadSuccess={({ numPages }) => setNumPages(numPages)}
                  loading={
                    <div className="flex items-center justify-center h-96 text-slate-400">
                      <span className="material-symbols-outlined text-4xl animate-spin">progress_activity</span>
                    </div>
                  }
                  error={
                    <div className="flex items-center justify-center h-96 text-slate-400 gap-2">
                      <span className="material-symbols-outlined">error</span>
                      <span>Failed to load PDF</span>
                    </div>
                  }
                >
                  <Page
                    pageNumber={pageNumber}
                    scale={scale}
                    className="shadow-xl"
                    renderTextLayer={true}
                    renderAnnotationLayer={true}
                  />
                </Document>
              </div>

              {/* Page Navigation */}
              {numPages && numPages > 1 && (
                <div className="sticky bottom-0 flex items-center justify-center gap-4 py-3 bg-white/80 backdrop-blur border-t border-slate-200">
                  <button
                    onClick={() => setPageNumber((p) => Math.max(p - 1, 1))}
                    disabled={pageNumber <= 1}
                    className="p-1.5 rounded-lg hover:bg-slate-100 disabled:opacity-30 transition-colors"
                  >
                    <span className="material-symbols-outlined">chevron_left</span>
                  </button>
                  <span className="text-sm font-medium text-slate-600">
                    {pageNumber} / {numPages}
                  </span>
                  <button
                    onClick={() => setPageNumber((p) => Math.min(p + 1, numPages))}
                    disabled={pageNumber >= numPages}
                    className="p-1.5 rounded-lg hover:bg-slate-100 disabled:opacity-30 transition-colors"
                  >
                    <span className="material-symbols-outlined">chevron_right</span>
                  </button>
                </div>
              )}
            </div>
          </div>

          {/* Right: AI Insights Sidebar */}
          <div className="lg:col-span-4 lg:sticky lg:top-24 space-y-6">
            <ScoreCard score={85} resultText="Excellent Potential" />
            <div className="space-y-4">
              <CollapsibleInsight
                title="Strengths"
                icon="check_circle"
                items={[
                  { text: "Clear hierarchical structure makes it easy for recruiters to scan within 6 seconds.", icon: "task_alt" },
                  { text: "Strong tech stack alignment with modern UX/UI requirements.", icon: "task_alt" },
                ]}
              />

              <CollapsibleInsight
                title="Weaknesses"
                icon="warning"
                items={[
                  { text: "Lacks quantifiable achievements that demonstrate impact.", icon: "error_outline" },
                  { text: "Some bullet points are too generic and could be more specific.", icon: "error_outline" },
                ]}
                variant="weakness"
              />

              <details className="group bg-white border border-slate-200 rounded-xl overflow-hidden" open>
                <summary className="flex items-center justify-between p-4 cursor-pointer hover:bg-slate-50 transition-colors list-none">
                  <div className="flex items-center gap-3">
                    <span className="material-symbols-outlined text-primary bg-primary/10 p-1.5 rounded-lg text-xl">lightbulb</span>
                    <span className="font-bold text-slate-800">AI Suggestions</span>
                  </div>
                  <span className="material-symbols-outlined text-slate-400 group-open:rotate-180 transition-transform">expand_more</span>
                </summary>
                <div className="px-4 pb-4 space-y-3">
                  <div className="p-3 bg-alice-blue/50 rounded-lg border border-sky-blue/20">
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-[10px] font-bold text-sky-blue uppercase">Actionable Tip</span>
                      <span className="text-[10px] font-bold text-slate-400">HIGH IMPACT</span>
                    </div>
                    <p className="text-xs text-slate-700 leading-relaxed font-semibold italic">"Quantify the design system impact. Instead of 'reducing time', say 'reduced front-end development cycles by 30% saving ~$120k annually'."</p>
                  </div>
                  <div className="p-3 bg-alice-blue/50 rounded-lg border border-sky-blue/20">
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-[10px] font-bold text-sky-blue uppercase">Actionable Tip</span>
                      <span className="text-[10px] font-bold text-slate-400">QUICK FIX</span>
                    </div>
                    <p className="text-xs text-slate-700 leading-relaxed font-semibold italic">"Swap 'Developed' with more powerful verbs like 'Orchestrated' or 'Engineered' in your second experience role."</p>
                  </div>
                </div>
              </details>
            </div>
          </div>

        </div>
      </main>

      {/* Background blobs */}
      <div className="fixed top-0 left-0 w-full h-full -z-10 pointer-events-none overflow-hidden">
        <div className="absolute top-[-10%] right-[-10%] size-96 bg-sky-blue/10 blur-[120px] rounded-full"></div>
        <div className="absolute bottom-[-5%] left-[-5%] size-80 bg-primary/10 blur-[100px] rounded-full"></div>
      </div>
    </div>
  );
};

export default AIOverview;
