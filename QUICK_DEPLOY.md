# Rychlý návod - Nasazení na Heroku

## Krok 1: Instalace Heroku CLI

1. Stáhni a nainstaluj Heroku CLI: https://devcenter.heroku.com/articles/heroku-cli
2. Otevři terminál/PowerShell a přihlas se:
```bash
heroku login
```

## Krok 2: Nasazení (Windows PowerShell)

Spusť tento příkaz v root adresáři projektu:

```powershell
.\deploy-heroku.ps1
```

Nebo ručně:

```powershell
cd server
git init
git add .
git commit -m "Initial commit"
heroku create my-itinerary-backend
git push heroku master
```

## Krok 3: Získání URL

Po nasazení získej URL:

```bash
heroku info
```

URL bude ve formátu: `https://my-itinerary-backend.herokuapp.com`

## Krok 4: Aktualizace frontendu

1. Jdi na GitHub: Settings > Secrets and variables > Actions
2. Přidej/uprav secret `REACT_APP_API_URL` s hodnotou z kroku 3
3. Pushni změnu do GitHubu (nebo počkej na další commit)

## ⚠️ Důležité upozornění

**Heroku má ephemeral filesystem** - to znamená:
- Data v `storage/` složce se **smazou při každém restartu**
- Pro produkci použij databázi (PostgreSQL, MongoDB, atd.)

Pro testování to funguje, ale pro skutečnou produkci přidej databázi.

## Přidání PostgreSQL databáze (volitelné)

```bash
heroku addons:create heroku-postgresql:mini
```

Pak budeš muset upravit DAO soubory, aby používaly databázi místo JSON souborů.

## Kontrola logů

```bash
heroku logs --tail
```

## Otevření aplikace

```bash
heroku open
```
