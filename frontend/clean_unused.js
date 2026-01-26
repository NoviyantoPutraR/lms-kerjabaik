import fs from 'fs';
import path from 'path';

function walk(dir) {
    let results = [];
    const list = fs.readdirSync(dir);
    list.forEach(file => {
        const fullPath = path.join(dir, file);
        const stat = fs.statSync(fullPath);
        if (stat && stat.isDirectory()) {
            results = results.concat(walk(fullPath));
        } else {
            if (fullPath.endsWith('.ts') || fullPath.endsWith('.tsx')) {
                results.push(fullPath);
            }
        }
    });
    return results;
}

const files = walk('src');

files.forEach(file => {
    let content = fs.readFileSync(file, 'utf8');
    let changed = false;

    // Pattern 1: Unused parameters in function (e.g. (data, variables) => )
    // We replace them with _ prefix: (_data, _variables)
    // This is a simple heuristic, but it often matches common TS6133 cases in callbacks
    const callbackRegex = /\(([^)]+)\)\s*=>/g;
    content = content.replace(callbackRegex, (match, p1) => {
        const params = p1.split(',').map(p => p.trim());
        const newParams = params.map(p => {
            if (p && !p.startsWith('_') && !p.includes(':') && !p.includes('{')) {
                // If it looks like a simple name, we prefix it (assuming it might be unused)
                // This is aggressive, but we can verify with build
                // Actually, let's only do it for common callback param names that often trigger this
                if (['data', 'variables', 'index', 'user', 'error', 'item', 'e', 'event'].includes(p)) {
                    return '_' + p;
                }
            }
            return p;
        });
        if (params.join(',') !== newParams.join(',')) {
            changed = true;
            return `(${newParams.join(', ')}) =>`;
        }
        return match;
    });

    if (changed) {
        fs.writeFileSync(file, content, 'utf8');
    }
});
