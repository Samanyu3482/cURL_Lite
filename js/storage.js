const STORAGE_KEY = "curl-lite-history";
const DRAFT_KEY = "curl-lite-draft";
const AI_KEY_STORAGE = "curl-lite-ai-key";

function saveAIKey(key) {
    localStorage.setItem(AI_KEY_STORAGE, key);
}

function loadAIKey() {
    return localStorage.getItem(AI_KEY_STORAGE) || "";
}

function clearAIKey() {
    localStorage.removeItem(AI_KEY_STORAGE);
}



function setCookie(name, value, days = 30) {
    const date = new Date();
    date.setTime(date.getTime() + (days * 24 * 60 * 60 * 1000));
    const expires = "expires=" + date.toUTCString();
    document.cookie = `${name}=${encodeURIComponent(value)}; ${expires}; path=/; SameSite=Lax`;
}

function getCookie(name) {
    const nameEQ = name + "=";
    const ca = document.cookie.split(';');
    for(let i = 0; i < ca.length; i++) {
        let c = ca[i].trim();
        if(c.indexOf(nameEQ) === 0) {
            return decodeURIComponent(c.substring(nameEQ.length, c.length));
        }
    }
    return null;
}

function deleteCookie(name) {
    document.cookie = `${name}=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;`;
}



function saveDraft(draftObj) {
    sessionStorage.setItem(DRAFT_KEY, JSON.stringify(draftObj));
}
function loadDraft() {
    const raw = sessionStorage.getItem(DRAFT_KEY);
    if(!raw) {
        return null;
    }
    return JSON.parse(raw);
}

function clearDraft() {
    sessionStorage.removeItem(DRAFT_KEY);
}

function loadHistory() {
    const raw = localStorage.getItem(STORAGE_KEY);
    if(!raw) return [];
    
    return JSON.parse(raw);
}

function saveHistory(item) {
    const history = loadHistory();
    history.unshift(item);
    if(history.length > 20) {
        history.pop();
    }
    localStorage.setItem(STORAGE_KEY, JSON.stringify(history));
}

function clearHistoryData() {
    localStorage.removeItem(STORAGE_KEY);
}
