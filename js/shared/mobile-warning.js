/**
 * mobile-warning.js — Overlay de aviso para páginas que dependem de desktop.
 *
 * Usado em Prática e Ferramentas, onde teclado MIDI físico e/ou tela maior
 * são requisitos práticos. Dispara apenas quando a heurística de mobile
 * acerta (pointer: coarse + largura ≤ 900px). A dispensa fica em
 * sessionStorage — reaparece em nova sessão, sem poluir localStorage.
 *
 * Uso:
 *   showMobileWarning({
 *     message: "Texto descritivo do motivo…",
 *     sessionKey: "tyghorn-melody:mobile-warning-dismissed:play",
 *     onContinue: () => { ... },  // opcional
 *     onBack: () => { ... }       // opcional (default: volta para index)
 *   });
 */

const MEDIA_QUERY = "(pointer: coarse) and (max-width: 900px)";

export function showMobileWarning({ message, sessionKey, onContinue, onBack }) {
    if (!window.matchMedia(MEDIA_QUERY).matches) return;
    if (sessionStorage.getItem(sessionKey) === "true") return;

    const overlay = document.createElement("div");
    overlay.className = "mobile-warning-overlay";
    overlay.setAttribute("role", "alertdialog");
    overlay.setAttribute("aria-modal", "true");
    overlay.setAttribute("aria-labelledby", "mobile-warning-title");

    const panel = document.createElement("div");
    panel.className = "mobile-warning-panel";

    const icon = document.createElement("div");
    icon.className = "mobile-warning-icon";
    icon.setAttribute("aria-hidden", "true");
    icon.textContent = "⚠";

    const title = document.createElement("h2");
    title.className = "mobile-warning-title";
    title.id = "mobile-warning-title";
    title.textContent = "Experiência otimizada para desktop";

    const body = document.createElement("p");
    body.className = "mobile-warning-message";
    body.textContent = message;

    const actions = document.createElement("div");
    actions.className = "mobile-warning-actions";

    const backBtn = document.createElement("button");
    backBtn.type = "button";
    backBtn.className = "mobile-warning-btn mobile-warning-btn--secondary";
    backBtn.textContent = "Voltar ao início";
    backBtn.addEventListener("click", () => {
        remove();
        if (typeof onBack === "function") onBack();
        else window.location.href = "../index.html";
    });

    const continueBtn = document.createElement("button");
    continueBtn.type = "button";
    continueBtn.className = "mobile-warning-btn mobile-warning-btn--primary";
    continueBtn.textContent = "Continuar";
    continueBtn.addEventListener("click", () => {
        try { sessionStorage.setItem(sessionKey, "true"); } catch (_) { /* storage bloqueado */ }
        remove();
        if (typeof onContinue === "function") onContinue();
    });

    actions.append(backBtn, continueBtn);
    panel.append(icon, title, body, actions);
    overlay.append(panel);
    document.body.append(overlay);

    continueBtn.focus();

    function remove() {
        overlay.remove();
    }
}
