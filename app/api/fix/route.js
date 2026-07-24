import fs from 'fs';
import path from 'path';

export const dynamic = 'force-dynamic';

export async function GET(req) {
  try {
    const filePath = path.join(process.cwd(), 'app', 'dashboard', 'page.js');
    let content = fs.readFileSync(filePath, 'utf8');
    
    const badStart = '{/* EDIT PROFILE TAB */}';
    
    const firstIdx = content.indexOf(badStart);
    const lastIdx = content.lastIndexOf(badStart);
    
    if (firstIdx !== -1 && lastIdx !== -1 && firstIdx !== lastIdx) {
      const newContent = content.substring(0, firstIdx) + content.substring(lastIdx);
      fs.writeFileSync(filePath, newContent);
      return new Response('Deleted duplicate section!');
    }
    
    return new Response(`First: ${firstIdx}, Last: ${lastIdx}`);
  } catch (error) {
    return new Response('Error: ' + error.message);
  }
}
