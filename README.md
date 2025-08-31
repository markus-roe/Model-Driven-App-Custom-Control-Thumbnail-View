# Model-Driven App Custom Grid Control

Ein modernes, responsives Grid-Control für Model-Driven Apps mit erweiterten Funktionen für Datensatzverwaltung, Sortierung, Filterung und Paginierung.

## Features

### Kernfunktionalitäten
- **Responsive Grid-Layout** mit modernem Fluent UI Design
- **Paginierung** mit Navigation (Erste/Letzte/Vorherige/Nächste Seite)
- **Spaltensortierung** (A-Z, Z-A) für alle Spalten außer der ersten
- **Spaltenfilterung** mit "Enthält keine Daten" Option
- **Bild-Thumbnail-Unterstützung** für Bildspalten
- **Zeilenauswahl** mit Mehrfachauswahl
- **Datensatznavigation** durch Klick auf Zellen
- **Ladezustand-Behandlung** mit visuellen Indikatoren

### Erweiterte Features
- **Angepasste Zeilenformatierung** basierend auf Datenwerten
- **Deutsche Lokalisierung** (immer aktiv, unabhängig von Environment-Einstellungen)
- **Erste Spalte gesperrt** (keine Sortierung/Filterung möglich)
- **Responsive Design** für verschiedene Bildschirmgrößen
- **Optimierte Performance** für große Datensätze

## Architektur

### Projektstruktur
```
ModelDrivenGrid/
├── ControlManifest.Input.xml    # PCF Control Manifest
├── index.ts                     # Haupt-Control-Klasse
├── Grid.tsx                     # React Grid-Komponente
├── css/
│   └── ModelDrivenGrid.css     # Styling und Layout
└── strings/
    ├── ModelDrivenGrid.1031.resx # Deutsche Lokalisierung
    └── ModelDrivenGrid.1033.resx # Englische Lokalisierung (deaktiviert)
```

### Technologie-Stack
- **PowerApps Component Framework (PCF)** - Basis-Framework
- **React 17** - UI-Bibliothek
- **TypeScript** - Typsichere Entwicklung
- **Fluent UI** - Microsoft Design System
- **CSS3** - Anpassbare Styling

## Voraussetzungen

### Entwicklungsumgebung
- **Node.js** (Version 18+ empfohlen)
- **npm** (mit dem Projekt geliefert)
- **Power Platform CLI** (pac)
- **Visual Studio Code** (empfohlen)

### Power Platform
- **Dynamics 365** oder **Power Apps** Environment
- **Entwicklerberechtigungen** für PCF Controls
- **Publisher-Prefix** konfiguriert (aktuell: `crc2a`)

## Installation & Setup

### 1. Repository klonen
```bash
git clone [repository-url]
cd Model-Driven-App-Custom-Control-Thumbnail-View
```

### 2. Abhängigkeiten installieren
```bash
npm install
```

### 3. Projekt bauen
```bash
npm run build
```

### 4. Lokale Entwicklung starten
```bash
npm start
```

## Verwendung

### In Model-Driven Apps
1. **Control importieren** in Ihre Power Apps Solution
2. **Control zu Formularen hinzufügen** (Standard oder Untergitter)
3. **Datensatzquelle konfigurieren** (Dataset mit Spalten)
4. **Spalteneigenschaften anpassen** nach Bedarf

### Konfiguration
- **Erste Spalte**: Automatisch gesperrt (keine Sortierung/Filterung)
- **Alle anderen Spalten**: Vollständige Sortier- und Filterfunktionen
- **Bildspalten**: Automatische Thumbnail-Anzeige
- **Responsive Layout**: Passt sich automatisch der Container-Größe an

## Deployment

### Environment-spezifische Deployments

#### Entwicklung (Development)
```bash
npm run deploy:dev
```
- **Environment ID**: `378fafb8-13d9-eff6-be3c-a6464ba9fc48`
- **Publisher-Prefix**: `crc2a`

#### Test
```bash
npm run deploy:test
```
- **Environment ID**: `55eac54b-b01f-e9e8-a708-503cb3c61051`
- **Publisher-Prefix**: `crc2a`

#### Produktion (Production)
```bash
npm run deploy:prod
```
- **Environment ID**: `9b02274b-16bd-e554-90d8-1ac052015b53`
- **Publisher-Prefix**: `crc2a`

### Deployment-Schritte
1. **Environment auswählen**: Entsprechenden Deploy-Befehl verwenden
2. **Automatischer Build**: `npm run build` wird automatisch ausgeführt
3. **ZIP-Datei erstellen**: Wird automatisch nach dem Build generiert
4. **Automatischer Import**: Das Control wird automatisch in das ausgewählte Environment importiert

**Was passiert beim Deployment:**
- ✅ **Build-Prozess**: TypeScript wird kompiliert, React-Bundle erstellt
- ✅ **ZIP-Erstellung**: Fertige Control-Datei wird gepackt
- ✅ **Environment-Upload**: Control wird automatisch hochgeladen
- ✅ **Import**: Control wird in die Power Platform Solution importiert
- ✅ **Verfügbarkeit**: Control ist sofort in Power Apps Studio verfügbar

## Entwicklung


### Code-Qualität
- **ESLint** für TypeScript/React
- **Power Apps spezifische Regeln** aktiviert
- **Automatische Formatierung** verfügbar


## Lokalisierung

### Aktuelle Konfiguration
- **Primärsprache**: Deutsch (immer aktiv)
- **Fallback**: Deutsche Labels direkt im Code
- **Unterstützte Sprachen**: 
  - `1031` (Deutsch) - Aktiv
  - `1033` (Englisch) - Deaktiviert

### Label-Beispiele
```typescript
const germanLabels = {
    'Label_SortAZ': 'A bis Z',
    'Label_SortZA': 'Z bis A',
    'Label_DoesNotContainData': 'Enthält keine Daten',
    'Label_NoRecords': 'Keine Datensätze gefunden',
    'Label_Grid_Footer_RecordCount': '{0} Datensätze ({1} ausgewählt)',
    'Label_Grid_Footer': 'Seite {0}'
};
```