import { describe, expect, test } from "vitest";
import { 
    calculateAlpha,
    calculateVariance,
    calculateNormalizedVariance
 } from "./statistics.js";

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

describe("calculateVariance", () => {
    test("人数推移から分散を正しく計算する", () => {
        const attendanceHistory = [4, 6];
        const agentCount = 10;

        const variance = calculateVariance(
            attendanceHistory,
            agentCount
        );

        expect(variance).toBe(1);
    });

    test("中央人数が続く場合は分散が0になる", () => {
        const attendanceHistory = [5, 5, 5];
        const agentCount = 10;

        expect(
            calculateVariance(
                attendanceHistory,
                agentCount
            )
        ).toBe(0);
    });

    test("空配列ならエラーになる", () => {
        expect(
            () => calculateVariance([], 101)
        ).toThrow();
    });
});

describe("calculateNormalizedVariance", () => {
    test("分散を人数で割って正規化する", () => {
        expect(
            calculateNormalizedVariance(20, 100)
        ).toBeCloseTo(0.2);
    });

    test("負の分散ならエラーになる", () => {
        expect(
            () => calculateNormalizedVariance(-1, 100)
        ).toThrow();
    });
});