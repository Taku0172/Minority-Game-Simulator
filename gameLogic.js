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