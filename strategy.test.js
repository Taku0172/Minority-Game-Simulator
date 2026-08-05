import { describe, expect, test } from "vitest";

import {
    generateStrategy,
    getActionFromStrategy
} from "./strategy.js";

describe("generateStrategy", () => {
    test("m=2なら長さ4の戦略を生成する", () => {
        const strategy = generateStrategy(2);

        expect(strategy).toHaveLength(4);
    });

    test("m=10なら長さ1024の戦略を生成する", () => {
        const strategy = generateStrategy(10);

        expect(strategy).toHaveLength(1024);
    });

    test("戦略の要素は0または1だけである", () => {
        const strategy = generateStrategy(5);

        expect(
            strategy.every(
                action => action === 0 || action === 1
            )
        ).toBe(true);
    });

    test("固定乱数を使うと結果を再現できる", () => {
        const alwaysLowRandom = () => 0.2;
        const strategy =
            generateStrategy(2, alwaysLowRandom);

        expect(strategy).toEqual([0, 0, 0, 0]);
    });
});

describe("getActionFromStrategy", () => {
    test("履歴番号に対応する行動を返す", () => {
        const strategy = [1, 0, 1, 1];

        expect(
            getActionFromStrategy(strategy, 0)
        ).toBe(1);

        expect(
            getActionFromStrategy(strategy, 1)
        ).toBe(0);

        expect(
            getActionFromStrategy(strategy, 3)
        ).toBe(1);
    });

    test("範囲外の履歴番号ならエラーになる", () => {
        const strategy = [1, 0, 1, 1];

        expect(
            () => getActionFromStrategy(strategy, 4)
        ).toThrow();
    });
});