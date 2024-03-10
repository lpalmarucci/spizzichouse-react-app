# Spizzichouse APP React

## Descrizione
Spizzichouse APP React è un'applicazione progettata per facilitare la gestione delle partite del gioco di carte Spizzico. L'applicativo consente di registrare e monitorare le partite giocate, fornendo anche la possibilità di segnare i punteggi per ciascun round.

## Caratteristiche Principali
- Registrazione delle partite di Spizzico
- Segnalazione dei punteggi per ciascun round
- Archiviazione storico partite
- Suddivisione degli utenti per casata
- WIP: Grafico su andamento delle ultime partite


## Installazione
1. Effettua un clone del repository
2. Lancia il comando <code>pnpm i</code>
2. Esegui <code>pnpm run dev</code>

## Docker
L'applicativo è dockerizzato per semplificare l'installazione e la gestione dell'ambiente. Per utilizzare Docker:
1. Assicurati che Docker sia installato sul tuo sistema.
2. Per generare l'immagine esegui <code>docker build -t app --no-cache .</code>
3. Per avviare l'applicativo esegui <code>docker run --name=app -p 80:80 -e VITE_SERVER_URL={base-url-spizzichouse-api}/api app</code>
