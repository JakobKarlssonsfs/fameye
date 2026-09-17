(() => {
  "use strict";
  
  const supabaseURL = "https://mzpahzxetjtzmpoludkk.supabase.co";
  const publishableKey = "sb_publishable_2j0APr_7N_L0bL7ilF0ZnA_sWWrkDCL";
  const form = document.getElementById("reset-form");
  const password = document.getElementById("password");
  const confirmation = document.getElementById("confirm-password");
  const button = document.getElementById("submit-button");
  const message = document.getElementById("message");
  const helpText = document.getElementById("help-text");
  
  const fragment = new URLSearchParams(window.location.hash.slice(1));
  const query = new URLSearchParams(window.location.search);
  const accessToken = fragment.get("access_token");
  const recoveryType = fragment.get("type");
  const callbackError = fragment.get("error_description") || fragment.get("error") ||
    query.get("error_description") || query.get("error");
  
  // Keep the short-lived token only in memory and remove it from the address bar.
  if (window.location.hash || window.location.search) {
    window.history.replaceState({}, document.title, window.location.pathname);
  }
  
  const showMessage = (text, kind) => {
    message.textContent = text;
    message.className = `message ${kind}`;
  };
  
  if (callbackError || !accessToken || (recoveryType && recoveryType !== "recovery")) {
    form.hidden = true;
    helpText.hidden = true;
    showMessage(
      callbackError
        ? "Länken är ogiltig eller har gått ut. Begär en ny återställningslänk i Famili."
        : "Återställningslänken saknar nödvändig information. Begär en ny länk i Famili.",
      "error"
    );
    return;
  }
  
  form.hidden = false;
  
  form.addEventListener("submit", async (event) => {
    event.preventDefault();
  
    if (password.value.length < 8) {
      showMessage("Lösenordet behöver innehålla minst åtta tecken.", "error");
      password.focus();
      return;
    }
    if (password.value !== confirmation.value) {
      showMessage("Lösenorden matchar inte. Kontrollera och försök igen.", "error");
      confirmation.focus();
      return;
    }
  
    button.disabled = true;
    button.textContent = "Sparar …";
    message.className = "message";
    message.textContent = "";
  
    try {
      const response = await fetch(`${supabaseURL}/auth/v1/user`, {
        method: "PUT",
        headers: {
          "apikey": publishableKey,
          "Authorization": `Bearer ${accessToken}`,
          "Content-Type": "application/json"
        },
        body: JSON.stringify({ password: password.value })
      });
  
      if (!response.ok) throw new Error("Password update failed");
  
      password.value = "";
      confirmation.value = "";
      form.hidden = true;
      helpText.hidden = true;
      showMessage("Lösenordet är ändrat. Du kan nu öppna Famili och logga in.", "success");
    } catch (_) {
      showMessage("Det gick inte att ändra lösenordet. Länken kan ha gått ut. Begär en ny länk i Famili och försök igen.", "error");
      button.disabled = false;
      button.textContent = "Spara nytt lösenord";
    }
  });
})();
