# Change Log

All notable changes to the "Titlebar Glow" extension will be documented in this file.

## [1.0.0] - 2025-10-31

### Initial Release

#### Features
- Auto-generated unique colors based on workspace folder name
- Customizable glow effect with adjustable intensity, diameter, and position
- Cross-platform support (Windows, macOS, Linux)
- Real-time updates when switching workspaces
- Status bar indicator showing current glow status and color
- Three commands: Apply, Remove, and Toggle glow effect
- Automatic CSS file backup system
- Color seed customization for getting different color variations

#### Configuration Options
- `titlebarGlow.enabled` - Enable/disable the extension
- `titlebarGlow.glowIntensity` - Control glow opacity (0-1)
- `titlebarGlow.glowOffsetX` - Horizontal position offset
- `titlebarGlow.glowDiameter` - Size of the glow effect
- `titlebarGlow.colorSeed` - Seed for color generation variations

#### Safety Features
- Automatic backup of original CSS file
- Token-based injection for safe removal
- Atomic file writes to prevent corruption
- Graceful error handling with user notifications

---

## Release Notes Format

### [Version] - Date

#### Added
- New features

#### Changed
- Changes to existing functionality

#### Deprecated
- Soon-to-be removed features

#### Removed
- Removed features

#### Fixed
- Bug fixes

#### Security
- Security fixes

