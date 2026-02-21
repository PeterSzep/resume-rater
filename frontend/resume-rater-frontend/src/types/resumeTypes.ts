export type ResumeStats = {
    resume_id: number;
    name: string;
    date: string;
    status: "Optimized" | "Needs Improvement";
    score: number;
};

export type Resume = {
    resume_id: number;
    account_id: number;
    original_filename: string;
    file_path: string;
    extracted_text: string;
    file_size: number;
    uploaded_at: string;
};

export type Rating = {
    rating_id: number;
    resume_id: number;
    overall_score: number;
    criteria_scores: Record<string, unknown>;
    feedback: string;
    strengths: string[];
    improvements: string[];
    created_at: string;
};