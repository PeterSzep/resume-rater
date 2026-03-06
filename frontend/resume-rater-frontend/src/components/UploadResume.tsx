import { useRef, useState } from "react";
import { useUser } from "../context/UserContext";
import { uploadResume } from "../api/resumes";
import { useNavigate } from "react-router-dom";

const UploadResume = ({ isHomePage }: { isHomePage: boolean }) => {
  const { user } = useUser();
  const navigation = useNavigate();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [uploading, setUploading] = useState(false);

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file || !user) return;

    setUploading(true);
    try {
      const resume = await uploadResume(user, file);
      const resumeId = resume.resume_id;
      if(isHomePage){
        navigation("/ai-overview/" + resumeId);
        // console.log("Navigating to AI Overview page...");
      }
    } catch (error) {
      alert("Failed to upload resume: " + (error as Error).message);
    } finally {
      setUploading(false);
      e.target.value = "";
    }
  };

  return (
    <div className="mt-12 glass-card-light rounded-2xl p-8 border border-primary/20 bg-gradient-to-r from-primary/5 to-transparent flex flex-col md:flex-row items-center justify-between gap-6">
      <div className="flex gap-6 items-center">
        <div className="hidden sm:flex size-16 items-center justify-center rounded-2xl bg-primary text-white shadow-lg shadow-primary/30">
          <span className="material-symbols-outlined text-4xl">upload_file</span>
        </div>
        <div className="text-center md:text-left">
          <h3 className="text-xl font-bold text-slate-900">
            Ready to boost your score?
          </h3>
          <p className="text-slate-600 mt-1">
            Upload a new version of your resume for an instant AI-powered
            optimization report.
          </p>
        </div>
      </div>
      <input
        ref={fileInputRef}
        type="file"
        accept=".pdf"
        className="hidden"
        onChange={handleFileChange}
      />
      <button
        onClick={() => fileInputRef.current?.click()}
        disabled={uploading}
        className="w-full md:w-auto px-8 py-4 bg-primary text-white font-bold rounded-xl hover:bg-primary/90 transition-all shadow-lg shadow-primary/20 flex items-center justify-center gap-2 disabled:opacity-60"
      >
        <span className="material-symbols-outlined">
          {uploading ? "hourglass_empty" : "add"}
        </span>
        {uploading ? "Uploading..." : "Upload New Resume"}
      </button>
    </div>
  );
};

export default UploadResume;
