import { test, expect } from "@playwright/test";

const BASE_URL = "http://localhost:4321";

test.describe("Portfolio Layout and Scroll", () => {
  test.beforeEach(async ({ page }) => {
    await page.goto(BASE_URL);
    await page.waitForLoadState("domcontentloaded");
  });

  test("all 8 sections render", async ({ page }) => {
    const sections = page.locator(".section");
    await expect(sections).toHaveCount(8);
  });

  test("each section is exactly 100dvh tall", async ({ page }) => {
    const sections = page.locator(".section");
    const count = await sections.count();
    const viewportHeight = page.viewportSize()!.height;

    for (let i = 0; i < count; i++) {
      const box = await sections.nth(i).boundingBox();
      expect(box).not.toBeNull();
      // Allow 2px tolerance for rounding
      expect(Math.abs(box!.height - viewportHeight)).toBeLessThanOrEqual(2);
    }
  });

  test("scroll-parent has vertical scroll-snap enabled", async ({ page }) => {
    const scrollParent = page.locator("#scroll-parent");
    const snapType = await scrollParent.evaluate(
      (el) => getComputedStyle(el).scrollSnapType
    );
    expect(snapType).toContain("y");
    expect(snapType).toContain("mandatory");
  });

  test("sections have scroll-snap-align set", async ({ page }) => {
    const firstSection = page.locator(".section").first();
    const snapAlign = await firstSection.evaluate(
      (el) => getComputedStyle(el).scrollSnapAlign
    );
    // Should be "start", "end", or "center" — not "none"
    expect(snapAlign).not.toBe("none");
  });

  test("sections have correct background colors", async ({ page }) => {
    const expectedColors: Record<number, string> = {
      0: "rgb(0, 2, 3)",       // Intro: #000203
      1: "rgb(243, 244, 246)", // Dembrane: #F3F4F6
      2: "rgb(4, 21, 33)",    // Unforgettable: #041521
      3: "rgb(46, 35, 130)",   // Matteo: #2E2382
      4: "rgb(255, 255, 255)", // Process Gold: #fff
      5: "rgb(0, 161, 228)",   // KLM: #00A1E4
      6: "rgb(95, 112, 142)",  // Bachelor's Thesis: #5F708E
      7: "rgb(13, 13, 13)",    // Zettelkasten: #0D0D0D
    };

    const sections = page.locator(".section");
    for (const [index, expectedBg] of Object.entries(expectedColors)) {
      const bg = await sections.nth(Number(index)).evaluate(
        (el) => getComputedStyle(el).backgroundColor
      );
      expect(bg).toBe(expectedBg);
    }
  });

  test("section-carousel has horizontal scroll enabled", async ({ page }) => {
    const carousel = page.locator(".section-carousel").first();
    const overflowX = await carousel.evaluate(
      (el) => getComputedStyle(el).overflowX
    );
    expect(overflowX).toBe("scroll");
  });

  test("section-carousel has overscroll-behavior-x: contain", async ({
    page,
  }) => {
    const carousel = page.locator(".section-carousel").first();
    const overscroll = await carousel.evaluate(
      (el) => getComputedStyle(el).overscrollBehaviorX
    );
    expect(overscroll).toBe("contain");
  });

  test("parts within intro section are visible (not zero opacity)", async ({
    page,
  }) => {
    // Wait for IntersectionObserver to fire
    await page.waitForTimeout(500);
    const firstPart = page.locator(".section").first().locator(".part").first();
    const opacity = await firstPart.evaluate(
      (el) => getComputedStyle(el).opacity
    );
    expect(Number(opacity)).toBeGreaterThan(0);
  });

  test("vertical scrolling snaps to next section", async ({ page }) => {
    const scrollParent = page.locator("#scroll-parent");
    const viewportHeight = page.viewportSize()!.height;

    // Scroll down one full viewport
    await scrollParent.evaluate((el, vh) => {
      el.scrollTo({ top: vh, behavior: "instant" });
    }, viewportHeight);

    // Wait for snap to settle
    await page.waitForTimeout(300);

    const scrollTop = await scrollParent.evaluate((el) => el.scrollTop);
    // Should snap to exactly the viewport height (second section)
    expect(Math.abs(scrollTop - viewportHeight)).toBeLessThanOrEqual(2);
  });

  test("section titles have correct left padding", async ({ page }) => {
    const viewportWidth = page.viewportSize()!.width;
    const title = page.locator(".section-title h1").first();
    const paddingLeft = await title.evaluate(
      (el) => getComputedStyle(el).paddingLeft
    );

    const padding = parseFloat(paddingLeft);
    if (viewportWidth >= 768) {
      // Desktop: pl-16 ≈ 64px (rem-based, affected by fluid font-size)
      expect(padding).toBeGreaterThan(50);
      expect(padding).toBeLessThan(70);
    } else {
      // Mobile: pl-4 ≈ 16px
      expect(padding).toBeGreaterThan(12);
      expect(padding).toBeLessThan(20);
    }
  });

  test("no horizontal overflow on the page", async ({ page }) => {
    const bodyWidth = await page.evaluate(() => document.body.scrollWidth);
    const viewportWidth = page.viewportSize()!.width;
    expect(bodyWidth).toBeLessThanOrEqual(viewportWidth);
  });

  test("section content grid uses column flow", async ({ page }) => {
    const content = page.locator(".section-content").first();
    const gridAutoFlow = await content.evaluate(
      (el) => getComputedStyle(el).gridAutoFlow
    );
    expect(gridAutoFlow).toBe("column");
  });
});

test.describe("Portfolio Layout - Mobile", () => {
  test.use({ viewport: { width: 375, height: 667 } });

  test("sections are fully visible on mobile (no opacity animation)", async ({
    page,
  }) => {
    await page.goto(BASE_URL);
    await page.waitForLoadState("domcontentloaded");
    await page.waitForTimeout(300);

    const firstSection = page.locator(".section").first();
    const opacity = await firstSection.evaluate(
      (el) => getComputedStyle(el).opacity
    );
    expect(opacity).toBe("1");
  });

  test("no content overflows viewport width on mobile", async ({ page }) => {
    await page.goto(BASE_URL);
    await page.waitForLoadState("domcontentloaded");

    const scrollParentWidth = await page.evaluate(() => {
      const el = document.getElementById("scroll-parent");
      return el ? el.scrollWidth : 0;
    });
    // scroll-parent should not have horizontal overflow
    expect(scrollParentWidth).toBeLessThanOrEqual(375);
  });
});
