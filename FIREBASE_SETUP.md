# Firebase Setup for React Native

## ❌ Current Error
```
Error: No Firebase App '[DEFAULT]' has been created - call firebase.initializeApp()
```

## ✅ Solution: Add Firebase Configuration Files

### **Step 1: Get google-services.json from Firebase Console**

1. Go to [Firebase Console](https://console.firebase.google.com)
2. Select your project (or create one)
3. Click ⚙️ Settings → **Project Settings**
4. Scroll to **Your apps** section

### **Step 2: Add Android App (if not exists)**

1. Click **Add app** → Select **Android** icon
2. Enter package name: **`com.kritijobapp`** (must match exactly)
3. Optional: Enter app nickname (e.g., "KritiJob Android")
4. Click **Register app**

### **Step 3: Download google-services.json**

1. Click **Download google-services.json**
2. Place it in: **`android/app/google-services.json`**

```
KritiJobApp/
  android/
    app/
      google-services.json  ← Place here
      src/
      build.gradle
```

### **Step 4: Clean & Rebuild**

```bash
# Clean Android build
cd android
./gradlew clean
cd ..

# Rebuild the app
npm run android
```

### **Step 5: Verify Setup**

App should start without Firebase errors. You should see:
- No "Firebase App not created" error
- FCM token registered after login

---

## 📝 Important Notes

### ⚠️ **Security**
- `google-services.json` is in `.gitignore` - DO NOT commit to Git
- Each developer needs their own copy from Firebase Console
- For production, use different Firebase projects for dev/staging/prod

### ✅ **Already Configured**
- ✅ Firebase dependencies installed (`@react-native-firebase/app`, `@react-native-firebase/messaging`)
- ✅ Gradle plugin added to `android/build.gradle`
- ✅ Google Services plugin applied in `android/app/build.gradle`
- ✅ Backend Firebase Admin SDK configured

### 📦 **What's Missing**
- ❌ `google-services.json` file (you need to download it)

---

## 🔧 Alternative: Use Template (For Quick Testing)

If you want to test without Firebase Console access:

1. Copy `android/app/google-services.json.template` to `android/app/google-services.json`
2. Replace placeholder values with your Firebase project details
3. Rebuild app

**Note:** This is NOT recommended - always download from Firebase Console for production.

---

## 🧪 Verify Firebase is Working

After adding the file and rebuilding:

1. **Open Metro logs:**
   ```bash
   npm start
   ```

2. **Check for:**
   - ✅ No Firebase errors
   - ✅ "FCM token registered with backend successfully" (after login)

3. **Test notifications:**
   - Login as candidate
   - Have employer create a job
   - You should receive a push notification

---

## 🆘 Still Having Issues?

### Error: "App is not authorized to use Firebase"
- Verify package name matches: `com.kritijobapp`
- Re-download `google-services.json`
- Clean and rebuild

### Error: "google-services.json not found"
- Check file location: `android/app/google-services.json`
- File name must be exact (lowercase, hyphenated)
- Rebuild after adding file

### Error: Firebase still not initialized
- Check `android/build.gradle` has Google Services classpath
- Check `android/app/build.gradle` applies the plugin
- Run `./gradlew clean` in android folder

---

## 📚 Documentation

For more details:
- [React Native Firebase Setup](https://rnfirebase.io/)
- [Firebase Console](https://console.firebase.google.com)
- [Push Notifications Guide](../PUSH_NOTIFICATIONS_GUIDE.md)
