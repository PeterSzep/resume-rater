import type { User } from "../context/UserContext";
import type { Resume, ResumeStats } from "../types/resumeTypes";
import { BASE_URL } from "./index";


export async function getResumesForAccount(user: User): Promise<Resume[]> {
    const response = await fetch(`${BASE_URL}/accounts/${user.user_id}/resumes`, {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json',
        },
    });

    if (response.ok) {
        return await response.json();
    } else {
        const errorData = await response.json();
        throw new Error(errorData.detail || 'Failed to fetch resumes');
    }
}

export async function getLatestResumesForAccount(user: User): Promise<Resume[]> {
    const response = await fetch(`${BASE_URL}/accounts/${user.user_id}/resumes/newest`, {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json',
        },
    });

    if (response.ok) {
        return await response.json();
    }else{
        const errorData = await response.json();
        throw new Error(errorData.detail || 'Failed to fetch latest resume');
    }
}
