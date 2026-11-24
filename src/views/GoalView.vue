<script setup>
import { computed, onMounted, ref } from 'vue'
import { useGoalsStore } from '@/stores/goals'

const goalsStore = useGoalsStore()

const respostas = ref({})

onMounted(() => {
  goalsStore.fetchGoals()
})

async function responder(questaoId) {

  const alternativaId = respostas.value[questaoId]

  if (!alternativaId) return

  const sucesso = await goalsStore.responder(
    questaoId,
    alternativaId
  )

  if (sucesso) {
    delete respostas.value[questaoId]
  }

}

/* ------------------------------------------------------------------ */
/* Apenas visual / navegação (não altera as funções acima)             */
/* ------------------------------------------------------------------ */

const PONTOS_PADRAO = 25

const questaoAtiva = ref(null)
const posicaoAtiva = ref(1)
const totalAtivo = ref(1)
const escolhida = ref(null)
const resultado = ref(null) // { errada, certa }
const travado = ref(false)

const grupos = computed(() => {
  const mapa = new Map()

  for (const q of goalsStore.questoes) {
    const chave = `${q.materia}||${q.tema}`

    if (!mapa.has(chave)) {
      mapa.set(chave, {
        chave,
        materia: q.materia,
        tema: q.tema,
        questoes: [],
        pontos: 0
      })
    }

    const g = mapa.get(chave)
    g.questoes.push(q)
    g.pontos += q.pontos ?? PONTOS_PADRAO
  }

  return [...mapa.values()]
})

function abrirGrupo(grupo) {
  questaoAtiva.value = grupo.questoes[0]
  posicaoAtiva.value = 1
  totalAtivo.value = grupo.questoes.length
  escolhida.value = null
  resultado.value = null
}

function voltar() {
  if (travado.value) return
  questaoAtiva.value = null
  escolhida.value = null
  resultado.value = null
}

const esperar = (ms) => new Promise((resolve) => setTimeout(resolve, ms))

function acharCorreta(questao, fb) {
  const letras = ['a', 'b', 'c', 'd']
  const rc = String(fb.resposta_correta ?? '').trim().toLowerCase()

  const idx = questao.alternativas.findIndex((alt, i) => {
    const texto = String(alt.texto).trim().toLowerCase()
    return (
      String(alt.id).toLowerCase() === rc ||
      texto === rc ||
      rc === letras[i] ||
      rc.startsWith(`${letras[i]})`) ||
      rc.endsWith(texto)
    )
  })

  return idx >= 0 ? questao.alternativas[idx].id : null
}

async function confirmar() {
  const questao = questaoAtiva.value
  const selecionada = respostas.value[questao.id]

  if (!selecionada || travado.value) return

  travado.value = true
  escolhida.value = selecionada

  await responder(questao.id)

  const fb = goalsStore.feedback

  // Falhou ao enviar: mantém a questão aberta para tentar de novo
  if (!fb) {
    travado.value = false
    return
  }

  if (fb.correta) {
    resultado.value = { errada: null, certa: selecionada }
    await esperar(1500)
  } else {
    // 1º vermelho na escolhida, 2º verde na correta
    resultado.value = { errada: selecionada, certa: null }
    await esperar(900)
    resultado.value = {
      errada: selecionada,
      certa: acharCorreta(questao, fb)
    }
    await esperar(1700)
  }

  goalsStore.feedback = null
  travado.value = false
  voltar()
}

function selecionada(alt) {
  return !resultado.value && respostas.value[questaoAtiva.value.id] === alt.id
}
</script>

<template>

  <main class="metas">

    <!-- ============ LISTA DE EXERCÍCIOS ============ -->

    <section v-if="!questaoAtiva" class="lista">

      <h1 class="lista__titulo">Exercícios Diários</h1>

      <p class="lista__subtitulo">
        Complete os exercícios para ganhar pontos e manter sua sequência!
      </p>

      <!-- Carregamento -->

      <div v-if="goalsStore.loading" class="aviso">

        <p>Preparando suas questões diárias...</p>

        <p class="aviso__sec">Isso pode levar alguns segundos.</p>

      </div>

      <!-- Erros -->

      <div v-if="goalsStore.error" class="aviso aviso--erro">

        <p>{{ goalsStore.error }}</p>

        <button
          v-if="goalsStore.total === 0"
          class="btn-outline"
          :disabled="goalsStore.loading"
          @click="goalsStore.fetchGoals()"
        >
          Tentar novamente
        </button>

      </div>

      <template v-if="!goalsStore.loading">

        <!-- Progresso -->

        <div v-if="goalsStore.total > 0" class="progresso">

          <p>
            {{ goalsStore.realizadas }}
            de
            {{ goalsStore.total }}
            questões concluídas
          </p>

          <progress
            :value="goalsStore.realizadas"
            :max="goalsStore.total"
          ></progress>

          <p>{{ goalsStore.progresso }}%</p>

        </div>

        <!-- Cards das questões pendentes -->

        <div v-if="goalsStore.questoes.length > 0" class="grid">

          <button
            v-for="grupo in grupos"
            :key="grupo.chave"
            type="button"
            class="card"
            @click="abrirGrupo(grupo)"
          >

            <div class="card__topo">

              <span class="card__icone">

                <!-- Matemática -->
                <svg
                  v-if="grupo.materia?.toLowerCase().startsWith('mat')"
                  viewBox="0 0 24 24" fill="none" stroke="currentColor"
                  stroke-width="2" stroke-linecap="round" stroke-linejoin="round"
                >
                  <path d="M12 18V5" />
                  <path d="M15 13a4.17 4.17 0 0 1-3-4 4.17 4.17 0 0 1-3 4" />
                  <path d="M17.598 6.5A3 3 0 1 0 12 5a3 3 0 1 0-5.598 1.5" />
                  <path d="M17.997 5.125a4 4 0 0 1 2.526 5.77" />
                  <path d="M18 18a4 4 0 0 0 2-7.464" />
                  <path d="M19.967 17.483A4 4 0 1 1 12 18a4 4 0 1 1-7.967-.517" />
                  <path d="M6 18a4 4 0 0 1-2-7.464" />
                  <path d="M6.003 5.125a4 4 0 0 0-2.526 5.77" />
                </svg>

                <!-- Português -->
                <svg
                  v-else-if="grupo.materia?.toLowerCase().startsWith('port')"
                  viewBox="0 0 24 24" fill="none" stroke="currentColor"
                  stroke-width="2" stroke-linecap="round" stroke-linejoin="round"
                >
                  <path d="M15 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7Z" />
                  <path d="M14 2v4a2 2 0 0 0 2 2h4" />
                  <path d="M10 9H8" />
                  <path d="M16 13H8" />
                  <path d="M16 17H8" />
                </svg>

                <!-- Demais matérias -->
                <svg
                  v-else
                  viewBox="0 0 24 24" fill="none" stroke="currentColor"
                  stroke-width="2" stroke-linecap="round" stroke-linejoin="round"
                >
                  <path d="M12 7v14" />
                  <path d="M3 18a1 1 0 0 1-1-1V4a1 1 0 0 1 1-1h5a4 4 0 0 1 4 4 4 4 0 0 1 4-4h5a1 1 0 0 1 1 1v13a1 1 0 0 1-1 1h-6a3 3 0 0 0-3 3 3 3 0 0 0-3-3z" />
                </svg>

              </span>

              <span class="card__check"></span>

            </div>

            <h2 class="card__titulo">
              {{ grupo.materia }} - {{ grupo.tema }}
            </h2>

            <div class="card__rodape">
              <span class="card__questoes">
                {{ grupo.questoes.length }} questões
              </span>
              <span class="card__pts">+{{ grupo.pontos }} pts</span>
            </div>

          </button>

        </div>

        <!-- Metas concluídas -->

        <div v-else-if="goalsStore.concluidas" class="aviso">

          <h2 class="aviso__titulo">Metas diárias concluídas!</h2>

          <p>Parabéns! Você respondeu todas as questões de hoje.</p>

          <p class="aviso__sec">Volte amanhã para novas questões.</p>

        </div>

        <!-- Planilha vazia -->

        <div v-else-if="!goalsStore.error" class="aviso">

          <h2 class="aviso__titulo">Nenhuma meta disponível</h2>

          <p>
            Adicione matérias à sua planilha de estudos
            para receber questões diárias.
          </p>

          <RouterLink to="/planner" class="btn-outline">
            Ir para a planilha
          </RouterLink>

        </div>

      </template>

    </section>

    <!-- ============ QUESTÃO ABERTA ============ -->

    <section v-else class="questao">

      <div class="questao__topo">

        <h1 class="questao__titulo">
          {{ questaoAtiva.materia }} - {{ questaoAtiva.tema }}
        </h1>

        <button
          type="button"
          class="questao__voltar"
          :disabled="travado"
          @click="voltar"
        >
          Voltar
        </button>

      </div>

      <p class="questao__contador">
        Questão {{ posicaoAtiva }} de {{ totalAtivo }}
      </p>

      <p class="questao__pergunta">{{ questaoAtiva.pergunta }}</p>

      <form @submit.prevent="confirmar">

        <div class="opcoes">

          <label
            v-for="alternativa in questaoAtiva.alternativas"
            :key="alternativa.id"
            class="opcao"
            :class="{
              'opcao--selecionada': selecionada(alternativa),
              'opcao--certa': resultado && resultado.certa === alternativa.id,
              'opcao--errada': resultado && resultado.errada === alternativa.id,
              'opcao--travada': travado
            }"
          >

            <input
              type="radio"
              class="opcao__input"
              :name="`questao-${questaoAtiva.id}`"
              :value="alternativa.id"
              v-model="respostas[questaoAtiva.id]"
              :disabled="travado || goalsStore.respondendo"
            />

            <span class="opcao__bolinha"></span>

            <span class="opcao__texto">{{ alternativa.texto }}</span>

          </label>

        </div>

        <button
          type="submit"
          class="btn-confirmar"
          :disabled="
            !respostas[questaoAtiva.id] ||
            travado ||
            goalsStore.respondendo
          "
        >
          Confirmar Resposta
        </button>

      </form>

      <p v-if="goalsStore.error" class="questao__erro">
        {{ goalsStore.error }}
      </p>

    </section>

  </main>

</template>

<style scoped>
.metas {
  --preto: #020208;
  --borda: #e4e4e7;
  --muted: #71717a;
  --laranja: #e17100;
  --verde: #16a34a;
  --verde-bg: #f0fdf4;
  --vermelho: #dc2626;
  --vermelho-bg: #fef2f2;

  font-family: 'Inter', system-ui, -apple-system, 'Segoe UI', sans-serif;
  color: var(--preto);
  background: #fff;
  max-width: 972px;
  margin: 0 auto;
  padding: 36px 0 48px;
  box-sizing: border-box;
}

.metas * {
  box-sizing: border-box;
}

/* ---------- Lista ---------- */

.lista__titulo {
  margin: 0;
  font-size: 18px;
  font-weight: 500;
  line-height: 28px;
}

.lista__subtitulo {
  margin: 8px 0 20px;
  font-size: 14px;
  color: var(--muted);
}

.grid {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 20px;
}

.card {
  display: flex;
  flex-direction: column;
  width: 100%;
  padding: 20px;
  text-align: left;
  font: inherit;
  color: inherit;
  background: #fff;
  border: 1px solid var(--borda);
  border-radius: 12px;
  cursor: pointer;
  transition: border-color 0.15s, box-shadow 0.15s, transform 0.15s;
}

.card:hover {
  border-color: #c4c4cc;
  box-shadow: 0 4px 14px rgba(0, 0, 0, 0.06);
  transform: translateY(-1px);
}

.card__topo {
  display: flex;
  align-items: flex-start;
  justify-content: space-between;
  margin-bottom: 16px;
}

.card__icone {
  display: grid;
  place-items: center;
  width: 38px;
  height: 38px;
  color: #fff;
  background: var(--preto);
  border-radius: 8px;
}

.card__icone svg {
  width: 20px;
  height: 20px;
}

.card__check {
  width: 18px;
  height: 18px;
  border: 2px solid #71717a;
  border-radius: 50%;
}

.card__titulo {
  margin: 0 0 12px;
  font-size: 14px;
  font-weight: 500;
  line-height: 20px;
}

.card__rodape {
  display: flex;
  align-items: center;
  justify-content: space-between;
  font-size: 12px;
}

.card__questoes {
  color: var(--muted);
}

.card__pts {
  color: var(--laranja);
  font-weight: 500;
}

/* ---------- Avisos / progresso ---------- */

.aviso {
  padding: 20px;
  margin-bottom: 20px;
  font-size: 14px;
  background: #fff;
  border: 1px solid var(--borda);
  border-radius: 12px;
}

.aviso p {
  margin: 0 0 6px;
}

.aviso__titulo {
  margin: 0 0 8px;
  font-size: 16px;
  font-weight: 500;
}

.aviso__sec {
  color: var(--muted);
}

.aviso--erro {
  color: var(--vermelho);
  background: var(--vermelho-bg);
  border-color: #fecaca;
}

.progresso {
  margin-bottom: 20px;
  font-size: 13px;
  color: var(--muted);
}

.progresso p {
  margin: 0 0 6px;
}

.progresso progress {
  display: block;
  width: 100%;
  height: 6px;
  margin-bottom: 6px;
  appearance: none;
  border: 0;
  border-radius: 999px;
  overflow: hidden;
  background: #f0f0f2;
}

.progresso progress::-webkit-progress-bar {
  background: #f0f0f2;
}

.progresso progress::-webkit-progress-value {
  background: var(--preto);
  transition: width 0.3s;
}

.progresso progress::-moz-progress-bar {
  background: var(--preto);
}

.btn-outline {
  display: inline-block;
  margin-top: 8px;
  padding: 8px 16px;
  font: inherit;
  font-size: 14px;
  font-weight: 500;
  color: var(--preto);
  text-decoration: none;
  background: #fff;
  border: 1px solid var(--borda);
  border-radius: 8px;
  cursor: pointer;
}

.btn-outline:hover {
  background: #f4f4f5;
}

.btn-outline:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}

/* ---------- Questão ---------- */

.questao {
  width: 100%;
  max-width: 614px;
  margin: 0 auto;
  padding: 26px;
  background: #fff;
  border: 1px solid var(--borda);
  border-radius: 16px;
}

.questao__topo {
  display: flex;
  align-items: flex-start;
  justify-content: space-between;
  gap: 16px;
}

.questao__titulo {
  margin: 0;
  font-size: 15px;
  font-weight: 500;
  line-height: 24px;
}

.questao__voltar {
  padding: 0;
  font: inherit;
  font-size: 12px;
  color: var(--muted);
  background: none;
  border: 0;
  cursor: pointer;
}

.questao__voltar:hover:not(:disabled) {
  color: var(--preto);
}

.questao__voltar:disabled {
  cursor: not-allowed;
  opacity: 0.5;
}

.questao__contador {
  margin: 4px 0 24px;
  font-size: 12px;
  color: var(--muted);
}

.questao__pergunta {
  margin: 0 0 20px;
  font-size: 15px;
  line-height: 24px;
}

.questao__erro {
  margin: 12px 0 0;
  font-size: 13px;
  color: var(--vermelho);
}

/* ---------- Opções ---------- */

.opcoes {
  display: flex;
  flex-direction: column;
  gap: 10px;
  margin-bottom: 26px;
}

.opcao {
  display: flex;
  align-items: center;
  gap: 12px;
  height: 46px;
  padding: 0 14px;
  font-size: 13px;
  background: #fff;
  border: 1px solid var(--borda);
  border-radius: 8px;
  cursor: pointer;
  transition: background 0.15s, border-color 0.15s;
}

.opcao:hover:not(.opcao--travada) {
  background: #fafafa;
}

.opcao--travada {
  cursor: default;
}

.opcao__input {
  position: absolute;
  opacity: 0;
  pointer-events: none;
}

.opcao__bolinha {
  position: relative;
  flex: none;
  width: 18px;
  height: 18px;
  background: #fff;
  border: 1px solid var(--borda);
  border-radius: 50%;
  transition: background 0.15s, border-color 0.15s;
}

.opcao__bolinha::after {
  content: '';
  position: absolute;
  inset: 0;
  margin: auto;
  width: 6px;
  height: 6px;
  background: #fff;
  border-radius: 50%;
  opacity: 0;
}

/* selecionada */
.opcao--selecionada {
  background: #f4f4f5;
  border-color: var(--preto);
}

.opcao--selecionada .opcao__bolinha {
  background: var(--preto);
  border-color: var(--preto);
}

.opcao--selecionada .opcao__bolinha::after {
  opacity: 1;
}

/* resposta certa */
.opcao--certa {
  background: var(--verde-bg);
  border-color: var(--verde);
}

.opcao--certa .opcao__bolinha {
  background: var(--verde);
  border-color: var(--verde);
}

.opcao--certa .opcao__bolinha::after {
  opacity: 1;
}

/* resposta errada */
.opcao--errada {
  background: var(--vermelho-bg);
  border-color: var(--vermelho);
}

.opcao--errada .opcao__bolinha {
  background: var(--vermelho);
  border-color: var(--vermelho);
}

.opcao--errada .opcao__bolinha::after {
  opacity: 1;
}

/* ---------- Botão confirmar ---------- */

.btn-confirmar {
  display: block;
  width: 100%;
  height: 38px;
  font: inherit;
  font-size: 14px;
  font-weight: 500;
  color: #fff;
  background: var(--preto);
  border: 0;
  border-radius: 8px;
  cursor: pointer;
  transition: opacity 0.15s;
}

.btn-confirmar:hover:not(:disabled) {
  opacity: 0.9;
}

.btn-confirmar:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}

/* ---------- Responsivo ---------- */

@media (max-width: 1020px) {
  .metas {
    padding-left: 20px;
    padding-right: 20px;
  }
}

@media (max-width: 860px) {
  .grid {
    grid-template-columns: repeat(2, 1fr);
  }
}

@media (max-width: 560px) {
  .grid {
    grid-template-columns: 1fr;
  }

  .questao {
    padding: 20px;
  }
}
</style>