import * as fs from 'fs';
import * as path from 'path';
import * as os from 'os';

const INJECTION_TOKEN_START = '/* TITLEBAR_GLOW_EXTENSION_START */';
const INJECTION_TOKEN_END = '/* TITLEBAR_GLOW_EXTENSION_END */';
const BACKUP_SUFFIX = '.titlebar-glow.backup';

/**
 * Locates the VS Code CSS file across different platforms
 */
export function locateCSSFile(): string | null {
    const execPath = process.execPath;
    const platform = os.platform();
    
    let cssPath: string;
    
    if (platform === 'win32') {
        // Windows: C:\Users\...\AppData\Local\Programs\Microsoft VS Code\resources\app\out\vs\workbench\workbench.desktop.main.css
        const resourcesPath = path.join(path.dirname(execPath), 'resources');
        cssPath = path.join(resourcesPath, 'app', 'out', 'vs', 'workbench', 'workbench.desktop.main.css');
    } else if (platform === 'darwin') {
        // macOS: /Applications/Visual Studio Code.app/Contents/Resources/app/out/vs/workbench/workbench.desktop.main.css
        const resourcesPath = path.join(path.dirname(execPath), '..', 'Resources');
        cssPath = path.join(resourcesPath, 'app', 'out', 'vs', 'workbench', 'workbench.desktop.main.css');
    } else {
        // Linux: /usr/share/code/resources/app/out/vs/workbench/workbench.desktop.main.css
        const resourcesPath = path.join(path.dirname(execPath), 'resources');
        cssPath = path.join(resourcesPath, 'app', 'out', 'vs', 'workbench', 'workbench.desktop.main.css');
    }
    
    // Check if file exists
    if (fs.existsSync(cssPath)) {
        return cssPath;
    }
    
    return null;
}

/**
 * Creates a backup of the CSS file if it doesn't exist
 */
function createBackup(cssPath: string): void {
    const backupPath = cssPath + BACKUP_SUFFIX;
    
    // Only create backup if it doesn't exist
    if (!fs.existsSync(backupPath)) {
        fs.copyFileSync(cssPath, backupPath);
    }
}

/**
 * Generates the CSS injection code
 */
function generateGlowCSS(color: string, intensity: number, offsetX: number, diameter: number): string {
    return `
${INJECTION_TOKEN_START}
.titlebar-container::before {
    content: '';
    position: absolute;
    left: ${offsetX}px;
    top: 50%;
    transform: translateY(-50%);
    width: ${diameter}px;
    height: ${diameter}px;
    border-radius: 50%;
    background: radial-gradient(circle, ${color} 0%, transparent 70%);
    opacity: ${intensity};
    pointer-events: none;
    z-index: 0;
}

.titlebar-container > * {
    position: relative;
    z-index: 1;
}
${INJECTION_TOKEN_END}
`;
}

/**
 * Removes any existing injection from the CSS content
 */
function removeExistingInjection(cssContent: string): string {
    const startIndex = cssContent.indexOf(INJECTION_TOKEN_START);
    if (startIndex === -1) {
        return cssContent;
    }
    
    const endIndex = cssContent.indexOf(INJECTION_TOKEN_END, startIndex);
    if (endIndex === -1) {
        return cssContent;
    }
    
    // Remove from start token to end token (including end token and its newline)
    return cssContent.substring(0, startIndex) + cssContent.substring(endIndex + INJECTION_TOKEN_END.length).replace(/^\n/, '');
}

/**
 * Checks if the glow effect is currently injected
 */
export function isInjected(cssPath: string): boolean {
    try {
        const cssContent = fs.readFileSync(cssPath, 'utf8');
        return cssContent.includes(INJECTION_TOKEN_START);
    } catch (error) {
        return false;
    }
}

/**
 * Injects the glow effect CSS into the VS Code CSS file
 */
export function injectCSS(cssPath: string, color: string, intensity: number, offsetX: number, diameter: number): void {
    // Create backup first
    createBackup(cssPath);
    
    // Read current CSS
    let cssContent = fs.readFileSync(cssPath, 'utf8');
    
    // Remove any existing injection
    cssContent = removeExistingInjection(cssContent);
    
    // Generate and append new CSS
    const glowCSS = generateGlowCSS(color, intensity, offsetX, diameter);
    cssContent += glowCSS;
    
    // Write to temp file first (atomic write)
    const tempPath = cssPath + '.tmp';
    fs.writeFileSync(tempPath, cssContent, 'utf8');
    
    // Rename temp file to actual file
    fs.renameSync(tempPath, cssPath);
}

/**
 * Removes the glow effect CSS from the VS Code CSS file
 */
export function removeCSS(cssPath: string): void {
    try {
        // Read current CSS
        let cssContent = fs.readFileSync(cssPath, 'utf8');
        
        // Remove injection
        cssContent = removeExistingInjection(cssContent);
        
        // Write to temp file first (atomic write)
        const tempPath = cssPath + '.tmp';
        fs.writeFileSync(tempPath, cssContent, 'utf8');
        
        // Rename temp file to actual file
        fs.renameSync(tempPath, cssPath);
    } catch (error) {
        throw new Error(`Failed to remove CSS injection: ${error}`);
    }
}

/**
 * Restores the CSS file from backup
 */
export function restoreFromBackup(cssPath: string): boolean {
    const backupPath = cssPath + BACKUP_SUFFIX;
    
    if (fs.existsSync(backupPath)) {
        fs.copyFileSync(backupPath, cssPath);
        return true;
    }
    
    return false;
}

