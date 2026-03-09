import { BASE_URL } from ".";
import { type User } from "../context/UserContext";
import type { Rating } from "../types/resumeTypes";
import { getResumesForAccount } from "./resumes";


export async function getRatingsForResume(accountId: number, resumeId: number): Promise<Rating[]> {
    const response = await fetch(`${BASE_URL}/accounts/${accountId}/resumes/${resumeId}/ratings`, {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json',
        },
    });

    if (response.ok) {
        return await response.json();
    } else {
        return [];
    }
}

export async function createRating(resumeId: number): Promise<Rating> {
    const response = await fetch(`${BASE_URL}/resumes/${resumeId}/ratings/`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
    });

    if (response.ok) {
        return await response.json();
    } else {
        const errorData = await response.json();
        throw new Error(errorData.detail || 'Failed to create rating');
    }
}

export async function getRatingsForAccount(user: User): Promise<Rating[]> {
    const resumes = await getResumesForAccount(user);
    const ratingArrays = await Promise.all(resumes.map((r) => getRatingsForResume(user.user_id, r.resume_id)));
    return ratingArrays.flat();
}