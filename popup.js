chrome.storage.sync.get("keybindings", ({ keybindings }) => {
  fullKeyDetails = keybindings || {};
  const keys = Object.keys(fullKeyDetails);
  for(const key of keys){
    fullKeyDetails[key] = fullKeyDetails[key].eventDetails
  }
});
document.addEventListener("keydown", (e) => {
  console.log("key tessss")
  const activeInput = document.activeElement;
  if (activeInput.classList.contains("toKey")) {
    e.preventDefault();
    activeInput.value = e.key; // Show just the key
    fullKeyDetails[e.key] = {
      key: e.key,
      code: e.code,
      keyCode: e.keyCode,
      which: e.which,
      ctrlKey: e.ctrlKey,
      shiftKey: e.shiftKey,
      altKey: e.altKey,
      metaKey: e.metaKey,
      location: e.location
    };
  }
});



document.addEventListener("DOMContentLoaded", () => {
  const form = document.getElementById("keybindingsForm");
  const mappingsDiv = document.getElementById("mappings");
  const addBtn = document.getElementById("add");

  function createMappingRow(from = "", to = "") {
    const row = document.createElement("div");
    row.className = "mapping-row";
row.innerHTML = `
  <input type="text" class="fromKey" readonly value="${from.from}" placeholder="From key"/>
    <span>TO</span>
    <input type="text" class="toKey" readonly value="${to}" placeholder="To key"/>
     <button type="button" class="deleteMapping">X</button>
`;
row.querySelector(".deleteMapping").addEventListener("click", () => {
  deleteMapping(from);
  row.remove();
});
    mappingsDiv.appendChild(row);

    row.querySelectorAll("input").forEach(input => {
      input.addEventListener("click", () => {
        input.value = "";
        const handler = (e) => {
          input.value = e.key;
          document.removeEventListener("keydown", handler);
        };
        document.addEventListener("keydown", handler);
      });
    });
  }

  chrome.storage.sync.get("keybindings", ({ keybindings }) => {
    if (keybindings) {
      for (const toKey in keybindings) {
        createMappingRow(keybindings[toKey], toKey);
      }
    } else {
      createMappingRow();
    }
  });

  addBtn.addEventListener("click", () => createMappingRow());

  function deleteMapping(fromKey) {
  chrome.storage.sync.get("keyMappings", (data) => {
    const mappings = data.keyMappings || {};
    delete mappings[fromKey];
    chrome.storage.sync.set({ keyMappings: mappings }, () => {
      console.log(`Mapping for '${fromKey}' deleted.`);
    });
  });
}



form.addEventListener("submit", (e) => {
  e.preventDefault();
  const fromKeys = form.querySelectorAll(".fromKey");
  const toKeys = form.querySelectorAll(".toKey");
  const bindings = {};

  for (let i = 0; i < fromKeys.length; i++) {
    const from = fromKeys[i].value.toLowerCase();
    const to = toKeys[i].value;
    if (from && to && fullKeyDetails[to]) {
      bindings[to] = {
        from,
        eventDetails: fullKeyDetails[to]
      };
    }
  }
    chrome.storage.sync.set({ keybindings: bindings }, () => {
      chrome.tabs.query({ url: "*://www.youtube.com/*" }, (tabs) => {
        for (let tab of tabs) {
          chrome.tabs.sendMessage(tab.id, {
            type: "UPDATE_KEYBINDINGS",
             action: "reloadMappings",
            payload: bindings,
          });
        }

      });
      showSaveMessage(); // Show the message

    });
  });
});


function showSaveMessage() {
  const msg = document.getElementById("saveMessage");
  msg.style.display = "block";
  setTimeout(() => {
    msg.style.display = "none";
  }, 2000); // 2 seconds
}
