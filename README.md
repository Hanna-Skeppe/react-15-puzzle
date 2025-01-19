# React n-pussel

Det här projektet är skapat med React, Typescript och Tailwind CSS.

För att ändra antal rader och kolumner i spelet, skapa en .env-fil i rotmappen och lägg till de två variablerna:
`VITE_ROWS=`
`VITE_COLUMNS=`
Om inga miljövariabler läggs till kommer spelet att ha 4 rader och 4 kolumner.

För att starta projektet lokalt kör: `npm run dev`

För att bygga projektet, kör: `npm run build` och därefter `npm run preview` (detta kommando kör en server som serverar den byggda applikation från dist-mappen och låter dig testa den i produktionsläge.)
