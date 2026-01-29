# Heroku Deployment Guide

Tento návod popisuje, jak nasadit backend server na Heroku.

## Předpoklady

1. Účet na Heroku (zdarma na [heroku.com](https://www.heroku.com))
2. Heroku CLI nainstalovaná ([stáhnout zde](https://devcenter.heroku.com/articles/heroku-cli))
3. Git nainstalovaný

## Krok 1: Přihlášení do Heroku

```bash
heroku login
```

## Krok 2: Vytvoření Heroku aplikace

V adresáři projektu (root):

```bash
heroku create my-itinerary-app-backend
```

Nebo použij vlastní název (musí být unikátní).

## Krok 3: Nasazení kódu

### Možnost A: Nasazení z root adresáře (doporučeno)

Heroku potřebuje, aby `package.json` a `Procfile` byly v root adresáři projektu, nebo musíš nasadit pouze `server` složku.

**Doporučený postup - nasazení pouze server složky:**

1. Vytvoř nový git repozitář v `server` složce:

```bash
cd server
git init
git add .
git commit -m "Initial commit for Heroku deployment"
```

2. Přidej Heroku remote:

```bash
heroku git:remote -a my-itinerary-app-backend
```

3. Pushni na Heroku:

```bash
git push heroku master
```

Nebo pokud používáš `main` branch:

```bash
git push heroku main
```

### Možnost B: Nasazení z root s monorepo strukturou

Pokud chceš nasadit z root adresáře, musíš:

1. Vytvořit `Procfile` v root:
```
web: cd server && node app.js
```

2. Upravit `package.json` v root, aby měl start script, který spustí server

## Krok 4: Ověření nasazení

Po úspěšném nasazení zkontroluj:

```bash
heroku open
```

Mělo by se otevřít v prohlížeči a zobrazit "Hello World".

## Krok 5: Získání URL backendu

Získej URL tvého Heroku aplikace:

```bash
heroku info
```

Nebo v Heroku dashboardu najdeš URL ve formátu:
`https://my-itinerary-app-backend.herokuapp.com`

## Krok 6: Aktualizace frontendu

1. Jdi na GitHub do Settings > Secrets and variables > Actions
2. Přidej nebo uprav secret `REACT_APP_API_URL`:
   - Název: `REACT_APP_API_URL`
   - Hodnota: `https://my-itinerary-app-backend.herokuapp.com` (nebo tvoje URL)

3. Pushni změnu do GitHubu, aby se frontend znovu nasadil s novou API URL

## Důležité poznámky

### Ephemeral Filesystem

Heroku má **ephemeral filesystem** - to znamená, že:
- ✅ Soubory se ukládají dočasně
- ❌ Po restartu aplikace se soubory v `storage/` smažou
- ⚠️ Pro produkci bys měl použít databázi (PostgreSQL, MongoDB, atd.)

### Pro produkční použití

Pro skutečnou produkci doporučuji:

1. **Přidat PostgreSQL databázi na Heroku:**
```bash
heroku addons:create heroku-postgresql:mini
```

2. **Upravit DAO soubory**, aby používaly databázi místo JSON souborů

3. **Nebo použít externí storage** (AWS S3, Cloudinary, atd.)

### CORS

CORS je již nakonfigurován v `app.js` pomocí `cors()` middleware, takže by měl fungovat s frontendem na GitHub Pages.

### Logy

Pro sledování logů:

```bash
heroku logs --tail
```

### Restart aplikace

```bash
heroku restart
```

### Environment Variables

Pokud potřebuješ nastavit environment variables:

```bash
heroku config:set NODE_ENV=production
```

## Troubleshooting

### Port error
- Heroku automaticky nastavuje `PORT` environment variable
- Aplikace je upravena, aby používala `process.env.PORT || 2000`

### Build failed
- Zkontroluj, že všechny dependencies jsou v `package.json`
- Ujisti se, že `node_modules` není v git repozitáři

### Application error
- Zkontroluj logy: `heroku logs --tail`
- Ověř, že všechny cesty k souborům jsou relativní

### CORS errors
- Ujisti se, že `cors()` middleware je v `app.js`
- Zkontroluj, že frontend URL je správně nastaven

## Alternativní řešení pro storage

Pokud potřebuješ trvalé ukládání dat, zvaž:

1. **Heroku Postgres** (SQL databáze)
2. **MongoDB Atlas** (NoSQL databáze, zdarma)
3. **Firebase** (Google, zdarma tier)
4. **Supabase** (open-source alternativa Firebase)
