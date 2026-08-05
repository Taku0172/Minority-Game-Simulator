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