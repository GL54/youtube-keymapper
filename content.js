let keyMap = {};

chrome.storage.sync.get("keybindings", ({ keybindings }) => {
  keyMap = keybindings || {};
});

chrome.runtime.onMessage.addListener((msg, sender, sendResponse) => {
  if (msg.type === "UPDATE_KEYBINDINGS") {
    keyMap = msg.payload || {};
  }
  if (message.action === "reloadMappings") {
    loadMappings(); // your function to refresh keybindings from storage
  }
});

document.addEventListener("keydown", (e) => {
  const newKey = e.key.toLowerCase();
  const actionKey = Object.keys(keyMap).find(
    (targetKey) => keyMap[targetKey]?.toLowerCase() === newKey
  );

  if (actionKey) {
    e.preventDefault();
    simulateRealKeyPress(actionKey);
  }
});

function simulateRealKeyPress(key) {
  const specialKeyCodes = {
    "ArrowLeft": 37,
    "ArrowUp": 38,
    "ArrowRight": 39,
    "ArrowDown": 40,
    " ": 32,
    "Enter": 13,
    "Escape": 27,
    // Add more if needed
  };

  const keyCode = specialKeyCodes[key] || key.charCodeAt(0);
  console.log("key press isss",key.charCodeAt)
  const event = new KeyboardEvent("keydown", {
    key: key,
    code: key,
    keyCode: keyCode,
    which: keyCode,
    bubbles: true,
    cancelable: true
  });

  (document.activeElement || document.body).dispatchEvent(event);
}