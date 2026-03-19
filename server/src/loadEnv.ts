import dotenv from 'dotenv';
import fs from 'fs';
import path from 'path';

let envLoaded = false;

export const loadServerEnv = () => {
    if (envLoaded) return;

    const cwd = process.cwd();
    const candidates = [
        path.resolve(cwd, '.env.local'),
        path.resolve(cwd, '.env'),
        path.resolve(cwd, 'server/.env.local'),
        path.resolve(cwd, 'server/.env'),
        path.resolve(cwd, '../.env.local'),
        path.resolve(cwd, '../.env'),
    ];

    const seen = new Set<string>();

    for (const file of candidates) {
        if (seen.has(file) || !fs.existsSync(file)) continue;

        dotenv.config({ path: file, override: false });
        seen.add(file);
    }

    envLoaded = true;
};
