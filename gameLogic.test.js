import { describe, expect, test } from "vitest";

import {
    determineMinority,
    updateHistory,
    playRound
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