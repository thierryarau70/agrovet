const fs = require('fs');
const text = fs.readFileSync('pages/iatf/[id].vue', 'utf8');
const lines = text.split('\n');

let open = 0;
for (let i = 0; i < lines.length; i++) {
    const line = lines[i];
    const o = (line.match(/<div\b[^>]*>/g) || []).length;
    const c = (line.match(/<\/div>/g) || []).length;
    open += (o - c);
    if (o > 0 || c > 0) {
        console.log(`Line ${i + 1}: +${o} -${c} | Total Open: ${open} | ${line.trim().substring(0, 50)}`);
    }
}
