import { describe, test, expect } from "vitest";

import { determineMinority } from "./gameLogic.js";

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