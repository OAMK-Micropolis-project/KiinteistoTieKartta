# Kiinteistötiekartta (Micropolis / OAMK)

Desktop-sovellus kiinteistösalkun hallintaan: kiinteistöjen lisäys, muokkaus, poisto, vuositasoinen talousdata sekä analytiikka (kaaviot).

## Ohjeita ja selityksiä

Tämä sovellus käyttää paikallista JSON-tiedostoa tietolähteenä. Käyttäjä valitsee tiedoston polun sovelluksen käyttöliittymästä, ja sovellus lukee sekä tallentaa muutokset samaan tiedostoon.

### Ohjelman käyttö / toiminta (pikaohje)
1. Avaa sovellus.
2. Valitse data-tiedosto (JSON) Path/Pathfinder-napista (tai vastaavasta).
3. Selaa kiinteistöjä toolbarissa: haku ja salkkusuodatus (A/B/C/D).
4. Vaihda vuosi (year filter) Summary-näkymässä.
5. Avaa kiinteistö detail-näkymään.
6. Muokkaa kiinteistöä (Muokkaa) tai poista (Poista).
7. Lisää uusi kiinteistö (Lisää kiinteistö).
8. Päivitä data manuaalisesti (Päivitä).

## Miten se toimii?

Sovellus on React-sovellus, jossa näkymät ovat reittejä (React Router). Data pidetään keskitetysti Context/Providerissa. Kun käyttäjä tekee muutoksen (lisää/muokkaa/poistaa), Provider päivittää tilan ja tallentaa JSON-tiedostoon.

### Dataformaatti (tiivistetty)
- `yllapitokulut` ja `vuokrakulut` ovat vuosikohtaisia avain-objekteja: `{ "2026": {...}, "2025": {...} }`
- `pisteet` kuvaa kuntoarviota (1–5), ja käytetään salkutuksessa / pisteytyksessä.

## Mitä komponentteja on luotu?

**Näkymät / sivut**
- Summary / HomePage: yhteenveto, listaus, kaaviot, vuosisuodatin
- DetailView: kiinteistön detaljit, tabit (perustiedot/kunto/toimenpiteet/talous)
- AddProp: lisää/muokkaa kiinteistö (myös vuositasoinen muokkaus)

**UI-komponentit**
- Toolbar: navigointi, haku, salkkusuodatus, refresh, tiedostopolku
- Tooltip: hover-selitteet laskuille
- Chartit: DonutChart ja PointsBarChart (portfoliojakauma ja pisteet)
- Modals: VuokrakulutModal, YllapitokulutModal (talousdatan muokkaus)
- Tab-komponentit: PerustiedotTab, KuntoarviointiTab, TalousTab, ToimenpiteetTab
- InfoRow, DetailCard, ErrorBoundary jne.

## Miten komponentit keskustelevat toisten kanssa?

**Keskeinen idea: Context (Provider) = yhden totuuden lähde**
- `KiinteistoProvider` tarjoaa store-API:n (getById, add, update, remove, refresh, laskennat).
- Komponentit käyttävät `useKiinteistot()` hookia lukeakseen dataa ja tehdäkseen muutoksia.
- `onUpdate(item)` callback siirtyy esim. Tab/Modal-komponenteihin, jotka kutsuvat `update()`.

**Reititys (esimerkki)**
- `/` -> Summary/Home
- `/detail/:id` -> DetailView
- `/add` -> AddProp (lisää)
- `/add/:id` -> AddProp (muokkaa)

## Työkalut ja kirjastot

- React + TypeScript + Vite (pohja)  
- React Router (reititys)
- Chart.js + react-chartjs-2 (kaaviot)
- ESLint (laajennettavissa oleva ESLint-konfiguraatioon)

## Kehittäjälle: käynnistys

```bash
npm install
npm run dev