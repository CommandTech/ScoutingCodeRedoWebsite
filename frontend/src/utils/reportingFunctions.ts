const calculateDifferences = (teamNumbers: string[], parsedData: any[], column: string) => {
    return teamNumbers.map((teamNumber) => {
        const endAutoData = parsedData.filter((row: any) => row['Team'] === teamNumber && row['RecordType'] === 'EndAuto');
        const endMatchData = parsedData.filter((row: any) => row['Team'] === teamNumber && row['RecordType'] === 'EndMatch');

        const endAutoValues = endAutoData.map((row: any) => parseInt(row[`${column}`])).filter((value) => !isNaN(value));
        const endMatchValues = endMatchData.map((row: any) => parseInt(row[`${column}`])).filter((value) => !isNaN(value));
        const differences = endMatchValues.map((value, index) => value - (endAutoValues[index] || 0));
        const minEndAuto = endAutoValues.length > 0 ? Math.min(...endAutoValues) : 0;
        return [Math.max(...differences), minEndAuto];
    });
};

const calculateClimbTimes = (teamNumbers: string[], parsedData: any[]) => {
    const climbTimes: { [key: string]: { min: number, max: number } } = {};

    teamNumbers.forEach((teamNumber) => {
        const teamData = parsedData.filter((row: any) => row['Team'] === teamNumber);
        teamData.forEach((row: any) => {
            const endState = row['EndState'];
            const climbT = parseFloat(row['ClimbT']);
            if (!isNaN(climbT)) {
                if (!climbTimes[endState]) {
                    climbTimes[endState] = { min: climbT, max: climbT };
                } else {
                    climbTimes[endState].min = Math.min(climbTimes[endState].min, climbT);
                    climbTimes[endState].max = Math.max(climbTimes[endState].max, climbT);
                }
            }
        });
    });
    console.log('climbTimes:', climbTimes);
    return climbTimes;
};

const calculateCoralCounts = (teamNumbers: string[], parsedData: any[]) => {
    const coralCounts = teamNumbers.map((teamNumber) => {
        const teamData = parsedData.filter((row: any) => row['Team'] === teamNumber && row['RecordType'] === 'EndAuto');
        return teamData.map((row: any) =>
            parseInt(row.DelCoralL1) + parseInt(row.DelCoralL2) + parseInt(row.DelCoralL3) + parseInt(row.DelCoralL4)
        );
    });

    const allCoralCounts = coralCounts.flat().filter((count) => !isNaN(count));
    const maxCoralCount = Math.max(...allCoralCounts);
    const minCoralCount = Math.min(...allCoralCounts);

    return { maxCoralCount, minCoralCount };
};

export { calculateDifferences, calculateClimbTimes, calculateCoralCounts };