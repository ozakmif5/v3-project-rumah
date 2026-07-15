# Project Rumah Asrya

A construction project management dashboard (Indonesian language) for tracking workers, attendance, payroll, materials, progress, and financial reports.

## Stack

- Pure HTML + CSS + JavaScript (no build step, no backend)
- Bootstrap 5 + Font Awesome for UI
- `localStorage` for data persistence
- Data export to Excel via the Laporan section

## How to run

```
python3 -m http.server 5000
```

The app is served as a static site on port 5000.

## Sections

- **Dashboard** — summary cards (total spend, payroll, materials) + progress visualization
- **Absensi** — log worker attendance with date ranges and daily wages
- **Kehadiran** — attendance summary counts (present, excused, sick, absent)
- **Pengupahan** — payroll summary per worker with payment tracking
- **Material** — log and track material purchases
- **Progress** — track construction task completion percentages
- **Laporan** — full financial report with Excel export

## User preferences

_None recorded yet._
