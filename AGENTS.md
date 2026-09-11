# Project Guidelines & Agent Instructions

## 1. Execution & Testing Policy (STRICT RULE)
> **DO NOT RUN OR TEST**: The agent is strictly prohibited from running development servers, native builds, emulators, or test suites (`npm run start`, `npm run android`, `npm run ios`, `npm run web`, `npm run android:dev`, etc.).
> **All running, launching, building, and testing will be executed manually by the USER.**
> The agent's role is strictly limited to code analysis, writing/editing code, and fixing issues without running them.

---

## 2. Expo SDK & Documentation Rule
> **IMPORTANT**: Expo APIs and packages change across major releases. Always consult the exact versioned documentation for Expo SDK 57:
> **https://docs.expo.dev/versions/v57.0.0/** before writing code or adding dependencies.

---

## 3. Tech Stack

- **Framework**: Expo SDK 57 (`~57.0.12`) with New Architecture
- **Runtime & Language**: React 19 (`19.2.3`), React Native (`0.86.2`), TypeScript (`~6.0.3`)
- **Routing**: Expo Router v57 with typed routes (`experiments.typedRoutes = true`)
- **Compiler**: React Compiler enabled (`experiments.reactCompiler = true`)
- **Styling**: NativeWind v5 (`^5.0.0-preview.2`) + Tailwind CSS v4 (`^4.2.0`), Gluestack UI Core v5 (`@gluestack-ui/core`)
- **Animations**: React Native Reanimated v4 (`4.5.1`), React Native Worklets (`0.10.1`), `@legendapp/motion` (`^2.4.0`)
- **Icons & Assets**: `expo-symbols`, `expo-image`, `@expo/html-elements`

---

## 4. Directory Layout & Path Aliases

### Path Aliases
Path aliases are configured in [`tsconfig.json`](./tsconfig.json) and [`babel.config.js`](./babel.config.js):
- `@/*` &rarr; `./src/*` (e.g., `@/components/...`, `@/hooks/...`, `@/constants/...`, `@/global.css`)
- `@/assets/*` &rarr; `./assets/*` (e.g., `@/assets/images/...`)

### Directory Structure
```
personal-v4/
├── android/               # Native Android project (managed via prebuild)
├── assets/                # App assets (icons, splash, images)
│   ├── expo.icon
│   └── images/
├── src/
│   ├── app/               # Expo Router file-based routes
│   │   ├── _layout.tsx    # Root layout & providers
│   │   ├── index.tsx      # Home screen
│   │   └── explore.tsx    # Explore screen
│   ├── components/        # Reusable UI components
│   │   ├── ui/            # Primitive UI / Gluestack components
│   │   ├── animated-icon.tsx
│   │   ├── app-tabs.tsx
│   │   └── ...
│   ├── constants/         # App constants & theme definitions
│   │   └── theme.ts
│   ├── hooks/             # Custom React hooks
│   └── global.css         # Tailwind & global CSS styles
├── app.json               # Expo configuration
├── babel.config.js        # Babel configuration with module-resolver
├── metro.config.js        # Metro bundler with NativeWind
├── package.json           # Dependencies and scripts
└── tsconfig.json          # TypeScript compiler options
```

---

## 5. Environment & Build Requirements

### Java Development Kit (JDK)
- **Required**: **JDK 17** (e.g., Eclipse Adoptium Temurin 17).
- *Do not use JDK > 21* as Android Gradle Plugin / `jlink` (`JdkImageTransform`) will fail during build.
- `JAVA_HOME` must point to JDK 17 (e.g., `C:\Users\<User>\.gradle\jdks\eclipse_adoptium-17-amd64-windows.2`).

### Android SDK
- `ANDROID_HOME` must point to the Android SDK directory (e.g., `%LOCALAPPDATA%\Android\Sdk`).
- PATH must include `%ANDROID_HOME%\platform-tools` and `%JAVA_HOME%\bin`.

---

## 6. Development Commands

| Command | Description |
| :--- | :--- |
| `npm run start` | Start Metro development server (`expo start`) |
| `npm run android:dev` | Regenerate native folder and build/run on Android (`npx expo prebuild && npx expo run:android`) |
| `npm run android` | Run on connected Android device/emulator (`expo run:android`) |
| `npm run ios` | Run on iOS simulator (`expo run:ios`) |
| `npm run web` | Start web development server (`expo start --web`) |
| `npx tsc --noEmit` | Run TypeScript type checking |
| `npm run lint` | Run ESLint check (`expo lint`) |

---

## 7. Coding Conventions & Best Practices

1. **Imports**:
   - Always use `@/` for source files in `src/` (e.g., `@/components/my-component`, `@/constants/theme`).
   - Use `@/assets/` for static assets in `assets/`.
   - Never use relative traversal like `../../components` across boundaries when `@/` is available.
2. **File-based Routing**:
   - Place screens and route groups inside `src/app/`.
   - Keep layout logic and global providers inside `src/app/_layout.tsx`.
3. **Styling**:
   - Use Tailwind utility classes via `className="..."` with NativeWind.
   - For custom theme values and color constants, reference `@/constants/theme`.
4. **New Architecture & Worklets**:
   - Ensure native module compatibility with React Native 0.86 New Architecture.
   - Use `react-native-worklets` and `react-native-reanimated` v4 API patterns.
