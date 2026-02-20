export type ResumeStats = {
    id: number;
    name: string;
    date: string;
    status: "Optimized" | "Needs Improvement";
    score: number;
};