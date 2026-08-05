import {
    getActionFromStrategy,
    selectStrategy
} from "./strategy.js";

export function determineMinority(actions) {

    const countOne =
        actions.filter(action => action === 1).length;

    const countZero =
        actions.length - countOne;

    if (countOne < countZero) {
        return 1;
    }

    return 0;
}

export function updateHistory(
    currentHistory,
    minorityAction,
    memoryLength
) {
    if (
        !Number.isInteger(memoryLength) ||
        memoryLength < 1
    ) {
        throw new Error(
            "memoryLength must be a positive integer."
        );
    }

    const maxHistoryCount = 2 ** memoryLength;

    if (
        !Number.isInteger(currentHistory) ||
        currentHistory < 0 ||
        currentHistory >= maxHistoryCount
    ) {
        throw new Error("currentHistory is out of range.");
    }

    if (minorityAction !== 0 && minorityAction !== 1) {
        throw new Error("minorityAction must be 0 or 1.");
    }

    return (
        (currentHistory * 2 + minorityAction)
        % maxHistoryCount
    );
}

export function playRound(
    agents,
    currentHistory,
    randomFn = Math.random
) {
    if (!Array.isArray(agents) || agents.length === 0) {
        throw new Error("agents must be a non-empty array.");
    }

    const actions = agents.map(agent => {
        const selectedStrategyIndex =
            selectStrategy(agent, randomFn);

        const selectedStrategy =
            agent.strategies[selectedStrategyIndex];

        return getActionFromStrategy(
            selectedStrategy,
            currentHistory
        );
    });

    const minorityAction = determineMinority(actions);

    agents.forEach(agent => {
        agent.strategies.forEach((strategy, strategyIndex) => {
            const predictedAction =
                getActionFromStrategy(
                    strategy,
                    currentHistory
                );

            if (predictedAction === minorityAction) {
                agent.virtualScores[strategyIndex] += 1;
            }
        });
    });

    const countOne =
        actions.filter(action => action === 1).length;

    const countZero = actions.length - countOne;

    return {
        actions,
        minorityAction,
        countZero,
        countOne
    };
}