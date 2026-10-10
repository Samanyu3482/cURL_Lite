const formElement = document.getElementById("request-form");
formElement.addEventListener("submit", handleSubmit);

const abortBtn = document.getElementById("btn-abort");
abortBtn.addEventListener("click", abortCurrentRequest);

const clearHistoryBtn = document.getElementById("btn-clear-history");
clearHistoryBtn.addEventListener("click", () => {
    clearHistoryData();
    renderHistoryList([]);
});




function getFormData() {
    return {
        method : document.getElementById("method-select").value,
        url : document.getElementById("url-input").value,
        headers : getRequestHeaders(),
        body : document.getElementById("body-input").value.trim(),
        timeout : document.getElementById("timeout-input").value
    }
}

function setupDraftAutoSave() {
    const form = document.getElementById("request-form");
    form.addEventListener("input", () => {
        const currDraft = getFormData();
        saveDraft(currDraft);
    })

    form.addEventListener("change", () => {
        const currDraft = getFormData();
        saveDraft(currDraft);
    })

}

function setupCookiePreferences() {
    const timeoutInput = document.getElementById("timeout-input");
    
    timeoutInput.addEventListener("change", () => {
        const timeoutValue = timeoutInput.value;
        if (timeoutValue) {
            setCookie("curl_lite_timeout", timeoutValue, 30); 
        }
    });
}
function loadCookiePreferences() {
    const savedTimeout = getCookie("curl_lite_timeout");
    if (savedTimeout) {
        document.getElementById("timeout-input").value = savedTimeout;
    }
}

const historyListContainer = document.getElementById("history-list");
historyListContainer.addEventListener("click", (event) => {
    const historyCard = event.target.closest(".history-card");
    if (historyCard) {
        const historyId = historyCard.dataset.id;
        const historyItem = loadHistory().find(item => item.id == historyId);
        if (historyItem) {
            populateForm(historyItem);
        }
    }
});


function getRequestHeaders() {
    const headers = {};
    const rows = document.querySelectorAll(".header-row");
    
    for(const row of rows) {
        const keyInput = row.querySelector(".header-key");
        const valueInput = row.querySelector(".header-val");
        const key = keyInput.value.trim();
        const value = valueInput.value.trim();
        if(key) {
            headers[key] = value;
        }
    }
    return headers;
}

async function handleSubmit(event) {
    event.preventDefault(); // to prevent page reload
    console.log("Form submitted");
    const formMethod = document.getElementById("method-select").value;
    const formUrl = document.getElementById("url-input").value;
    const headers = getRequestHeaders();
    const body = document.getElementById("body-input");
    const formBody = body.value.trim();
    const timeoutValue = document.getElementById("timeout-input").value;

    const requestConfig = {
        method: formMethod,
        url: formUrl,
        headers : headers,
        body : formBody,
        timeout : timeoutValue
    };

    console.log(requestConfig);
    console.log("--- Generated Fetch Code ---");
    console.log(generateFetchCode(requestConfig));
    updateLifecycleStatus("pending");
    toggleLoadingState(true);
    let response;
    try {
        response = await sendRequest(requestConfig);
    }
    catch(error) {
        updateLifecycleStatus("rejected");
        console.log(error);
    }
    finally {
        toggleLoadingState(false);
    }

    const historyItem = {
        id : Date.now(),
        method : requestConfig.method,
        url : requestConfig.url,
        status : response.status,
        statusText : response.statusText,
        duration : response.duration,
        body : requestConfig.body,
        time : new Date().toLocaleTimeString([], {
            hour : '2-digit', minute: "2-digit"
        }),
        headers : requestConfig.headers
    }
    saveHistory(historyItem);
    renderHistoryList(loadHistory());

    console.log(response);
    renderResponse(response);
    clearDraft();
}


function restoreDraft() {
    const urlParams = new URLSearchParams(window.location.search);
    const paramUrl = urlParams.get("url");
    const paramMethod = urlParams.get("method");

    if (paramUrl) {
        populateForm({
            url: paramUrl,
            method: paramMethod || "GET",
            headers: { "Content-Type": "application/json" },
            body: urlParams.get("body") || ""
        });
        return;
    }

    const draft = loadDraft();
    if (draft && !Array.isArray(draft) && Object.keys(draft).length > 0) {
        populateForm(draft);
    }
}

async function setupAIAssistant() {
    const keyInput = document.getElementById("ai-key-input");
    const promptInput = document.getElementById("ai-prompt-input");
    const aiBtn = document.getElementById("btn-ai-generate");
    const aiPromptBar = document.querySelector(".ai-prompt-bar");

    if (keyInput) {
        keyInput.value = loadAIKey();
        keyInput.addEventListener("change", (e) => {
            saveAIKey(keyInput.value.trim());
        });
        if (!aiBtn) return;
        aiBtn.addEventListener("click", async () => {
            const apiKey = keyInput.value.trim();
            const promptText = promptInput.value.trim();
            if (!apiKey) {
                alert("Please enter your ASI API Key first.");
                return;
            }
            if (!promptText) {
                alert("Please enter a prompt (e.g., 'Fetch products under $100 from dummyjson').");
                return;
            }
            try {
                aiBtn.disabled = true;
                aiBtn.textContent = "✨ Thinking...";
                if (aiPromptBar) aiPromptBar.classList.add("ai-generating");

                const config = await generateRequestFromPrompt(promptText, apiKey);
                populateForm(config);
                saveDraft(getFormData());
            } 
            catch (e) {
                alert(`AI Generation Failed: ${e.message}`);
                console.log(e);
            } 
            finally {
                aiBtn.disabled = false;
                aiBtn.textContent = "✨ Generate";
                if (aiPromptBar) aiPromptBar.classList.remove("ai-generating");
            }
        });
    }
}
loadCookiePreferences();
restoreDraft();
setupDraftAutoSave();
setupCookiePreferences();
setupHeadersEditor();
setupAIAssistant();
renderHistoryList(loadHistory());
