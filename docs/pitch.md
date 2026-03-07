# Conditional date filed

## Concept

Voglio creare un plugin per DatoCMS usando la skill del plugin builder, per realizzzare un sistema di si creazione di date condizionali in cui l'utente può:

* conoscere l'anno
* se conosce l'anno, si attiva il campo del mese (1-12)
* se conosce il mese può inserire anche il giorno (1-31 in base al mese)
* Un campo B.C / B.C. per indicare se è prima o dopo l'anno 0 (default A.C.)
* Un booleano "Crica", di default false

Il sistema offre inoltre un campo aggiuntiva "crica" che è un booleano e che indica che la datazione  inserita dall'utente può non essere esatta.

I campi data sono ti tipo integer.

# UI

Voglio che siano campi separati tra loro, mostrati inline. Non ho però idea di come realizzarlo: immagino un plugin di tipo field però so che è possibile, una cosa molto simile a quanto fatto su questo altro plugin https://github.com/thales-goncalves/datocms-plugin-working-schedule-day

# Output

GrapQL può tornare i singoli valori e potrebbe tornare anche un campo aggiontivo di tipo data creata dall'aggregazione dei tre campi integer se esistenti. Oppure no.