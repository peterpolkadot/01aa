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

function extractSaints(html) {
  const saints = new Map();
  // Match: href="/saints/saint.php?saint_id=123">Name Here</a>
  const regex = /href="\/saints\/saint\.php\?saint_id=(\d+)"[^>]*>([^<]+)</g;
  let match;
  while ((match = regex.exec(html)) !== null) {
    const id = match[1];
    const name = match[2].trim();
    if (name && name.length > 1 && !name.includes("Image of") && !saints.has(name)) {
      saints.set(name, id);
    }
  }
  return saints;
}

async function main() {
  console.log("🚀 Starting catholic.org scraper");
  const allSaints = new Map();

  for (const letter of letters) {
    try {
      const { html, status } = await fetchPage(letter);
      if (status === 200) {
        const saints = extractSaints(html);
        saints.forEach((id, name) => {
          if (!allSaints.has(name)) allSaints.set(name, id);
        });
        console.log(`${letter}: ${saints.size} saints`);
      } else {
        console.log(`${letter}: HTTP ${status} — skipped`);
      }
      await new Promise(r => setTimeout(r, 500));
    } catch (e) {
      console.error(`${letter} failed: ${e.message}`);
    }
  }

  // Write CSV with name and image_url
  const sorted = [...allSaints.entries()].sort((a, b) => a[0].localeCompare(b[0]));
  const rows = sorted.map(([name, id]) => {
    const safeName = name.replace(/"/g, '""');
const imageUrl = `https://www.catholic.org/files/images/saints/${id}.jpg`;
    return `"${safeName}","${imageUrl}"`;
  });

  const csv = "name,image_url\n" + rows.join("\n");
  fs.writeFileSync("saints.csv", csv);
  console.log(`\n✅ Done — ${sorted.length} saints written to saints.csv`);
}

main().catch(err => {
  console.error("❌ Failed:", err.message);
  process.exit(1);
});
