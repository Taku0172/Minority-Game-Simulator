import { describe, expect, test } from "vitest";

import {
    determineMinority,
    updateHistory
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