import { NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';

export async function GET(request: Request) {
    try {
        const filePath = path.join(process.cwd(), 'app/api/data/wistiavideos.json');
        const fileContents = fs.readFileSync(filePath, 'utf8');

        const parsedData = JSON.parse(fileContents);

        // Assuming the array is nested under a "videos" key
        const videos = parsedData.videos;

        if (!Array.isArray(videos)) {
            throw new Error('The "videos" key does not contain an array');
        }

        // Extract page and limit from query parameters
        const url = new URL(request.url);
        const page = parseInt(url.searchParams.get('page') || '1', 10);
        const limit = parseInt(url.searchParams.get('limit') || '10', 10);

        // Implement pagination
        const startIndex = (page - 1) * limit;
        const endIndex = startIndex + limit;
        const paginatedVideos = videos.slice(startIndex, endIndex);

        return NextResponse.json(paginatedVideos);
    } catch (error: unknown) {
        if (error instanceof Error) {
            console.error('Error reading or parsing file:', error);
            return NextResponse.json({ error: 'Failed to read or parse file', details: error.message }, { status: 500 });
        } else {
            // Handle unexpected types of errors
            console.error('Unexpected error:', error);
            return NextResponse.json({ error: 'An unexpected error occurred' }, { status: 500 });
        }
    }
}
