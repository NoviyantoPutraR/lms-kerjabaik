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

// Read the build output to find EXACT lines to fix
const buildOutput = fs.readFileSync('build_output_final.txt', 'utf8');
const errorLines = buildOutput.split('\n').filter(l => l.includes('error TS6133'));

const errorsByFile = {};
errorLines.forEach(l => {
    const match = l.match(/(src\/.*?)\((\d+),(\d+)\): error TS6133: '(.*?)'/);
    if (match) {
        const [_, file, line, col, name] = match;
        if (!errorsByFile[file]) errorsByFile[file] = [];
        errorsByFile[file].push({ line: parseInt(line), col: parseInt(col), name });
    }
});

Object.keys(errorsByFile).forEach(file => {
    if (!fs.existsSync(file)) return;
    let content = fs.readFileSync(file, 'utf8');
    const lines = content.split('\n');
    let changed = false;

    errorsByFile[file].forEach(err => {
        const lineIdx = err.line - 1;
        if (lines[lineIdx]) {
            // Very targeted replacement on the exact line
            // We prefix with _ if it's not already
            const line = lines[lineIdx];
            const regex = new RegExp(`\\b${err.name}\\b`, 'g');
            lines[lineIdx] = line.replace(regex, `_${err.name}`);
            changed = true;
        }
    });

    if (changed) {
        fs.writeFileSync(file, lines.join('\n'), 'utf8');
        console.log(`Fixed ${file}`);
    }
});
