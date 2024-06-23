import { fetchAccessToken } from '@humeai/voice';

async function getToken(setToken: React.Dispatch<React.SetStateAction<string | null>>) {
    const apiKey = import.meta.env.VITE_HUME_API_KEY || '';
    const secretKey = import.meta.env.VITE_HUME_API_SECRET || '';

    const token = (await fetchAccessToken({ apiKey, secretKey })) || '';
    setToken(token)
}

export { getToken }