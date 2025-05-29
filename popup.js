document.addEventListener('DOMContentLoaded', function() {
    const exportButton = document.getElementById('exportTabs');
    const debugButton = document.getElementById('debugGroups');
    const statusDiv = document.getElementById('status');
    const debugOutput = document.getElementById('debugOutput');

    exportButton.addEventListener('click', async function() {
        try {
            // Get the current window's tabs
            const window = await chrome.windows.getCurrent({ populate: true });
            const tabs = window.tabs;

            // Create markdown content
            let markdownContent = '# Browser Tabs Export\n\n';
            
            // Get tab groups from the current window
            let allGroups = await chrome.tabGroups.query({ windowId: window.id });
            
            // Find the minimum tab index for each group (this represents the group's position in tab bar)
            for (const group of allGroups) {
                const groupTabs = tabs.filter(tab => tab.groupId === group.id);
                if (groupTabs.length > 0) {
                    // Find the minimum tab index in this group
                    group.minTabIndex = Math.min(...groupTabs.map(tab => tab.index));
                } else {
                    group.minTabIndex = Infinity;
                }
            }
            
            console.log('Groups with min tab indexes:', JSON.stringify(allGroups.map(g => ({ 
                title: g.title, 
                minTabIndex: g.minTabIndex 
            }))));
            
            // Sort by the minimum tab index in each group
            allGroups.sort((a, b) => a.minTabIndex - b.minTabIndex);
            
            console.log('Sorted groups by position:', JSON.stringify(allGroups.map(g => ({ 
                title: g.title, 
                minTabIndex: g.minTabIndex 
            }))));
            
            // Add ungrouped tabs first
            markdownContent += '## Ungrouped Tabs\n\n';
            tabs.filter(tab => tab.groupId === -1).forEach(tab => {
                markdownContent += `- [${tab.title}](${tab.url})\n`;
            });

            // Add grouped tabs
            for (const group of allGroups) {
                const groupTabs = tabs.filter(tab => tab.groupId === group.id);
                if (groupTabs.length > 0) {
                    markdownContent += `\n## Group: ${group.title || 'Unnamed Group'}\n\n`;
                    groupTabs.forEach(tab => {
                        markdownContent += `- [${tab.title}](${tab.url})\n`;
                    });
                }
            }

            // Create blob and download
            const blob = new Blob([markdownContent], { type: 'text/markdown' });
            const url = URL.createObjectURL(blob);
            // Create filename with date and time to avoid collisions
            const now = new Date();
            const date = now.toISOString().split('T')[0];
            const time = now.toTimeString().split(' ')[0].replace(/:/g, '-');
            const filename = `tabs-export_${date}_${time}.md`;
            
            chrome.downloads.download({
                url: url,
                filename: filename,
                saveAs: true
            });

            statusDiv.textContent = 'Export successful!';
            statusDiv.className = 'success';
            statusDiv.style.display = 'block';
            
            // Hide status after 3 seconds
            setTimeout(() => {
                statusDiv.style.display = 'none';
            }, 3000);

        } catch (error) {
            statusDiv.textContent = 'Error: ' + error.message;
            statusDiv.className = 'error';
            statusDiv.style.display = 'block';
        }
    });
    
    // Add debug button functionality
    debugButton.addEventListener('click', async function() {
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
            
            // Sort by the minimum tab index in each group
            const sortedByPosition = [...allGroups].sort((a, b) => a.minTabIndex - b.minTabIndex);
            
            // Display the results
            let output = '=== Tab Groups (by position in tab bar) ===\n';
            sortedByPosition.forEach(group => {
                output += `Group: ${group.title || 'Unnamed'}\n`;
                output += `  Min Tab Index: ${group.minTabIndex}\n`;
                output += `  Color: ${group.color}\n`;
                output += `  ID: ${group.id}\n`;
                output += '---\n';
            });
            
            output += '\n=== Tab Groups (alphabetical) ===\n';
            const sortedByTitle = [...allGroups].sort((a, b) => {
                const titleA = a.title || '';
                const titleB = b.title || '';
                return titleA.localeCompare(titleB);
            });
            
            sortedByTitle.forEach(group => {
                output += `Group: ${group.title || 'Unnamed'} (Index: ${group.index})\n`;
            });
            
            // Display the debug output
            debugOutput.textContent = output;
            debugOutput.style.display = 'block';
        } catch (error) {
            debugOutput.textContent = 'Error: ' + error.message;
            debugOutput.style.display = 'block';
        }
    });
});
