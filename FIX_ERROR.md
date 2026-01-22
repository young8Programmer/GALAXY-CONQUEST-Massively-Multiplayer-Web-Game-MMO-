# 🔧 Xatoni Tuzatish

## Muammo
`Cannot find module './scan'` - bu `node_modules` dependency conflict muammosi.

## Yechim

### 1-qadam: Root papkada
```bash
cd "C:\Users\valir\OneDrive\Рабочий стол\Yangi loyihalar\GALAXY CONQUEST — Massively Multiplayer Web Game (MMO)"
```

### 2-qadam: node_modules va lock fayllarni o'chirish
```bash
# Root node_modules
if exist node_modules rmdir /s /q node_modules

# Backend node_modules
if exist backend\node_modules rmdir /s /q backend\node_modules

# Frontend node_modules  
if exist frontend\node_modules rmdir /s /q frontend\node_modules

# Lock fayllar
if exist package-lock.json del package-lock.json
if exist backend\package-lock.json del backend\package-lock.json
if exist frontend\package-lock.json del frontend\package-lock.json
```

### 3-qadam: npm cache tozalash
```bash
npm cache clean --force
```

### 4-qadam: Qayta o'rnatish
```bash
# Root dependencies
npm install

# Backend dependencies
cd backend
npm install

# Frontend dependencies
cd ../frontend
npm install
```

### 5-qadam: Backend ishga tushirish
```bash
cd backend
npm run start:dev
```

## Alternativ yechim (agar yuqoridagi ishlamasa)

Backend papkasida:
```bash
cd backend
npm install --legacy-peer-deps
npm run start:dev
```

Yoki Node.js versiyasini tekshiring (18+ kerak):
```bash
node --version
```
