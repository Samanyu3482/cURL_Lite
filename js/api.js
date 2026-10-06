let currentController = null;
function abortCurrentRequest() {
    if(currentController) {
        currentController.abort();
        currentController = null;
    }
}



async function generateRequestFromPrompt(promptText, apiKey) {
    const endpoint = "https://inference.asicloud.cudos.org/v1/chat/completions";

    const systemInstruction = `You are an HTTP request builder assistant. Convert user prompts into HTTP request configurations.
        Return ONLY a raw valid JSON object with NO markdown formatting, NO backticks, and NO extra text.
        The JSON must strictly match this structure:
        {
        "method": "GET" | "POST" | "PUT" | "DELETE",
        "url": "full valid URL string",
        "headers": { "Content-Type": "application/json" },
        "body": "JSON string for payload or empty string"
        }`;

    const payload = {
        model: "asi1-mini",
        messages: [
            { role: "system", content: systemInstruction },
            { role: "user", content: `User Prompt: ${promptText}` }
        ]
    };

    const response = await fetch(endpoint, {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${apiKey}`
        },
        body: JSON.stringify(payload)
    });

    if (!response.ok) {
        throw new Error(`ASI Cloud Error (${response.status}) - Check your API key`);
    }

    const data = await response.json();
    let textResult = data.choices[0].message.content.trim();

    
    textResult = textResult.replace(/^```json\s*/i, "").replace(/^```\s*/i, "").replace(/```$/, "").trim();

    return JSON.parse(textResult);
}




async function generateCollectionFromPrompt(promptText, apiKey) {
    const endpoint = "https://inference.asicloud.cudos.org/v1/chat/completions";

    const systemInstruction = `You are a collection generator assistant. Convert user prompts into collections of HTTP request configurations.
    Return ONLY a raw valid JSON object with NO markdown formatting, NO backticks, and NO extra text.
    The JSON must strictly match this structure:
    {
    "name": "collection name",
    "requests": [
        {
        "method": "GET" | "POST" | "PUT" | "DELETE",
        "url": "full valid URL string",
        "headers": { "Content-Type": "application/json" },
        "body": "JSON string for payload or empty string"
        }
    ]
    }`;

    const payload = {
        model: "asi1-mini",
        messages: [
            { role: "system", content: systemInstruction },
            { role: "user", content: `User Prompt: ${promptText}` }
        ]
    };

    const response = await fetch(endpoint, {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${apiKey}`
        },
        body: JSON.stringify(payload)
    });

    if (!response.ok) {
        throw new Error(`ASI Cloud Error (${response.status}) - Check your API key`);
    }

    const data = await response.json();
    let textResult = data.choices[0].message.content.trim();


    textResult = textResult.replace(/^```json\s*/i, "").replace(/^```\s*/i, "").replace(/```$/, "").trim();

    return JSON.parse(textResult);
}


async function sendRequest(config) {
    try {
        if(currentController) {
            currentController.abort();
        }
        currentController = new AbortController();
        
        const fetchOptions = {
            method : config.method,
            headers : config.headers,
            signal : currentController.signal
        };
        if(config.method !== "GET" && config.method !== "DELETE" && config.body) {
            fetchOptions.body = config.body;
        }

        const timeoutMs = Number(config.timeout) || 5000;
        const timeoutId = setTimeout(() => {
            if(currentController) {
                currentController.abort();
                
            }
        }, timeoutMs);

        const startTime = performance.now();
        const response = await fetch(config.url, fetchOptions);
        const endTime = performance.now();

        clearTimeout(timeoutId);
        

        const duration = Math.round(endTime - startTime);
        const headerObj = Object.fromEntries(response.headers.entries());

        const data = await response.json();
        if(!response.ok) {
            updateLifecycleStatus("rejected");
            return {
                ok : false,
                status : response.status,
                statusText : response.statusText,
                data : data,
                duration : duration,
                headers : headerObj
                
                
            }
            
        } else {
            updateLifecycleStatus("fulfilled");
            return {
                ok : true,
                status : response.status,
                statusText : response.statusText,
                data : data,
                duration : duration,
                headers : headerObj
            }
        }
    } catch (error) {
        updateLifecycleStatus("rejected");
        if(error.name === "AbortError") {
            return {
                ok : false,
                status : 0,
                statusText : "Aborted",
                error : "Request was cancelled by user or timed out",
                duration : 0,
                headers : {}
            }
        }
        return {
            ok : false,
            status : 0,
            statusText : "Network Error",
            error : error.message,
            duration : 0,
            headers : {}
        }
    }
}