import { ref } from 'vue';
import { defineStore } from 'pinia';
import cronogramaApi from '../api/cronogramaApi';
import cronogramaItemApi from '../api/cronogramaItemApi';
import materiaApi from '../api/materiaApi';

const DIA_SEMANA_MAP = {
  Segunda: 'SEG', Terça: 'TER', Quarta: 'QUA', Quinta: 'QUI',
  Sexta: 'SEX', Sábado: 'SAB', Domingo: 'DOM',
};

const DIA_SEMANA_LABEL = Object.fromEntries(
  Object.entries(DIA_SEMANA_MAP).map(([nome, codigo]) => [codigo, nome])
);

export const useCronogramaStore = defineStore('cronograma', () => {
  const cronogramaId = ref(null);
  const itens = ref([]);
  const materias = ref([]);
  const loading = ref(false);

  async function fetchInicial() {
    loading.value = true;
    try {
      const { data: cronogramas } = await cronogramaApi.list();
      const lista = cronogramas.results ?? cronogramas;
      cronogramaId.value = lista[0]?.id ?? null;

      const { data: materiasData } = await materiaApi.list();
      materias.value = materiasData.results ?? materiasData;

      await fetchItens();
    } finally {
      loading.value = false;
    }
  }

  async function fetchItens() {
    const { data } = await cronogramaItemApi.list();
    itens.value = (data.results ?? data).map((item) => ({
      ...item,
      diaLabel: DIA_SEMANA_LABEL[item.dia_semana],
    }));
  }

  function itensPorDia(diaLabel) {
    return itens.value.filter((i) => i.diaLabel === diaLabel);
  }

  function totalHoras(diaLabel) {
    const totalMin = itensPorDia(diaLabel).reduce((acc, i) => acc + i.duracao_minutos, 0);
    return (totalMin / 60).toFixed(1);
  }

  async function addItem({ materia, topico, diaLabel, horario, duracao }) {
    const payload = {
      cronograma: cronogramaId.value,
      materia,
      topico,
      dia_semana: DIA_SEMANA_MAP[diaLabel],
      horario,
      duracao_minutos: duracao,
      concluido: false,
    };
    const { data } = await cronogramaItemApi.create(payload);
    itens.value.push({ ...data, diaLabel: DIA_SEMANA_LABEL[data.dia_semana] });
  }

  async function toggleConcluido(id) {
    const item = itens.value.find((i) => i.id === id);
    if (!item) return;
    const { data } = await cronogramaItemApi.update(id, { concluido: !item.concluido });
    item.concluido = data.concluido;
  }

  async function deleteItem(id) {
    await cronogramaItemApi.delete(id);
    itens.value = itens.value.filter((i) => i.id !== id);
  }

  return {
    itens, materias, loading,
    fetchInicial, itensPorDia, totalHoras, addItem, toggleConcluido, deleteItem,
  };
});