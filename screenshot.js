// Street View Screenshot Script using Puppeteer
// Install: npm install puppeteer

const puppeteer = require("puppeteer");

async function captureStreetView(browser, lat, lng, heading, outputFile) {
  const page = await browser.newPage();

  // Set viewport size
  await page.setViewport({ width: 1920, height: 1080 });

  // Navigate to Google Maps Street View
  // heading: 0=North, 45=NE, 90=East, 135=SE, 180=South, 225=SW, 270=West, 315=NW
  const url = `https://www.google.com/maps/@${lat},${lng},3a,75y,${heading}h,90t/data=!3m6!1e1!3m4!1s0!2e0!7i16384!8i8192`;

  await page.goto(url, { waitUntil: "networkidle2" });

  // Wait for Street View to load
  await new Promise((resolve) => setTimeout(resolve, 3000));

  // Take screenshot
  await page.screenshot({ path: outputFile, fullPage: false });

  console.log(`Screenshot saved to ${outputFile}`);

  await page.close();
}

async function captureMultipleLocations(locations) {
  const browser = await puppeteer.launch();

  for (let i = 0; i < locations.length; i++) {
    const { lat, lng, heading, name } = locations[i];
    const outputFile = `streetview_${name || i}.png`;

    console.log(
      `Capturing ${
        name || `location ${i}`
      } (${lat}, ${lng}) facing ${heading}°...`
    );
    await captureStreetView(browser, lat, lng, heading || 45, outputFile);
  }

  await browser.close();
  console.log("All screenshots completed!");
}

// List of locations to capture
// heading defines the angle it is facing for the screenshot
const locations = [
  { lat: 40.6423375481, lng: -73.9285629984, heading: 45, name: "nyc1" },
  { lat: 40.7867711196, lng: -73.9484854204, heading: 315, name: "nyc2" },
];

captureMultipleLocations(locations);
