import SysTray, { MenuItem } from 'systray2';
import { exec } from 'child_process';

const icons = {
    green: "iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR42mNkYAAAAAYAAjCB0C8AAAAASUVORK5CYII=", // solid green
    orange: "iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR42mP8/x8AAwMCAO+ip1sAAAAASUVORK5CYII=", // solid orange
    red: "iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR42mP8z8AAAAOQAYyA+L+EAAAAAElFTkSuQmCC", // solid red
    gray: "iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR42mP8DwQAAgMBADn1+30AAAAASUVORK5CYII=", // solid gray
    purple: "iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR42mO8+Z8AAwMBAMR2oVAAAAAASUVORK5CYII=" // solid purple
};

const cliCmd = 'npx antigravity-usage quota --json';

const MAX_SLOTS = 20;
let initialItems: MenuItem[] = [];

// 0: Loading status
// 1: Wakeup Button
// 2: Separator
// 3-19: Models
for (let i = 0; i < MAX_SLOTS; i++) {
    initialItems.push({
        title: i === 0 ? "Fetching real usage..." : " ",
        tooltip: "",
        checked: false,
        enabled: i === 1, // Wakeup button is clickable
        hidden: i !== 0
    });
}

initialItems.push(SysTray.separator);
initialItems.push({
    title: "Quit",
    tooltip: "Quit the application",
    checked: false,
    enabled: true
});

let menu = {
    icon: icons.purple,
    title: "A",
    tooltip: "Antigravity Usage (Fetching...)",
    items: initialItems
};

const systray = new SysTray({
    menu,
    debug: false,
    copyDir: true
});

function createProgressBar(pct: number): string {
    const totalBlocks = 10;
    const filledBlocks = Math.round((pct / 100) * totalBlocks);
    const emptyBlocks = totalBlocks - filledBlocks;
    const bar = '█'.repeat(filledBlocks) + '░'.repeat(emptyBlocks);
    return `[${bar}]`;
}

function fetchRealUsage() {
    exec(cliCmd, (error, stdout, stderr) => {
        let newItemsData: { title: string, tooltip: string, enabled?: boolean }[] = [];
        let tooltip = "Antigravity Usage";
        let overallPct = 0;
        let validModelsCount = 0;
        let currentIcon = icons.gray;

        if (!stdout || !stdout.includes('{')) {
            newItemsData.push({ title: "❌ Offline or Not Logged In", tooltip: "Run `npx antigravity-usage login`" });
            newItemsData.push({ title: "🚀 Quick Wakeup / Ping", tooltip: "Trigger wakeup manually", enabled: true });
            newItemsData.push({ title: "---", tooltip: "" });
            tooltip = "Antigravity Usage: Offline/Error";
        } else {
            try {
                const jsonStr = stdout.substring(stdout.indexOf('{'));
                const snapshot = JSON.parse(jsonStr);

                tooltip = `Antigravity Usage\nMethod: ${snapshot.method}`;
                
                if (snapshot.email) {
                    newItemsData.push({ title: `👤 ${snapshot.email}`, tooltip: "Logged in account" });
                } else {
                    newItemsData.push({ title: "📊 Usage Data", tooltip: "Status" });
                }

                newItemsData.push({ title: "🚀 Quick Wakeup / Ping", tooltip: "Trigger wakeup manually", enabled: true });
                newItemsData.push({ title: "---", tooltip: "" });

                if (snapshot.models && snapshot.models.length > 0) {
                    const visibleModels = snapshot.models.filter((m: any) => !m.isAutocompleteOnly);
                    
                    for (const model of visibleModels) {
                        let statusText = "";
                        if (model.isExhausted) {
                            statusText = `[EXHAUSTED ] 0%`;
                        } else if (model.remainingPercentage !== undefined) {
                            const pct = Math.round(model.remainingPercentage * 100);
                            statusText = `${createProgressBar(pct)} ${pct}%`;
                            overallPct += pct;
                            validModelsCount++;
                        } else {
                            statusText = "N/A";
                        }

                        newItemsData.push({
                            title: `${model.label.padEnd(25)} ${statusText}`,
                            tooltip: `Model: ${model.modelId}\nResets: ${model.resetTime || 'N/A'}`
                        });
                    }

                    // Calculate average percentage for dynamic icon
                    if (validModelsCount > 0) {
                        const avgPct = overallPct / validModelsCount;
                        if (avgPct >= 50) currentIcon = icons.green;
                        else if (avgPct >= 20) currentIcon = icons.orange;
                        else currentIcon = icons.red;
                    }

                } else {
                    newItemsData.push({ title: "No models found", tooltip: "No quota information available" });
                }
            } catch (err) {
                newItemsData.push({ title: "⚠️ Failed to parse output", tooltip: "Check terminal logs" });
                newItemsData.push({ title: "🚀 Quick Wakeup / Ping", tooltip: "Trigger wakeup manually", enabled: true });
            }
        }

        for (let i = 0; i < MAX_SLOTS; i++) {
            const data = newItemsData[i];
            const updatedItem: MenuItem = {
                title: data ? data.title : " ",
                tooltip: data ? data.tooltip : "",
                checked: false,
                enabled: data ? !!data.enabled : false,
                hidden: !data 
            };
            
            menu.items[i] = updatedItem;
            systray.sendAction({ type: 'update-item', item: updatedItem, seq_id: i });
        }

        // Update overall menu icon and tooltip
        menu.tooltip = tooltip;
        if (menu.icon !== currentIcon) {
            menu.icon = currentIcon;
        }

        systray.sendAction({ type: 'update-menu', menu: menu });
    });
}

function triggerWakeup() {
    menu.items[1].title = "⏳ Waking up models...";
    systray.sendAction({ type: 'update-item', item: menu.items[1], seq_id: 1 });
    
    exec('npx antigravity-usage wakeup trigger', (error, stdout, stderr) => {
        if (error) console.error("Wakeup failed:", stderr);
        
        menu.items[1].title = "✅ Wakeup complete! Refreshing...";
        systray.sendAction({ type: 'update-item', item: menu.items[1], seq_id: 1 });
        
        setTimeout(() => {
            fetchRealUsage(); // Refresh list immediately
        }, 2000);
    });
}

systray.onClick(action => {
    if (action.item.title === "Quit") {
        systray.kill();
        process.exit(0);
    } else if (action.item.title.includes("Wakeup")) {
        triggerWakeup();
    }
});

systray.ready().then(() => {
    console.log("Systray started! Premium features enabled.");
    fetchRealUsage();
    setInterval(fetchRealUsage, 60000);
}).catch(err => {
    console.error("Failed to start systray:", err);
});
