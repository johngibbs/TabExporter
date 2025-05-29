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
    let groups = await chrome.tabGroups.query({ windowId: currentWindow.id });
    
    // Find the minimum tab index for each group (this represents the group's position in tab bar)
    for (const group of groups) {
      const groupTabs = tabs.filter(tab => tab.groupId === group.id);
      if (groupTabs.length > 0) {
        // Find the minimum tab index in this group
        group.minTabIndex = Math.min(...groupTabs.map(tab => tab.index));
      } else {
        group.minTabIndex = Infinity;
      }
    }
    
    // Get the saved sort preference and sort groups accordingly
    await new Promise((resolve) => {
      chrome.storage.sync.get(['sortByPosition'], function(result) {
        const sortByPosition = result.sortByPosition !== false; // Default to position sorting
        
        // Sort groups based on the saved preference
        if (sortByPosition) {
          // Sort by the minimum tab index in each group (browser order)
          groups.sort((a, b) => a.minTabIndex - b.minTabIndex);
        } else {
          // Sort alphabetically by group title
          groups.sort((a, b) => {
            const titleA = a.title || '';
            const titleB = b.title || '';
            return titleA.localeCompare(titleB);
          });
        }
        
        // Continue processing after sorting is complete
        resolve();
      });
    });
    
    // Create markdown content
    let markdownContent = '# Browser Tabs Export\n\n';
    
    // Map API color names to browser UI color names
    const colorMap = {
      'blue': 'blue',
      'pink': 'pink',
      'red': 'violet',
      'purple': 'purple',
      'green': 'royal blue',
      'cyan': 'teal',
      'orange': 'orange',
      'yellow': 'yellow',
      'grey': 'gray',
  };
    
    // Process tab groups first
    for (const group of groups) {
      const groupTabs = tabs.filter(tab => tab.groupId === group.id);
      if (groupTabs.length > 0) {
        const displayColor = colorMap[group.color] || group.color;
        markdownContent += `## Group [${displayColor}]: ${group.title || 'Unnamed Group'}\n\n`;
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
    
    // Download the file with date and time to avoid collisions
    const now = new Date();
    const date = now.toISOString().split('T')[0]; // YYYY-MM-DD
    
    // Format time with AM/PM indicator
    const hours = now.getHours();
    const minutes = now.getMinutes().toString().padStart(2, '0');
    const seconds = now.getSeconds().toString().padStart(2, '0');
    const ampm = hours >= 12 ? 'P' : 'A';
    const hours12 = (hours % 12 || 12).toString().padStart(2, '0');
    
    const time = `${ampm}${hours12}${minutes}${seconds}`;
    const filename = `tabs-export_${date}_${time}.md`;
    
    chrome.downloads.download({
      url: url,
      filename: filename,
      saveAs: true
    });
  } catch (error) {
    console.error('Error exporting tabs:', error);
  }
}
