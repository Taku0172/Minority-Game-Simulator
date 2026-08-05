import {
    createAgent,
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

export function simulateGame(
    agentCount,
    memoryLength,
    rounds = 500,
    strategyCount = 2,
    randomFn = Math.random
) {
    if (
        !Number.isInteger(agentCount) ||
        agentCount < 3 ||
        agentCount % 2 === 0
    ) {
        throw new Error(
            "agentCount must be an odd integer greater than or equal to 3."
        );
    }

    if (
        !Number.isInteger(memoryLength) ||
        memoryLength < 2 ||
        memoryLength > 10
    ) {
        throw new Error(
            "memoryLength must be an integer between 2 and 10."
        );
    }

    if (!Number.isInteger(rounds) || rounds < 1) {
        throw new Error(
            "rounds must be a positive integer."
        );
    }

    if (
        !Number.isInteger(strategyCount) ||
        strategyCount < 1
    ) {
        throw new Error(
            "strategyCount must be a positive integer."
        );
    }

    // N人のエージェントを生成する
    const agents = Array.from(
        { length: agentCount },
        () => createAgent(
            memoryLength,
            strategyCount,
            randomFn
        )
    );

    // 初期履歴を0〜2^m-1の範囲でランダムに決める
    const historyCount = 2 ** memoryLength;

    let currentHistory = Math.floor(
        randomFn() * historyCount
    );

    // 各期の結果を保存する配列
    const attendanceHistory = [];
    const differenceHistory = [];
    const minorityHistory = [];

    for (let round = 0; round < rounds; round++) {
        const roundResult = playRound(
            agents,
            currentHistory,
            randomFn
        );

        // 1を選んだ人数
        attendanceHistory.push(
            roundResult.countOne
        );

        // 0と1の人数差
        differenceHistory.push(
            Math.abs(
                roundResult.countOne -
                roundResult.countZero
            )
        );

        // その期の少数派
        minorityHistory.push(
            roundResult.minorityAction
        );

        // 履歴を更新
        currentHistory = updateHistory(
            currentHistory,
            roundResult.minorityAction,
            memoryLength
        );
    }

    return {
        attendanceHistory,
        differenceHistory,
        minorityHistory,
        finalHistory: currentHistory,
        finalAgents: agents
    };
}