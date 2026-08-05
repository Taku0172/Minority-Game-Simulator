const runButton = document.getElementById("runButton");
const agentCountInput = document.getElementById("agentCount");
const memoryLengthSelect = document.getElementById("memoryLength");
const errorMessage = document.getElementById("errorMessage");
const statusMessage = document.getElementById("statusMessage");

runButton.addEventListener("click", () => {
    const agentCount = Number(agentCountInput.value);
    const memoryLength = Number(memoryLengthSelect.value);

    if (!Number.isInteger(agentCount) || agentCount < 3) {
        errorMessage.textContent =
            "エージェント人数は3以上の整数にしてください。";
        return;
    }

    if (agentCount % 2 === 0) {
        errorMessage.textContent =
            "エージェント人数は奇数にしてください。";
        return;
    }

    errorMessage.textContent = "";

    statusMessage.textContent =
        `エージェント人数 ${agentCount}人、記憶長 m=${memoryLength} で開始します。`;

    console.log("Simulation started!", {
        agentCount,
        memoryLength
    });
});