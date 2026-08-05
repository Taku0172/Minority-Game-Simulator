import { describe, expect, test } from "vitest";
import { calculateAlpha } from "./statistics.js";

describe("calculateAlpha", () => {
    test("N=101, m=2 のとき alpha を正しく計算する", () => {
        const alpha = calculateAlpha(2, 101);

        expect(alpha).toBeCloseTo(4 / 101);
    });

    test("N=101, m=10 のとき alpha を正しく計算する", () => {
        const alpha = calculateAlpha(10, 101);

        expect(alpha).toBeCloseTo(1024 / 101);
    });

    test("人数が0以下ならエラーになる", () => {
        expect(() => calculateAlpha(2, 0)).toThrow();
    });
});