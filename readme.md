# Visitor Statistics To SDG

Syftet med detta projekt är att automatisera sändningar av statestikskdata kopplat till sidor som representerar innehåll kopplat till SDG.

## Konfiguration

Konfiguration av tjänsten sker genom 'Azure Configurations settings'.  
För att tillåta flera olika källor kommer systemet "förhöra" konfigurationen om vilka inställningar som finns.  
Idag har vi byggt stöd för google analytics  
  
För att konfigurera en källa ifrån google analytics skapar man en inställning som börjar på 'GTM_' och sedan valfritt namn, exempel GTM_kovse.  
  
Datan som ska finnas i denna konfigurationsvariabel ska vara i följande format:
```json
{
  "site":"Site name",
  "rawQuery":"https://www.googleapis.com/analytics/v3/data/ga?ids=ga%3Axxxxxxxx&start-date=yesterday&end-date=yesterday&metrics=ga%3AuniquePa..."
}
```
## Functioner
En sammanställning av de funktioner som finns
### View
Används för att kunna se den information som ska skickas till SDG APIet baserat på de konfigurationer som finns. Används för att debugga och gör det möjligt att se hur olika google frågor kommer se ut som konverterade till SDG format.
