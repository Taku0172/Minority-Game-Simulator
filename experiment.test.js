import { describe, expect, test } from "vitest";

import {
    runRepeatedSimulations
} from "./experiment.js";

describe("runRepeatedSimulations", () => {
    test("指定した回数だけ結果を保存する", () => {
        const result = runRepeatedSimulations(
            11,
            2,
            3,
            10
        );

        expect(
            result.normalizedVariances
        ).toHaveLength(3);

        expect(result.repetitions).toBe(3);
    });

    test("平均値を正しく返す", () => {
        const result = runRepeatedSimulations(
            11,
            2,
            3,
            10
        );

        const expectedAverage =
            result.normalizedVariances.reduce(
                (sum, value) => sum + value,
                0
            ) /
            result.normalizedVariances.length;

        expect(
            result.averageNormalizedVariance
        ).toBeCloseTo(expectedAverage);
    });

    test("繰り返し回数が0ならエラーになる", () => {
        expect(
            () =>
                runRepeatedSimulations(
                    11,
                    2,
                    0,
                    10
                )
        ).toThrow();
    });

    test("平均値は0以上の有限値になる", () => {
        const result = runRepeatedSimulations(
            11,
            2,
            3,
            10
        );

        expect(
            Number.isFinite(
                result.averageNormalizedVariance
            )
        ).toBe(true);

        expect(
            result.averageNormalizedVariance
        ).toBeGreaterThanOrEqual(0);
    });
});