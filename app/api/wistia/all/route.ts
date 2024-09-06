import { NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';

export async function GET() {
    try {
        const filePath = path.join(process.cwd(), 'app/api/data/wistiavideos.json');
        const fileContents = fs.readFileSync(filePath, 'utf8');
        const videos = JSON.parse(fileContents);
        console.log(videos['videos'])
        return NextResponse.json(videos['videos']);
    } catch (error) {
        console.error(error)
    }
    
}