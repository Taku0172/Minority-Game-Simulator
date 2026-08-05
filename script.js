import { simulateGame } from "./gameLogic.js";

import {
    calculateAlpha,
    calculateVariance,
    calculateNormalizedVariance
} from "./statistics.js";

let attendanceChart = null;

const runButton = document.getElementById("runButton");
const agentCountInput = document.getElementById("agentCount");
const memoryLengthSelect = document.getElementById("memoryLength");
const errorMessage = document.getElementById("errorMessage");
const statusMessage = document.getElementById("statusMessage");
const alphaValue = document.getElementById("alphaValue");
const varianceValue = document.getElementById("varianceValue");
const normalizedVarianceValue =
    document.getElementById("normalizedVarianceValue");

function drawAttendanceChart(
    attendanceHistory,
    agentCount
) {
    const canvas =
        document.getElementById("attendanceChart");

    const labels = attendanceHistory.map(
        (_, index) => index + 1
    );

    if (attendanceChart !== null) {
        attendanceChart.destroy();
    }

    attendanceChart = new Chart(canvas, {
        type: "line",
        data: {
            labels,
            datasets: [
                {
                    label: "1を選んだ人数",
                    data: attendanceHistory,
                    borderWidth: 2,
                    pointRadius: 0
                },
                {
                    label: "人数の中央 N/2",
                    data: labels.map(
                        () => agentCount / 2
                    ),
                    borderWidth: 1,
                    pointRadius: 0,
                    borderDash: [6, 6]
                }
            ]
        },
        options: {
            responsive: true,
            animation: false,
            scales: {
                x: {
                    title: {
                        display: true,
                        text: "期"
                    }
                },
                y: {
                    min: 0,
                    max: agentCount,
                    title: {
                        display: true,
                        text: "1を選んだ人数"
                    }
                }
            }
        }
    });
}

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

        drawAttendanceChart(
            result.attendanceHistory,
            agentCount
        );

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