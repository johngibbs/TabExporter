# Tab Exporter - Pending Tasks

## Before Publishing to Microsoft Edge Add-ons Store

### Documentation Updates
- [x] Update GitHub issues URL in `docs/PRIVACY.md`
- [ ] Update version number in `manifest.json` if needed before release
- [ ] Update Microsoft Edge Store URL in `README.md` after publishing

### Privacy Policy
- [ ] Host the privacy policy at a permanent URL (needed before publishing)
- [ ] Update any placeholders in the privacy policy (needed before publishing)
- [ ] Add link to privacy policy in the extension's popup (optional)

### Assets to Prepare
- [ ] Create promotional images (1280x800) showing the extension in action
- [ ] Prepare a detailed description for the store listing
- [ ] Create a feature list highlighting key functionality

### Version Control
- [ ] Create and push v1.0.0 git tag before publishing
  ```bash
  git tag -a v1.0.0 -m "Initial public release"
  git push origin v1.0.0
  ```

## Future Enhancements
- [ ] Update export filename to "Tabs-Export_MsEdge-(<window/workspace-name>)_YYYY-MM-DD_[A|P]HHMMSS.md"
- [ ] Update export file title to "# Tabs Export - Microsoft Edge ([Window|Workspace]: <window/workspace-name>)"
- [ ] Add support for exporting to different formats (HTML, JSON)
- [ ] Add options for customizing the markdown output
- [ ] Add dark/light theme support for the popup
- [ ] Implement tab group filtering before export
