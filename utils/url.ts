export const getAvatarUrl = (url?: string) => {
    if (!url) return '';
    if (url.startsWith('http') || url.startsWith('data:')) return url;

    // Get base URL from env or default
    const apiUrl = import.meta.env.VITE_API_URL || 'http://localhost:3001/api';

    // Remove /api suffix to get the root origin
    const origin = apiUrl.replace(/\/api\/?$/, '');

    // Ensure url starts with /
    const path = url.startsWith('/') ? url : `/${url}`;

    return `${origin}${path}`;
};
