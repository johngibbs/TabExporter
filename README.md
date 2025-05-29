# Tab Exporter Extension

A Microsoft Edge extension that allows you to export your browser tabs (including tab groups) to a markdown file.

## Features

- Export tabs to markdown with groups preserved
- Display tab group colors and sort by position or name
- Generate timestamped filenames for unique exports
- Toggle view for tab group information
- Clean, intuitive interface

## Installation

1. Open Microsoft Edge
2. Go to `edge://extensions/`
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
