/**
 * Generates a deterministic color based on a string input
 */

/**
 * Simple hash function to convert string to number
 */
function hashString(str: string): number {
    let hash = 0;
    for (let i = 0; i < str.length; i++) {
        const char = str.charCodeAt(i);
        hash = ((hash << 5) - hash) + char;
        hash = hash & hash; // Convert to 32bit integer
    }
    return Math.abs(hash);
}

/**
 * Generates a vibrant RGB color from a workspace name and seed
 * Uses HSL color space to ensure colors are vibrant and visually distinct
 */
export function generateColor(workspaceName: string, seed: string = ''): { r: number; g: number; b: number } {
    const combined = workspaceName + seed;
    const hash = hashString(combined);
    
    // Use HSL to generate vibrant colors
    // Hue: full spectrum (0-360)
    const hue = (hash % 360);
    
    // Saturation: 60-90% for vibrant but not oversaturated colors
    const saturation = 60 + ((hash >> 8) % 31);
    
    // Lightness: 45-65% for colors that work well on dark backgrounds
    const lightness = 45 + ((hash >> 16) % 21);
    
    return hslToRgb(hue, saturation, lightness);
}

/**
 * Converts HSL to RGB
 */
function hslToRgb(h: number, s: number, l: number): { r: number; g: number; b: number } {
    h = h / 360;
    s = s / 100;
    l = l / 100;
    
    let r, g, b;
    
    if (s === 0) {
        r = g = b = l; // achromatic
    } else {
        const hue2rgb = (p: number, q: number, t: number) => {
            if (t < 0) t += 1;
            if (t > 1) t -= 1;
            if (t < 1/6) return p + (q - p) * 6 * t;
            if (t < 1/2) return q;
            if (t < 2/3) return p + (q - p) * (2/3 - t) * 6;
            return p;
        };
        
        const q = l < 0.5 ? l * (1 + s) : l + s - l * s;
        const p = 2 * l - q;
        r = hue2rgb(p, q, h + 1/3);
        g = hue2rgb(p, q, h);
        b = hue2rgb(p, q, h - 1/3);
    }
    
    return {
        r: Math.round(r * 255),
        g: Math.round(g * 255),
        b: Math.round(b * 255)
    };
}

/**
 * Converts RGB to hex string
 */
export function rgbToHex(r: number, g: number, b: number): string {
    return '#' + [r, g, b].map(x => {
        const hex = x.toString(16);
        return hex.length === 1 ? '0' + hex : hex;
    }).join('');
}

