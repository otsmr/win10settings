<!-- TODO -->


# Dokumentation

## Erste Schritte
Benötigt werden NodeJS und Git.  

**Erweiterte Windows Einstellungen selber kompilieren**
```bash
git clone https://github.com/otsmr/win10settings.git
cd win10settings
npm install
npm run build
```

**Entwicklungsumgebung starten**
```bash
npm run dev
```

## Struktur des Codes

| Ordner / Datei | Beschreibung |
| ------ | ------------ |
| `/build` | Dieser Ordner wird von `React` erstellt und enthält den Produktions-Frontend-Code. |
| `/dist` | Wird von `electron-builder` erstellt und enthält die **gepackte Windows-Anwendung**. |
| `/public` | Enthält das Backend und die statischen Dateien der Anwendung. |
| `/public/electron/configs` | **Powershell-Befehle**, die ausgeführt werden, um die Einstellungen zu ändern. |
| `/public/config.json` | Die **Standardeinstellungen**. |
| `/src` | Das Frontend der App in React und Typescript. |
| `/src/localization` | Sprachdateien |
| `/webpage` | Statische Webseite |