// Listen for messages from popup
chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  if (request.action === 'exportTabs') {
    exportCurrentWindowTabs();
  }
});

// Function to export tabs to markdown
async function exportCurrentWindowTabs() {
  try {
    // Get the current window
    const currentWindow = await chrome.windows.getCurrent();
    
    // Get all tabs in the current window
    const tabs = await chrome.tabs.query({ windowId: currentWindow.id });
    
    // Get tab groups
    const groups = await chrome.tabGroups.query({ windowId: currentWindow.id });
    
    // Create markdown content
    let markdownContent = '# Browser Tabs Export\n\n';
    
    // Process tab groups first
    for (const group of groups) {
      const groupTabs = tabs.filter(tab => tab.groupId === group.id);
      if (groupTabs.length > 0) {
        markdownContent += `## Group: ${group.title}\n\n`;
        for (const tab of groupTabs) {
          markdownContent += `- [${tab.title}](${tab.url})\n`;
        }
        markdownContent += '\n';
      }
    }
    
    // Add ungrouped tabs
    const ungroupedTabs = tabs.filter(tab => tab.groupId === -1);
    if (ungroupedTabs.length > 0) {
      markdownContent += '## Ungrouped Tabs\n\n';
      for (const tab of ungroupedTabs) {
        markdownContent += `- [${tab.title}](${tab.url})\n`;
      }
    }
    
    // Create download link
    const blob = new Blob([markdownContent], { type: 'text/markdown' });
    const url = URL.createObjectURL(blob);
    
    // Download the file
    chrome.downloads.download({
      url: url,
      filename: `tabs-export-${new Date().toISOString().split('T')[0]}.md`,
      saveAs: true
    });
  } catch (error) {
    console.error('Error exporting tabs:', error);
  }
}
