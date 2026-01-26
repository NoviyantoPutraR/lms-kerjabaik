import fs from 'fs';

// Read the build output to find EXACT lines to fix
const buildOutput = fs.readFileSync('build_output_v13.txt', 'utf8');
const errorLines = buildOutput.split('\n').filter(l => l.includes('error TS6133') || l.includes('error TS2304') || l.includes('error TS2339'));

const errorsByFile = {};
errorLines.forEach(l => {
    const match = l.match(/(src\/.*?)\((\d+),(\d+)\): error TS(6133|2304|2339): (.*)$/);
    if (match) {
        const [_, file, line, col, code, msg] = match;
        if (!errorsByFile[file]) errorsByFile[file] = [];

        let name = '';
        if (code === '6133') {
            const nameMatch = msg.match(/'(.*?)'/);
            if (nameMatch) name = nameMatch[1];
        } else if (code === '2304') {
            const nameMatch = msg.match(/name '(.*?)'/);
            if (nameMatch) name = nameMatch[1];
        } else if (code === '2339') {
            const nameMatch = msg.match(/Property '(.*?)'/);
            if (nameMatch) name = nameMatch[1];
        }

        if (name) {
            errorsByFile[file].push({ line: parseInt(line), col: parseInt(col), name, code });
        }
    }
});

Object.keys(errorsByFile).forEach(file => {
    if (!fs.existsSync(file)) return;
    let content = fs.readFileSync(file, 'utf8');
    const lines = content.split('\n');
    let changed = false;

    // Sort by line descending to avoid index shifts if we and newlines (though we dont here)
    errorsByFile[file].sort((a, b) => b.line - a.line).forEach(err => {
        const lineIdx = err.line - 1;
        if (lines[lineIdx]) {
            let line = lines[lineIdx];

            if (err.code === '6133') {
                // Prefix unused with _
                const regex = new RegExp(`\\b${err.name}\\b`, 'g');
                lines[lineIdx] = line.replace(regex, `_${err.name}`);
                changed = true;
            } else if (err.code === '2304' && err.name === 'data') {
                // Fix the destructured data error: { kursusId, _data } -> { kursusId, data }
                if (line.includes('_data')) {
                    lines[lineIdx] = line.replace('_data', 'data');
                    changed = true;
                }
            } else if (err.code === '2304' && err.name === 'variables') {
                // Success callback often has variables prefix
                if (line.includes('_variables') && !line.includes(' variables.')) {
                    // Check if it's being accessed
                }
                // Let's do a more general fix for the _ prefix mess
                lines[lineIdx] = line.replace(/_data/g, 'data').replace(/_variables/g, 'variables').replace(/_index/g, 'index').replace(/_e\b/g, 'e');
                changed = true;
            }
        }
    });

    if (changed) {
        fs.writeFileSync(file, lines.join('\n'), 'utf8');
        console.log(`Fixed ${file}`);
    }
});
