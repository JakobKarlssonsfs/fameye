# Publicera Famili på jrdevelopment.se

## 1. Ladda upp till GitHub

Öppna GitHub-projektet som publicerar jrdevelopment.se. I webbplatsens publiceringsmapp, välj **Add file → Upload files**. Dra in alla filer och mappen `famili` från paketet, och välj **Commit changes**. Om webbplatsen publicerar från `docs` ska allt ligga i den mappen.

Behåll mappstrukturen: `famili/index.html` ska ligga inuti mappen `famili`. Övriga HTML-, CSS-, JS- och PNG-filer ligger bredvid mappen. Ladda inte upp ZIP-filen som själva webbplatsen.

Adresserna blir:

- `https://jrdevelopment.se/famili/` – presentation av appen. Även `/famili` öppnar denna mapp.
- `https://jrdevelopment.se/famili-confirmation.html` – efter e-postbekräftelse.
- `https://jrdevelopment.se/famili-aterstall.html` – nytt lösenord.
- `https://jrdevelopment.se/famili-support.html` – support.
- `https://jrdevelopment.se/famili-integritetspolicy.html` – integritetspolicy.

## 2. Uppdatera Supabase

Öppna **Authentication → URL Configuration** i Familis Supabase-projekt.

Sätt **Site URL** till:

```
https://jrdevelopment.se/famili/
```

Lägg till dessa två adresser under **Redirect URLs** och spara:

```
https://jrdevelopment.se/famili-confirmation.html
https://jrdevelopment.se/famili-aterstall.html
```

Appens registrering och lösenordsåterställning är uppdaterade till dessa adresser. [Supabases dokumentation om redirect-adresser](https://supabase.com/docs/guides/auth/redirect-urls).

Mejlmallarnas länkar ska använda `{{ .ConfirmationURL }}` så att Supabase först verifierar länken och sedan skickar besökaren till rätt sida. Om en gammal adress har skrivits direkt i en mejlmall behöver den ersättas. Klicklänken i mejlet ska inte gå direkt till HTML-sidan utan verifiering.

## 3. Kör den uppdaterade appen

När sidorna är publicerade och Supabase-inställningarna är sparade, starta den nya appversionen med **▶︎ i Xcode**.

Skapa ett tillfälligt konto och kontrollera bekräftelsemejlet. Prova även Glömt lösenord? och välj ett nytt lösenord via mejllänken. Begär nya mejl för testerna: redan skickade mejl kan innehålla tidigare adresser.

Paketet använder endast Famili-adresser. Äldre, redan installerade appversioner använder fortfarande sina tidigare länkar tills de uppdateras. Gamla filer på GitHub behöver inte tas bort för att de nya adresserna ska fungera.

Sidorna kräver ingen byggprocess eller extra bibliotek. Den gemensamma stilen finns i `famili.css`. Loggan och bakgrunden kommer från appen.
