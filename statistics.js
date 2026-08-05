export function calculateAlpha(memoryLength, agentCount) {
    if (!Number.isInteger(memoryLength) || memoryLength <= 0) {
        throw new Error ("memoryLength must be a non-negative integer.");
    }

    if (!Number.isInteger(agentCount) || agentCount <= 0) {
        throw new Error ("agentCount must be a positive intege.");
    }

    return (2 ** memoryLength) / agentCount;
}

export function calculateVariance(
    attendanceHistory,
    agentCount
) {
    if (
        !Array.isArray(attendanceHistory) ||
        attendanceHistory.length === 0
    ) {
        throw new Error(
            "attendanceHistory must be a non-empty array."
        );
    }

    if (
        !Number.isInteger(agentCount) ||
        agentCount <= 0
    ) {
        throw new Error(
            "agentCount must be a positive integer."
        );
    }

    const target = agentCount / 2;

    const squaredDifferences =
        attendanceHistory.map(attendance => {
            if (
                !Number.isInteger(attendance) ||
                attendance < 0 ||
                attendance > agentCount
            ) {
                throw new Error(
                    "attendance values must be integers between 0 and agentCount."
                );
            }

            return (attendance - target) ** 2;
        });

    return (
        squaredDifferences.reduce(
            (sum, value) => sum + value,
            0
        ) / squaredDifferences.length
    );
}

export function calculateNormalizedVariance(
    variance,
    agentCount
) {
    if (
        typeof variance !== "number" ||
        !Number.isFinite(variance) ||
        variance < 0
    ) {
        throw new Error(
            "variance must be a non-negative finite number."
        );
    }

    if (
        !Number.isInteger(agentCount) ||
        agentCount <= 0
    ) {
        throw new Error(
            "agentCount must be a positive integer."
        );
    }

    return variance / agentCount;
}