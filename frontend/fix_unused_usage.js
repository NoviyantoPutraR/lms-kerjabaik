
import fs from 'fs';
import path from 'path';

const buildErrorsFile = 'd:/kerjabaik.ai/ACADEMY/frontend/build_errors.txt';
const content = fs.readFileSync(buildErrorsFile, 'utf8');

const errors = content.split('\n');
const fileChanges = new Map();

errors.forEach(line => {
    // TS2304: Cannot find name 'variables' -> replace _variables with variables
    const match2304 = line.match(/(src\/.*?)\((\d+),(\d+)\): error TS2304: Cannot find name '(.*?)'/);
    if (match2304) {
        const [_, filePath, lineNum, colNum, name] = match2304;
        const fullPath = path.join('d:/kerjabaik.ai/ACADEMY/frontend', filePath).replace(/\\/g, '/');
        if (!fileChanges.has(fullPath)) fileChanges.set(fullPath, []);
        fileChanges.get(fullPath).push({ line: parseInt(lineNum), name, type: '2304' });
    }

    // TS2339: Property '_data' does not exist -> replace _data with data in destructuring
    const match2339 = line.match(/(src\/.*?)\((\d+),(\d+)\): error TS2339: Property '(_data|_variables)' does not exist on type/);
    if (match2339) {
        const [_, filePath, lineNum, colNum, name] = match2339;
        const fullPath = path.join('d:/kerjabaik.ai/ACADEMY/frontend', filePath).replace(/\\/g, '/');
        if (!fileChanges.has(fullPath)) fileChanges.set(fullPath, []);
        fileChanges.get(fullPath).push({ line: parseInt(lineNum), name: name.substring(1), type: '2339_prefix' });
    }

    // TS2552: Cannot find name 'index'. Did you mean '_index'? -> replace _index with index
    const match2552 = line.match(/(src\/.*?)\((\d+),(\d+)\): error TS2552: Cannot find name '(.*?)'\. Did you mean '(_.*?)'\?/);
    if (match2552) {
        const [_, filePath, lineNum, colNum, name, suggestion] = match2552;
        const fullPath = path.join('d:/kerjabaik.ai/ACADEMY/frontend', filePath).replace(/\\/g, '/');
        if (!fileChanges.has(fullPath)) fileChanges.set(fullPath, []);
        fileChanges.get(fullPath).push({ line: parseInt(lineNum), name, type: '2552' });
    }
});

fileChanges.forEach((changes, filePath) => {
    if (!fs.existsSync(filePath)) return;
    console.log(`Processing ${filePath}...`);
    let fileContent = fs.readFileSync(filePath, 'utf8');
    let lines = fileContent.split('\n');

    // De-duplicate changes per line
    const lineMap = new Map();
    changes.forEach(c => {
        if (!lineMap.has(c.line)) lineMap.set(c.line, new Set());
        lineMap.get(c.line).add(c.name);
    });

    lineMap.forEach((names, lineNum) => {
        const lineIdx = lineNum - 1;
        names.forEach(name => {
            const pattern = new RegExp(`\\b_${name}\\b`, 'g');
            // Check line and neighbours
            for (let i = Math.max(0, lineIdx - 2); i <= Math.min(lines.length - 1, lineIdx + 2); i++) {
                if (pattern.test(lines[i])) {
                    lines[i] = lines[i].replace(pattern, name);
                    console.log(`  Fixed ${name} on line ${i + 1}`);
                }
            }
        });
    });

    fs.writeFileSync(filePath, lines.join('\n'), 'utf8');
});

console.log('Done!');
