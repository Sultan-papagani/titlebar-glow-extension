import * as vscode from 'vscode';
import { generateColor, rgbToHex } from './colorGenerator';
import { getConfig, getWorkspaceName } from './config';
import { locateCSSFile, injectCSS, removeCSS, isInjected } from './cssInjector';

let statusBarItem: vscode.StatusBarItem;

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
 * Updates the status bar item
 */
function updateStatusBar() {
    const cssPath = locateCSSFile();
    if (!cssPath) {
        return;
    }
    
    const config = getConfig();
    const workspaceName = getWorkspaceName();
    const color = generateColor(workspaceName, config.colorSeed);
    const colorHex = rgbToHex(color.r, color.g, color.b);
    
    if (isInjected(cssPath) && config.enabled) {
        statusBarItem.text = `$(star-full) ${colorHex}`;
        statusBarItem.tooltip = `Titlebar Glow Active\nWorkspace: ${workspaceName}\nColor: ${colorHex}`;
    } else {
        statusBarItem.text = `$(star-empty) Glow Off`;
        statusBarItem.tooltip = 'Titlebar Glow Inactive';
    }
    
    statusBarItem.show();
}

/**
 * Extension activation
 */
export function activate(context: vscode.ExtensionContext) {
    console.log('Titlebar Glow extension is now active!');
    
    // Create status bar item
    statusBarItem = vscode.window.createStatusBarItem(vscode.StatusBarAlignment.Right, 100);
    statusBarItem.command = 'titlebarGlow.toggle';
    context.subscriptions.push(statusBarItem);
    
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
    
    // Listen for workspace folder changes
    context.subscriptions.push(
        vscode.workspace.onDidChangeWorkspaceFolders(() => {
            const config = getConfig();
            if (config.enabled) {
                vscode.window.showInformationMessage(
                    'Workspace changed. Would you like to update the titlebar glow?',
                    'Yes',
                    'No'
                ).then(result => {
                    if (result === 'Yes') {
                        applyGlowEffect();
                    }
                });
            }
        })
    );
    
    // Listen for configuration changes
    context.subscriptions.push(
        vscode.workspace.onDidChangeConfiguration(e => {
            if (e.affectsConfiguration('titlebarGlow')) {
                updateStatusBar();
                
                const config = getConfig();
                const cssPath = locateCSSFile();
                
                // Auto-reapply if already injected and still enabled
                if (cssPath && isInjected(cssPath) && config.enabled) {
                    vscode.window.showInformationMessage(
                        'Titlebar Glow settings changed. Would you like to reapply the effect?',
                        'Yes',
                        'No'
                    ).then(result => {
                        if (result === 'Yes') {
                            applyGlowEffect();
                        }
                    });
                }
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

