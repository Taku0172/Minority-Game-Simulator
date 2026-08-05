export function calculateAlpha(memoryLength, agentCount) {
    if (!Number.isInteger(memoryLength) || memoryLength <= 0) {
        throw new Error ("memoryLength must be a non-negative integer.");
    }

    if (!Number.isInteger(agentCount) || agentCount <= 0) {
        throw new Error ("agentCount must be a positive intege.");
    }

    return (2 ** memoryLength) / agentCount;
}