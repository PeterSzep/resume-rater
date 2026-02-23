import type { User } from "../context/UserContext";
import type { Resume } from "../types/resumeTypes";
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

export async function uploadResume(user: User, file: File): Promise<Resume> {
    const formData = new FormData();
    formData.append("file", file);

    const response = await fetch(`${BASE_URL}/accounts/${user.user_id}/resumes/`, {
        method: 'POST',
        body: formData,
    });

    if (response.ok) {
        return await response.json();
    } else {
        const errorData = await response.json();
        throw new Error(errorData.detail || 'Failed to upload resume');
    }
}

export async function deleteResume(accountId: number, resumeId: number): Promise<void> {
    const response = await fetch(`${BASE_URL}/accounts/${accountId}/resumes/${resumeId}`, {
        method: 'DELETE',
        headers: {
            'Content-Type': 'application/json',
        },
    });

    if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.detail || 'Failed to delete resume');
    }
}