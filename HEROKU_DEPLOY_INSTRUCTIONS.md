# Instrukce pro nasazení na Heroku přes GitHub

## Krok 1: Přihlas se do Heroku

1. Jdi na https://dashboard.heroku.com
2. Přihlas se do svého účtu

## Krok 2: Vytvoř novou aplikaci

1. Klikni na **"New"** → **"Create new app"**
2. Zadej název aplikace (např. `my-itinerary-backend`)
3. Vyber region (Europe)
4. Klikni **"Create app"**

## Krok 3: Připoj GitHub repozitář

1. V nové aplikaci klikni na záložku **"Deploy"**
2. V sekci **"Deployment method"** klikni na **"GitHub"**
3. Přihlas se k GitHubu a autorizuj Heroku
4. Najdi repozitář `Lucijeje/MyItineraryApp`
5. Klikni **"Connect"**

## Krok 4: Nastav buildpack a root directory

1. Jdi do **Settings** → **Buildpacks**
2. Klikni **"Add buildpack"**
3. Vyber **"nodejs"** nebo zadej: `heroku/nodejs`
4. Klikni **"Save changes"**

5. V **Settings** → **Config Vars** přidej:
   - Key: `PROJECT_PATH`
   - Value: `server`
   - Klikni **"Add"**

## Krok 5: Uprav Procfile v root adresáři

Vytvoř nebo uprav `Procfile` v **root** adresáři projektu (ne v server):

```
web: cd server && node app.js
```

## Krok 6: Deploy

1. V záložce **"Deploy"** scrolluj dolů
2. V sekci **"Manual deploy"** vyber branch `master`
3. Klikni **"Deploy Branch"**
4. Počkej na dokončení deploye

## Krok 7: Získej URL

1. Po úspěšném deployi klikni na **"Open app"**
2. Nebo získej URL z horní části stránky (např. `https://my-itinerary-backend.herokuapp.com`)

## Krok 8: Aktualizuj frontend

1. Jdi na GitHub: Settings > Secrets and variables > Actions
2. Přidej nebo uprav secret `REACT_APP_API_URL` s URL z kroku 7
3. Pushni změnu do GitHubu, aby se frontend znovu nasadil

---

## Alternativa: Použij Heroku CLI (pokud máš nainstalované)

Pokud máš Heroku CLI v PATH, můžeš použít:

```bash
cd server
heroku create my-itinerary-backend
git push heroku master
```
