# Tab Exporter Extension

A Microsoft Edge extension that allows you to export your browser tabs (including tab groups) to a well-formatted markdown file. Perfect for saving research, project references, or simply keeping track of your browsing sessions.

## Features

- Export tabs to markdown with groups preserved
- Display tab group colors and sort by position or name
- Generate timestamped filenames for unique exports
- Toggle view for tab group information
- Clean, intuitive interface
- Privacy-focused: All processing happens locally in your browser

## Installation

### Option 1: Install from Microsoft Edge Add-ons Store (Recommended)

1. Visit the [Tab Exporter](https://microsoftedge.microsoft.com/addons/detail/PLACEHOLDER-EXTENSION-ID) page in the Microsoft Edge Add-ons Store
2. Click "Get" or "Add to Edge"
3. Confirm the installation when prompted

### Option 2: Install from Source

1. Download or clone this repository
2. Open Microsoft Edge and go to `edge://extensions/`
3. Enable "Developer mode" in the top right corner
4. Click "Load unpacked" and select the extension directory

## Usage

1. Click the extension icon in the toolbar
2. Select a tab group sorting option:
   - **Browser Order** (default): Groups appear in the same order as in your browser
   - **Alphabetical**: Groups are sorted alphabetically by title
3. Click "Export Current Window Tabs"
4. Choose where to save the markdown file
5. The file will be named `tabs-export_YYYY-MM-DD_AHHMMSS.md` (where A=AM/P=PM)

## Tab Group Information

- Click "Show Tab Group Info" to view information about your tab groups
- The information will be displayed in the selected sort order
- Click "Hide Tab Group Info" to hide the information when done
- If you change the sort order, the tab group information will update automatically

## Privacy

Tab Exporter is designed with your privacy in mind:

- **No Data Collection**: The extension processes all data locally in your browser
- **No Tracking**: We don't use any analytics or tracking
- **No Server Communication**: Your tab data never leaves your computer
- **Minimal Permissions**: Only requests necessary permissions to function

For more details, please see our [Privacy Policy](./PRIVACY.md).

## Development

### Development Setup

1. Fork and clone this repository
   ```bash
   git clone https://github.com/johngibbs/TabExporter.git
   cd tab-exporter
   ```
2. Open Microsoft Edge and navigate to `edge://extensions/`
3. Enable "Developer mode"
4. Click "Load unpacked" and select the extension directory

### Contributing

Contributions are welcome! Please open an issue to discuss your ideas or submit a pull request.

## License

Tab Exporter is open source software licensed under the [MIT License](LICENSE).

```
MIT License

Copyright (c) 2025 John Gibbs

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all
copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
SOFTWARE.
```
