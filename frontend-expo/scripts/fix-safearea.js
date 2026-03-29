const fs = require('fs');
const path = require('path');

const ROOT_DIR = 'd:\\FOR RENDO (ONLY)\\ProgrammingYearIII\\Service_Finder\\frontend-expo\\app';

function walkDir(dir, callback) {
    fs.readdirSync(dir).forEach(f => {
        let dirPath = path.join(dir, f);
        let isDirectory = fs.statSync(dirPath).isDirectory();
        isDirectory ? walkDir(dirPath, callback) : callback(path.join(dir, f));
    });
}

let count = 0;
walkDir(ROOT_DIR, function(filePath) {
    if (filePath.endsWith('.tsx') || filePath.endsWith('.ts')) {
        let content = fs.readFileSync(filePath, 'utf8');
        
        // Match import { ..., SafeAreaView, ... } from 'react-native';
        const rnImportMatch = content.match(/import\s+{([^}]*?)}\s+from\s+['"]react-native['"];?/);
        
        if (rnImportMatch && rnImportMatch[1].includes('SafeAreaView')) {
            // Remove SafeAreaView safely
            let newImports = rnImportMatch[1]
                .replace(/,\s*SafeAreaView\s*,/g, ', ')
                .replace(/(^|\s)SafeAreaView\s*,/g, '')
                .replace(/,\s*SafeAreaView(\s|$)/g, '')
                .replace(/(^|\s)SafeAreaView(\s|$)/g, '')
                .trim();
            
            if (newImports.length > 0) {
                // If it ends with trailing comma, trim it
                if (newImports.endsWith(',')) newImports = newImports.slice(0, -1);
                content = content.replace(rnImportMatch[0], `import { ${newImports} } from 'react-native';`);
            } else {
                content = content.replace(rnImportMatch[0], '');
            }
            
            if (!content.includes("'react-native-safe-area-context'")) {
               content = `import { SafeAreaView } from 'react-native-safe-area-context';\n` + content;
            }
            
            fs.writeFileSync(filePath, content);
            count++;
        }
    }
});

console.log(`Updated ${count} files with SafeAreaView migration.`);
