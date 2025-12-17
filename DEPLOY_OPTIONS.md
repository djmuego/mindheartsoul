# 🚀 Варианты деплоя через GitHub

Репозиторий: https://github.com/djmuego/mindheartsoul.git

---

## 🎯 Вариант 1: GitHub Pages (САМЫЙ ПРОСТОЙ) ⭐

### Преимущества:
- ✅ **Бесплатно**
- ✅ **Автоматический деплой** при push в main
- ✅ **HTTPS по умолчанию**
- ✅ **Собственный домен** (можно настроить)
- ✅ **Не нужен сервер**

### Как настроить:

#### Шаг 1: Создай GitHub Action для сборки

Файл `.github/workflows/deploy.yml` уже готов (см. ниже)

#### Шаг 2: Включи GitHub Pages

1. Зайди в репозиторий: https://github.com/djmuego/mindheartsoul
2. Settings → Pages
3. Source: выбери **GitHub Actions**
4. Сохрани

#### Шаг 3: Push код

```bash
git push origin main
```

**Готово!** Сайт будет доступен по адресу:
- `https://djmuego.github.io/mindheartsoul/`

### Настройка собственного домена (опционально):

1. Settings → Pages → Custom domain
2. Укажи свой домен (например, `mindheartsoul.com`)
3. В DNS настройках домена добавь CNAME запись:
   ```
   CNAME mindheartsoul.com djmuego.github.io
   ```

---

## 🎯 Вариант 2: Vercel (РЕКОМЕНДУЕТСЯ) ⭐⭐⭐

### Преимущества:
- ✅ **Бесплатно**
- ✅ **Автоматический деплой** при push
- ✅ **Глобальный CDN** (очень быстро)
- ✅ **Preview для каждого PR**
- ✅ **Автоматический HTTPS**
- ✅ **Environment variables** (можно хранить GEMINI_API_KEY!)
- ✅ **Собственный домен**

### Как настроить:

#### Шаг 1: Зайди на Vercel

1. https://vercel.com/signup
2. Войди через GitHub
3. Нажми **Import Project**

#### Шаг 2: Импортируй репозиторий

1. Выбери `djmuego/mindheartsoul`
2. Framework Preset: **Vite**
3. Build Command: `npm run build`
4. Output Directory: `dist`
5. Нажми **Deploy**

#### Шаг 3: Настрой Environment Variables (для AI)

1. Settings → Environment Variables
2. Добавь:
   ```
   VITE_GEMINI_API_KEY = твой_реальный_ключ
   ```
3. Redeploy

**Готово!** Сайт будет доступен по адресу:
- `https://mindheartsoul.vercel.app/`

**При каждом push в GitHub** - автоматический деплой!

---

## 🎯 Вариант 3: Netlify (АЛЬТЕРНАТИВА)

### Преимущества:
- ✅ **Бесплатно**
- ✅ **Автоматический деплой**
- ✅ **Формы и serverless functions**
- ✅ **Split testing**
- ✅ **Собственный домен**

### Как настроить:

#### Шаг 1: Зайди на Netlify

1. https://netlify.com/
2. Войди через GitHub
3. Нажми **Add new site** → **Import an existing project**

#### Шаг 2: Настрой билд

1. Выбери `djmuego/mindheartsoul`
2. Build command: `npm run build`
3. Publish directory: `dist`
4. Нажми **Deploy**

#### Шаг 3: Environment Variables

1. Site settings → Environment variables
2. Добавь `VITE_GEMINI_API_KEY`

**Готово!** Сайт будет доступен по адресу:
- `https://mindheartsoul.netlify.app/`

---

## 🎯 Вариант 4: Cloudflare Pages

### Преимущества:
- ✅ **Бесплатно**
- ✅ **Безлимитные requests**
- ✅ **Глобальный CDN Cloudflare**
- ✅ **Workers для serverless**
- ✅ **Web Analytics**

### Как настроить:

1. https://pages.cloudflare.com/
2. Connect to Git → GitHub → `djmuego/mindheartsoul`
3. Build settings:
   - Framework preset: **Vite**
   - Build command: `npm run build`
   - Build output: `dist`
4. Deploy

**Готово!** Сайт будет доступен по адресу:
- `https://mindheartsoul.pages.dev/`

---

## 🎯 Вариант 5: Beget через Git (ТВОЙ СЛУЧАЙ)

### Вариант 5A: Через SSH и Git

Если у Beget есть SSH доступ:

```bash
# На сервере Beget
cd public_html
git clone https://github.com/djmuego/mindheartsoul.git .
npm install
npm run build
mv dist/* ./
rm -rf dist node_modules src

# При обновлении:
git pull
npm install
npm run build
mv dist/* ./
rm -rf dist
```

### Вариант 5B: Через GitHub Actions → FTP

Создай GitHub Action, который при push:
1. Делает build
2. Загружает dist/ на Beget через FTP

Файл `.github/workflows/beget-deploy.yml` (см. ниже)

### Вариант 5C: Вручную (текущий способ)

1. `npm run build` локально
2. Загрузи `dist/` на Beget
3. При обновлении повтори

---

## 🏆 МОЯ РЕКОМЕНДАЦИЯ

### Для максимальной простоты и скорости:

**🥇 1. Vercel** - лучший выбор!
- Один клик для деплоя
- Автоматический деплой при push
- Можно хранить GEMINI_API_KEY безопасно
- Preview URLs для каждого PR
- Очень быстро (глобальный CDN)

**🥈 2. GitHub Pages** - если нужно бесплатно
- Просто включить в Settings
- Автоматический деплой
- Но нет environment variables (AI не будет работать)

**🥉 3. Beget** - если нужен свой хостинг
- Ручной деплой через FTP
- Или настроить GitHub Actions

---

## 📁 Готовые файлы для автодеплоя

### GitHub Actions для GitHub Pages

Создай файл `.github/workflows/deploy.yml`:

```yaml
name: Deploy to GitHub Pages

on:
  push:
    branches: [ main ]
  workflow_dispatch:

permissions:
  contents: read
  pages: write
  id-token: write

jobs:
  build:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      
      - name: Setup Node.js
        uses: actions/setup-node@v4
        with:
          node-version: '18'
          cache: 'npm'
      
      - name: Install dependencies
        run: npm ci
      
      - name: Build
        run: npm run build
        env:
          VITE_GEMINI_API_KEY: ${{ secrets.VITE_GEMINI_API_KEY }}
      
      - name: Setup Pages
        uses: actions/configure-pages@v4
      
      - name: Upload artifact
        uses: actions/upload-pages-artifact@v3
        with:
          path: ./dist
      
      - name: Deploy to GitHub Pages
        id: deployment
        uses: actions/deploy-pages@v4
```

### GitHub Actions для Beget (FTP)

Создай файл `.github/workflows/beget-deploy.yml`:

```yaml
name: Deploy to Beget

on:
  push:
    branches: [ main ]

jobs:
  deploy:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      
      - name: Setup Node.js
        uses: actions/setup-node@v4
        with:
          node-version: '18'
      
      - name: Install and Build
        run: |
          npm ci
          npm run build
      
      - name: FTP Deploy
        uses: SamKirkland/FTP-Deploy-Action@v4.3.4
        with:
          server: ${{ secrets.FTP_SERVER }}
          username: ${{ secrets.FTP_USERNAME }}
          password: ${{ secrets.FTP_PASSWORD }}
          local-dir: ./dist/
          server-dir: /public_html/
```

Добавь secrets в GitHub:
- Settings → Secrets → New repository secret
- `FTP_SERVER` = ftp.your-domain.beget.tech
- `FTP_USERNAME` = твой логин
- `FTP_PASSWORD` = твой пароль

---

## ⚡ Самый быстрый способ ПРЯМО СЕЙЧАС:

### 1. Зайди на Vercel:
https://vercel.com/new

### 2. Import Git Repository:
- Войди через GitHub
- Выбери `djmuego/mindheartsoul`
- Нажми **Import**

### 3. Настрой:
- Framework Preset: **Vite** (автоопределится)
- Build Command: `npm run build` (автоопределится)
- Output Directory: `dist` (автоопределится)
- Нажми **Deploy**

### 4. Готово! 🎉
Через 2 минуты сайт будет доступен по адресу Vercel!

При каждом `git push` будет автоматический деплой!

---

## 🔑 Как добавить GEMINI_API_KEY на Vercel:

1. Project Settings → Environment Variables
2. Добавь переменную:
   ```
   Name: VITE_GEMINI_API_KEY
   Value: твой_реальный_ключ_от_gemini
   ```
3. Redeploy (кнопка в интерфейсе)

**Теперь AI будет работать на production!** 🤖

---

## 📊 Сравнение вариантов

| Вариант | Сложность | Скорость | Авто-деплой | ENV vars | Цена |
|---------|-----------|----------|-------------|----------|------|
| **Vercel** | ⭐ Легко | ⚡⚡⚡ | ✅ | ✅ | 💰 Free |
| **GitHub Pages** | ⭐ Легко | ⚡⚡ | ✅ | ❌ | 💰 Free |
| **Netlify** | ⭐ Легко | ⚡⚡⚡ | ✅ | ✅ | 💰 Free |
| **Cloudflare** | ⭐⭐ Средне | ⚡⚡⚡ | ✅ | ✅ | 💰 Free |
| **Beget (SSH)** | ⭐⭐⭐ Сложно | ⚡ | ❌ | ⚠️ | 💰 Платно |
| **Beget (FTP)** | ⭐⭐ Средне | ⚡ | ⚠️ | ❌ | 💰 Платно |

---

## 🎉 Итого

**Для тебя лучший вариант:** 🏆 **Vercel**

**Почему:**
1. ✅ 2 минуты на настройку
2. ✅ Автоматический деплой при push
3. ✅ Можно хранить API ключ безопасно
4. ✅ Preview URLs для тестирования
5. ✅ Очень быстрый CDN
6. ✅ **100% бесплатно**

**Действия:**
1. Иди на https://vercel.com/new
2. Import repository `djmuego/mindheartsoul`
3. Deploy
4. Готово! 🚀

**Хочешь другой вариант?** Скажи, настрою! 😊
