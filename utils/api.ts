import axios, { AxiosInstance } from 'axios';

const api: AxiosInstance = axios.create({
    baseURL: 'https://aog-wistia-archived-videos.vercel.app/api',
    headers: {
        'Content-Type': 'application/json',
    },
});

export const GetVideos = async (): Promise<WistiaVideo[] | undefined> => {
    try {
        const response = await api.get('/wistia/all');
        return response.data
    } catch (error) {
        console.error("Error fetching videos:", error);
        throw error;
    }
}

export const GetPaginatedVideos = async (page: number, limit: number): Promise<WistiaVideo[] | undefined> => {
    try {
        const response = await api.get('/wistia', {
            params: {
                page,
                limit,
            },
        });
        return response.data;
    } catch (error) {
        console.error("Error fetching videos:", error);
        throw error;
    }
};