import { describe, expect, test } from "vitest";

import {
    determineMinority,
    updateHistory,
    playRound,
    simulateGame
} from "./gameLogic.js";

describe("determineMinority", () => {

    test("1が少数派", () => {

        expect(
            determineMinority([0,0,0,1,1])
        ).toBe(1);

    });

    test("0が少数派", () => {

        expect(
            determineMinority([1,1,1,0,0])
        ).toBe(0);

    });

});

describe("updateHistory", () => {
    test("m=3で011に0を追加すると110になる", () => {
        const currentHistory = 3; // 011

        const nextHistory =
            updateHistory(currentHistory, 0, 3);

        expect(nextHistory).toBe(6); // 110
    });

    test("m=3で110に1を追加すると101になる", () => {
        const currentHistory = 6; // 110

        const nextHistory =
            updateHistory(currentHistory, 1, 3);

        expect(nextHistory).toBe(5); // 101
    });

    test("少数派行動が0または1以外ならエラーになる", () => {
        expect(
            () => updateHistory(3, 2, 3)
        ).toThrow();
    });

    test("履歴番号が範囲外ならエラーになる", () => {
        expect(
            () => updateHistory(8, 0, 3)
        ).toThrow();
    });
});

describe("playRound", () => {
    test("1ラウンドの少数派と人数を正しく返す", () => {
        const agents = [
            {
                strategies: [[0], [0]],
                virtualScores: [0, 0]
            },
            {
                strategies: [[0], [0]],
                virtualScores: [0, 0]
            },
            {
                strategies: [[1], [1]],
                virtualScores: [0, 0]
            }
        ];

        const result = playRound(
            agents,
            0,
            () => 0
        );

        expect(result.actions).toEqual([0, 0, 1]);
        expect(result.minorityAction).toBe(1);
        expect(result.countZero).toBe(2);
        expect(result.countOne).toBe(1);
    });

    test("少数派を予測した戦略の仮想得点が増える", () => {
        const agents = [
            {
                strategies: [[0], [1]],
                virtualScores: [0, 0]
            },
            {
                strategies: [[0], [0]],
                virtualScores: [0, 0]
            },
            {
                strategies: [[1], [1]],
                virtualScores: [0, 0]
            }
        ];

        playRound(
            agents,
            0,
            () => 0
        );

        expect(agents[0].virtualScores).toEqual([0, 1]);
        expect(agents[1].virtualScores).toEqual([0, 0]);
        expect(agents[2].virtualScores).toEqual([1, 1]);
    });
});

describe("simulateGame", () => {
    test("指定した測定ラウンド数だけ結果を保存する", () => {
        const result = simulateGame(
            101,
            2,
            10,
            50
        );

        expect(
            result.attendanceHistory
        ).toHaveLength(50);

        expect(
            result.differenceHistory
        ).toHaveLength(50);

        expect(
            result.minorityHistory
        ).toHaveLength(50);
    });

    test("各期の1選択人数は0以上N以下である", () => {
        const agentCount = 101;

        const result = simulateGame(
            agentCount,
            3,
            10,
            50
        );

        const isValid =
            result.attendanceHistory.every(
                count =>
                    Number.isInteger(count) &&
                    count >= 0 &&
                    count <= agentCount
            );

        expect(isValid).toBe(true);
    });

    test("人数差は必ず1以上の奇数になる", () => {
        const result = simulateGame(
            101,
            3,
            10,
            50
        );

        const isValid =
            result.differenceHistory.every(
                difference =>
                    difference >= 1 &&
                    difference % 2 === 1
            );

        expect(isValid).toBe(true);
    });

    test("偶数人数ならエラーになる", () => {
        expect(
            () => simulateGame(
                100,
                3,
                10,
                50
            )
        ).toThrow();
    });

    test("記憶長が範囲外ならエラーになる", () => {
        expect(
            () => simulateGame(
                101,
                11,
                10,
                50
            )
        ).toThrow();
    });
});