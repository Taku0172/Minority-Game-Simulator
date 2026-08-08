import {
    runRepeatedSimulations
} from "./experiment.js";

import { simulateGame } from "./gameLogic.js";

import {
    calculateAlpha,
    calculateVariance,
    calculateNormalizedVariance
} from "./statistics.js";

let attendanceChart = null;
let differenceChart = null;
let phaseChart = null;
const phasePoints = [];

const runButton = document.getElementById("runButton");
const runSweepButton = document.getElementById("runSweepButton");
const agentCountInput = document.getElementById("agentCount");
const memoryLengthSelect = document.getElementById("memoryLength");
const errorMessage = document.getElementById("errorMessage");
const statusMessage = document.getElementById("statusMessage");
const alphaValue = document.getElementById("alphaValue");
const varianceValue = document.getElementById("varianceValue");
const normalizedVarianceValue =
    document.getElementById("normalizedVarianceValue");

const phasePointLabelPlugin = {
    id: "phasePointLabelPlugin",

    afterDatasetsDraw(chart) {
        const { ctx } = chart;

        const dataset = chart.data.datasets[0];
        const meta = chart.getDatasetMeta(0);

        meta.data.forEach((point, index) => {
            const dataPoint = dataset.data[index];

            if (dataPoint.m === undefined) {
                return;
            }

            ctx.save();

            ctx.font = "12px Arial";
            ctx.textAlign = "left";
            ctx.textBaseline = "bottom";

            ctx.fillText(
                `m=${dataPoint.m}`,
                point.x + 7,
                point.y - 5
            );

            ctx.restore();
        });
    }
};

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

function drawDifferenceChart(differenceHistory) {
    const canvas =
        document.getElementById("differenceChart");

    const labels = differenceHistory.map(
        (_, index) => index + 1
    );

    if (differenceChart !== null) {
        differenceChart.destroy();
    }

    differenceChart = new Chart(canvas, {
        type: "line",
        data: {
            labels,
            datasets: [
                {
                    label: "0と1の人数差",
                    data: differenceHistory,
                    borderWidth: 2,
                    pointRadius: 0
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
                    beginAtZero: true,
                    title: {
                        display: true,
                        text: "人数差"
                    }
                }
            }
        }
    });
}

function drawPhaseChart() {
    const canvas =
        document.getElementById("phaseChart");

    if (phaseChart !== null) {
        phaseChart.destroy();
    }

    phaseChart = new Chart(canvas, {
        type: "scatter",

        data: {
            datasets: [
                {
                    label: "平均 σ²/N",
                    data: phasePoints,
                    pointRadius: 5,
                    showLine: true,
                    borderWidth: 2
                }
            ]
        },

        plugins: [
            phasePointLabelPlugin
        ],

        options: {
            responsive: true,
            animation: false,

            scales: {
                x: {
                    type: "linear",
                    title: {
                        display: true,
                        text: "α = 2^m / N"
                    }
                },

                y: {
                    beginAtZero: true,
                    title: {
                        display: true,
                        text: "σ² / N"
                    }
                }
            }
        }
    });
}

runButton.addEventListener("click", async () => {
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

    await new Promise(resolve => setTimeout(resolve, 0));

    try {
        const warmupRounds = 1000;
        const measurementRounds = 5000;

        const result = simulateGame(
            agentCount,
            memoryLength,
            warmupRounds,
            measurementRounds
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
        
        const repeatedResult =
            runRepeatedSimulations(
                agentCount,
                memoryLength,
                100,
                warmupRounds,
                measurementRounds
            );

        const averageNormalizedVariance =
            repeatedResult.averageNormalizedVariance;    


        phasePoints.push({
            x: alpha,
            y: averageNormalizedVariance,
            m: memoryLength
        });

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

        drawDifferenceChart(
            result.differenceHistory
        );

        drawPhaseChart();

        statusMessage.textContent =
            `1000期のウォームアップ後、5000期の測定が完了しました。`;

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

runSweepButton.addEventListener("click", async () => {
    const agentCount = Number(agentCountInput.value);

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
    runSweepButton.disabled = true;

    statusMessage.textContent =
        "m=2〜10について、500期のウォームアップ後、2000期を10回ずつ計算しています。";

    await new Promise(resolve => setTimeout(resolve, 0));

    try {
        const warmupRounds = 500;
        const measurementRounds = 1000;
        const repetition = 10;

        // 以前の相図上の点を消す
        phasePoints.length = 0;

        for (
            let memoryLength = 2;
            memoryLength <= 10;
            memoryLength++
        ) {
            const alpha = calculateAlpha(
                memoryLength,
                agentCount
            );

            const repeatedResult =
                runRepeatedSimulations(
                    agentCount,
                    memoryLength,
                    repetition,
                    warmupRounds,
                    measurementRounds
                );

            phasePoints.push({
                x: alpha,
                y:
                    repeatedResult
                        .averageNormalizedVariance,
                m: memoryLength
            });
        }

        // αの小さい順に並べる
        phasePoints.sort(
            (pointA, pointB) =>
                pointA.x - pointB.x
        );

        drawPhaseChart();

        statusMessage.textContent =
            `N=${agentCount}について、m=2〜10の一括比較が完了しました。`;
    } catch (error) {
        errorMessage.textContent =
            `エラー：${error.message}`;

        statusMessage.textContent =
            "一括比較に失敗しました。";
    } finally {
        runButton.disabled = false;
        runSweepButton.disabled = false;
    }
});