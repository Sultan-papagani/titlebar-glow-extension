import * as vscode from 'vscode';

export interface GlowConfig {
    enabled: boolean;
    glowIntensity: number;
    glowOffsetX: number;
    glowDiameter: number;
    colorSeed: string;
}

/**
 * Reads the extension configuration from VS Code settings
 */
export function getConfig(): GlowConfig {
    const config = vscode.workspace.getConfiguration('titlebarGlow');
    
    return {
        enabled: config.get<boolean>('enabled', true),
        glowIntensity: config.get<number>('glowIntensity', 0.3),
        glowOffsetX: config.get<number>('glowOffsetX', 50),
        glowDiameter: config.get<number>('glowDiameter', 200),
        colorSeed: config.get<string>('colorSeed', '')
    };
}

/**
 * Updates a specific configuration value
 */
export async function updateConfig(key: string, value: any): Promise<void> {
    const config = vscode.workspace.getConfiguration('titlebarGlow');
    await config.update(key, value, vscode.ConfigurationTarget.Global);
}

/**
 * Gets the current workspace name
 */
export function getWorkspaceName(): string {
    const workspaceFolders = vscode.workspace.workspaceFolders;
    if (!workspaceFolders || workspaceFolders.length === 0) {
        return 'default';
    }
    return workspaceFolders[0].name;
}

