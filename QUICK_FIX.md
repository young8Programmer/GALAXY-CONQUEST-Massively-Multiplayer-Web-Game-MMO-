# 🔧 Tezkor Yechim - Backend Xatosi

## Muammo
`Cannot find module './scan'` - bu root `node_modules` va backend `node_modules` o'rtasidagi conflict.

## Yechim (Qo'lda qiling)

**1. Terminalni yoping va yangi terminal oching (CMD yoki PowerShell)**

**2. Quyidagi buyruqlarni ketma-ket bajaring:**

```cmd
cd "C:\Users\valir\OneDrive\Рабочий стол\Yangi loyihalar\GALAXY CONQUEST — Massively Multiplayer Web Game (MMO)"

REM Root node_modules ni o'chirish (agar bor bo'lsa)
if exist node_modules rmdir /s /q node_modules
if exist package-lock.json del package-lock.json

REM Backend ga o'tish
cd backend

REM Backend node_modules ni o'chirish
if exist node_modules rmdir /s /q node_modules
if exist package-lock.json del package-lock.json

REM npm cache tozalash
npm cache clean --force

REM Qayta o'rnatish
npm install

REM Test qilish
npm run start:dev
```

**Yoki PowerShell da:**

```powershell
cd "C:\Users\valir\OneDrive\Рабочий стол\Yangi loyihalar\GALAXY CONQUEST — Massively Multiplayer Web Game (MMO)"

# Root tozalash
Remove-Item -Recurse -Force node_modules -ErrorAction SilentlyContinue
Remove-Item -Force package-lock.json -ErrorAction SilentlyContinue

# Backend ga o'tish
cd backend

# Backend tozalash
Remove-Item -Recurse -Force node_modules -ErrorAction SilentlyContinue
Remove-Item -Force package-lock.json -ErrorAction SilentlyContinue

# Cache tozalash
npm cache clean --force

# O'rnatish
npm install

# Test
npm run start:dev
```

**Agar hali ham muammo bo'lsa:**

```cmd
cd backend
npm install --legacy-peer-deps --force
npm run start:dev
```

Bu muammo root papkadagi `node_modules` va backend `node_modules` o'rtasidagi dependency conflict tufayli yuzaga kelmoqda. Root `node_modules` ni tozalash kerak.
