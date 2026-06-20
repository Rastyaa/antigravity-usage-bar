import { exec } from 'child_process';
import * as path from 'path';

const cliScriptPath = path.resolve(__dirname, '../../antigravity-usage/dist/index.js');
console.log("Path:", cliScriptPath);
exec(`node "${cliScriptPath}" quota --json`, (error, stdout, stderr) => {
    console.log("Done");
    console.log("Error:", error);
    console.log("Stdout:", stdout);
});
