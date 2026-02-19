import { BASE_URL } from './index';

export async function regsiterUser(name : string, email : string, password : string) {
    const response = await fetch(`${BASE_URL}/accounts/`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({
            full_name: name,
            email: email,
            password: password,
        }),
    });

    if(response.ok) {
        return await response.json();
    } else {
        const errorData = await response.json();
        throw new Error(errorData.detail || 'Failed to register user');
    }
}