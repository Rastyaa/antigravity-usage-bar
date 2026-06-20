import SysTray, { MenuItem } from 'systray2';
import { exec } from 'child_process';

const icons = {
    green: "iVBORw0KGgoAAAANSUhEUgAAABgAAAAYCAYAAADgdz34AAABeElEQVR4nNWVTUsCURSGn1FTLMv8iCBCqIVgiwozg6B2LkLIRdGqXb+gtv6BoEW7fkHRvk37tklQgQuxDxIqAiOQSaRw2jTi6NzrjOmid+NccOee8z71z5t4L/12KlaTZ3K4mit0kDqUe0qDM2CrI0QtzWb4pwK65rK4N0K25qF6RBZu1FoyzP7XdGG/kDyhWX4QgvSfCHrQqE1qUjkVqAGSzH3ePsjQSBeBafQQgHVzAqYjnp/tZWsF6KIEDhY9vlezDCRoaoYFhVvwx6yuQA5IAnL9fUaqVyVXuAMj8vv8TIO6bJuIJA3BWvjQ8V/0zBFw+ab2rE6C5maexPWOx4iQdjHP8dtEdwOtwkwrMA7BTOCJXKTZiW2PLZCObZMJJKUD6iVKBOYacHupo5NWSIXarPgEQ9U4QG5zsDDA7rPQm3ldf+azXDLFC9Zla/cuQ1yzdz/JOtivTndzpbLdr3gboBaS13rTJ3ULM6oR/kV2IKL/vd3Lf9QPbVHy+SGKtPwAAAABJRU5ErkJggg==",
    orange: "iVBORw0KGgoAAAANSUhEUgAAABgAAAAYCAYAAADgdz34AAABb0lEQVR4nNWVu0oDQRSGv9nMYIyXIipI0CLEBESwVwQttE0KRTR2YuOz+AIi9lZaWgoWVlrYRBERSyFIIoqXEHfXIibksjPZjUnh3yyz55z/m5mzMwv/XcJP0tth1NXFhnYKRg9j0GTsF2R1w9yU7wkIam6qawF0aq6rF6ZgvWRilfDSQW38cbKAo7zVgqo90fagWSq5aRzrVAOYZi8GYoRiiwDY+UsA5NQ6WFJrXPXztQKV3ABh4ZYKlM53ARfRP4acWPa/ApNkMgvA98Mxzusj9tNF5X1q6++A0Pgc1nAcgPL9UcNTTq4gwqPmybUDyLpmRjJnTdNTyMQa5dx+ZwAhI8h4BoDP03RtawDU9DZ983uoVNYIMG5RKJ5GqEFwHZzn64aYnb+qGERnsEZm2wO8LiuVqjTXebnDLb83xJziDdhfv3mtza76+T7JQeV5ktvd7UHNWwDdgDTXeza5U4hXnfYrCgrR5ff8n9xz/QBoWnmcZlPRrQAAAABJRU5ErkJggg==",
    red: "iVBORw0KGgoAAAANSUhEUgAAABgAAAAYCAYAAADgdz34AAABd0lEQVR4nGNgGOqAkRhFz31s/uOSk9xyBK8ZeCXxGUysRUzUMByfeqwWkGo4Pn0YFpBrOC79jPgkkQGHnQuDQGk9nP8mJ57hz8N7OC2CxQnOOEAHnC6eqHxnTxwqUQHcAnyuZxYRZWA3MGFgYGBg+H3jCsQCRzcGBmZmnAbDzCPKB5xOngwMjEwM/z5/ZPjQ18LA8P8/A5OAEAO7iSXxPsBrATR4fhzYw/D3+VOGX5fPQ8W9KLeATVufgVlShoGBgYHh+77tUHoHAwMDAwOHiSUDE78AXv0shCxAjkzh/jloulkYOB3cGL5uXEWeBYwcHAwcNo4MDAwMDO+q8uBBw8DAwMDlFcDAl1nMwOnihdcCvEHEYe3IwMjJxcDw/x/D79s3UOR+37wGcaGCMgOrshphC7AVVrBI/PPoAcP/H99RLXhwl+H/r58o6pABzDyiczKpAGtOJlS2k2o4hgXUsARdP9ZIJtcSbPpwpiJSLcGlnuZ1Ms0BACz7fKgOODSPAAAAAElFTkSuQmCC",
    gray: "iVBORw0KGgoAAAANSUhEUgAAABgAAAAYCAYAAADgdz34AAABgklEQVR4nNWVO08CQRSFv91AUCIQNfhAeexGEBNLbTSxM/oHbPQn+Hts7DVqpQ2V22pthzGRUJC4hKehkAiuBYGwwMwuKIWnmUzOvefM3Ht3Fv47FDdB55dXlog7Oz2RakhJmbBbI/UvxGXxQw1GFZflDRiMKy7KV2RkLxKxGAd7u939dTpNuVoTGnU6IuxBP1K6bt9ruiDSjq6B7PQzfj9ry0sAvBeLACS1OKoiHsKOnqsbbGgaiqLw2WhgPD4B4J+aIroadn8DGVK6BsBrLketXidvmgBs6s5lcjRYWQwxGwgAkHnLttdse42Fw0z7fNJ8j5NBbzOPjw7tp1NVklqc58zLeAZej4f1aASAe8Mgbxa63FYiwf7ONildlxpIS6RHI3i9XizLolAq2ziz1J6mhWCQ0Pycs8Gwx6rTxErtg69m08aVKlWarRYw+I306klLdPdgCLlvy+Li5laWDvSVyOltd4tenYEe/NakP39ok8c1GZYnnKJRTURxE/8nTxw/1f18Vbgb3EQAAAAASUVORK5CYII=",
    purple: "iVBORw0KGgoAAAANSUhEUgAAABgAAAAYCAYAAADgdz34AAABi0lEQVR4nNWVyy8DURjFf9OWFlFRr+pD0qiGiKRWpJU2EisrWzuR2Nn7A/Av2NjYWVmWxEqERZcSIVFEvBqvKm0EVWPBNJ3q3I6WhbOZzJzvnHPv993cgf8OSU/R4viqrMVNLY8KPYSkyFhvkOE3zEX1RQN+ai7SfQso11xLL4nIfHQG2hme9ufeV2a2uD9LaQYpM9GcQSF8IVfBu1OXLhcgWn2dzYKjrwmA61gSAO+QA4NR+xAqfrp20BVyIkkSL+kMGws7IENNgxm3v0X/DkTwhT/bc7h9yePVE/H9O9X3igLs3Y1Y22oBiG1eAHDw9XT3t2KxVgv1plIB+cMdmw+oV2eU8AYd7K6dlBdgMhvxDNoBiMxFie8lclzPSAfByV58YZcwQNgiz4CdKosJWZa5PX5QcTdHSQBsHfU0e6ylA4pdVsoQk+dpMs9ZFZc4TfH2mlXV5UPxE7YoMhvV5N6zMksT6yI5UNCiUne7XuT7fJtBpSGF+qJDLjekmE7zFP00RKv+z//Jf44PtpF+IASlhQEAAAAASUVORK5CYII="
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
    
    let fillChar = '🟩';
    if (pct < 20) fillChar = '🟥';
    else if (pct < 50) fillChar = '🟧';
    else if (pct < 75) fillChar = '🟨';
    
    const emptyChar = '⬜'; // or ⬛
    
    const bar = fillChar.repeat(filledBlocks) + emptyChar.repeat(emptyBlocks);
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
