(() => {
  "use strict";

  const supabaseURL = "https://mzpahzxetjtzmpoludkk.supabase.co";
  const publishableKey = "sb_publishable_2j0APr_7N_L0bL7ilF0ZnA_sWWrkDCL";
  const fragment = new URLSearchParams(location.hash.slice(1));
  const query = new URLSearchParams(location.search);
  const tokenHash = query.get("token_hash");
  const type = query.get("type");
  const error = fragment.get("error") || fragment.get("error_description") ||
    query.get("error") || query.get("error_description");
  const legacyCallback = query.has("code") || fragment.has("access_token");
  const card = document.getElementById("confirmation-card");
  const icon = document.getElementById("status-icon");
  const title = document.getElementById("page-title");
  const text = document.getElementById("confirmation-text");
  const instruction = document.getElementById("instruction");
  const button = document.getElementById("confirm-button");
  const message = document.getElementById("confirmation-message");

  // Keep the one-time token in memory; never store it or a returned session.
  if (location.hash || location.search) history.replaceState({}, document.title, location.pathname);

  const showError = () => {
    document.title = "Famili – bekräftelselänken fungerar inte";
    card.classList.add("error");
    icon.textContent = "!";
    title.textContent = "Länken fungerar inte";
    text.textContent = "Bekräftelselänken kan ha gått ut eller redan ha använts.";
    instruction.textContent = "Prova att logga in i Famili. Om du fortfarande inte kan logga in, kontakta oss via länken nedan.";
    button.hidden = true;
  };

  if (error || (tokenHash && type !== "email" && type !== "signup")) {
    showError();
    return;
  }

  if (!tokenHash) {
    if (legacyCallback) {
      // Older emails were verified by Supabase before redirecting to this page.
      title.textContent = "Öppna Famili";
      text.textContent = "Du har öppnat länken i ditt bekräftelsemejl.";
      instruction.textContent = "Öppna Famili och logga in. Om du inte kommer in kan du kontakta oss via länken nedan.";
    }
    return;
  }

  button.hidden = false;
  instruction.textContent = "Tryck på knappen nedan för att bekräfta din e-postadress.";
  let isWorking = false;
  // A page load or email scanner must not consume the confirmation token.
  button.addEventListener("click", async () => {
    if (isWorking) return;
    isWorking = true;
    button.disabled = true;
    button.textContent = "Bekräftar …";
    message.hidden = true;
    try {
      const response = await fetch(`${supabaseURL}/auth/v1/verify`, {
        method: "POST",
        credentials: "omit",
        cache: "no-store",
        headers: { apikey: publishableKey, "Content-Type": "application/json" },
        body: JSON.stringify({ token_hash: tokenHash, type: "email" })
      });
      if (!response.ok) {
        if (response.status >= 500 || response.status === 429) throw new Error("Try again");
        showError();
        return;
      }

      document.title = "Famili – e-post bekräftad";
      icon.textContent = "✓";
      title.textContent = "Din e-post är bekräftad";
      text.textContent = "Ditt konto är redo.";
      instruction.textContent = "Öppna Famili och logga in med din e-postadress och ditt lösenord.";
      button.hidden = true;
    } catch (_) {
      message.textContent = "Det gick inte att bekräfta just nu. Kontrollera internetanslutningen och försök igen. Om kontot redan är bekräftat kan du logga in i Famili.";
      message.hidden = false;
      button.disabled = false;
      button.textContent = "Försök igen";
    } finally {
      isWorking = false;
    }
  });
})();
