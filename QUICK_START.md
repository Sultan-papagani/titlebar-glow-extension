# Quick Start Guide

## 🚀 Get Running in 3 Steps

### 1️⃣ Install Dependencies
```bash
npm install
```

### 2️⃣ Compile the Extension
```bash
npm run compile
```

### 3️⃣ Test It Out
1. Press **F5** (or Run > Start Debugging)
2. A new VS Code window opens (Extension Development Host)
3. Press **Ctrl+Shift+P** (or **Cmd+Shift+P** on Mac)
4. Type and run: **"Titlebar Glow: Apply Glow Effect"**
5. **CLOSE and REOPEN** the Extension Development Host window completely
6. See the colorful glow on your titlebar! 🌈

⚠️ **Important**: Window reload doesn't work - you MUST fully close and reopen!

## 🎨 Try Different Colors

1. Open Settings (**Ctrl+,** or **Cmd+,**)
2. Search for: **"Titlebar Glow"**
3. Change **"Color Seed"** to any text (e.g., "1", "2", "blue", etc.)
4. Run **"Titlebar Glow: Apply Glow Effect"** again
5. **Close and reopen Cursor** to see the new color

## ⚙️ Customize the Glow

In Settings, adjust these values:

- **Glow Intensity**: 0.3 → Try 0.5 for brighter glow
- **Glow Offset X**: 50 → Try 100 to move it right
- **Glow Diameter**: 200 → Try 300 for bigger glow

## 📦 Package for Distribution

```bash
# Install the packaging tool
npm install -g @vscode/vsce

# Create a .vsix file
vsce package
```

You'll get a file like `titlebar-glow-1.0.0.vsix`

## 📥 Install the Package

1. Open VS Code
2. Go to Extensions (**Ctrl+Shift+X** or **Cmd+Shift+X**)
3. Click the **"..."** menu (top-right)
4. Select **"Install from VSIX..."**
5. Choose your `.vsix` file

## 🔄 Development Workflow

While developing:

```bash
# Start watch mode (auto-compile on save)
npm run watch
```

Then:
1. Make changes to TypeScript files
2. Press **Ctrl+R** (or **Cmd+R**) in Extension Development Host to reload
3. Test your changes

## 🎯 Common Commands

| Action | Command |
|--------|---------|
| Apply glow | `Titlebar Glow: Apply Glow Effect` |
| Remove glow | `Titlebar Glow: Remove Glow Effect` |
| Toggle glow | Click status bar icon (★) or `Titlebar Glow: Toggle` |

## ⚠️ Permission Issues?

If you see permission errors:

- **Windows**: Right-click VS Code → "Run as Administrator"
- **Mac**: Run `sudo code --user-data-dir=/tmp` (temporary fix)
- **Linux**: May need `sudo` or adjust permissions

## 💡 Pro Tips

1. **Different workspaces, different colors**: The color is generated from your workspace folder name automatically!
2. **Status bar indicator**: Shows the current glow color (click to toggle)
3. **After VS Code updates**: Just re-run "Apply Glow Effect"
4. **Remember**: Always close and reopen completely - window reload doesn't work!

## 🆘 Something Not Working?

1. **Check Output panel**: View > Output > "Extension Host"
2. **Rebuild**: `npm run compile`
3. **Clean build**: Delete `out/` folder and run `npm run compile`
4. **Verify installation**: Make sure `node_modules/` exists

## 📚 Need More Help?

- Read `SETUP.md` for detailed development guide
- Read `PROJECT_SUMMARY.md` for technical details
- Read `README.md` for user documentation

---

**Ready to make your titlebar glow!** ✨

