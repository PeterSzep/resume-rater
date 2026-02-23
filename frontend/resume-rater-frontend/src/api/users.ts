import { BASE_URL } from './index';
import {type User} from '../context/UserContext';

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

export async function loginUser(email : string, password : string, ) {
    const response = await fetch(`${BASE_URL}/accounts/login`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({  
            email: email,
            password: password,
        }),
    });

    if(response.ok) {
        return await response.json();
    } else {
        const errorData = await response.json();
        throw new Error(errorData.detail || 'Failed to login user');
    }
}

export async function deleteUser(user : User) {
    const response = await fetch(`${BASE_URL}/accounts/${user.user_id}/`, {
        method: 'DELETE',
    });

    if(response.ok) {
        return true;
    } else {
        const errorData = await response.json();
        throw new Error(errorData.detail || 'Failed to delete user');
    }
}