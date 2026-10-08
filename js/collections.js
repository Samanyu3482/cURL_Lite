document.addEventListener("DOMContentLoaded", async () => {
    await loadCollectionsFromDB();
    setupModal();
    setUpAIAssistantForCollections();

});


async function loadCollectionsFromDB() {
    const collections = await getAllCollectionsFromDB();

    const container = document.getElementById("collections-container");
    const badge = document.getElementById("collections-badge-count");

    badge.textContent = `${collections.length} Collections`;
    container.innerHTML = "";

    if (collections.length === 0) {
        container.innerHTML = `
            <div class="empty-state-box">
                <span style="font-size: 2rem;">📂</span>
                <p>No collections saved in IndexedDB yet.</p>
                <small>Use the AI generator above or click "+ Create Collection" to start.</small>
            </div>`;
        return;
    }

    for (const col of collections) {
        const card = document.createElement("div");
        card.className = "collection-card";

        const items = col.requests || col.endpoints || [];

        const endpointsHTML = items.map(req => `
            <div class="endpoint-item">
                <span class="method-tag ${req.method.toLowerCase()}">${req.method}</span>
                <span class="endpoint-url" title="${req.url}">${req.url}</span>
                <a href="playground.html?url=${encodeURIComponent(req.url)}&method=${req.method}" class="btn-run-endpoint">
                    ▶ Run
                </a>
            </div>
        `).join("");

        card.innerHTML = `
            <div class="collection-card-header">
                <div>
                    <div class="collection-title">${col.name}</div>
                    <div class="collection-desc">${items.length} Endpoints</div>
                </div>
                <button class="btn-remove-header btn-delete-col" data-id="${col.id}" title="Delete collection">✕</button>
            </div>
            <div class="endpoint-list">${endpointsHTML}</div>
        `;

        container.appendChild(card);
    }

    document.querySelectorAll(".btn-delete-col").forEach(btn => {
        btn.addEventListener("click", async (e) => {
            const id = Number(e.target.dataset.id);
            await deleteCollectionFromDB(id);
            await loadCollectionsFromDB();
        });
    });
}


function setupModal() {
    const modal = document.getElementById("collection-modal");
    const openBtn = document.getElementById("btn-create-collection");
    const closeBtn = document.getElementById("btn-close-modal");
    const cancelBtn = document.getElementById("btn-cancel-modal");
    const form = document.getElementById("create-collection-form");

    openBtn.addEventListener("click", () => modal.style.display = "flex");

    closeBtn.addEventListener("click", () => modal.style.display = "none");
    cancelBtn.addEventListener("click", () => modal.style.display = "none");

    form.addEventListener("submit", async (e) => {
        e.preventDefault();
        const name = document.getElementById("col-name-input").value.trim();
        const desc = document.getElementById("col-desc-input").value.trim();

        const newCollection = {
            name: name,
            description: desc,
            requests: []
        };

        await saveCollectionToDB(newCollection);
        form.reset();
        modal.style.display = "none";
        await loadCollectionsFromDB();
    });
}

function setUpAIAssistantForCollections() {
    const keyInput = document.getElementById("ai-key-input");
    const promptInput = document.getElementById("ai-collection-prompt");
    const aiBtn = document.getElementById("btn-ai-generate-collection");
    const aiPromptBar = document.querySelector(".ai-prompt-bar");

    if (keyInput) {
        keyInput.value = loadAIKey();
        keyInput.addEventListener("change", () => saveAIKey(keyInput.value.trim()));
    }

    aiBtn.addEventListener("click", async () => {
        const apiKey = keyInput.value.trim();
        const promptText = promptInput.value.trim();

        if (!apiKey) { alert("Please enter your ASI API Key first."); return; }
        if (!promptText) { alert("Please enter a prompt for the collection."); return; }

        try {
            aiBtn.disabled = true;
            aiBtn.textContent = "✨ Generating Collection...";
            if (aiPromptBar) aiPromptBar.classList.add("ai-generating");

            const collectionData = await generateCollectionFromPrompt(promptText, apiKey);

            await saveCollectionToDB(collectionData);

            await loadCollectionsFromDB();

            promptInput.value = "";
        } catch (e) {
            alert(`AI Collection Generation Failed: ${e.message}`);
            console.error(e);
        } finally {
            aiBtn.disabled = false;
            aiBtn.textContent = "✨ Generate Collection";
            if (aiPromptBar) aiPromptBar.classList.remove("ai-generating");
        }
    });
}

