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

// Main export function
async function exportTabs() {
    const statusDiv = document.getElementById('status');
    
    try {
        // Get the current window and its tabs
        const window = await chrome.windows.getCurrent({ populate: true });
        const tabs = window.tabs;
        
        // Get tab groups from the current window
        const allGroups = await chrome.tabGroups.query({ windowId: window.id });
        
        // Process groups and calculate their minimum tab indices
        for (const group of allGroups) {
            const groupTabs = tabs.filter(tab => tab.groupId === group.id);
            group.minTabIndex = groupTabs.length > 0 
                ? Math.min(...groupTabs.map(tab => tab.index))
                : Infinity;
        }
        
        // Get sort preference
        const sortByPosition = document.getElementById('sortByPosition').checked;
        
        // Sort groups based on preference
        const sortedGroups = [...allGroups].sort(sortByPosition
            ? (a, b) => a.minTabIndex - b.minTabIndex
            : (a, b) => (a.title || '').localeCompare(b.title || '')
        );
        
        // Generate markdown content
        let markdownContent = '# Browser Tabs Export\n\n';
        
        // Add ungrouped tabs
        const ungroupedTabs = tabs.filter(tab => tab.groupId === -1);
        if (ungroupedTabs.length > 0) {
            markdownContent += '## Ungrouped Tabs\n\n';
            ungroupedTabs.forEach(tab => {
                markdownContent += `- [${tab.title}](${tab.url})\n`;
            });
        }
        
        // Add grouped tabs
        for (const group of sortedGroups) {
            const groupTabs = tabs.filter(tab => tab.groupId === group.id);
            if (groupTabs.length > 0) {
                const displayColor = colorMap[group.color] || group.color;
                markdownContent += `\n## Group [${displayColor}]: ${group.title || 'Unnamed Group'}\n\n`;
                groupTabs.forEach(tab => {
                    markdownContent += `- [${tab.title}](${tab.url})\n`;
                });
            }
        }
        
        // Create content blob and download link
        const blob = new Blob([markdownContent], { type: 'text/markdown' });
        const url = URL.createObjectURL(blob);

        // Create filename with date and time to avoid collisions
        const now = new Date();
        const date = now.toISOString().split('T')[0];
        
        const hours = now.getHours();
        const minutes = now.getMinutes().toString().padStart(2, '0');
        const seconds = now.getSeconds().toString().padStart(2, '0');
        const ampm = hours >= 12 ? 'P' : 'A';
        const hours12 = (hours % 12 || 12).toString().padStart(2, '0');
        const time = `${ampm}${hours12}${minutes}${seconds}`;
        
        const filename = `tabs-export_${date}_${time}.md`;

        await chrome.downloads.download({
            url: url,
            filename: filename,
            saveAs: true
        });
        
        showStatus('Export successful!', 'success');
    } catch (error) {
        console.error('Export failed:', error);
        showStatus('Error: ' + error.message, 'error');
    }
}

// Helper function to show status messages
function showStatus(message, type) {
    const statusDiv = document.getElementById('status');
    statusDiv.textContent = message;
    statusDiv.className = type;
    statusDiv.style.display = 'block';
    
    if (type === 'success') {
        setTimeout(() => {
            statusDiv.style.display = 'none';
        }, 3000);
    }
}

document.addEventListener('DOMContentLoaded', function() {
    const exportButton = document.getElementById('exportTabs');
    const debugButton = document.getElementById('debugGroups');
    const statusDiv = document.getElementById('status');
    const debugOutput = document.getElementById('debugOutput');
    const sortByPositionRadio = document.getElementById('sortByPosition');
    const sortAlphabeticallyRadio = document.getElementById('sortAlphabetically');
    
    // Load saved sort preference
    chrome.storage.sync.get(['sortByPosition'], function(result) {
        // If sort preference is not set, then default to sort-by-position
        const sortByPosition = result.sortByPosition !== false;
        sortByPositionRadio.checked = sortByPosition;
        sortAlphabeticallyRadio.checked = !sortByPosition;
    });
    
    // Save sort preference when changed
    sortByPositionRadio.addEventListener('change', () => {
        chrome.storage.sync.set({sortByPosition: true});
    });
    sortAlphabeticallyRadio.addEventListener('change', () => {
        chrome.storage.sync.set({sortByPosition: false});
    });

    // Set up export button
    exportButton.addEventListener('click', exportTabs);
    
    // Function to toggle tab group info display
    async function toggleTabGroupInfo() {
        if (debugOutput.style.display === 'block') {
            // If already displayed, hide it
            debugOutput.style.display = 'none';
            debugButton.textContent = 'Show Tab Group Info';
        } else {
            // Otherwise show it
            await displayTabGroupInfo();
            debugButton.textContent = 'Hide Tab Group Info';
        }
    }
    
    // Function to display tab group information based on sort order
    async function displayTabGroupInfo() {
        try {
            // Get the current window
            const window = await chrome.windows.getCurrent({ populate: true });
            const tabs = window.tabs;
            
            // Get tab groups from the current window
            const allGroups = await chrome.tabGroups.query({ windowId: window.id });
            
            // Find the minimum tab index for each group
            for (const group of allGroups) {
                const groupTabs = tabs.filter(tab => tab.groupId === group.id);
                if (groupTabs.length > 0) {
                    // Find the minimum tab index in this group
                    group.minTabIndex = Math.min(...groupTabs.map(tab => tab.index));
                } else {
                    group.minTabIndex = Infinity;
                }
            }
            
            // Get the selected sort order
            const sortByPosition = document.getElementById('sortByPosition').checked;
            
            // Clone and sort the groups based on selected order
            let sortedGroups;
            let output;
            
            if (sortByPosition) {
                // Sort by browser position
                sortedGroups = [...allGroups].sort((a, b) => a.minTabIndex - b.minTabIndex);
                output = `=== Tab Groups (by position in tab bar) ===\n`;
            } else {
                // Sort alphabetically
                sortedGroups = [...allGroups].sort((a, b) => {
                    const titleA = a.title || '';
                    const titleB = b.title || '';
                    return titleA.localeCompare(titleB);
                });
                output = `=== Tab Groups (alphabetical) ===\n`;
            }
            
            // Add group details to output
            sortedGroups.forEach(group => {
                output += `Group: ${group.title || 'Unnamed'}\n`;
                output += `  Min Tab Index: ${group.minTabIndex}\n`;
                output += `  Color: ${group.color}\n`;
                output += `  ID: ${group.id}\n`;
                output += '---\n';
            });
            
            debugOutput.textContent = output;
            debugOutput.style.display = 'block';
        } catch (error) {
            debugOutput.textContent = 'Error: ' + error.message;
            debugOutput.style.display = 'block';
            debugButton.textContent = 'Hide Tab Group Info';
        }
    }
    
    // Add debug button functionality
    debugButton.addEventListener('click', toggleTabGroupInfo);
    
    // Update tab group info when sort order changes
    sortByPositionRadio.addEventListener('change', function() {
        if (debugOutput.style.display === 'block') {
            displayTabGroupInfo();
            debugButton.textContent = 'Hide Tab Group Info';
        }
    });
    
    sortAlphabeticallyRadio.addEventListener('change', function() {
        if (debugOutput.style.display === 'block') {
            displayTabGroupInfo();
            debugButton.textContent = 'Hide Tab Group Info';
        }
    });
});
