# VICE CITY: STREET LIFE - Mobile Guide

## 📱 How to Play on Android Phone

### **Option 1: Play in Chrome (Easiest)**

1. **Download the ZIP file** from GitHub
2. **Extract** the ZIP to your phone
3. **Open** `index-mobile.html` in **Chrome** browser
4. **Allow** the game to load (may take 2-3 seconds)
5. **Tap** "FREE ROAM" to start driving!

**✅ Works on:** All Android phones with Chrome
**✅ No installation required**
**✅ No internet required after first load**

---

### **Option 2: Add to Home Screen (PWA)**

1. Open `index-mobile.html` in Chrome
2. Tap the **three dots menu** (⋮) in Chrome
3. Tap **"Add to Home screen"**
4. Confirm by tapping **"Add"**
5. The game will now appear as an app on your home screen!

**Benefits:**
- Opens like a native app
- Works offline
- No browser chrome
- Fullscreen mode

---

### **Option 3: Create APK (Advanced)**

#### **Method A: Using Android Studio (Recommended)**

1. **Install Android Studio** on your computer
2. **Create a new project** with WebView
3. **Copy** the game files to `assets/www/` folder
4. **Build** the APK
5. **Transfer** to your phone and install

#### **Method B: Using Online Tools (Easiest)**

**Recommended Online Tools:**
1. **[PWABuilder](https://www.pwabuilder.com/)**
   - Upload your ZIP file
   - Generate Android APK
   - Download and install

2. **[Appy Pie](https://www.appypie.com/)**
   - Create a WebView app
   - Point to your hosted game
   - Generate APK

3. **[WebViewGold](https://www.webviewgold.com/)**
   - Simple WebView wrapper
   - Easy APK generation

#### **Method C: Using Cordova (For Developers)**

```bash
# Install Cordova
npm install -g cordova

# Create project
cordova create ViceCity com.vicecity.streetlife ViceCity

# Add Android platform
cd ViceCity
cordova platform add android

# Copy game files to www/
cp -r /path/to/vice-city-mobile/* www/

# Build APK
cordova build android

# APK will be in: platforms/android/app/build/outputs/apk/debug/
```

---

## 🎮 **Mobile Controls**

### **Touch Controls**

| Button | Position | Action |
|--------|----------|--------|
| **←** | Left Side | Steer Left |
| **→** | Right Side | Steer Right |
| **↑** | Right Side | Accelerate |
| **↓** | Left Side | Brake/Reverse |
| **N** | Bottom Center | Nitro Boost |

### **Tips for Better Control**

1. **Use both thumbs** - One for steering, one for accelerate/braking
2. **Tap and hold** for continuous action
3. **Release to stop** - Lift your finger to stop accelerating or steering
4. **Combine controls** - Steer + Accelerate for smooth turns

---

## ⚡ **Performance Tips for Mobile**

### **For Best Performance:**

1. **Use Chrome** - Best optimized for WebGL
2. **Close other apps** - Free up RAM
3. **Enable Hardware Acceleration** in Chrome settings
4. **Use WiFi** for initial load (if using CDN)
5. **Clear cache** if game is slow

### **Lower Graphics for Older Phones:**

If the game runs slow:
1. Open Chrome settings
2. Enable "Lite Mode" (Data Saver)
3. Close background tabs
4. Restart your phone

---

## 🔧 **Troubleshooting**

### **Problem: Game doesn't load**
- **Solution:** Make sure you have internet connection for first load
- **Solution:** Use Chrome browser (not other browsers)
- **Solution:** Clear browser cache and retry

### **Problem: Black screen**
- **Solution:** Wait 2-3 seconds, the game is loading
- **Solution:** Check browser console for errors (Chrome: Menu > More Tools > Developer Tools)
- **Solution:** Try `index-mobile.html` instead of `index.html`

### **Problem: Controls don't work**
- **Solution:** Make sure touch controls are enabled (they should be visible at bottom)
- **Solution:** Try tapping different areas of the screen
- **Solution:** Restart the game

### **Problem: Game is laggy**
- **Solution:** Close other apps
- **Solution:** Use Chrome instead of other browsers
- **Solution:** Try on WiFi instead of mobile data
- **Solution:** Wait for the game to fully load

### **Problem: Can't install as PWA**
- **Solution:** Make sure you're using Chrome
- **Solution:** Visit the page twice (some browsers need this)
- **Solution:** Check that the site is served over HTTPS (for PWA)

---

## 📊 **Device Compatibility**

### **✅ Fully Supported**
- Samsung Galaxy (A series, S series, Note series)
- Google Pixel (All models)
- OnePlus (All models)
- Xiaomi (Redmi, Mi, POCO series)
- Motorola (G series, E series)
- Any phone with Chrome and WebGL support

### **⚠️ Limited Support**
- Very old phones (Android 6.0 and below)
- Phones with less than 2GB RAM
- Some Huawei phones (no Google services)
- Opera Mini, UC Browser

### **❌ Not Supported**
- iOS (iPhone) - Safari doesn't support WebGL well
- Windows Phone
- Blackberry

---

## 🎯 **Recommended Settings**

For **Samsung Galaxy A25** (Your phone):
- **Graphics:** Medium
- **Resolution:** Adaptive
- **Target FPS:** 30 (60 if stable)
- **Shadows:** Medium
- **View Distance:** Medium
- **Traffic:** Low

---

## 📦 **File Structure for APK**

If you're creating an APK manually, use this structure:

```
assets/
└── www/
    ├── index-mobile.html
    ├── manifest.json
    ├── sw.js
    ├── game/
    │   └── bundle-mobile.js
    ├── icons/
    │   └── icon.svg
    └── js/
        └── three.min.js
```

---

## 🔗 **Quick Links**

- **Download ZIP:** [vice-city-mobile-phase1.zip](https://github.com/Marc907080/macmac/raw/main/vice-city-mobile-phase1.zip)
- **GitHub:** https://github.com/Marc907080/macmac
- **Three.js:** https://threejs.org/
- **PWABuilder:** https://www.pwabuilder.com/

---

## 💡 **Pro Tip**

For the **best experience**, use the **PWA method** (Add to Home Screen). This gives you:
- Native app-like experience
- Offline play
- No browser UI
- Faster loading
- Push notifications (in future updates)

---

**Need Help?**
- Check the [README.md](README.md) for general information
- Check the [CHANGELOG.md](CHANGELOG.md) for latest updates
- Open an issue on GitHub for bugs

**Enjoy driving in Vice City! 🚗💨**
