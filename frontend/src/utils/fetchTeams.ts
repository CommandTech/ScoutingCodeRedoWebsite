export const fetchTeams = async (selectedTeams: string[] = []) => {
    try {
        const controller = new AbortController();
        const timeoutId = setTimeout(() => controller.abort(), 10000); // 10 seconds timeout

        const response = await fetch('/ExcelCSVFiles/Activities.csv', {
            signal: controller.signal,
        });

        clearTimeout(timeoutId);

        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }

        const text = await response.text();
        const rows = text.split('\n').slice(1); // Skip header row
        const teamAutoPoints: { [key: string]: number[] } = {};
        const teamAlgaePoints: { [key: string]: number[] } = {};
        const teamCoralPoints: { [key: string]: number[] } = {};
        const autoCoral: number[] = [0, 0, 0, 0];
        const teamSurfacingPoints: { [key: string]: number[] } = {};
        const teamPointsPoints: { [key: string]: number[] } = {};

        rows.forEach(row => {
            const [id, team, match, time, recordType, mode, driveSta, defense, defenseValue, avoidance, scouterName, scouterError, matchEvent, strategy, coop, dzTime, delNearFar, acqAlgaeNearFar, acqCoralNearFar, startingLoc, leave, acqCoralS, acqCoralF, acqAlgaeR, acqAlgaeF, delCoralL1, delCoralL2, delCoralL3, delCoralL4, delCoralF, delAlgaeP, delAlgaeN, delAlgaeF, climbT, endState, cageAttempt, selectedCage, pointScored] = row.split(',');

            if (recordType === 'EndAuto') {
                const coralPoints = (parseInt(delCoralL1) * 3) + (parseInt(delCoralL2) * 4) + (parseInt(delCoralL3) * 6) + (parseInt(delCoralL4) * 7);
                for (let i = 0; i < 4; i++) {
                    autoCoral[i] = parseInt(eval(`delCoralL${i + 1}`));
                }

                if (!teamCoralPoints[team]) {
                    teamCoralPoints[team] = [];
                }
                teamCoralPoints[team].push(coralPoints);

                const autoPoints = parseInt(pointScored, 10);
                if (!teamAutoPoints[team]) {
                    teamAutoPoints[team] = [];
                }
                teamAutoPoints[team].push(autoPoints);
            }

            if (recordType === 'EndMatch') {
                const algaePoints = (parseInt(delAlgaeP) * 6) + (parseInt(delAlgaeN) * 4);
                if (!teamAlgaePoints[team]) {
                    teamAlgaePoints[team] = [];
                }
                teamAlgaePoints[team].push(algaePoints);

                const coralPoints =
                    ((parseInt(delCoralL1) - autoCoral[0]) * 2) +
                    ((parseInt(delCoralL2) - autoCoral[1]) * 3) +
                    ((parseInt(delCoralL3) - autoCoral[2]) * 4) +
                    ((parseInt(delCoralL4) - autoCoral[3]) * 5);

                if (!teamCoralPoints[team]) {
                    teamCoralPoints[team] = [];
                }
                teamCoralPoints[team].push(coralPoints);

                let surfacingPoints = 0;
                switch (endState) {
                    case 'Park':
                        surfacingPoints = 2;
                        break;
                    case 'Elsewhere':
                        surfacingPoints = 0;
                        break;
                    case 'Deep':
                        surfacingPoints = 12;
                        break;
                    case 'Shallow':
                        surfacingPoints = 6;
                        break;
                    default:
                        surfacingPoints = 0;
                        break;
                }
                if (!teamSurfacingPoints[team]) {
                    teamSurfacingPoints[team] = [];
                }
                teamSurfacingPoints[team].push(surfacingPoints);

                const teamPoints = parseInt(pointScored);
                if (!teamPointsPoints[team]) {
                    teamPointsPoints[team] = [];
                }
                teamPointsPoints[team].push(teamPoints);
            }
        });

        const teamAverageAutoPoints: { [key: string]: number } = {};
        for (const team in teamAutoPoints) {
            const totalAutoPoints = teamAutoPoints[team].reduce((sum, points) => sum + points, 0);
            teamAverageAutoPoints[team] = totalAutoPoints / teamAutoPoints[team].length;
        }

        const teamAverageAlgaePoints: { [key: string]: number } = {};
        for (const team in teamAlgaePoints) {
            const totalAlgaePoints = teamAlgaePoints[team].reduce((sum, points) => sum + points, 0);
            teamAverageAlgaePoints[team] = totalAlgaePoints / teamAlgaePoints[team].length;
        }

        const teamAverageCoralPoints: { [key: string]: number } = {};
        for (const team in teamCoralPoints) {
            const totalCoralPoints = teamCoralPoints[team].reduce((sum, points) => sum + points, 0);
            teamAverageCoralPoints[team] = totalCoralPoints / teamCoralPoints[team].length;
        }

        const teamAverageSurfacingPoints: { [key: string]: number } = {};
        for (const team in teamSurfacingPoints) {
            const totalSurfacingPoints = teamSurfacingPoints[team].reduce((sum, points) => sum + points, 0);
            teamAverageSurfacingPoints[team] = totalSurfacingPoints / teamSurfacingPoints[team].length;
        }

        const teamAveragePoints: { [key: string]: number } = {};
        for (const team in teamPointsPoints) {
            const totalPoints = teamPointsPoints[team].reduce((sum, points) => sum + points, 0);
            teamAveragePoints[team] = totalPoints / teamPointsPoints[team].length;
        }

        const sortedTeams = Object.keys(teamAverageAutoPoints)
            .map(team => team.replace('frc', ''))
            .sort((a, b) => parseInt(a) - parseInt(b))
            .map(team => `frc${team}`)
            .filter(team => !selectedTeams.includes(team)); // Filter out selected teams

        return {
            teams: sortedTeams,
            teamAverageAutoPoints,
            teamAverageAlgaePoints,
            teamAverageCoralPoints,
            teamAverageSurfacingPoints,
            teamAveragePoints,
        };
    } catch (error) {
        console.error('Error fetching teams:', error);
        throw error;
    }
};