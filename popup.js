document.addEventListener('DOMContentLoaded', function() {
    const exportButton = document.getElementById('exportTabs');
    const statusDiv = document.getElementById('status');

    exportButton.addEventListener('click', async function() {
        try {
            // Get the current window's tabs
            const window = await chrome.windows.getCurrent({ populate: true });
            const tabs = window.tabs;

            // Create markdown content
            let markdownContent = '# Browser Tabs Export\n\n';
            
            // Group tabs by their group ID
            const groups = new Map();
            tabs.forEach(tab => {
                if (tab.groupId !== -1) {
                    if (!groups.has(tab.groupId)) {
                        groups.set(tab.groupId, []);
                    }
                    groups.get(tab.groupId).push(tab);
                }
            });

            // Add ungrouped tabs first
            markdownContent += '## Ungrouped Tabs\n\n';
            tabs.filter(tab => tab.groupId === -1).forEach(tab => {
                markdownContent += `- [${tab.title}](${tab.url})\n`;
            });

            // Add grouped tabs
            for (const [groupId, groupTabs] of groups) {
                const group = await chrome.tabs.getGroup(groupId);
                markdownContent += `\n## ${group.title}\n\n`;
                groupTabs.forEach(tab => {
                    markdownContent += `- [${tab.title}](${tab.url})\n`;
                });
            }

            // Create blob and download
            const blob = new Blob([markdownContent], { type: 'text/markdown' });
            const url = URL.createObjectURL(blob);
            const filename = `tabs-export-${new Date().toISOString().split('T')[0]}.md`;
            
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
});
