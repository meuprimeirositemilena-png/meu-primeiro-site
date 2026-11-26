
/*
  JavaScript do site ODS 13 - Ação Climática.

  Funcionalidades:
  1. Menu hambúrguer para celulares.
  2. Cabeçalho que muda ao rolar a página.
  3. Destaque automático da seção atual.
  4. Fechamento do menu pelo ESC ou clique fora.
  5. Checklist educativo sobre prevenção de chuvas intensas.
*/

document.addEventListener("DOMContentLoaded", function () {

    // ==========================================
    // 1. ELEMENTOS DO CABEÇALHO
    // ==========================================

    const cabecalho = document.querySelector(".cabecalho");
    const botaoMenu = document.getElementById("menu-toggle");

    const linksMenu = document.querySelectorAll(
        "#menu-navegacao a[href^='#']"
    );


    // ==========================================
    // 2. MENU PARA CELULAR
    // ==========================================

    function fecharMenu() {

        if (!cabecalho || !botaoMenu) return;

        cabecalho.classList.remove("menu-aberto");

        botaoMenu.setAttribute("aria-expanded", "false");
        botaoMenu.setAttribute(
            "aria-label",
            "Abrir menu de navegação"
        );
    }


    function abrirMenu() {

        if (!cabecalho || !botaoMenu) return;

        cabecalho.classList.add("menu-aberto");

        botaoMenu.setAttribute("aria-expanded", "true");
        botaoMenu.setAttribute(
            "aria-label",
            "Fechar menu de navegação"
        );
    }


    function alternarMenu() {

        if (!cabecalho) return;

        const menuEstaAberto =
            cabecalho.classList.contains("menu-aberto");

        if (menuEstaAberto) {
            fecharMenu();
        } else {
            abrirMenu();
        }
    }


    if (botaoMenu) {

        botaoMenu.addEventListener("click", alternarMenu);

    }


    // Fecha o menu quando o usuário escolhe uma seção.

    linksMenu.forEach(function (link) {

        link.addEventListener("click", function () {

            fecharMenu();

        });

    });


    // Fecha o menu ao pressionar ESC.

    document.addEventListener("keydown", function (evento) {

        if (
            evento.key === "Escape" &&
            cabecalho &&
            cabecalho.classList.contains("menu-aberto")
        ) {

            fecharMenu();

            if (botaoMenu) {
                botaoMenu.focus();
            }

        }

    });


    // Fecha o menu ao clicar fora do cabeçalho.

    document.addEventListener("click", function (evento) {

        if (
            cabecalho &&
            cabecalho.classList.contains("menu-aberto") &&
            !cabecalho.contains(evento.target)
        ) {

            fecharMenu();

        }

    });


    // ==========================================
    // 3. IDENTIFICAÇÃO DAS SEÇÕES DO SITE
    // ==========================================

    const secoes = Array.from(linksMenu)

        .map(function (link) {

            const id = link.getAttribute("href").substring(1);

            return document.getElementById(id);

        })

        .filter(Boolean);


    // ==========================================
    // 4. ATUALIZAÇÃO DO CABEÇALHO
    // ==========================================

    function atualizarCabecalho() {

        if (!cabecalho) return;

        // Adiciona a classe "rolado" depois de 20 pixels.

        const paginaRolada = window.scrollY > 20;

        cabecalho.classList.toggle(
            "rolado",
            paginaRolada
        );

        // Atualiza a altura do cabeçalho no CSS.

        const altura = cabecalho.offsetHeight;

        document.documentElement.style.setProperty(
            "--altura-cabecalho",
            altura + "px"
        );

    }


    // ==========================================
    // 5. DESTAQUE DA SEÇÃO ATUAL (SCROLL SPY)
    // ==========================================

    function atualizarSecaoAtiva() {

        if (secoes.length === 0) return;

        let secaoAtual = secoes[0];

        const alturaCabecalho = cabecalho
            ? cabecalho.offsetHeight
            : 0;

        const linhaDeLeitura =
            window.scrollY + alturaCabecalho + 110;


        // Identifica qual seção já chegou à área de leitura.

        secoes.forEach(function (secao) {

            const inicioSecao =
                secao.getBoundingClientRect().top + window.scrollY;

            if (inicioSecao <= linhaDeLeitura) {

                secaoAtual = secao;

            }

        });


        // Ao chegar ao final da página, ativa a última seção.

        const chegouAoFinal =
            window.innerHeight + window.scrollY >=
            document.documentElement.scrollHeight - 5;

        if (chegouAoFinal) {

            secaoAtual = secoes[secoes.length - 1];

        }


        // Atualiza o menu de navegação.

        linksMenu.forEach(function (link) {

            const estaAtivo =
                secaoAtual &&
                link.getAttribute("href") ===
                "#" + secaoAtual.id;

            link.classList.toggle(
                "ativo",
                Boolean(estaAtivo)
            );

            if (estaAtivo) {

                link.setAttribute("aria-current", "location");

            } else {

                link.removeAttribute("aria-current");

            }

        });

    }


    // ==========================================
    // 6. OTIMIZAÇÃO DA ROLAGEM
    // ==========================================

    let atualizacaoAgendada = false;


    function atualizarPagina() {

        atualizarCabecalho();

        atualizarSecaoAtiva();

    }


    window.addEventListener("scroll", function () {

        // Evita executar várias atualizações ao mesmo tempo.

        if (!atualizacaoAgendada) {

            window.requestAnimationFrame(function () {

                atualizarPagina();

                atualizacaoAgendada = false;

            });

            atualizacaoAgendada = true;

        }

    }, { passive: true });


    // Atualiza o layout quando a janela muda de tamanho.

    window.addEventListener("resize", function () {

        if (window.innerWidth > 768) {

            fecharMenu();

        }

        atualizarPagina();

    });


    // Executa a primeira atualização ao carregar o site.

    atualizarPagina();


    // ==========================================
    // 7. CHECKLIST EDUCATIVO SOBRE CHUVAS
    // ==========================================

    const checklist = document.getElementById(
        "checklist-preparacao"
    );


    if (checklist) {

        const caixas = checklist.querySelectorAll(
            "input[type='checkbox']"
        );

        const status = document.getElementById(
            "checklist-status"
        );

        const barra = document.getElementById(
            "checklist-barra"
        );

        const preenchimento = document.getElementById(
            "checklist-preenchimento"
        );

        const botaoReset = document.getElementById(
            "checklist-reset"
        );


        // Atualiza a quantidade de itens marcados.

        function atualizarChecklist() {

            const marcados = checklist.querySelectorAll(
                "input[type='checkbox']:checked"
            ).length;

            const total = caixas.length;

            const porcentagem = total === 0
                ? 0
                : (marcados / total) * 100;


            // Atualiza o texto.

            if (status) {

                status.textContent =
                    marcados + " de " + total + " itens marcados";

            }


            // Atualiza a acessibilidade da barra.

            if (barra) {

                barra.setAttribute(
                    "aria-valuenow",
                    marcados
                );

            }


            // Atualiza visualmente o preenchimento.

            if (preenchimento) {

                preenchimento.style.width =
                    porcentagem + "%";

            }

        }


        // Detecta quando uma caixa é marcada ou desmarcada.

        caixas.forEach(function (caixa) {

            caixa.addEventListener(
                "change",
                atualizarChecklist
            );

        });


        // Botão para reiniciar o checklist.

        if (botaoReset) {

            botaoReset.addEventListener("click", function () {

                caixas.forEach(function (caixa) {

                    caixa.checked = false;

                });

                atualizarChecklist();

            });

        }


        // Inicializa a contagem.

        atualizarChecklist();

    }

});
