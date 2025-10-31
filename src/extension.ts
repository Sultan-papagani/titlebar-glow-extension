import * as vscode from 'vscode';
import { generateColor, rgbToHex } from './colorGenerator';
import { getConfig, getWorkspaceName } from './config';
import { locateCSSFile, injectCSS, removeCSS, isInjected } from './cssInjector';

let statusBarItem: vscode.StatusBarItem;

/**
 * Forces an immediate color update based on current workspace and settings
 */
async function forceUpdateColor() {
    try {
        const cssPath = locateCSSFile();
        
        if (!cssPath) {
            vscode.window.showErrorMessage(
                'Titlebar Glow: Could not locate CSS file.'
            );
            return;
        }
        
        if (!isInjected(cssPath)) {
            vscode.window.showInformationMessage('Titlebar Glow is not currently active. Use "Apply Glow Effect" first.');
            return;
        }
        
        const config = getConfig();
        const workspaceName = getWorkspaceName();
        const color = generateColor(workspaceName, config.colorSeed);
        const colorHex = rgbToHex(color.r, color.g, color.b);
        
        injectCSS(cssPath, colorHex, config.glowIntensity, config.glowOffsetX, config.glowDiameter);
        
        vscode.window.showWarningMessage(
            `Color updated to ${colorHex}! CLOSE and REOPEN Cursor to see changes.`,
            'OK'
        );
        
        updateStatusBar();
    } catch (error) {
        vscode.window.showErrorMessage(
            `Titlebar Glow: Failed to update color. ${error}`
        );
    }
}

/**
 * Applies the glow effect
 */
async function applyGlowEffect() {
    try {
        const cssPath = locateCSSFile();
        
        if (!cssPath) {
            vscode.window.showErrorMessage(
                'Titlebar Glow: Could not locate VS Code CSS file. Please ensure VS Code is installed correctly.'
            );
            return;
        }
        
        const config = getConfig();
        if (!config.enabled) {
            vscode.window.showInformationMessage('Titlebar Glow is disabled in settings.');
            return;
        }
        
        const workspaceName = getWorkspaceName();
        const color = generateColor(workspaceName, config.colorSeed);
        const colorHex = rgbToHex(color.r, color.g, color.b);
        
        injectCSS(cssPath, colorHex, config.glowIntensity, config.glowOffsetX, config.glowDiameter);
        
        vscode.window.showWarningMessage(
            `Titlebar Glow applied! Color: ${colorHex}. Please CLOSE and REOPEN Cursor completely for changes to take effect.`,
            'OK'
        );
        
        updateStatusBar();
    } catch (error) {
        vscode.window.showErrorMessage(
            `Titlebar Glow: Failed to apply effect. ${error}`
        );
    }
}

/**
 * Removes the glow effect
 */
async function removeGlowEffect() {
    try {
        const cssPath = locateCSSFile();
        
        if (!cssPath) {
            vscode.window.showErrorMessage(
                'Titlebar Glow: Could not locate VS Code CSS file.'
            );
            return;
        }
        
        if (!isInjected(cssPath)) {
            vscode.window.showInformationMessage('Titlebar Glow is not currently applied.');
            return;
        }
        
        removeCSS(cssPath);
        
        vscode.window.showWarningMessage(
            'Titlebar Glow removed! Please CLOSE and REOPEN Cursor completely for changes to take effect.',
            'OK'
        );
        
        updateStatusBar();
    } catch (error) {
        vscode.window.showErrorMessage(
            `Titlebar Glow: Failed to remove effect. ${error}`
        );
    }
}

/**
 * Toggles the glow effect
 */
async function toggleGlowEffect() {
    try {
        const cssPath = locateCSSFile();
        
        if (!cssPath) {
            vscode.window.showErrorMessage(
                'Titlebar Glow: Could not locate CSS file.'
            );
            return;
        }
        
        const currentlyInjected = isInjected(cssPath);
        
        if (currentlyInjected) {
            // Remove the glow
            removeCSS(cssPath);
            
            vscode.window.showWarningMessage(
                'Titlebar Glow removed! Please CLOSE and REOPEN Cursor completely for changes to take effect.',
                'OK'
            );
        } else {
            // Apply the glow
            const config = getConfig();
            const workspaceName = getWorkspaceName();
            const color = generateColor(workspaceName, config.colorSeed);
            const colorHex = rgbToHex(color.r, color.g, color.b);
            
            injectCSS(cssPath, colorHex, config.glowIntensity, config.glowOffsetX, config.glowDiameter);
            
            vscode.window.showWarningMessage(
                `Titlebar Glow applied! Color: ${colorHex}. Please CLOSE and REOPEN Cursor completely for changes to take effect.`,
                'OK'
            );
        }
        
        updateStatusBar();
    } catch (error) {
        vscode.window.showErrorMessage(
            `Titlebar Glow: Failed to toggle effect. ${error}`
        );
    }
}

/**
 * Gets the currently injected color from the CSS file
 */
function getInjectedColor(cssPath: string): string | null {
    try {
        const fs = require('fs');
        const cssContent = fs.readFileSync(cssPath, 'utf8');
        
        // Look for the color in the injected CSS (format: background: radial-gradient(circle, #RRGGBB 0%, ...)
        const colorMatch = cssContent.match(/background:\s*radial-gradient\(circle,\s*(#[0-9a-fA-F]{6})/i);
        if (colorMatch) {
            // Always return uppercase for consistent comparison
            return colorMatch[1].toUpperCase();
        }
    } catch (error) {
        // Ignore errors
    }
    return null;
}

/**
 * Smart status bar click handler - updates color if out of sync, otherwise toggles
 */
async function handleStatusBarClick() {
    const cssPath = locateCSSFile();
    if (!cssPath) {
        return;
    }
    
    const config = getConfig();
    const workspaceName = getWorkspaceName();
    const expectedColor = generateColor(workspaceName, config.colorSeed);
    const expectedColorHex = rgbToHex(expectedColor.r, expectedColor.g, expectedColor.b);
    
    // Check if colors are out of sync
    if (isInjected(cssPath) && config.enabled) {
        const injectedColor = getInjectedColor(cssPath);
        
        // Compare colors (case-insensitive)
        if (injectedColor && injectedColor.toUpperCase() !== expectedColorHex.toUpperCase()) {
            // Colors don't match - force update instead of toggle
            await forceUpdateColor();
            return;
        }
    }
    
    // Otherwise, do normal toggle
    await toggleGlowEffect();
}

/**
 * Updates the status bar item
 */
function updateStatusBar() {
    const cssPath = locateCSSFile();
    if (!cssPath) {
        return;
    }
    
    const config = getConfig();
    const workspaceName = getWorkspaceName();
    const expectedColor = generateColor(workspaceName, config.colorSeed);
    const expectedColorHex = rgbToHex(expectedColor.r, expectedColor.g, expectedColor.b);
    
    if (isInjected(cssPath) && config.enabled) {
        const injectedColor = getInjectedColor(cssPath);
        
        // Compare colors (case-insensitive)
        if (injectedColor && injectedColor.toUpperCase() !== expectedColorHex.toUpperCase()) {
            // Color mismatch - needs update
            statusBarItem.text = `$(warning) ${injectedColor} → ${expectedColorHex}`;
            statusBarItem.tooltip = `Titlebar Glow OUT OF SYNC!\nWorkspace: ${workspaceName}\nCurrent: ${injectedColor}\nExpected: ${expectedColorHex}\n\nClick to update!`;
            statusBarItem.backgroundColor = new vscode.ThemeColor('statusBarItem.warningBackground');
        } else {
            // Color matches
            statusBarItem.text = `$(star-full) ${expectedColorHex}`;
            statusBarItem.tooltip = `Titlebar Glow Active\nWorkspace: ${workspaceName}\nColor: ${expectedColorHex}\nClick to toggle off`;
            statusBarItem.backgroundColor = undefined;
        }
    } else {
        statusBarItem.text = `$(star-empty) Glow Off`;
        statusBarItem.tooltip = 'Titlebar Glow Inactive - Click to enable';
        statusBarItem.backgroundColor = undefined;
    }
    
    statusBarItem.show();
}

/**
 * Extension activation
 */
export function activate(context: vscode.ExtensionContext) {
    console.log('Titlebar Glow extension is now active!');
    
    // Create status bar item with smart click handler
    statusBarItem = vscode.window.createStatusBarItem(vscode.StatusBarAlignment.Right, 100);
    statusBarItem.command = 'titlebarGlow.statusBarClick';
    context.subscriptions.push(statusBarItem);
    
    // Register status bar click handler
    context.subscriptions.push(
        vscode.commands.registerCommand('titlebarGlow.statusBarClick', handleStatusBarClick)
    );
    
    // Register commands
    context.subscriptions.push(
        vscode.commands.registerCommand('titlebarGlow.apply', applyGlowEffect)
    );
    
    context.subscriptions.push(
        vscode.commands.registerCommand('titlebarGlow.remove', removeGlowEffect)
    );
    
    context.subscriptions.push(
        vscode.commands.registerCommand('titlebarGlow.toggle', toggleGlowEffect)
    );
    
    context.subscriptions.push(
        vscode.commands.registerCommand('titlebarGlow.forceUpdate', forceUpdateColor)
    );
    
    // Listen for workspace folder changes
    context.subscriptions.push(
        vscode.workspace.onDidChangeWorkspaceFolders(async () => {
            const config = getConfig();
            const cssPath = locateCSSFile();
            
            if (config.enabled && cssPath && isInjected(cssPath)) {
                // Auto-apply new color for new workspace
                const workspaceName = getWorkspaceName();
                const color = generateColor(workspaceName, config.colorSeed);
                const colorHex = rgbToHex(color.r, color.g, color.b);
                
                injectCSS(cssPath, colorHex, config.glowIntensity, config.glowOffsetX, config.glowDiameter);
                
                vscode.window.showWarningMessage(
                    `Titlebar Glow updated for new workspace! New color: ${colorHex}. CLOSE and REOPEN Cursor to see changes.`,
                    'OK'
                );
                
                updateStatusBar();
            }
        })
    );
    
    // Listen for configuration changes
    context.subscriptions.push(
        vscode.workspace.onDidChangeConfiguration(async e => {
            if (e.affectsConfiguration('titlebarGlow')) {
                const config = getConfig();
                const cssPath = locateCSSFile();
                
                // Auto-reapply if already injected and still enabled
                if (cssPath && isInjected(cssPath) && config.enabled) {
                    const workspaceName = getWorkspaceName();
                    const color = generateColor(workspaceName, config.colorSeed);
                    const colorHex = rgbToHex(color.r, color.g, color.b);
                    
                    injectCSS(cssPath, colorHex, config.glowIntensity, config.glowOffsetX, config.glowDiameter);
                    
                    vscode.window.showWarningMessage(
                        `Titlebar Glow updated! New color: ${colorHex}. CLOSE and REOPEN Cursor to see changes.`,
                        'OK'
                    );
                }
                
                updateStatusBar();
            }
        })
    );
    
    // Initialize status bar
    updateStatusBar();
    
    // Auto-apply on startup if enabled and not yet injected
    const config = getConfig();
    const cssPath = locateCSSFile();
    if (config.enabled && cssPath && !isInjected(cssPath)) {
        // Don't auto-apply on first activation, let user trigger it manually
        vscode.window.showInformationMessage(
            'Titlebar Glow is enabled. Would you like to apply it now?',
            'Apply',
            'Not Now'
        ).then(result => {
            if (result === 'Apply') {
                applyGlowEffect();
            }
        });
    }
}

/**
 * Extension deactivation
 */
export function deactivate() {
    if (statusBarItem) {
        statusBarItem.dispose();
    }
}

