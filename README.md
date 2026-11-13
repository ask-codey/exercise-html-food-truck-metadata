# Exercise: Make the Food Truck Page Shine

Exercise code for the lesson **Exercise: Make the Food Truck Page Shine** in the HTML in Depth course on [ask-codey.com](https://www.ask-codey.com).

Rolling Tacos, a food truck, has a good-looking page that nobody can find. Its title says "Home", it has no description, a shared link shows a bare address, and search engines can't read its hours. You'll write the head of `index.html` so the page shows well in a search result, makes a real preview card in a chat app, and describes the truck to machines with structured data. Tests check every part.

## Before you start

Install Node.js once, if you haven't yet (the lesson *Setup: VS Code, a Browser and Node.js* shows how). Then open this folder in VS Code, open the terminal (**Terminal > New Terminal**), and type:

```bash
npm install
```

That downloads the two tools the tests use into a `node_modules` folder. You only do it once.

## What's here

- `index.html`: the Rolling Tacos page. The body is finished; the `<head>` is yours to write. For you to finish.
- `menu-and-schedule.txt`: every fact you need for the head: the website address, the share picture's address and description, the phone number, the fall spot, its map location, the schedule and the menu. Ready to use.
- `share-image.jpg`: the photo of the truck, 1200 by 630 pixels, the right size for a preview card. Ready to use.
- `style.css`: the page's look. Ready to use; you don't need to change it.
- `page.test.js` and `package.json`: the tests, and the file that names the tools they need. You don't need to change these.

## Run it

Open `index.html` with Live Server (right-click it in VS Code, then **Open with Live Server**) to see the page.

## Check your work

```bash
npm test
```

At first seven of the eight checks fail: that is expected. Each part of the head you write turns its check green. Every check prints what it found as a numbered line, such as `1) title: Home (4 characters)`, and a failing check's message says what it expected. The last check runs an HTML validator over the whole page.

## What to do

1. **The title.** Replace "Home" with a title that says what the page offers, then the site name: 60 characters or fewer.
2. **The description.** Add a meta description of 50 to 160 characters that would make a hungry person click.
3. **The canonical link.** The page lives at `https://rollingtacos.example/`. Say so with a canonical link.
4. **The preview card.** Add the Open Graph tags (`og:title`, `og:description`, `og:type`, `og:url`, `og:image`, `og:image:alt`) and `twitter:card`. The picture's address must be the full one in `menu-and-schedule.txt`.
5. **The structured data.** Add a JSON-LD block that describes Rolling Tacos with schema.org: its type, name, address, map location and fall schedule.
6. **Check it with the validators** (once the tests are green). Paste your JSON-LD block into the Schema Markup Validator (validator.schema.org, **Code snippet**), and your whole `index.html` into the W3C validator (validator.w3.org/nu, **Validate by direct input**). Fix anything they report.

## The rules

- The head must agree with the page. Every fact comes from `menu-and-schedule.txt` or the page itself.
- The truck moved for the fall. Use the new spot and the new hours, not the ones from the lessons.
- Write the structured data for things a visitor can see on the page. No made-up reviews or ratings.

## Tips

- Read `menu-and-schedule.txt` before you write anything. Everything you need is in it.
- Open Graph tags use `property="og:..."`. The description and `twitter:card` use `name="..."`.
- When the JSON check says the block isn't valid JSON, look at the line before the one it names: a missing or extra comma is the usual cause.
- Count characters with VS Code: select the text, and the bar at the bottom of the window shows how many you selected.

## Hand it in

When it works, put your solution in a public repo of your own on GitHub, then paste that repo's address into **Submit your exercise** on the lesson page at [ask-codey.com](https://www.ask-codey.com). That's what completes the lesson. You don't need Git: create the repo on GitHub, choose **Add file**, then **Upload files**, and upload everything in this folder except `node_modules` (it's the files `npm install` downloaded, far too many for GitHub's upload, and `npm install` makes it again). The lesson page shows each step, and the lesson *Put Your Work on GitHub* walks through every screen.
