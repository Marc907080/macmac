# VICE CITY: STREET LIFE - APK Creation Guide

## 📱 **How to Create an APK for Android**

This guide will help you convert the web-based game into a **native Android APK** that you can install on your phone.

---

## 🎯 **Option 1: EASIEST - Use PWABuilder (No Coding Required)**

**⭐ Recommended for beginners ⭐**

### **Steps:**

1. **Go to [PWABuilder](https://www.pwabuilder.com/)**

2. **Enter your website URL** (if hosted)
   - OR upload your ZIP file

3. **Click "Generate"**

4. **Download the Android APK**

5. **Transfer to your phone and install**

**Pros:**
- ✅ No coding required
- ✅ Free
- ✅ Works offline
- ✅ Automatic updates

**Cons:**
- ❌ Requires internet for first setup
- ❌ Limited customization

---

## 🎯 **Option 2: Use WebViewGold (Simple & Fast)**

**Great for quick APK generation**

### **Steps:**

1. **Download WebViewGold** from [webviewgold.com](https://www.webviewgold.com/)

2. **Create a new project**

3. **Set the start URL** to your game's index.html

4. **Configure app settings:**
   - App name: VICE CITY: STREET LIFE
   - Package name: com.vicecity.streetlife
   - Version: 1.0

5. **Add permissions:**
   - Internet (for CDN fallback)
   - Storage (for offline cache)

6. **Build the APK**

7. **Test on your phone**

**Pros:**
- ✅ Very easy to use
- ✅ Good performance
- ✅ Offline support

**Cons:**
- ❌ Paid for full features

---

## 🎯 **Option 3: Use Android Studio (Full Control)**

**⭐ Best for developers ⭐**

### **Prerequisites:**
- Android Studio installed on your computer
- Java JDK installed
- Basic knowledge of Android development

### **Steps:**

#### **1. Create a new Android Studio project**

1. Open Android Studio
2. Click **"New Project"**
3. Select **"Empty Activity"**
4. Configure:
   - Name: ViceCity
   - Package name: com.vicecity.streetlife
   - Language: Java or Kotlin
   - Minimum SDK: API 21 (Android 5.0)
5. Click **Finish**

#### **2. Copy game files**

1. In Android Studio, go to **Project** view
2. Navigate to: `app/src/main/assets/`
3. Create a folder named `www`
4. Copy ALL game files into this folder:
   - index.html or index-mobile.html
   - game/ folder
   - js/ folder
   - manifest.json
   - sw.js
   - styles.css (if exists)
   - All other files

#### **3. Create a WebView Activity**

Open `MainActivity.java` and replace with:

```java
package com.vicecity.streetlife;

import android.os.Bundle;
import android.webkit.WebSettings;
import android.webkit.WebView;
import android.webkit.WebViewClient;
import androidx.appcompat.app.AppCompatActivity;

public class MainActivity extends AppCompatActivity {
    private WebView webView;
    
    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        setContentView(R.layout.activity_main);
        
        webView = findViewById(R.id.webview);
        
        // Enable JavaScript
        WebSettings webSettings = webView.getSettings();
        webSettings.setJavaScriptEnabled(true);
        webSettings.setDomStorageEnabled(true);
        webSettings.setAllowFileAccess(true);
        webSettings.setAllowContentAccess(true);
        
        // Enable WebGL
        webSettings.setJavaScriptEnabled(true);
        webSettings.setDomStorageEnabled(true);
        
        // Load local file
        webView.loadUrl("file:///android_asset/www/index-mobile.html");
        
        // Prevent links from opening in browser
        webView.setWebViewClient(new WebViewClient() {
            @Override
            public boolean shouldOverrideUrlLoading(WebView view, String url) {
                view.loadUrl(url);
                return true;
            }
        });
    }
    
    @Override
    public void onBackPressed() {
        if (webView.canGoBack()) {
            webView.goBack();
        } else {
            super.onBackPressed();
        }
    }
}
```

#### **4. Update the Layout**

Open `res/layout/activity_main.xml` and replace with:

```xml
<?xml version="1.0" encoding="utf-8"?>
<RelativeLayout xmlns:android="http://schemas.android.com/apk/res/android"
    xmlns:tools="http://schemas.android.com/tools"
    android:layout_width="match_parent"
    android:layout_height="match_parent"
    tools:context=".MainActivity">
    
    <WebView
        android:id="@+id/webview"
        android:layout_width="match_parent"
        android:layout_height="match_parent" />
</RelativeLayout>
```

#### **5. Update AndroidManifest.xml**

Add these permissions:

```xml
<uses-permission android:name="android.permission.INTERNET" />
<uses-permission android:name="android.permission.ACCESS_NETWORK_STATE" />
<uses-permission android:name="android.permission.WRITE_EXTERNAL_STORAGE" />
<uses-permission android:name="android.permission.READ_EXTERNAL_STORAGE" />
```

Also, add this to the Application tag:

```xml
android:usesCleartextTraffic="true"
```

#### **6. Enable Hardware Acceleration**

In `AndroidManifest.xml`, add to the Activity:

```xml
android:hardwareAccelerated="true"
```

#### **7. Build the APK**

1. Click **Build > Build Bundle(s) / APK(s) > Build APK**
2. Wait for the build to complete
3. Android Studio will show a notification with the APK location
4. Click **"locate"** to find the APK file

#### **8. Install on Your Phone**

1. **Transfer the APK** to your phone (via USB, email, or cloud storage)
2. **Enable "Unknown Sources"** in your phone settings
3. **Open the APK file** and install
4. **Open the app** and start playing!

**Pros:**
- ✅ Full control over the app
- ✅ Best performance
- ✅ Offline support
- ✅ Can add native features

**Cons:**
- ❌ Requires Android Studio setup
- ❌ More complex

---

## 🎯 **Option 4: Use Cordova/PhoneGap (Cross-Platform)**

**Good for iOS and Android**

### **Steps:**

#### **1. Install Node.js and Cordova**

```bash
# Install Node.js from https://nodejs.org/
# Then install Cordova
npm install -g cordova
```

#### **2. Create a Cordova Project**

```bash
cordova create ViceCity com.vicecity.streetlife ViceCity
cd ViceCity
```

#### **3. Add Android Platform**

```bash
cordova platform add android
```

#### **4. Copy Game Files**

```bash
# Copy all game files to www/ folder
cp -r /path/to/vice-city-mobile/* www/
```

#### **5. Configure config.xml**

Edit `config.xml`:

```xml
<widget id="com.vicecity.streetlife" version="1.0.0" xmlns="http://www.w3.org/ns/widgets">
    <name>VICE CITY: STREET LIFE</name>
    <description>AAA-Style Open-World 3D Mobile Driving Game</description>
    <author email="your@email.com" href="https://github.com/Marc907080/macmac">Marc907080</author>
    <content src="index-mobile.html" />
    
    <!-- Enable WebGL -->
    <preference name="EnableViewPortScale" value="true" />
    <preference name="AndroidInsecureWebModeEnabled" value="true" />
    <preference name="AndroidLaunchMode" value="singleInstance" />
    
    <!-- Permissions -->
    <edit-config file="app/src/main/AndroidManifest.xml" mode="merge" target="/manifest/uses-permission">
        <uses-permission android:name="android.permission.INTERNET" />
        <uses-permission android:name="android.permission.ACCESS_NETWORK_STATE" />
        <uses-permission android:name="android.permission.WRITE_EXTERNAL_STORAGE" />
    </edit-config>
    
    <!-- Allow cleartext traffic (for CDN fallback) -->
    <edit-config file="app/src/main/AndroidManifest.xml" mode="merge" target="/manifest/application">
        <application android:usesCleartextTraffic="true" />
    </edit-config>
    
    <!-- Icon -->
    <icon src="icons/icon-512x512.png" />
</widget>
```

#### **6. Build the APK**

```bash
cordova build android
```

#### **7. Find the APK**

The APK will be in: `platforms/android/app/build/outputs/apk/debug/`

#### **8. Install on Your Phone**

Transfer the APK to your phone and install it.

**Pros:**
- ✅ Cross-platform (Android + iOS)
- ✅ Easy to use
- ✅ Good community support

**Cons:**
- ❌ Slightly slower than native
- ❌ Requires Node.js

---

## 📋 **APK Creation Comparison**

| Method | Difficulty | Time | Offline | Customization | Cost |
|--------|------------|------|---------|---------------|------|
| PWABuilder | ⭐ | 5 min | ✅ | ❌ | Free |
| WebViewGold | ⭐⭐ | 10 min | ✅ | ⭐⭐ | Free/Paid |
| Android Studio | ⭐⭐⭐⭐ | 30 min | ✅ | ⭐⭐⭐⭐⭐ | Free |
| Cordova | ⭐⭐⭐ | 20 min | ✅ | ⭐⭐⭐⭐ | Free |

---

## 🔧 **Required Files for APK**

Make sure your project has these files:

```
www/
├── index-mobile.html      # Mobile-optimized HTML
├── manifest.json          # PWA manifest
├── sw.js                  # Service worker
├── game/
│   └── bundle-mobile.js   # Bundled game code
├── js/
│   └── three.min.js       # Three.js library
├── icons/
│   ├── icon-72x72.png
│   ├── icon-96x96.png
│   ├── icon-128x128.png
│   ├── icon-144x144.png
│   ├── icon-152x152.png
│   ├── icon-192x192.png
│   ├── icon-384x384.png
│   └── icon-512x512.png
└── screenshots/
    ├── screenshot1.png
    └── screenshot2.png
```

---

## 📱 **Testing Your APK**

### **On Android Phone:**

1. **Enable Developer Options:**
   - Go to Settings > About Phone
   - Tap "Build Number" 7 times
   - Developer Options will be enabled

2. **Enable USB Debugging:**
   - Go to Settings > Developer Options
   - Enable "USB Debugging"

3. **Install APK via ADB:**
   ```bash
   adb install vice-city.apk
   ```

4. **Or transfer via USB:**
   - Connect phone to computer
   - Copy APK to phone
   - Open file manager on phone
   - Tap APK to install

### **On Emulator:**

1. **Install Android Studio**
2. **Create an AVD (Android Virtual Device)**
3. **Run the emulator**
4. **Drag and drop APK** into the emulator
5. **Install and test**

---

## 🚀 **Publishing to Google Play Store**

If you want to publish your game on Google Play:

### **Requirements:**
- ✅ Signed APK (not debug)
- ✅ App icon (512x512)
- ✅ Screenshots (6.5" and 10" tablet)
- ✅ Feature graphic
- ✅ Description
- ✅ Privacy policy
- ✅ $25 developer fee

### **Steps:**

1. **Create a signed APK:**
   ```bash
   # For Android Studio
   Build > Generate Signed Bundle / APK > APK
   
   # For Cordova
   cordova build android --release
   jarsigner -verbose -sigalg SHA1withRSA -digestalg SHA1 -keystore my-release-key.keystore platforms/android/app/build/outputs/apk/release/app-release-unsigned.apk alias_name
   ```

2. **Create a Google Play Developer account** ($25 one-time fee)

3. **Upload your APK** to Google Play Console

4. **Fill in all required information**

5. **Submit for review** (takes 2-7 days)

6. **Publish!**

---

## 💡 **Tips for Better APK Performance**

1. **Minimize file size:**
   - Compress textures
   - Remove unused code
   - Use WebP images instead of PNG

2. **Enable WebGL:**
   - Make sure WebGL is enabled in your WebView
   - Test on different devices

3. **Add loading screen:**
   - Show a loading screen while Three.js loads
   - Prevents white screen on startup

4. **Test on multiple devices:**
   - Test on low-end phones (2GB RAM)
   - Test on high-end phones (8GB RAM)
   - Test on different Android versions

5. **Add error handling:**
   - Show error messages if WebGL fails
   - Fallback to CDN if local files fail

---

## 🔗 **Useful Links**

- **PWABuilder:** https://www.pwabuilder.com/
- **WebViewGold:** https://www.webviewgold.com/
- **Android Studio:** https://developer.android.com/studio
- **Cordova:** https://cordova.apache.org/
- **PhoneGap:** https://phonegap.com/
- **Google Play Console:** https://play.google.com/console

---

## 📝 **Troubleshooting APK Issues**

### **Problem: APK won't install**
- **Solution:** Enable "Unknown Sources" in phone settings
- **Solution:** Check if APK is corrupted (try rebuilding)
- **Solution:** Make sure package name is unique

### **Problem: White screen on startup**
- **Solution:** Check if Three.js is loading (add console.log)
- **Solution:** Make sure WebGL is enabled in WebView
- **Solution:** Add error handling for WebGL failures

### **Problem: Game is laggy**
- **Solution:** Reduce graphics quality in settings
- **Solution:** Test on a different device
- **Solution:** Close other apps to free up RAM

### **Problem: Controls don't work**
- **Solution:** Make sure touch events are enabled in WebView
- **Solution:** Test touch controls in Chrome first
- **Solution:** Check for JavaScript errors

### **Problem: Internet required**
- **Solution:** Make sure Three.js is bundled locally
- **Solution:** Check if all files are in the correct location
- **Solution:** Test offline in Chrome first

---

## 🎉 **Success!**

Once you've created your APK, you can:
- Install it on your phone
- Share it with friends
- Publish it on Google Play
- Sell it (if you want)

**Enjoy your native Vice City game on Android! 🚗💨**

---

**Need Help?**
- Check the [MOBILE-GUIDE.md](MOBILE-GUIDE.md) for mobile-specific tips
- Check the [README.md](README.md) for general information
- Open an issue on GitHub for bugs

**Happy driving! 🎮**
