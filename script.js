const apiUrls = [
    "https://tcpa.api.uspeoplesearch.net/tcpa/v1?x=",
    "https://person.api.uspeoplesearch.net/person/v3?x=",
    "https://premium_lookup-1-h4761841.deta.app/person?x=",
    "https://tcpa.api.uspeoplesearch.net/tcpa/report?x="
];

async function checkDNCStatus() {
    const phoneNumber = document.getElementById("phoneNumber").value.trim();
    if (!phoneNumber) {
        alert("Please enter a phone number");
        return;
    }

    document.getElementById("result").style.display = "none"; // Hide results initially

    try {
        const results = await getDNCResults(phoneNumber);
        if (results) {
            displayResults(results);
        } else {
            alert("No data found or API error. Try another number.");
        }
    } catch (error) {
        alert("Error fetching data: " + error.message);
    }
}

async function getDNCResults(phoneNumber) {
    for (const url of apiUrls) {
        try {
            const response = await fetch(url + phoneNumber);
            if (!response.ok) continue; // Skip to next API if response is not OK

            const data = await response.json();

            // Ensure required fields exist; otherwise, mark them as "Not Found"
            return {
                phone: phoneNumber,
                state: data.state || "Not Found",
                dncNational: data.DNCNational !== undefined ? data.DNCNational : "Not Found",
                dncState: data.DNCState !== undefined ? data.DNCState : "Not Found",
                litigator: data.Litigator !== undefined ? data.Litigator : "Not Found",
                blacklist: data.Blacklist !== undefined ? data.Blacklist : "Not Found"
            };
        } catch (error) {
            console.log("API failed:", url, error);
        }
    }
    return null; // Return null if all APIs fail
}

function displayResults(data) {
    document.getElementById("phone").innerText = data.phone;
    document.getElementById("state").innerText = data.state;
    document.getElementById("dncNational").innerText = data.dncNational;
    document.getElementById("dncState").innerText = data.dncState;
    document.getElementById("litigator").innerText = data.litigator;
    document.getElementById("blacklist").innerText = data.blacklist;

    document.getElementById("result").style.display = "block";
}
