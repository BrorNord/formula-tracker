const currentRaceEl = document.getElementById("current-race");
const upcomingRaceEl = document.getElementById("upcoming-race");
const driverStandingsEl = document.querySelector("#driver-standings tbody");
const constructorStandingsEl = document.querySelector("#constructor-standings tbody");

const API_URL_OPENF1 = "https://api.openf1.org/v1/sessions";
const API_URL_STANDINGS = "https://api.openf1.org/v1/standings";

// Fetch Current & Upcoming Races
async function fetchRaceData() {
    try {
        const response = await fetch(API_URL_OPENF1);
        const races = await response.json();

        const currentRace = races.find(race => race.session_name === "Race");
        const nextRace = races.find(race => race.session_name === "Practice 1"); 

        currentRaceEl.innerHTML = currentRace ? `
            <p><strong>${currentRace.meeting_name}</strong> - ${currentRace.location}</p>
            <p>Started at: ${currentRace.start_time}</p>
        ` : `<p>No current race.</p>`;

        upcomingRaceEl.innerHTML = nextRace ? `
            <p><strong>${nextRace.meeting_name}</strong> - ${nextRace.location}</p>
            <p>Starts at: ${nextRace.start_time}</p>
        ` : `<p>No upcoming race.</p>`;

    } catch (error) {
        console.error("Error fetching race data:", error);
    }
}

// Fetch Standings
async function fetchStandings() {
    try {
        const response = await fetch(API_URL_STANDINGS);
        const standings = await response.json();

        driverStandingsEl.innerHTML = "";
        constructorStandingsEl.innerHTML = "";

        standings.drivers.forEach((driver, index) => {
            driverStandingsEl.innerHTML += `
                <tr>
                    <td>${index + 1}</td>
                    <td>${driver.driver_name}</td>
                    <td>${driver.points}</td>
                </tr>
            `;
        });

        standings.constructors.forEach((team, index) => {
            constructorStandingsEl.innerHTML += `
                <tr>
                    <td>${index + 1}</td>
                    <td>${team.constructor_name}</td>
                    <td>${team.points}</td>
                </tr>
            `;
        });

    } catch (error) {
        console.error("Error fetching standings:", error);
    }
}

// Run functions
if (window.location.pathname.includes("standings.html")) {
    fetchStandings();
} else {
    fetchRaceData();
    setInterval(fetchRaceData, 30000); // Refresh every 30s
}
