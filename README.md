# 🌻 A Birthday Surprise for Sunflower (Salome)

A creative, interactive, romantic birthday website crafted with love.

---

## 📁 Where to Drop Your Files

Everything is pre-wired to work out of the box with sweet placeholders. When you're ready, simply drop your real files into these folders:

### 1. Chat Screenshot
* Put your screenshot here: `assets/images/chat.png` (or `.jpg`)
* *(If using a different file name, update `chatImage` in `js/config.js`)*

### 2. Her 4 Pretty Photos (Heart Carousel)
* Place her 4 favorite pictures here:
  * `assets/images/carousel/1.jpg`
  * `assets/images/carousel/2.jpg`
  * `assets/images/carousel/3.jpg`
  * `assets/images/carousel/4.jpg`

### 3. Childhood-to-Now Photos (Memory Slideshow)
* Place them in chronological order (kid $\rightarrow$ present):
  * `assets/images/slideshow/1.jpg`
  * `assets/images/slideshow/2.jpg`
  * `assets/images/slideshow/3.jpg`
  * `assets/images/slideshow/4.jpg`
  * ...up to however many you have!
* You can easily customize the captions and eras for each photo in [js/config.js](file:///C:/Users/HP/.gemini/antigravity/scratch/sunflower-birthday/js/config.js).

### 4. Background Song (*Dancing in the Smoke* - Giveon)
* Drop your song file here: `assets/audio/music.mp3` or `assets/audio/dancing-in-the-smoke.mp3`
* *(Note: Even without the mp3 file, the site features a romantic ambient music-box fallback melody so it never plays in silence).*

---

## ✍️ Customizing the Romantic Letter & Words
Open `js/config.js` in any text editor. You can tweak:
* The drafted letter (paragraphs, memories, secondary school callbacks, God's blessings).
* Her nicknames or captions.
* Slideshow titles and eras.

---

## 🚀 How to Preview Locally

Double click `index.html` to open it in your browser, or run a simple local web server:
```bash
# In terminal inside the sunflower-birthday folder:
npx serve .
# OR using python:
python -m http.server 8000
```
Then visit `http://localhost:8000` or the displayed local port.

---

## 🌐 How to Send It to Her (Free & 1-Minute Live Link)

To send it to her phone so she can open it on WhatsApp / iMessage:
1. **Option A (Vercel):** Drag and drop this folder onto [vercel.com](https://vercel.com) — it will give you an instant live HTTPS link!
2. **Option B (Netlify Drop):** Go to [app.netlify.com/drop](https://app.netlify.com/drop) and drag this entire `sunflower-birthday` folder right onto the page. You get a live link in 10 seconds!
3. **Option C (GitHub Pages):** Push the folder to a GitHub repository and turn on GitHub Pages.
