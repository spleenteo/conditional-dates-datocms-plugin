---
shaping: true
---

# Conditional Dates Plugin — Frame

## Source

> Voglio creare un plugin per DatoCMS usando la skill del plugin builder, per realizzare un sistema di creazione di date condizionali in cui l'utente può:
>
> * conoscere l'anno
> * se conosce l'anno, si attiva il campo del mese (1-12)
> * se conosce il mese può inserire anche il giorno (1-31 in base al mese)
> * Un campo B.C / B.C. per indicare se è prima o dopo l'anno 0 (default A.C.)
> * Un booleano "Circa", di default false
>
> Il sistema offre inoltre un campo aggiuntivo "circa" che è un booleano e che indica che la datazione inserita dall'utente può non essere esatta.
>
> I campi data sono di tipo integer.
>
> Voglio che siano campi separati tra loro, mostrati inline. Non ho però idea di come realizzarlo: immagino un plugin di tipo field però so che è possibile, una cosa molto simile a quanto fatto su questo altro plugin https://github.com/thales-goncalves/datocms-plugin-working-schedule-day
>
> GraphQL può tornare i singoli valori e potrebbe tornare anche un campo aggiuntivo di tipo data creata dall'aggregazione dei tre campi integer se esistenti. Oppure no.

---

## Problem

Historical or uncertain dates cannot be represented with standard date fields. When documenting events, artworks, or historical records, editors often know only the year, or the year and month, but not the full date. They also need to express whether a date is approximate ("circa") and whether it falls before the common era (B.C.). DatoCMS has no native field type for this.

## Outcome

Editors can enter partial, uncertain, and historical dates through a clear inline UI. The data is stored as structured integers (year, month, day) with era and approximation metadata, queryable via GraphQL.
