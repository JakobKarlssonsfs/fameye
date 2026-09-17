(() => {
  "use strict";
  const fragment = new URLSearchParams(location.hash.slice(1));
  const query = new URLSearchParams(location.search);
  const error = fragment.get("error") || fragment.get("error_description") ||
    query.get("error") || query.get("error_description");
  // Supabase verifies the email before redirecting here. No tokens are needed on this page.
  if (location.hash || location.search) history.replaceState({}, document.title, location.pathname);
  if (!error) return;
  document.title = "Famili – bekräftelselänken fungerar inte";
  document.getElementById("confirmation-card").classList.add("error");
  document.getElementById("status-icon").textContent = "!";
  document.getElementById("page-title").textContent = "Länken fungerar inte";
  document.getElementById("confirmation-text").textContent = "Bekräftelselänken kan ha gått ut eller redan ha använts.";
  document.getElementById("instruction").textContent = "Prova att logga in i Famili. Om du fortfarande inte kan logga in, kontakta oss via länken nedan.";
})();
