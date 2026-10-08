const DB_NAME = "cURL_Lite_DB";
const DB_VERSION = 1;
const DB_STORE_NAME = "collections";

function openDB() {
    return new Promise((resolve, reject) => {
        const request = indexedDB.open(DB_NAME, DB_VERSION);

        request.onupgradeneeded = function(event) {
            const db = event.target.result;
            if(!db.objectStoreNames.contains(DB_STORE_NAME)) {
                db.createObjectStore(DB_STORE_NAME, { keyPath: "id", autoIncrement: true })
            }
        };

        request.onsuccess = function(event) {
            resolve(event.target.result);
        };

        request.onerror = function(event) {
            reject(event.target.error);
        };
    })

}

async function saveCollectionToDB(collection) {
    const db = await openDB();
    return new Promise((resolve, reject) => {
        const transaction = db.transaction(DB_STORE_NAME, "readwrite");
        const store = transaction.objectStore(DB_STORE_NAME);
        const request = store.put(collection);

        request.onsuccess = function() {
            resolve(request.result);
        };

        request.onerror = function() {
            reject(request.error);
        };
    });
}

async function getAllCollections() {
    const db = await openDB();
    return new Promise((resolve, reject) => {
        const transaction = db.transaction(DB_STORE_NAME, "readonly");
        const store = transaction.objectStore(DB_STORE_NAME);
        const request = store.getAll();

        request.onsuccess = function() {
            resolve(request.result);
        };

        request.onerror = function() {
            reject(request.error);
        };
    });
}

async function getCollectionById(id) {
    const db = await openDB();
    return new Promise((resolve, reject) => {
        const transaction = db.transaction(DB_STORE_NAME, "readonly");
        const store = transaction.objectStore(DB_STORE_NAME);
        const request = store.get(id);

        request.onsuccess = function() {
            resolve(request.result);
        };

        request.onerror = function() {
            reject(request.error);
        };
    });
}

async function updateCollection(collection) {
    const db = await openDB();
    return new Promise((resolve, reject) => {
        const transaction = db.transaction(DB_STORE_NAME, "readwrite");
        const store = transaction.objectStore(DB_STORE_NAME);
        const request = store.put(collection);

        request.onsuccess = function() {
            resolve(request.result);
        };

        request.onerror = function() {
            reject(request.error);
        };
    });
}

async function deleteCollection(id) {
    const db = await openDB();
    return new Promise((resolve, reject) => {
        const transaction = db.transaction(DB_STORE_NAME, "readwrite");
        const store = transaction.objectStore(DB_STORE_NAME);
        const request = store.delete(id);

        request.onsuccess = function() {
            resolve(request.result);
        };

        request.onerror = function() {
            reject(request.error);
        };
    }); 
}

async function getAllCollectionsFromDB() {
    const db = await openDB();
    return new Promise((resolve, reject) => {
        const transaction = db.transaction(DB_STORE_NAME, "readonly");
        const store = transaction.objectStore(DB_STORE_NAME);
        const request = store.getAll();

        request.onsuccess = function() {
            resolve(request.result);
        };

        request.onerror = function() {
            reject(request.error);
        };
    });
}


async function deleteCollectionFromDB(id) {
    const db = await openDB();
    return new Promise((resolve, reject) => {
        const transaction = db.transaction(DB_STORE_NAME, "readwrite");
        const store = transaction.objectStore(DB_STORE_NAME);
        const request = store.delete(id);

        request.onsuccess = function() {
            resolve(request.result);
        };

        request.onerror = function() {
            reject(request.error);
        };
    });
}