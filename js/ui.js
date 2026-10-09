function generateFetchCode(config) {
    const fetchOptions = {
        method: config.method,
        headers: config.headers
    };
    if (config.method != "GET" && config.method != "DELETE" && config.body) {
        fetchOptions.body = config.body;
    }

    return `fetch("${config.url}", ${JSON.stringify(fetchOptions, null, 2)})
    .then(response => {
        response.json()
    })
    .then(data => {
        console.log(data);
    })
    .catch(error => {
        console.log(error);
    })`
}




function toggleLoadingState(isLoading) {
    const sendBtn = document.getElementById("btn-send");
    if (isLoading) {
        sendBtn.disabled = true;
        sendBtn.setAttribute("aria-busy", "true");
        sendBtn.innerHTML = `<span aria-hidden="true">⏳</span> Sending...`;
    }
    else {
        sendBtn.disabled = false;
        sendBtn.setAttribute("aria-busy", "false");
        sendBtn.innerHTML = `<span aria-hidden="true">➤</span> Send`;
    }
}





function populateForm(item) {
    if(!item) return;

    if(item.method) {
        document.getElementById("method-select").value = item.method;
    }
    if(item.url) {
        document.getElementById("url-input").value = item.url;
    }
    if(item.body) {
        document.getElementById("body-input").value = item.body;
    }
    if(item.timeout) {
        document.getElementById("timeout-input").value = item.timeout;
    }
    if(item.headers) {
        const headerList = document.getElementById("headers-list");
        headerList.innerHTML = "";
        Object.entries(item.headers).forEach(([key, value]) => {
            const headerRow = createHeaderRow();
            headerRow.querySelector(".header-key").value = key;
            headerRow.querySelector(".header-val").value = value;
            headerList.appendChild(headerRow);
        });
    }

}



function renderHistoryList(historyArray) {
    const historyContainer = document.getElementById("history-list");
    const historyCount = document.getElementById("history-count");
    historyCount.textContent = historyArray.length;
    historyContainer.innerHTML = "";

    if (historyArray.length === 0) {
        historyContainer.innerHTML = `<p class="empty-state">No request history yet</p>`;
    } else {
        for (const item of historyArray) {
            const historyItem = document.createElement("article");
            historyItem.classList.add("history-card");
            historyItem.setAttribute("tabindex", "0");
            historyItem.dataset.id = item.id;
            historyItem.innerHTML = `
                <div class="history-card-top">
                    <span class="method-tag ${item.method.toLowerCase()}">${item.method}</span>
                    <time class="history-time">${item.time}</time>
                </div>
                <div class="history-url">${item.url}</div>
                <div class="history-card-bottom">
                    <span>Status: ${item.status} ${item.statusText}</span>
                    <span>${item.duration} ms</span>
                </div>
            `;

            historyContainer.appendChild(historyItem);
        }
    }
}



function updateLifecycleStatus(state) {
    const statusPending = document.getElementById("stage-pending");
    const statusFulfilled = document.getElementById("stage-fulfilled");
    const statusRejected = document.getElementById("stage-rejected");
    statusFulfilled.classList.remove("state-fulfilled");
    statusPending.classList.remove("state-pending");
    statusRejected.classList.remove("state-rejected");

    switch (state) {
        case "pending":
            statusPending.classList.add("state-pending");
            break;
        case "fulfilled":
            statusFulfilled.classList.add("state-fulfilled");
            break;
        case "rejected":
            statusRejected.classList.add("state-rejected");
            break;
    }
}

function createHeaderRow() {
    const newDiv = document.createElement("div");
    newDiv.classList.add("header-row");
    const inputKey = document.createElement("input");
    inputKey.setAttribute("type", "text");
    inputKey.placeholder = "Key (e.g. Authorization)";
    inputKey.classList.add("header-input");
    inputKey.classList.add("header-key");
    const inputValue = document.createElement("input");
    inputValue.setAttribute("type", "text");
    inputValue.placeholder = "Value (e.g. Bearer token)";
    inputValue.classList.add("header-input");
    inputValue.classList.add("header-val");
    const deleteBtn = document.createElement("button");
    deleteBtn.textContent = "x";
    deleteBtn.classList.add("btn-remove-header");
    deleteBtn.setAttribute("type", "button");
    deleteBtn.setAttribute("title", "Remove Header row");
    newDiv.appendChild(inputKey);
    newDiv.appendChild(inputValue);
    newDiv.appendChild(deleteBtn);
    return newDiv;
}
function setupHeadersEditor() {
    const addHeaderBtn = document.getElementById("btn-add-header");
    const headerList = document.getElementById("headers-list");


    addHeaderBtn.addEventListener("click", () => {
        const newHeaderRow = createHeaderRow();
        headerList.appendChild(newHeaderRow);
    });


    headerList.addEventListener("click", (event) => {
        if (event.target && event.target.classList.contains("btn-remove-header")) {
            const headerRow = event.target.closest(".header-row");
            if (headerRow) {
                headerRow.remove();
            }
        }
    });
}


function renderResponse(result) {
    const statusBadge = document.getElementById("response-status");
    statusBadge.textContent = `${result.status} : ${result.statusText}`;
    if (result.ok === true) {
        statusBadge.classList.remove("status-error");
        statusBadge.classList.add("status-success");
    }
    else {
        statusBadge.classList.remove("status-success");
        statusBadge.classList.add("status-error");
    }
    const statusMsg = result.statusText || (result.ok ? "OK" : "Error");
    statusBadge.textContent = `${result.status} ${statusMsg}`;
    const responseBody = document.getElementById("response-body");
    if (result.data) {
        responseBody.textContent = JSON.stringify(result.data, null, 2);
    } else {
        responseBody.textContent = JSON.stringify(result.error || "No Data Returned From the API", null, 2)
    }
    const responseTime = document.getElementById("response-time");
    responseTime.textContent = `${result.duration} ms`;
    const lifecycleLatency = document.getElementById("lifecycle-latency");
    lifecycleLatency.textContent = `Latency : ${result.duration} ms`;
    const responseHeaders = document.getElementById("response-headers");
    responseHeaders.textContent = "";
    Object.entries(result.headers).forEach(([key, value]) => {
        const headerElement = document.createElement("div");
        headerElement.textContent = `${key}: ${value}`;
        responseHeaders.appendChild(headerElement);
    });

}       