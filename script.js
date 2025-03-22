const currentRaceEl = document.getElementById("current-race");
const upcomingRaceEl = document.getElementById("upcoming-race");

const API_URL_LATEST_MEETING = "https://api.openf1.org/v1/meetings?meeting_key=latest";

// 🏎️ **Fetch Current & Upcoming Race**
async function fetchRaceData() {
    try {
        const response = await fetch(API_URL_LATEST_MEETING);
        const data = await response.json();
        
        console.log("Latest Meeting Data:", data); // Debugging output

        if (!data || data.length === 0) {
            currentRaceEl.innerHTML = "<p>No current race available.</p>";
            upcomingRaceEl.innerHTML = "<p>No upcoming race found.</p>";
            return;
        }

        const latestMeeting = data[0]; // Latest race weekend
        const raceDate = latestMeeting.date_start ? new Date(latestMeeting.date_start) : "Unknown Date";
        const gmtOffset = latestMeeting.gmt_offset || "N/A";

        currentRaceEl.innerHTML = `
            <h2>Current Race</h2>
            <p><strong>${latestMeeting.meeting_name || "Unknown Race"}</strong> (${latestMeeting.meeting_official_name || ""})</p>
            <p>📍 ${latestMeeting.location || "Unknown Location"}, ${latestMeeting.country_name || "Unknown Country"}</p>
            <p>🏁 Circuit: ${latestMeeting.circuit_short_name || "Unknown Circuit"}</p>
            <p>📅 Start Time: ${raceDate !== "Unknown Date" ? raceDate.toLocaleString() : "Unknown"} (GMT ${gmtOffset})</p>
        `;

        // 🏎️ **Fetch Upcoming Race**
        const responseAllMeetings = await fetch("https://api.openf1.org/v1/meetings");
        const allMeetings = await responseAllMeetings.json();
        
        console.log("All Meetings Data:", allMeetings); // Debugging output

        const upcomingMeeting = allMeetings.find(meeting => new Date(meeting.date_start) > new Date());

        if (upcomingMeeting) {
            const upcomingDate = new Date(upcomingMeeting.date_start);
            upcomingRaceEl.innerHTML = `
                <h2>Upcoming Race</h2>
                <p><strong>${upcomingMeeting.meeting_name || "Unknown Race"}</strong> (${upcomingMeeting.meeting_official_name || ""})</p>
                <p>📍 ${upcomingMeeting.location || "Unknown Location"}, ${upcomingMeeting.country_name || "Unknown Country"}</p>
                <p>🏁 Circuit: ${upcomingMeeting.circuit_short_name || "Unknown Circuit"}</p>
                <p>📅 Start Time: ${upcomingDate.toLocaleString()} (GMT ${upcomingMeeting.gmt_offset || "N/A"})</p>
            `;
        } else {
            upcomingRaceEl.innerHTML = "<p>No upcoming race found.</p>";
        }

    } catch (error) {
        console.error("Error fetching race data:", error);
        currentRaceEl.innerHTML = "<p>Error loading current race data.</p>";
        upcomingRaceEl.innerHTML = "<p>Error loading upcoming race data.</p>";
    }
}

// Refresh every 30 seconds
setInterval(fetchRaceData, 30000);
fetchRaceData();
