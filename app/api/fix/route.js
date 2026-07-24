import { exec } from 'child_process';
import util from 'util';
import path from 'path';
import fs from 'fs';

const execPromise = util.promisify(exec);
export const dynamic = 'force-dynamic';

export async function GET(req) {
  try {
    const cwd = process.cwd();
    // 1. Install web-push
    const { stdout: iOut, stderr: iErr } = await execPromise('npm install web-push', { cwd });
    
    // 2. Generate VAPID keys via code (since it's now installed)
    const webPush = require('web-push');
    const vapidKeys = webPush.generateVAPIDKeys();
    
    // 3. Append to .env.local
    const envPath = path.join(cwd, '.env.local');
    const envString = `\n# Web Push VAPID Keys\nNEXT_PUBLIC_VAPID_PUBLIC_KEY="${vapidKeys.publicKey}"\nVAPID_PRIVATE_KEY="${vapidKeys.privateKey}"\n`;
    
    fs.appendFileSync(envPath, envString);
    
    return new Response(`SUCCESS!\nPublic Key: ${vapidKeys.publicKey}\nPrivate Key: ${vapidKeys.privateKey}\n\nInstall logs:\n${iOut}`);
  } catch (err) {
    return new Response(`ERROR: ${err.message}`);
  }
}
