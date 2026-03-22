// catholic-scraper.js
const https = require("https");
const fs = require("fs");

const letters = "ABCDEFGHIJKLMNOPQRSTUVWXYZ".split("");

function fetchPage(letter) {
  return new Promise((resolve, reject) => {
    const options = {
      hostname: "www.catholic.org",
      path: `/saints/stindex.php?lst=${letter}`,
      method: "GET",
      headers: {
        "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36",
        "Accept": "text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8",
        "Accept-Language": "en-US,en;q=0.5",
        "Connection": "keep-alive"
      }
    };

    https.get(options, res => {
      let data = "";
      res.on("data", chunk => data += chunk);
      res.on("end", () => resolve({ letter, html: data, status: res.statusCode }));
    }).on("error", reject);
  });
}

function extractNames(html) {
  const names = new Set();
  // Match saint links: <a href="saint.php?saint_id=123">St. Name</a>
  const regex = /href="saint\.php\?saint_id=\d+"[^>]*>([^<]+)</g;
  let match;
  while ((match = regex.exec(html)) !== null) {
    const name = match[1].trim();
    if (name && name.length > 1) names.add(name);
  }
  return [...names];
}

async function main() {
  console.log("🚀 Starting catholic.org scraper");
  const allNames = new Set();

  for (const letter of letters) {
    try {
      const { html, status } = await fetchPage(letter);
      console.log(`${letter}: HTTP ${status}, ${html.length} bytes`);

      if (status === 200) {
        const names = extractNames(html);
        names.forEach(n => allNames.add(n));
        console.log(`  ✅ ${names.length} saints found`);
      } else {
        console.log(`  ⚠️ Skipped — status ${status}`);
      }

      // Small delay to be polite
      await new Promise(r => setTimeout(r, 500));

    } catch (e) {
      console.error(`  ❌ ${letter} failed: ${e.message}`);
    }
  }

  const sorted = [...allNames].sort();
  const csv = "name\n" + sorted.map(n => `"${n.replace(/"/g, '""')}"`).join("\n");
  fs.writeFileSync("saints.csv", csv);
  console.log(`\n✅ Done — ${sorted.length} saints written to saints.csv`);
}

main().catch(err => {
  console.error("❌ Failed:", err.message);
  process.exit(1);
});
