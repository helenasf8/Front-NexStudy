<template>
  <div class="notas">
    <div class="header-page">
      <h1>Quadro Kanban de Estudos</h1>
      <p>Organize suas tarefas de estudo arrastando entre as colunas</p>
    </div>

    <div class="kanban-grid">
      <div
        v-for="col in colunas"
        :key="col.status"
        class="kanban-column"
        @dragover.prevent="onDragOverColumn(col.status)"
        @drop="onDrop"
      >
        <div class="kanban-column-header">
          <div class="kanban-column-title">
            <span class="dot" :style="{ backgroundColor: col.cor }"></span>
            <h2>{{ col.titulo }}</h2>
            <span class="count">({{ cronogramaStore.itensPorStatus(col.status).length }})</span>
          </div>
          <button class="add-btn" @click="openModal(col.status)">
            <span class="mdi mdi-plus"></span>
          </button>
        </div>

        <div class="kanban-list">
          <div
            v-for="item in cronogramaStore.itensPorStatus(col.status)"
            :key="item.id"
            class="kanban-card"
            :class="{ dragging: draggedId === item.id }"
            draggable="true"
            @dragstart="onDragStart(item)"
            @dragend="draggedId = null"
            @dragover.prevent.stop="onDragOverCard(item)"
          >
            <span class="drag-handle mdi mdi-drag"></span>
            <p>{{ item.topico }}</p>
          </div>

          <div v-if="cronogramaStore.itensPorStatus(col.status).length === 0" class="empty-column">
            Nenhuma tarefa aqui
          </div>
        </div>
      </div>
    </div>

    <!-- MODAL -->
    <Teleport to="body">
      <div v-if="showModal" class="modal-overlay" @click.self="closeModal">
        <div class="modal-card">
          <div class="modal-header">
            <h3>Nova Tarefa</h3>
            <button class="modal-close" @click="closeModal">
              <span class="mdi mdi-close"></span>
            </button>
          </div>

          <form class="modal-form" @submit.prevent="handleQuickAdd">
            <div class="field">
              <label for="modal-materia">Matéria</label>
              <select id="modal-materia" v-model="quickAdd.materia" required>
                <option disabled value="">Selecione a matéria</option>
                <option v-for="m in cronogramaStore.materias" :key="m.id" :value="m.id">
                  {{ m.descricao }}
                </option>
              </select>
            </div>

            <div class="field">
              <label for="modal-topico">Título da tarefa</label>
              <input
                id="modal-topico"
                v-model="quickAdd.topico"
                type="text"
                placeholder="Ex: Revisar capítulo de Matemática"
                required
              />
            </div>

            <div class="modal-actions">
              <button type="submit" class="btn-primary">Adicionar</button>
              <button type="button" class="btn-secondary" @click="closeModal">Cancelar</button>
            </div>
          </form>
        </div>
      </div>
    </Teleport>
  </div>
</template>

<script setup>
import { ref, reactive, onMounted } from 'vue';
import { useCronogramaStore } from '../stores/cronograma';

const cronogramaStore = useCronogramaStore();

const colunas = [
  { status: 'PARA_FAZER', titulo: 'Para Fazer', cor: '#3b82f6' },
  { status: 'EM_ANDAMENTO', titulo: 'Em Andamento', cor: '#f97316' },
  { status: 'CONCLUIDO', titulo: 'Concluído', cor: '#22c55e' },
];

onMounted(() => {
  cronogramaStore.fetchInicial();
});

// ---------- Drag & Drop ----------
const draggedId = ref(null);

function onDragStart(item) {
  draggedId.value = item.id;
}

function onDragOverCard(targetItem) {
  if (!draggedId.value || draggedId.value === targetItem.id) return;
  const dragged = cronogramaStore.itens.find((i) => i.id === draggedId.value);
  if (!dragged) return;

  dragged.status = targetItem.status;

  const columnItems = cronogramaStore
    .itensPorStatus(targetItem.status)
    .filter((i) => i.id !== dragged.id);
  const targetIndex = columnItems.findIndex((i) => i.id === targetItem.id);
  columnItems.splice(targetIndex, 0, dragged);
  columnItems.forEach((i, idx) => { i.ordem = idx; });
}

function onDragOverColumn(status) {
  if (!draggedId.value) return;
  const dragged = cronogramaStore.itens.find((i) => i.id === draggedId.value);
  if (!dragged || dragged.status === status) return;

  dragged.status = status;
  const columnItems = cronogramaStore.itensPorStatus(status);
  columnItems.forEach((i, idx) => { i.ordem = idx; });
}

async function onDrop() {
  if (!draggedId.value) return;
  const dragged = cronogramaStore.itens.find((i) => i.id === draggedId.value);
  if (dragged) {
    const siblings = cronogramaStore.itensPorStatus(dragged.status);
    await Promise.all(
      siblings.map((i) =>
        cronogramaStore.persistItem(i.id, { status: i.status, ordem: i.ordem })
      )
    );
  }
  draggedId.value = null;
}

// ---------- Modal de adição rápida ----------
const showModal = ref(false);
const modalStatus = ref('PARA_FAZER');
const quickAdd = reactive({ materia: '', topico: '' });

const DIAS_ORDENADOS = ['Domingo', 'Segunda', 'Terça', 'Quarta', 'Quinta', 'Sexta', 'Sábado'];

function diaAtualLabel() {
  return DIAS_ORDENADOS[new Date().getDay()];
}

function horarioAtualArredondado() {
  const agora = new Date();
  const minutos = agora.getMinutes() < 30 ? 30 : 0;
  const hora = agora.getMinutes() < 30 ? agora.getHours() : agora.getHours() + 1;
  return `${String(hora % 24).padStart(2, '0')}:${String(minutos).padStart(2, '0')}`;
}

function openModal(status) {
  modalStatus.value = status;
  quickAdd.materia = '';
  quickAdd.topico = '';
  showModal.value = true;
}

function closeModal() {
  showModal.value = false;
}

async function handleQuickAdd() {
  await cronogramaStore.addItem({
    materia: quickAdd.materia,
    topico: quickAdd.topico,
    diaLabel: diaAtualLabel(),
    horario: horarioAtualArredondado(),
    duracao: 30,
    status: modalStatus.value,
  });
  closeModal();
}
</script>

<style scoped>
.notas {
  margin: 2vw 4vw;
}

.header-page {
  margin-bottom: 2.2vw;
}

.header-page h1 {
  font-size: 1.7em;
  font-weight: 700;
  margin-bottom: 0.4vw;
}

.header-page p {
  font-size: 1.05em;
  color: rgb(100, 100, 100);
}

/* GRID */
.kanban-grid {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 1.8vw;
  align-items: start;
}

.kanban-column {
  background: #f7f8f9;
  border: 1px solid rgb(232, 232, 232);
  border-radius: 18px;
  padding: 1.4vw;
  min-height: 240px;
}

.kanban-column-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 1.2vw;
}

.kanban-column-title {
  display: flex;
  align-items: center;
  gap: 10px;
}

.kanban-column-title h2 {
  font-size: 1.3em;
  font-weight: 700;
  color: rgb(25, 25, 25);
  line-height: 1;
  margin: 0;
}

.dot {
  width: 12px;
  height: 12px;
  border-radius: 50%;
  flex-shrink: 0;
}

.count {
  color: rgb(150, 150, 150);
  font-size: 0.95em;
  font-weight: 500;
}

.add-btn {
  display: flex;
  align-items: center;
  justify-content: center;
  background: none;
  border: none;
  color: rgb(150, 150, 150);
  font-size: 1.5em;
  cursor: pointer;
  padding: 0;
  transition: color 0.2s ease;
}

.add-btn:hover {
  color: rgb(23, 24, 24);
}

/* LISTA / CARDS */
.kanban-list {
  display: flex;
  flex-direction: column;
  gap: 0.9vw;
  min-height: 50px;
}

.kanban-card {
  display: flex;
  align-items: center;
  gap: 10px;
  background: white;
  border: 1px solid rgb(228, 228, 228);
  border-radius: 14px;
  padding: 1.1vw 1.2vw;
  cursor: grab;
  transition: opacity 0.2s ease, box-shadow 0.2s ease, transform 0.15s ease;
}

.kanban-card:hover {
  box-shadow: 0 4px 14px rgba(0, 0, 0, 0.08);
  transform: translateY(-1px);
}

.kanban-card.dragging {
  opacity: 0.4;
}

.kanban-card p {
  font-size: 1.02em;
  font-weight: 500;
  color: rgb(30, 30, 30);
  line-height: 1.4;
}

.drag-handle {
  color: rgb(200, 200, 200);
  cursor: grab;
  font-size: 1.25em;
  flex-shrink: 0;
}

.empty-column {
  text-align: center;
  color: rgb(175, 175, 175);
  font-size: 0.95em;
  padding: 2vw 0;
}

@media (max-width: 900px) {
  .kanban-grid {
    grid-template-columns: 1fr;
  }
}

/* ---------- MODAL ---------- */
.modal-overlay {
  position: fixed;
  inset: 0;
  background: rgba(0, 0, 0, 0.45);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1000;
  padding: 20px;
}

.modal-card {
  background: white;
  border-radius: 20px;
  padding: 2vw 2.2vw;
  width: 100%;
  max-width: 420px;
  box-shadow: 0 12px 40px rgba(0, 0, 0, 0.18);
}

.modal-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 1.5vw;
}

.modal-header h3 {
  font-size: 1.25em;
  font-weight: 700;
}

.modal-close {
  background: none;
  border: none;
  font-size: 1.3em;
  color: rgb(140, 140, 140);
  cursor: pointer;
  transition: color 0.2s ease;
}

.modal-close:hover {
  color: rgb(23, 24, 24);
}

.modal-form {
  display: flex;
  flex-direction: column;
  gap: 1.1vw;
}

.field {
  display: flex;
  flex-direction: column;
  gap: 6px;
}

.field label {
  font-weight: 600;
  font-size: 0.95em;
  color: rgb(40, 40, 40);
}

.field input,
.field select {
  padding: 0.75rem 0.9rem;
  border: 1px solid rgb(224, 224, 224);
  border-radius: 10px;
  background-color: #f2f2f0;
  font-size: 1em;
  outline: none;
}

.field select {
  appearance: none;
  background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='12' height='8'%3E%3Cpath d='M1 1l5 5 5-5' stroke='%23888' stroke-width='2' fill='none'/%3E%3C/svg%3E");
  background-repeat: no-repeat;
  background-position: right 0.9rem center;
  padding-right: 2.2rem;
}

.modal-actions {
  display: flex;
  gap: 0.8vw;
  margin-top: 0.5vw;
}

.btn-primary {
  flex: 1;
  background-color: rgb(23, 24, 24);
  color: white;
  border: none;
  padding: 0.75rem 1.4rem;
  border-radius: 10px;
  font-weight: 600;
  cursor: pointer;
  transition: background-color 0.2s ease;
}

.btn-primary:hover {
  background-color: rgb(50, 50, 50);
}

.btn-secondary {
  flex: 1;
  background-color: rgb(240, 240, 240);
  color: rgb(60, 60, 60);
  border: none;
  padding: 0.75rem 1.4rem;
  border-radius: 10px;
  font-weight: 600;
  cursor: pointer;
  transition: background-color 0.2s ease;
}

.btn-secondary:hover {
  background-color: rgb(225, 225, 225);
}
</style>