# Titlebar Glow

A VS Code extension that adds a colorful glow effect to the titlebar, automatically generating unique colors based on your workspace name - inspired by JetBrains IDEs.

## Features

- **Auto-Generated Colors**: Each workspace gets a unique color based on its folder name
- **Customizable Glow Effect**: Adjust intensity, diameter, and position
- **Auto-Detection**: Automatically locates VS Code's CSS file across platforms
- **Real-time Updates**: Changes apply immediately when switching workspaces
- **Status Bar Indicator**: Shows current glow status and color

## Preview

When you open different projects, the titlebar will display different colored glow effects, making it easy to distinguish between multiple VS Code windows.

## Installation

1. Install the extension from the VS Code Marketplace
2. Open Command Palette (`Ctrl+Shift+P` or `Cmd+Shift+P`)
3. Run `Titlebar Glow: Apply Glow Effect`
4. **Close and reopen Cursor completely** (not just reload)

## Usage

### ⚠️ Important: Full Restart Required

After applying or removing the glow effect, you **MUST completely close and reopen Cursor** (not just reload the window) for changes to take effect. The window reload command doesn't reload the modified CSS files.

### Commands

- **Apply Glow Effect**: Inject the glow effect into VS Code's CSS
  - Command: `Titlebar Glow: Apply Glow Effect`
  - **Then close and reopen Cursor**
  
- **Remove Glow Effect**: Remove the glow effect from VS Code's CSS
  - Command: `Titlebar Glow: Remove Glow Effect`
  - **Then close and reopen Cursor**
  
- **Toggle Glow Effect**: Toggle the glow effect on/off
  - Command: `Titlebar Glow: Toggle Glow Effect`
  - Also available via status bar icon
  - **Then close and reopen Cursor**

### Status Bar

The extension adds a status bar item on the right side:
- **Active**: Shows `★ #RRGGBB` (the color hex code)
- **Inactive**: Shows `☆ Glow Off`

Click the status bar item to quickly toggle the glow effect.

## Configuration

Open VS Code Settings (`Ctrl+,` or `Cmd+,`) and search for "Titlebar Glow":

### `titlebarGlow.enabled`
- **Type**: Boolean
- **Default**: `true`
- **Description**: Enable or disable the titlebar glow effect

### `titlebarGlow.glowIntensity`
- **Type**: Number (0-1)
- **Default**: `0.3`
- **Description**: Controls the opacity/intensity of the glow effect

Example:
```json
{
  "titlebarGlow.glowIntensity": 0.5
}
```

### `titlebarGlow.glowOffsetX`
- **Type**: Number
- **Default**: `50`
- **Description**: Horizontal offset of the glow effect from the left edge (in pixels)

Example:
```json
{
  "titlebarGlow.glowOffsetX": 100
}
```

### `titlebarGlow.glowDiameter`
- **Type**: Number
- **Default**: `200`
- **Description**: Diameter of the glow effect (in pixels)

Example:
```json
{
  "titlebarGlow.glowDiameter": 300
}
```

### `titlebarGlow.colorSeed`
- **Type**: String
- **Default**: `""`
- **Description**: A random seed mixed into the folder name during color calculation. Use this to get different color variations for the same project. For example, if you don't like the current color, try setting it to "1", "2", or any other string to generate a different color.

Example:
```json
{
  "titlebarGlow.colorSeed": "variant2"
}
```

## Example Configuration

Here's a complete example configuration:

```json
{
  "titlebarGlow.enabled": true,
  "titlebarGlow.glowIntensity": 0.4,
  "titlebarGlow.glowOffsetX": 75,
  "titlebarGlow.glowDiameter": 250,
  "titlebarGlow.colorSeed": ""
}
```

## How It Works

### CSS Injection Process

1. **Locates** VS Code's `workbench.desktop.main.css` file
2. **Injects** custom CSS rules at the end of the file
3. **Uses** a unique token to identify and manage injected styles
4. **Supports** safe removal and re-injection

The extension adds CSS that creates a `::before` pseudo-element on the `.titlebar-container` with a radial gradient glow effect.

### Color Generation

Colors are generated using a deterministic hash function based on your workspace folder name. This ensures:
- Same workspace always gets the same color
- Different workspaces get different colors
- Colors are vibrant and visually distinct
- You can change the color by modifying the `colorSeed` setting

## Important Notes

### System Modifications

⚠️ **This extension modifies VS Code's core CSS file.** While safe, you should be aware of this behavior:

- The extension creates a backup of the original CSS file
- Changes are reversible using the "Remove Glow Effect" command
- The backup file is stored as `workbench.desktop.main.css.titlebar-glow.backup`

### VS Code Updates

After VS Code updates, you may need to re-apply the glow effect because:
- Updates replace the CSS file with a new version
- Your modifications will be lost
- Simply run "Apply Glow Effect" again after updating

### Permissions

The extension requires write access to VS Code's installation directory:
- **Windows**: Usually `C:\Users\[Username]\AppData\Local\Programs\Microsoft VS Code\`
- **macOS**: Usually `/Applications/Visual Studio Code.app/`
- **Linux**: Usually `/usr/share/code/`

If you see permission errors:
- **Windows**: Run VS Code as Administrator
- **macOS/Linux**: You may need to adjust file permissions

### Backups

Consider backing up the CSS file before first use:
- The extension automatically creates a backup
- You can manually restore by copying `workbench.desktop.main.css.titlebar-glow.backup`

## Troubleshooting

### Glow effect not showing

1. **Make sure you completely CLOSED and REOPENED Cursor** (not just reloaded the window)
2. Check if the extension is enabled in settings
3. Try running "Apply Glow Effect" command again
4. **Remember: Window reload doesn't work - you need a full restart**

### Permission errors

- **Windows**: Run VS Code as Administrator
- **macOS/Linux**: Check file permissions on the installation directory

### After VS Code update

- Run "Apply Glow Effect" command again to re-inject the CSS

### Wrong color or want different color

- Change the `titlebarGlow.colorSeed` setting to any string value
- Each different seed generates a different color for the same workspace

### Want to completely remove the extension

1. Run "Remove Glow Effect" command
2. Verify the glow is gone after reload
3. Uninstall the extension

## Development

### Building from source

```bash
# Install dependencies
npm install

# Compile TypeScript
npm run compile

# Watch mode for development
npm run watch
```

### Packaging

```bash
# Install vsce
npm install -g @vscode/vsce

# Package extension
vsce package
```

## License

MIT

## Feedback

If you encounter any issues or have suggestions, please open an issue on the GitHub repository.

---

**Enjoy your colorful titlebar!** 🌈

