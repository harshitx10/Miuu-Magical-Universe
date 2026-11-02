# 🌙 Miuu's Magical Birthday Universe 🌙

An extraordinary, award-winning, cinematic birthday surprise website crafted specifically for **Miuu**. This website is a luxury digital surprise gift full of interactive locations, emotional letters, a progress-saving achievement shelf, a countdown timer, a mini-game, and custom particles.

---

## 🚀 How to Run the Website

Due to browser security protocols (CORS) regarding ES Modules, double-clicking `index.html` directly will result in browser errors. A lightweight local server is required. 

We have provided a automated script to handle this:

1. Double-click the file **`run_website.bat`** in this folder.
2. It will automatically start Python's built-in server (port 8000) and open your browser to:
   [http://localhost:8000](http://localhost:8000)

---

## 🎵 Background Music: Buck Owens - Made in Japan

- The website is configured to play the song **"Made in Japan" by Buck Owens**.
- **Important**: To activate the music, place your MP3 file in this root folder and rename it exactly to:
  `made_in_japan.mp3`
- The music will automatically start playing **only after entering the correct password (MIUU)** to maintain the magical opening mystery.
- The vintage vinyl player floats in the bottom-right and keeps playing across sections.
- When you open the gates of **The Final Castle**, the volume will slowly fade down, display the typing sequence of the final message, and then fade back up to play in the background of the sparkling starry moon screen.

---

## ✍️ Customizing Content

You can easily customize all text, dates, compliments, secrets, letters, and pictures without editing any code!

Open **`data.js`** in a text editor to modify:
- **Nickname & Password**: Change `✨ MIUU ✨` or the password `MIUU`.
- **Target Date**: Adjust the countdown date.
- **Garden Compliments**: Customize the 100 compliments that appear when flowers bloom.
- **100 Reasons**: Edit the 100 card compliments.
- **Letters**: Customize the text inside the vintage envelopes.
- **Constellation Stars**: Add your own custom blessings for the stars.
- **Memory Map Pins**: Customize coordinates and titles of places you share memories in.
- **Quiz**: Change questions, options, and rewards.
- **Memory Book Pages**: Swap texts and edit photo links.
- **Dream Tree & Gift Boxes**: Edit the random surprises.

---

## 📸 Swapping Photos & Videos

1. **Smile Gallery**: Replace the placeholder image URLs in `data.js` (inside `galleryPhotos` and `timelineEvents`) with your own local paths (e.g. `./images/photo1.jpg`) or hosted links.
2. **Ending Moon Frame**: Replace the image URL in `app.js` (inside the `FinalCastle` component) or simply drop your photo in the folder and link to it.
3. **Cinematic Video**: Drop your MP4 file in the root folder, and update the `<video src="...">` tag in `app.js` to point to your file name (e.g. `./my_video.mp4`).
