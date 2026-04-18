/**
 * data-management.js — Botões de limpar progresso e redefinir tudo.
 *
 * Amarra dois botões a confirmações via dialog nativo e chama as ações
 * correspondentes em shared/storage. Alerta final confirma sucesso.
 */

import { clearProgress, resetAll } from "../shared/storage.js";

/**
 * @param {object} dom — { btnClearProgress, btnResetAll }
 */
export function bindDataManagement(dom) {
    dom.btnClearProgress.addEventListener("click", () => {
        const confirmed = confirm(
            "Tem certeza que deseja limpar todo o progresso das músicas?\n\n" +
            "Isso removerá o histórico de prática (melhor acurácia, vezes tocadas).\n" +
            "Configurações de teclado e preferências serão mantidas."
        );
        if (!confirmed) return;
        clearProgress();
        alert("Progresso limpo com sucesso.");
    });

    dom.btnResetAll.addEventListener("click", () => {
        const confirmed = confirm(
            "⚠️ Tem certeza que deseja redefinir TODOS os dados do aplicativo?\n\n" +
            "Isso removerá:\n" +
            "• Progresso das músicas\n" +
            "• Configuração do teclado MIDI\n" +
            "• Preferências pessoais\n\n" +
            "Esta ação não pode ser desfeita."
        );
        if (!confirmed) return;
        resetAll();
        alert("Todos os dados foram redefinidos. O aplicativo voltou ao estado inicial.");
    });
}
