# Tab Exporter - Pending Tasks

## Before Publishing to Microsoft Edge Add-ons Store

### Store Assets to Prepare
- [ ] Create promotional images (1280x800) showing the extension in action
- [ ] Prepare a detailed description for the store listing
- [ ] Create a feature list highlighting key functionality
- [ ] Host the privacy policy at a permanent URL (needed before publishing)

### Update Placeholder Values
- [ ] Update Microsoft Edge Store URL in `README.md` after publishing (search for 'PLACEHOLDER-EXTENSION-ID')
- [x] Update GitHub URL in any files that reference it: https://github.com/johngibbs/TabExporter  

### Versioning
- [ ] Update version number in `manifest.json` if needed before release
- [ ] Create and push v1.0.0 git tag before publishing
  ```bash
  git tag -a v1.0.0 -m "Initial public release"
  git push origin v1.0.0
  ```

## Future Enhancements
- [ ] Update export filename to "tabs_msedge-<window/workspace-name>_YYYY-MM-DD_[A|P]HHMMSS.md"
- [ ] Update export file title to "# Tabs Export - Microsoft Edge ([Window|Workspace]: <window/workspace-name>)"
- [ ] Add support for exporting to different formats (HTML, JSON)
- [ ] Add options for customizing the markdown output
- [ ] Add dark/light theme support for the popup
- [ ] Implement tab group filtering before export
