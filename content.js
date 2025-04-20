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
  console.log("keys isss ,",e);
  console.log("action key iss, ",keyMap)
  const newKey = e.key.toLowerCase();
  let actionKey = Object.keys(keyMap).find(
    (targetKey) => keyMap[targetKey]?.from === newKey
  );
   actionKey = keyMap[actionKey];
  console.log("actionssss key is ",actionKey);
  if (actionKey) {
    e.preventDefault();
    simulateRealKeyPress(actionKey);
  }
});

function simulateRealKeyPress(key) {
  console.log("key isss ",key)
  key = key.eventDetails
  // const specialKeyCodes = {
  //   "ArrowLeft": 37,
  //   "ArrowUp": 38,
  //   "ArrowRight": 39,
  //   "ArrowDown": 40,
  //   " ": 32,
  //   "Enter": 13,
  //   "Escape": 27,
  //   // Add more if needed
  // };
  console.log("key presssssssssssss isss",key)
  const event = new KeyboardEvent("keydown", {
    key: key.key,
    code: key.code,
    keyCode: key.keyCode,
    which: key.which,
    bubbles: true,
    cancelable: true
  });
  console.log("key event isss",event);

  (document.activeElement || document.body).dispatchEvent(event);
}