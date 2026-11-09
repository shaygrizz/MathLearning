# MathLearning — Coniche

Sito interattivo per imparare **circonferenza, parabola e iperbole** (4° anno, liceo linguistico).
Lingue: italiano (principale) e russo (di prova).

## Come funziona una tappa

1. **Prevedi** — una domanda prima di vedere la teoria.
2. **Esplora** — figura interattiva (three.js) con cursori.
3. **Capisci** — spiegazione, formule, esempio svolto.
4. **Pratica** — 4 esercizi generati a caso, con suggerimenti.

In più: verifica finale per ogni argomento (6 domande), allenamento misto,
ripasso a intervalli degli errori (1, 3, 7 giorni) e un controllo dei prerequisiti.
I progressi restano nel `localStorage` del dispositivo.

## Struttura

| File | Contenuto |
| --- | --- |
| `js/content.js` | testi delle lezioni (IT/RU), una voce per tappa |
| `js/problems.js` | generatori di esercizi |
| `js/scenes.js` | figure interattive, compreso il cono 3D |
| `js/graph.js` | piano cartesiano disegnato con three.js |
| `js/app.js` | pagine, navigazione, sessioni di esercizi |
| `js/i18n.js`, `js/store.js` | lingue e progressi |
| `vendor/` | three.js e KaTeX in locale (nessun CDN) |

Nessuna fase di build: sono file statici.

## Pubblicare su GitHub Pages

Settings → Pages → Source: **Deploy from a branch** → `main` / `/ (root)`.

## Provare in locale

```
python3 -m http.server 8000
```
