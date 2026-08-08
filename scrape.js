const { chromium } = require("@playwright/test");

const seeds = [77, 78, 79, 80, 81, 82, 83, 84, 85, 86];

(async () => {
  const browser = await chromium.launch({ headless: true });
  const page = await browser.newPage();

  let grandTotal = 0;

  for (const seed of seeds) {
    const url = `https://sanand0.github.io/tdsdata/js_table/?seed=${seed}`;

    console.log(`Opening Seed ${seed}: ${url}`);

    await page.goto(url, { waitUntil: "networkidle" });

    const numbers = await page.locator("table td, table th").evaluateAll(cells =>
      cells
        .map(cell => {
          const text = cell.textContent.trim();
          const match = text.match(/-?\d+(?:\.\d+)?/);
          return match ? Number(match[0]) : 0;
        })
    );

    const seedTotal = numbers.reduce((sum, n) => sum + n, 0);

    console.log(`Seed ${seed}: ${seedTotal}`);

    grandTotal += seedTotal;
  }

  console.log("=================================");
  console.log(`GRAND TOTAL: ${grandTotal}`);
  console.log("=================================");

  await browser.close();
})();
