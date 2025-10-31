# Setup Guide

## Quick Start

Follow these steps to get your Titlebar Glow extension up and running:

### 1. Install Dependencies

```bash
npm install
```

### 2. Compile TypeScript

```bash
npm run compile
```

Or use watch mode during development:

```bash
npm run watch
```

### 3. Test the Extension

1. Open this folder in VS Code
2. Press `F5` to launch the Extension Development Host
3. In the new window, open the Command Palette (`Ctrl+Shift+P` or `Cmd+Shift+P`)
4. Run the command: `Titlebar Glow: Apply Glow Effect`
5. Reload VS Code when prompted

### 4. Package the Extension (Optional)

To create a `.vsix` file for distribution:

```bash
# Install vsce globally if you haven't already
npm install -g @vscode/vsce

# Package the extension
vsce package
```

This will create a file like `titlebar-glow-1.0.0.vsix` that you can install manually or publish to the VS Code Marketplace.

### 5. Install the Packaged Extension

To install the `.vsix` file:

1. Open VS Code
2. Go to Extensions view (`Ctrl+Shift+X` or `Cmd+Shift+X`)
3. Click the "..." menu at the top
4. Select "Install from VSIX..."
5. Choose your `.vsix` file

## Development Tips

### Debugging

- Set breakpoints in your TypeScript files
- Press `F5` to start debugging
- The Extension Development Host will open with your extension loaded
- Console output appears in the Debug Console

### Making Changes

1. Edit the TypeScript files in `src/`
2. The compiler will automatically recompile if you're using `npm run watch`
3. Reload the Extension Development Host (`Ctrl+R` or `Cmd+R`)
4. Test your changes

### File Structure

```
titlebar-glow/
├── src/
│   ├── extension.ts       # Main extension entry point
│   ├── colorGenerator.ts  # Color generation logic
│   ├── config.ts          # Configuration management
│   └── cssInjector.ts     # CSS file manipulation
├── out/                   # Compiled JavaScript (generated)
├── package.json           # Extension manifest
├── tsconfig.json          # TypeScript configuration
├── .vscodeignore          # Files to exclude from package
└── README.md              # User documentation
```

## Publishing to VS Code Marketplace

Before publishing, make sure to:

1. Update the `publisher` field in `package.json` with your VS Code Marketplace publisher name
2. Add a license file (e.g., `LICENSE`)
3. Add an icon (128x128px PNG) and reference it in `package.json`:
   ```json
   "icon": "icon.png"
   ```
4. Test thoroughly on all platforms (Windows, macOS, Linux)

Then publish:

```bash
# Login to your publisher account
vsce login <publisher-name>

# Publish the extension
vsce publish
```

## Troubleshooting

### TypeScript Compilation Errors

Make sure you have the correct TypeScript version:
```bash
npm install -D typescript@^5.0.0
```

### Extension Not Loading

- Check the Output panel for errors (View > Output, select "Extension Host")
- Make sure all dependencies are installed
- Try cleaning and rebuilding: `rm -rf out && npm run compile`

### Permission Issues During Testing

When testing the CSS injection, you might need:
- **Windows**: Run VS Code as Administrator
- **macOS/Linux**: Adjust permissions on VS Code installation directory

## Next Steps

- Test the extension with different workspaces
- Try different configuration options
- Customize the glow appearance to your liking
- Share your feedback!

Happy coding! 🚀

