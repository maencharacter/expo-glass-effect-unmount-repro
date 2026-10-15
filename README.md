# GlassView draws no glass after another view unmounts

Minimal reproduction for `expo-glass-effect` on iOS.

A `GlassView` inside a parent that fades in from opacity 0 to 1 shows its glass.
Once the app unmounts any other React Native view, the same `GlassView` draws no glass at all.
Its children render over sharp, unblurred content.
This lasts until the app is relaunched.

## Environment

- Expo SDK 57 (`expo` 57.0.29), React Native 0.86.3, New Architecture
- `expo-glass-effect` 57.0.4
- iPhone 17 Pro simulator, on iOS 26.4 and on iOS 27.0. Xcode 27.0, macOS 27.0.1.
- `expo-build-properties` turns on `ios.enableSceneSupport` only so the app launches on iOS 27, which closes an app built with the iOS 27 SDK unless it uses scenes. On iOS 26.4 the bug reproduces with or without it.

## Run

```sh
npm install
npx expo run:ios
```

## Steps

1. Tap **1. Open glass panel (fades in)**. The panel shows glass, and the text behind it is blurred. Tap anywhere to close it.
2. Repeat step 1 as often as you like. The glass shows every time.
3. Tap **3. Unmount the box below**. The grey "An ordinary View" box disappears.
4. Tap **1. Open glass panel (fades in)** again.

Expected: the panel shows glass, as in step 1.

Actual: the panel draws no glass. Its two rows sit on top of sharp text.
Every later fade-in fails the same way.
Mounting the box again does not help.

## What changes the result

All in the same app session, after step 3:

| Panel | Result |
| --- | --- |
| Fades in, content is rows, each a `View` with `borderRadius` | No glass |
| No fade, same rows | Glass |
| Fades in, content is plain `Text` lines | Glass |

Before step 3, all three show glass. The **Panel content** button switches between rows and plain text.

The unmounted view can be anything.
We first saw this when a `react-native-webview` WebView unmounted.
A plain `View` does the same, on screen or off screen.

## How we found it

In our app, dropdown menus that fade in lost their glass after the app came back from the background.
Going to the background unmounts some WebViews in our app, and that is what set it off.
We worked around it by not fading the glass's parents when a menu opens.
