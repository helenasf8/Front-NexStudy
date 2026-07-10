<template>
  <div class="planilha">
    <div class="header">
      <div>
        <h1>Planilha de Estudos</h1>
        <p>Organize sua semana de estudos</p>
      </div>
      <button @click="showForm = !showForm">
        <span class="mdi mdi-plus"></span>
        Adicionar Sessão
      </button>
    </div>

    <div v-if="showForm" class="form-card">
      <h2>Nova Sessão de Estudo</h2>
      <form @submit.prevent="handleAddSession">

        <div class="form-row">
          <select v-model="form.materia" required>
            <option disabled value="">Selecione a matéria</option>
            <option v-for="m in cronogramaStore.materias" :key="m.id" :value="m.id">
              {{ m.descricao }}
            </option>
          </select>
          <input v-model="form.topico" type="text" placeholder="Tópico" />
        </div>

        <div class="form-row">
          <select v-model="form.diaLabel" required>
            <option v-for="dia in dias" :key="dia" :value="dia">{{ dia }}</option>
          </select>
          <select v-model="form.horario" required>
            <option disabled value="">Selecione o horário</option>
            <option v-for="h in horariosDisponiveis" :key="h" :value="h">{{ h }}</option>
          </select>
        </div>

        <div class="form-row">
          <input v-model.number="form.duracao" type="number" min="1" placeholder="Duração (min)" required />
        </div>

        <div class="form-actions">
          <button type="submit" class="btn-primary">Adicionar</button>
          <button type="button" class="btn-secondary" @click="cancelForm">Cancelar</button>
        </div>
      </form>
    </div>

    <div class="days-grid">
      <div class="day-card" v-for="dia in dias" :key="dia">
        <div class="day-header">
          <h2>{{ dia }}</h2>
          <span class="hours">
            <span class="mdi mdi-clock-outline"></span>
            {{ cronogramaStore.totalHoras(dia) }}h
          </span>
        </div>

        <div v-if="cronogramaStore.itensPorDia(dia).length === 0" class="empty-state">
          <p>Nenhuma sessão agendada</p>
        </div>

        <div v-else class="sessions-list">
          <div v-for="item in cronogramaStore.itensPorDia(dia)" :key="item.id" class="session-card"
            :class="{ done: item.concluido }">
            <div class="session-check" @click="cronogramaStore.toggleConcluido(item.id)">
              <span v-if="item.concluido" class="mdi mdi-check check-icon"></span>
              <span v-else class="checkbox-empty"></span>
            </div>

            <div class="session-info">
              <h3>{{ item.materia_nome }}</h3>
              <p v-if="item.topico">{{ item.topico }}</p>
              <span class="session-time">
                <span class="mdi mdi-clock-outline"></span>
                {{ item.horario }} - {{ item.duracao_minutos }} min
              </span>
            </div>

            <button class="delete-btn" @click="cronogramaStore.deleteItem(item.id)">
              <span class="mdi mdi-trash-can-outline"></span>
            </button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, reactive, onMounted } from 'vue';
import { useCronogramaStore } from '../stores/cronograma';

const dias = ['Segunda', 'Terça', 'Quarta', 'Quinta', 'Sexta', 'Sábado', 'Domingo'];
const cronogramaStore = useCronogramaStore();

const showForm = ref(false);
const form = reactive({
  materia: '',
  topico: '',
  diaLabel: 'Segunda',
  horario: '',
  duracao: 60,
});

onMounted(() => {
  cronogramaStore.fetchInicial();
});

async function handleAddSession() {
  await cronogramaStore.addItem(form);
  cancelForm();
}

function cancelForm() {
  form.materia = '';
  form.topico = '';
  form.diaLabel = 'Segunda';
  form.horario = '';
  form.duracao = 60;
  showForm.value = false;
}

const horariosDisponiveis = [];
for (let h = 6; h <= 23; h++) {
  horariosDisponiveis.push(`${String(h).padStart(2, '0')}:00`);
  horariosDisponiveis.push(`${String(h).padStart(2, '0')}:30`);
}
</script>

<style scoped>
.planilha {
  margin: 2vw 4vw;
}

.header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 2vw;
}

.header h1 {
  font-size: 1.6em;
  margin-bottom: 0.3vw;
}

.header p {
  font-size: 1.05em;
  color: rgb(92, 92, 92);
}

.header button {
  display: flex;
  align-items: center;
  gap: 6px;
  background-color: rgb(23, 24, 24);
  color: white;
  font-size: 1.05em;
  font-weight: 600;
  border: none;
  padding: 0.7vw 1.4vw;
  border-radius: 12px;
  cursor: pointer;
  transition: background-color 0.3s ease;
}

.header button:hover {
  background-color: rgb(50, 50, 50);
}

/* FORMULÁRIO */
.form-card {
  border: 1px solid rgb(224, 224, 224);
  border-radius: 16px;
  padding: 1.8vw;
  margin-bottom: 1.5vw;
}

.form-card h2 {
  font-size: 1.15em;
  margin-bottom: 1vw;
}

.form-row {
  display: flex;
  gap: 1vw;
  margin-bottom: 1vw;
}

.form-row input,
.form-row select {
  flex: 1;
  padding: 0.7rem 0.9rem;
  border: 1px solid rgb(224, 224, 224);
  border-radius: 10px;
  background-color: #f2f2f0;
  font-size: 1em;
  outline: none;
}

/* seta customizada só nos selects */
.form-row select {
  appearance: none;
  background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='12' height='8'%3E%3Cpath d='M1 1l5 5 5-5' stroke='%23888' stroke-width='2' fill='none'/%3E%3C/svg%3E");
  background-repeat: no-repeat;
  background-position: right 0.9rem center;
  padding-right: 2.2rem;
}

.form-actions {
  display: flex;
  gap: 0.8vw;
  margin-top: 0.5vw;
}

.btn-primary {
  background-color: rgb(23, 24, 24);
  color: white;
  border: none;
  padding: 0.7rem 1.4rem;
  border-radius: 10px;
  font-weight: 600;
  cursor: pointer;
}

.btn-secondary {
  background-color: rgb(240, 240, 240);
  color: rgb(60, 60, 60);
  border: none;
  padding: 0.7rem 1.4rem;
  border-radius: 10px;
  font-weight: 600;
  cursor: pointer;
}

/* GRID DOS DIAS */
.days-grid {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 1.5vw;
}

.day-card {
  border: 1px solid rgb(224, 224, 224);
  border-radius: 16px;
  padding: 1.5vw;
}

.day-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 1vw;
}

.day-header h2 {
  font-size: 1.2em;
  font-weight: 700;
}

.hours {
  display: flex;
  align-items: center;
  gap: 4px;
  color: rgb(120, 120, 120);
  font-size: 0.95em;
}

.empty-state {
  text-align: center;
  color: rgb(150, 150, 150);
  padding: 2vw 0;
  font-size: 0.95em;
}

/* SESSÕES */
.sessions-list {
  display: flex;
  flex-direction: column;
  gap: 0.8vw;
}

.session-card {
  display: flex;
  align-items: flex-start;
  gap: 12px;
  border: 1px solid rgb(224, 224, 224);
  border-radius: 14px;
  padding: 1vw 1.2vw;
  transition: background-color 0.2s ease, border-color 0.2s ease;
}

.session-card.done {
  background-color: #eafbee;
  border-color: #b7e8c4;
}

.session-check {
  cursor: pointer;
  margin-top: 3px;
}

.checkbox-empty {
  display: block;
  width: 18px;
  height: 18px;
  border: 2px solid rgb(200, 200, 200);
  border-radius: 5px;
}

.check-icon {
  color: #22c55e;
  font-size: 1.3em;
}

.session-info {
  flex: 1;
}

.session-info h3 {
  font-size: 1em;
  font-weight: 600;
}

.session-info p {
  font-size: 0.9em;
  color: rgb(120, 120, 120);
  margin: 2px 0;
}

.session-time {
  display: flex;
  align-items: center;
  gap: 4px;
  font-size: 0.85em;
  color: rgb(140, 140, 140);
  margin-top: 4px;
}

.delete-btn {
  background: none;
  border: none;
  color: rgb(180, 180, 180);
  cursor: pointer;
  font-size: 1.2em;
  transition: color 0.2s ease;
}

.delete-btn:hover {
  color: #dc2626;
}

@media (max-width: 768px) {
  .days-grid {
    grid-template-columns: 1fr;
  }

  .header {
    flex-direction: column;
    align-items: flex-start;
    gap: 1rem;
  }

  .header button {
    width: 100%;
    justify-content: center;
  }

  .form-row {
    flex-direction: column;
  }
}
</style>