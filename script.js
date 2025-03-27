const upcomingRaceEl = document.getElementById("upcoming-race");
const raceEventsEl = document.getElementById("race-events");

const API_URL_UPCOMING_MEETING = "https://api.openf1.org/v1/meetings?year=2024"; // Adjust year as needed

// 🏎️ **Fetch Upcoming Race Data**
async function fetchUpcomingRace() {
    try {
        console.log("Fetching upcoming race data...");

        const response = await fetch(API_URL_UPCOMING_MEETING);
        const data = await response.json();

        if (!data || data.length === 0) {
            upcomingRaceEl.innerHTML = "<p>No upcoming race found.</p>";
            return;
        }

        // Find the closest future race (next race)
        const now = new Date();
        const futureRaces = data.filter(race => new Date(race.date_start) > now);
        const nextRace = futureRaces.length > 0 ? futureRaces[0] : null;

        if (!nextRace) {
            upcomingRaceEl.innerHTML = "<p>No upcoming race found.</p>";
            return;
        }

        const raceDate = new Date(nextRace.date_start);
        const gmtOffset = nextRace.gmt_offset || "N/A";

        // 🕒 Calculate Countdown
        updateCountdown(raceDate);

        // 🏁 Display Upcoming Race Info
        upcomingRaceEl.innerHTML = `
            <h2>Next Race</h2>
            <p><strong>${nextRace.meeting_name || "Unknown Race"}</strong></p>
            <p>📍 ${nextRace.location || "Unknown Location"}, ${nextRace.country_name || "Unknown Country"}</p>
            <p>🏁 Circuit: ${nextRace.circuit_short_name || "Unknown Circuit"}</p>
            <p>📅 Start Time: ${raceDate.toLocaleString()} (GMT ${gmtOffset})</p>
            <p>⏳ Countdown: <strong id="countdown-timer"></strong></p>
        `;

        // 🏎️ **List Race Weekend Events**
        const eventSessions = nextRace.sessions || [];
        raceEventsEl.innerHTML = `
            <h3>Race Weekend Schedule</h3>
            <ul>
                ${eventSessions.map(session => `
                    <li>${session.session_name} - ${new Date(session.date_start).toLocaleString()}</li>
                `).join('')}
            </ul>
        `;

        // Start countdown update every second
        setInterval(() => updateCountdown(raceDate), 1000);

    } catch (error) {
        console.error("Error fetching upcoming race data:", error);
        upcomingRaceEl.innerHTML = "<p>Error loading upcoming race data.</p>";
    }
}

// 🕒 **Update Countdown**
function updateCountdown(targetDate) {
    const now = new Date();
    const timeRemaining = targetDate - now;

    if (timeRemaining <= 0) {
        document.getElementById("countdown-timer").innerText = "Race has started!";
        return;
    }

    const seconds = Math.floor((timeRemaining / 1000) % 60);
    const minutes = Math.floor((timeRemaining / (1000 * 60)) % 60);
    const hours = Math.floor((timeRemaining / (1000 * 60 * 60)) % 24);
    const days = Math.floor(timeRemaining / (1000 * 60 * 60 * 24));

    document.getElementById("countdown-timer").innerText = `${days}d ${hours}h ${minutes}m ${seconds}s`;
}

// 🏁 **Initial Call to Fetch Upcoming Race Data**
fetchUpcomingRace();
