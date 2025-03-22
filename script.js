const currentRaceEl = document.getElementById("current-race");
const upcomingRaceEl = document.getElementById("upcoming-race");
const raceEventsEl = document.getElementById("race-events");

const API_URL_LATEST_MEETING = "https://api.openf1.org/v1/meetings?meeting_key=latest";

// 🏎️ **Fetch Race Data**
async function fetchRaceData() {
    try {
        console.log("Fetching race data...");

        const response = await fetch(API_URL_LATEST_MEETING);
        const data = await response.json();

        window.latestRaceData = data; // Debugging: store it in global scope
        console.log("Latest Meeting Data:", data);

        if (!data || data.length === 0) {
            currentRaceEl.innerHTML = "<p>No current race available.</p>";
            upcomingRaceEl.innerHTML = "<p>No upcoming race found.</p>";
            return;
        }

        const latestMeeting = data[0]; // Latest race weekend
        const raceDate = latestMeeting.date_start ? new Date(latestMeeting.date_start) : "Unknown Date";
        const gmtOffset = latestMeeting.gmt_offset || "N/A";

        // 🏁 Display Current Race Info
        currentRaceEl.innerHTML = `
            <h2>Current Race</h2>
            <p><strong>${latestMeeting.meeting_name || "Unknown Race"}</strong></p>
            <p>📍 ${latestMeeting.location || "Unknown Location"}, ${latestMeeting.country_name || "Unknown Country"}</p>
            <p>🏁 Circuit: ${latestMeeting.circuit_short_name || "Unknown Circuit"}</p>
            <p>📅 Start Time: ${raceDate !== "Unknown Date" ? raceDate.toLocaleString() : "Unknown"} (GMT ${gmtOffset})</p>
        `;

        // 🕒 Calculate Countdown for Next Race Session
        const nextRaceDate = new Date(latestMeeting.date_start);
        const countdown = calculateCountdown(nextRaceDate);
        upcomingRaceEl.innerHTML = `
            <h2>Next Race Countdown</h2>
            <p>Time until next race: <strong>${countdown}</strong></p>
        `;

        // 🏎️ **List All Race Weekend Events**
        const eventSessions = latestMeeting.sessions || [];
        raceEventsEl.innerHTML = `
            <h3>Race Weekend Events</h3>
            <ul>
                ${eventSessions.map(session => `
                    <li>${session.session_name} - ${new Date(session.date_start).toLocaleString()}</li>
                `).join('')}
            </ul>
        `;
    } catch (error) {
        console.error("Error fetching race data:", error
