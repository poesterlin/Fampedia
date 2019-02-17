# Setup
This is how you can setup your development environment:

## Frontends
The Frontend has different parts:
- Web page
- Apps for
    - Android
    - iOS
    - Desktop


### Web


**Install: (once)**
```
npm install
```
**Run:**

For live update mode:
```
    npm start
```
-> Website is then running on: `http://localhost:4200/`

For production build:
```
    npm run build
```
-> Output can be found in the `www ` folder.

### Android
Dependencies:
- install Android Studio

**Install: (once)**
```
npm install
npm install -g npx
npx cap add android
```
**Run:**
```
npm run android
```
-> This opens android studio and starts the build process. Might have some warnings but you can ignore them. Press run and select a virtual device or connect a device via usb.


### iOS
Dependencies:
- Mac OS X
- Xcode 9 and the Xcode command line tools
  
**Install: (once)**
```
npm install
npm install -g npx
npx cap add ios
```
**Run:**
```
npm run ios
```
This opens the desktop electron app.


### Desktop

**Install: (once)**
```
npm install
npm install -g npx
npx cap add electron
```
**Run:**
```
npm run electron
```
This opens the desktop electron app.


## Backend
