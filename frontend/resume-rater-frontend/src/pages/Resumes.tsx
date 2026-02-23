import { useUser } from "../context/UserContext";
import Navbar from "../components/Navbar";
import {useEffect, useState } from "react";
import type { ResumeStats } from "../types/resumeTypes";


const Resumes = () => {
    const { user } = useUser();
    const [resumes, setResumes] = useState<ResumeStats[]>([]);

    useEffect(() => {
        
    }, [user]);

    return (
        <div className="relative flex min-h-screen flex-col overflow-x-hidden main-gradient font-display">
            <Navbar user={user} />
        </div>
    );

}

export default Resumes;