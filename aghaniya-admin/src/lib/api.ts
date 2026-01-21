const API_URL = 'http://localhost:8000/api/v1';

export async function loginWithGoogle(tokenId: string) {
    const response = await fetch(`${API_URL}/auth/google`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({ token_id: tokenId }),
    });

    if (!response.ok) {
        const error = await response.json();
        throw new Error(error.detail || 'Failed to login');
    }

    return response.json();
}

export async function getMe(token: string) {
    // This endpoint needs to be created in the backend
    const response = await fetch(`${API_URL}/users/me`, {
        headers: {
            'Authorization': `Bearer ${token}`,
        },
    });

    if (!response.ok) {
        throw new Error('Failed to fetch user');
    }

    return response.json();
}
