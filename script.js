const currentRaceEl = document.getElementById("current-race");
const upcomingRaceEl = document.getElementById("upcoming-race");

const API_URL_OPENF1 = "https://api.openf1.org/v1/sessions";

// 🏎️ **Fix: Fetch Current & Upcoming Race**
async function fetchRaceData() {
    try {
        const response = await fetch(API_URL_OPENF1);
        const races = await response.json();

        // Get today's date in UTC format
        const today = new Date().toISOString().split("T")[0];

        // Filter race weekends by date
        const raceWeekends = races
            .filter(race => new Date(race.start_time).toISOString().split("T")[0] >= today)
            .sort((a, b) => new Date(a.start_time) - new Date(b.start_time)); // Sort by date

        const currentRace = raceWeekends.find(race => race.session_name === "Race");
        const nextRace = raceWeekends.find(race => race.session_name === "Practice 1");

        currentRaceEl.innerHTML = currentRace ? `
            <p><strong>${currentRace.meeting_name}</strong> - ${currentRace.location}</p>
            <p>Started at: ${new Date(currentRace.start_time).toLocaleString()}</p>
        ` : `<p>No current race.</p>`;

        upcomingRaceEl.innerHTML = nextRace ? `
            <p><strong>${nextRace.meeting_name}</strong> - ${nextRace.location}</p>
            <p>Starts at: ${new Date(nextRace.start_time).toLocaleString()}</p>
        ` : `<p>No upcoming race.</p>`;

    } catch (error) {
        console.error("Error fetching race data:", error);
        currentRaceEl.innerHTML = `<p>Error loading data.</p>`;
        upcomingRaceEl.innerHTML = `<p>Error loading data.</p>`;
    }
}

// Refresh every 30 seconds
setInterval(fetchRaceData, 30000);
fetchRaceData();
