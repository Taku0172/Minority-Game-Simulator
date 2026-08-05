export function generateStrategy(memoryLength, randomFn = Math.random) {
    if (
        !Number.isInteger(memoryLength) ||
        memoryLength < 0
    ) {
        throw new Error(
            "memoryLength must be a non-negative integer."
        );
    }

    const historyCount = 2 ** memoryLength;

    return Array.from(
        { length: historyCount },
        () => randomFn() < 0.5 ? 0 : 1
    );
}

export function getActionFromStrategy(strategy, historyIndex) {
    if (!Array.isArray(strategy) || strategy.length === 0) {
        throw new Error("strategy must be a non-empty array.");
    }

    if (
        !Number.isInteger(historyIndex) ||
        historyIndex < 0 ||
        historyIndex >= strategy.length
    ) {
        throw new Error("historyIndex is out of range.");
    }

    return strategy[historyIndex];
}