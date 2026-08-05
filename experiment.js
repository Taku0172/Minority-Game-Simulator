import { simulateGame } from "./gameLogic.js";

import {
    calculateVariance,
    calculateNormalizedVariance
} from "./statistics.js";

export function runRepeatedSimulations(
    agentCount,
    memoryLength,
    repetitions = 100,
    rounds = 500,
    strategyCount = 2,
    randomFn = Math.random
) {
    if (
        !Number.isInteger(repetitions) ||
        repetitions < 1
    ) {
        throw new Error(
            "repetitions must be a positive integer."
        );
    }

    const normalizedVariances = [];

    for (
        let repetition = 0;
        repetition < repetitions;
        repetition++
    ) {
        const result = simulateGame(
            agentCount,
            memoryLength,
            rounds,
            strategyCount,
            randomFn
        );

        const variance = calculateVariance(
            result.attendanceHistory,
            agentCount
        );

        const normalizedVariance =
            calculateNormalizedVariance(
                variance,
                agentCount
            );

        normalizedVariances.push(
            normalizedVariance
        );
    }

    const averageNormalizedVariance =
        normalizedVariances.reduce(
            (sum, value) => sum + value,
            0
        ) / normalizedVariances.length;

    return {
        averageNormalizedVariance,
        normalizedVariances,
        repetitions
    };
}