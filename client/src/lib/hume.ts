import { fetchAccessToken } from '@humeai/voice';

async function connect() {
    const apiKey = import.meta.env.VITE_HUME_API_KEY || '';
    const secretKey = import.meta.env.VITE_HUME_SECRET_KEY || '';

    const token = (await fetchAccessToken({ apiKey, secretKey })) || '';
    return token
}

export { connect }