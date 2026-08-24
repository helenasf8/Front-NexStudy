<template>
  <div class="editar-perfil">
    <div class="edit-card">
      <div class="edit-banner" :style="{ background: gradientDoTema(form.tema_cor) }">
        <button class="btn-voltar" @click="$router.back()">
          <span class="mdi mdi-arrow-left"></span>
          Voltar
        </button>

        <h1>Customizar Perfil</h1>

        <div class="avatar-upload">
          <div class="avatar-circle">
            <img v-if="fotoPreview" :src="fotoPreview" alt="Foto de perfil" />
            <span v-else class="mdi mdi-account"></span>
          </div>
          <button class="camera-btn" @click="fileInput.click()">
            <span class="mdi mdi-camera"></span>
          </button>
          <input
            ref="fileInput"
            type="file"
            accept="image/png, image/jpeg"
            class="hidden-input"
            @change="onFileChange"
          />
        </div>

        <p class="avatar-hint">Clique na câmera para alterar sua foto</p>
      </div>

      <div class="edit-body">
        <!-- INFORMAÇÕES BÁSICAS -->
        <section>
          <h2>Informações Básicas</h2>

          <div class="field">
            <label for="nome">Nome Completo</label>
            <input id="nome" v-model="form.name" type="text" />
          </div>

          <div class="field">
            <label for="email">Email</label>
            <input id="email" type="email" :value="userStore.user?.email" disabled />
            <span class="field-hint">O email não pode ser alterado</span>
          </div>

          <div class="field">
            <label for="bio">Bio / Sobre Você</label>
            <textarea id="bio" v-model="form.bio" rows="3"></textarea>
          </div>
        </section>

        <!-- PREFERÊNCIAS DE ESTUDO -->
        <section>
          <h2>Preferências de Estudo</h2>

          <div class="field-row">
            <div class="field">
              <label for="objetivo">Objetivo Principal</label>
              <select id="objetivo" v-model="form.objetivo">
                <option value="">Selecione um objetivo</option>
                <option v-for="o in objetivos" :key="o.codigo" :value="o.codigo">
                  {{ o.nome }}
                </option>
              </select>
            </div>

            <div class="field">
              <label for="materia-favorita">Matéria Favorita</label>
              <select id="materia-favorita" v-model="form.materia_favorita">
                <option value="">Selecione uma matéria</option>
                <option v-for="m in materias" :key="m.id" :value="m.id">{{ m.descricao }}</option>
              </select>
            </div>
          </div>

          <div class="field-row">
            <div class="field">
              <label for="horario">Melhor Horário para Estudar</label>
              <select id="horario" v-model="form.melhor_horario">
                <option value="">Selecione um horário</option>
                <option v-for="h in horarios" :key="h.codigo" :value="h.codigo">
                  {{ h.nome }}
                </option>
              </select>
            </div>

            <div class="field">
              <label for="meta-diaria">Meta Diária (minutos)</label>
              <input
                id="meta-diaria"
                v-model.number="form.meta_diaria_minutos"
                type="number"
                min="1"
              />
              <span class="field-hint">Tempo diário de estudo em minutos</span>
            </div>
          </div>
        </section>

        <!-- PERSONALIZAÇÃO VISUAL -->
        <section>
          <h2>Personalização Visual</h2>

          <p class="theme-label">Tema de Cor</p>
          <div class="theme-grid">
            <div
              v-for="tema in TEMAS"
              :key="tema.codigo"
              class="theme-option"
              :class="{ selected: form.tema_cor === tema.codigo }"
              @click="form.tema_cor = tema.codigo"
            >
              <div class="theme-swatch" :style="{ background: tema.gradient }">
                <span v-if="form.tema_cor === tema.codigo" class="mdi mdi-lightning-bolt"></span>
              </div>
              <p>{{ tema.nome }}</p>
            </div>
          </div>
        </section>
        <p v-if="errorMsg" class="error-message">{{ errorMsg }}</p>
        <div class="edit-actions">
          <button type="button" class="btn-secondary" @click="$router.back()">Cancelar</button>
          <button type="button" class="btn-primary" :disabled="saving" @click="handleSave">
            <span class="mdi mdi-content-save-outline"></span>
            {{ saving ? 'Salvando...' : 'Salvar Alterações' }}
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, reactive, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { useUserStore } from '../stores/user'
import materiaApi from '../api/materiaApi'
import { TEMAS, gradientDoTema } from '../constants/temas'

const router = useRouter()
const userStore = useUserStore()

const objetivos = [
  { codigo: 'MELHORAR_NOTAS', nome: 'Melhorar notas' },
  { codigo: 'VESTIBULAR', nome: 'Passar em vestibular' },
  { codigo: 'APRENDER', nome: 'Aprender algo novo' },
  { codigo: 'CONSTANCIA', nome: 'Manter constância' },
]

const horarios = [
  { codigo: 'MANHA', nome: 'Manhã' },
  { codigo: 'TARDE', nome: 'Tarde' },
  { codigo: 'NOITE', nome: 'Noite' },
  { codigo: 'MADRUGADA', nome: 'Madrugada' },
]

const materias = ref([])

const form = reactive({
  name: '',
  bio: '',
  objetivo: '',
  materia_favorita: '',
  melhor_horario: '',
  meta_diaria_minutos: 60,
  tema_cor: 'AZUL',
})

const fileInput = ref(null)
const selectedFile = ref(null)
const fotoPreview = ref(null)
const saving = ref(false)

onMounted(async () => {
  const { data } = await materiaApi.list()
  materias.value = data.results ?? data

  await userStore.fetchMe()
  const u = userStore.user
  if (u) {
    form.name = u.name ?? ''
    form.bio = u.bio ?? ''
    form.objetivo = u.objetivo ?? ''
    form.materia_favorita = u.materia_favorita ?? ''
    form.melhor_horario = u.melhor_horario ?? ''
    form.meta_diaria_minutos = u.meta_diaria_minutos ?? 60
    form.tema_cor = u.tema_cor ?? 'AZUL'
    fotoPreview.value = u.foto?.url ?? null
  }
})

function onFileChange(e) {
  const file = e.target.files[0]
  if (!file) return
  selectedFile.value = file
  fotoPreview.value = URL.createObjectURL(file)
}

const errorMsg = ref('')

async function handleSave() {
  saving.value = true
  errorMsg.value = ''
  try {
    const payload = {
      ...form,
      // campos vazios de ForeignKey precisam ser `null`, nunca string vazia
      materia_favorita: form.materia_favorita || null,
    }

    if (selectedFile.value) {
      const attachmentKey = await userStore.uploadFotoFile(selectedFile.value)
      payload.foto_attachment_key = attachmentKey
    }

    await userStore.updateMe(payload)
    router.push('/perfil')
  } catch (err) {
    console.error(err.response?.data ?? err)
    errorMsg.value = 'Erro ao salvar as alterações. Tente novamente.'
  } finally {
    saving.value = false
  }
}
</script>

<style scoped>
.editar-perfil {
  margin: 2vw 10vw;
}

.edit-card {
  border: 1px solid rgb(228, 228, 228);
  border-radius: 20px;
  overflow: hidden;
}

.edit-banner {
  padding: 2vw 2vw 2.2vw 2vw;
  display: flex;
  flex-direction: column;
  align-items: center;
  position: relative;
  transition: background 0.3s ease;
}

.btn-voltar {
  position: absolute;
  top: 2vw;
  left: 2vw;
  display: flex;
  align-items: center;
  gap: 6px;
  background: rgba(255, 255, 255, 0.2);
  border: 1px solid rgba(255, 255, 255, 0.5);
  color: white;
  font-size: 0.95em;
  font-weight: 600;
  padding: 0.5rem 1rem;
  border-radius: 10px;
  cursor: pointer;
  backdrop-filter: blur(4px);
  transition: background-color 0.2s ease;
}

.btn-voltar:hover {
  background: rgba(255, 255, 255, 0.3);
}

.edit-banner h1 {
  color: white;
  font-size: 1.3em;
  font-weight: 700;
  margin-bottom: 1.2vw;
}

.avatar-upload {
  position: relative;
  margin-bottom: 0.8vw;
}

.avatar-circle {
  width: 120px;
  height: 120px;
  border-radius: 50%;
  background: rgba(255, 255, 255, 0.25);
  border: 2px solid rgba(255, 255, 255, 0.4);
  display: flex;
  align-items: center;
  justify-content: center;
  overflow: hidden;
}

.avatar-circle img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.avatar-circle .mdi {
  font-size: 3em;
  color: rgba(255, 255, 255, 0.85);
}

.camera-btn {
  position: absolute;
  bottom: 0;
  right: 0;
  width: 34px;
  height: 34px;
  border-radius: 50%;
  background: white;
  border: none;
  display: flex;
  align-items: center;
  justify-content: center;
  color: rgb(60, 60, 60);
  font-size: 1.05em;
  cursor: pointer;
  box-shadow: 0 2px 6px rgba(0, 0, 0, 0.2);
  transition: transform 0.15s ease;
}

.camera-btn:hover {
  transform: scale(1.08);
}

.hidden-input {
  display: none;
}

.avatar-hint {
  color: rgba(255, 255, 255, 0.85);
  font-size: 0.9em;
}

.edit-body {
  padding: 2vw;
  display: flex;
  flex-direction: column;
  gap: 2vw;
}

section h2 {
  font-size: 1.1em;
  font-weight: 700;
  padding-bottom: 0.8vw;
  margin-bottom: 1.2vw;
  border-bottom: 1px solid rgb(232, 232, 232);
}

.field {
  display: flex;
  flex-direction: column;
  gap: 6px;
  margin-bottom: 1.2vw;
  flex: 1;
}

.field:last-child {
  margin-bottom: 0;
}

.field label {
  font-weight: 600;
  font-size: 0.95em;
  color: rgb(40, 40, 40);
}

.field input,
.field select,
.field textarea {
  padding: 0.7rem 0.9rem;
  border: 1px solid rgb(224, 224, 224);
  border-radius: 10px;
  background-color: white;
  font-size: 1em;
  outline: none;
  font-family: inherit;
}

.field input:disabled {
  background-color: #f2f2f0;
  color: rgb(140, 140, 140);
  cursor: not-allowed;
}

.field textarea {
  resize: vertical;
}

.field select {
  appearance: none;
  background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='12' height='8'%3E%3Cpath d='M1 1l5 5 5-5' stroke='%23888' stroke-width='2' fill='none'/%3E%3C/svg%3E");
  background-repeat: no-repeat;
  background-position: right 0.9rem center;
  padding-right: 2.2rem;
  cursor: pointer;
}

.field-hint {
  font-size: 0.82em;
  color: rgb(150, 150, 150);
}

.field-row {
  display: flex;
  gap: 1.2vw;
  margin-bottom: 1.2vw;
}

.field-row:last-child {
  margin-bottom: 0;
}

.field-row .field {
  margin-bottom: 0;
}

.theme-label {
  font-weight: 600;
  font-size: 0.95em;
  color: rgb(40, 40, 40);
  margin-bottom: 0.8vw;
}

.theme-grid {
  display: grid;
  grid-template-columns: repeat(6, 1fr);
  gap: 0.9vw;
}

.theme-option {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 6px;
  cursor: pointer;
  padding: 6px;
  border-radius: 12px;
  border: 2px solid transparent;
  transition: border-color 0.2s ease;
}

.theme-option.selected {
  border-color: rgb(23, 24, 24);
}

.theme-swatch {
  width: 100%;
  aspect-ratio: 1;
  border-radius: 10px;
  display: flex;
  align-items: center;
  justify-content: center;
}

.theme-swatch .mdi {
  color: white;
  font-size: 1.3em;
}

.theme-option p {
  font-size: 0.85em;
  font-weight: 500;
  color: rgb(70, 70, 70);
}

.edit-actions {
  display: flex;
  justify-content: flex-end;
  gap: 0.9vw;
  padding-top: 1.5vw;
  border-top: 1px solid rgb(232, 232, 232);
}

.btn-primary {
  display: flex;
  align-items: center;
  gap: 8px;
  background-color: rgb(23, 24, 24);
  color: white;
  border: none;
  padding: 0.75rem 1.6rem;
  border-radius: 10px;
  font-weight: 600;
  cursor: pointer;
  transition: background-color 0.2s ease;
}

.btn-primary:hover {
  background-color: rgb(50, 50, 50);
}

.btn-primary:disabled {
  opacity: 0.6;
  cursor: not-allowed;
}

.btn-secondary {
  background-color: rgb(240, 240, 240);
  color: rgb(60, 60, 60);
  border: none;
  padding: 0.75rem 1.6rem;
  border-radius: 10px;
  font-weight: 600;
  cursor: pointer;
  transition: background-color 0.2s ease;
}

.btn-secondary:hover {
  background-color: rgb(225, 225, 225);
}

@media (max-width: 900px) {
  .field-row {
    flex-direction: column;
    gap: 1.2vw;
  }

  .theme-grid {
    grid-template-columns: repeat(3, 1fr);
  }

  .edit-actions {
    flex-direction: column-reverse;
  }

  .btn-primary,
  .btn-secondary {
    width: 100%;
    justify-content: center;
  }
}
.error-message {
  background-color: #fef2f2;
  color: #dc2626;
  padding: 10px 14px;
  border-radius: 10px;
  font-size: 0.9em;
  border: 1px solid #fecaca;
}
</style>
