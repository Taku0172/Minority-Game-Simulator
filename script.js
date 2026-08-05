import { simulateGame } from "./gameLogic.js";

import {
    calculateAlpha,
    calculateVariance,
    calculateNormalizedVariance
} from "./statistics.js";

const runButton = document.getElementById("runButton");
const agentCountInput = document.getElementById("agentCount");
const memoryLengthSelect = document.getElementById("memoryLength");
const errorMessage = document.getElementById("errorMessage");
const statusMessage = document.getElementById("statusMessage");
const alphaValue = document.getElementById("alphaValue");
const varianceValue = document.getElementById("varianceValue");
const normalizedVarianceValue =
    document.getElementById("normalizedVarianceValue");

runButton.addEventListener("click", () => {
    const agentCount = Number(agentCountInput.value);
    const memoryLength =
        Number(memoryLengthSelect.value);

    if (
        !Number.isInteger(agentCount) ||
        agentCount < 3
    ) {
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
    runButton.disabled = true;
    statusMessage.textContent =
        "シミュレーションを実行しています。";

    try {
        const rounds = 500;

        const result = simulateGame(
            agentCount,
            memoryLength,
            rounds
        );

        const alpha = calculateAlpha(
            memoryLength,
            agentCount
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

        alphaValue.textContent =
            alpha.toFixed(4);

        varianceValue.textContent =
            variance.toFixed(4);

        normalizedVarianceValue.textContent =
            normalizedVariance.toFixed(4);

        statusMessage.textContent =
            `${rounds}期のシミュレーションが完了しました。`;

        console.log(result);
    } catch (error) {
        errorMessage.textContent =
            `エラー：${error.message}`;

        statusMessage.textContent =
            "シミュレーションに失敗しました.";
    } finally {
        runButton.disabled = false;
    }
});