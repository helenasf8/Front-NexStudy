<template>
  <div class="perfil">
    <div class="profile-card">
      <div class="banner" :style="{ background: gradientDoTema(userStore.user?.tema_cor) }">
        <router-link to="/edit-profile" class="btn-edit">
          <span class="mdi mdi-cog-outline"></span>
          Editar Perfil
        </router-link>
      </div>

      <div class="profile-body">
        <div class="avatar">
          <img v-if="userStore.user?.foto?.url" :src="userStore.user.foto.url" alt="Foto de perfil" />
          <span v-else class="avatar-letter">{{ inicial }}</span>
        </div>

        <div class="profile-info">
          <div class="profile-main">
            <h1>{{ userStore.user?.name || 'Estudante' }}</h1>
            <p class="email">{{ userStore.user?.email }}</p>
            <span class="points-badge">
              <span class="mdi mdi-star-outline"></span>
              450 pontos
            </span>
          </div>
        </div>

        <div class="bio-section">
          <h3>Bio</h3>
          <p>{{ userStore.user?.bio || 'Nenhuma bio adicionada ainda.' }}</p>
        </div>
      </div>
    </div>

    <!-- ESTATÍSTICAS E CONQUISTAS continuam iguais (ainda estáticas) -->
    <div class="stats-card">
      <h2>Estatísticas</h2>
      <ul class="stats-grid">
        <li>
          <div>
            <p class="stat-number">450</p>
            <p class="stat-label">Total de Pontos</p>
          </div>
          <span class="icon-box blue">
            <span class="mdi mdi-star-outline"></span>
          </span>
        </li>
        <li>
          <div>
            <p class="stat-number">5</p>
            <p class="stat-label">Dias de Sequência</p>
          </div>
          <span class="icon-box orange">
            <span class="mdi mdi-fire"></span>
          </span>
        </li>
        <li>
          <div>
            <p class="stat-number">4</p>
            <p class="stat-label">Nível Atual</p>
          </div>
          <span class="icon-box purple">
            <span class="mdi mdi-trophy-outline"></span>
          </span>
        </li>
        <li>
          <div>
            <p class="stat-number">50%</p>
            <p class="stat-label">Progresso</p>
          </div>
          <span class="icon-box green">
            <span class="mdi mdi-bullseye-arrow"></span>
          </span>
        </li>
      </ul>
    </div>

    <div class="achievements-card">
      <h2>Conquistas</h2>
      <ul class="achievements-grid">
        <li>
          <span class="achievement-icon">
            <span class="mdi mdi-fire"></span>
          </span>
          <p class="achievement-title">Semana Forte</p>
          <p class="achievement-desc">7 dias seguidos</p>
        </li>
        <li>
          <span class="achievement-icon">
            <span class="mdi mdi-star-outline"></span>
          </span>
          <p class="achievement-title">500 Pontos</p>
          <p class="achievement-desc">Iniciante dedicado</p>
        </li>
        <li>
          <span class="achievement-icon">
            <span class="mdi mdi-trophy-outline"></span>
          </span>
          <p class="achievement-title">1000 Pontos</p>
          <p class="achievement-desc">Estudante expert</p>
        </li>
        <li>
          <span class="achievement-icon">
            <span class="mdi mdi-medal-outline"></span>
          </span>
          <p class="achievement-title">Nível 5</p>
          <p class="achievement-desc">Mestre dos estudos</p>
        </li>
      </ul>
    </div>
  </div>
</template>

<script setup>
import { computed, onMounted } from 'vue';
import { useUserStore } from '../stores/user';
import { gradientDoTema } from '../constants/temas';

const userStore = useUserStore();

onMounted(() => {
  userStore.fetchMe();
});

const inicial = computed(() => {
  const fonte = userStore.user?.name || userStore.user?.email || '?';
  return fonte[0]?.toUpperCase() ?? '?';
});
</script>

<style scoped>
.perfil {
  margin: 2vw 10vw;
  display: flex;
  flex-direction: column;
  gap: 1.5vw;
}

.profile-card {
  border: 1px solid rgb(228, 228, 228);
  border-radius: 20px;
  overflow: hidden;
}

.banner {
  height: 110px;
  display: flex;
  align-items: flex-start;
  justify-content: flex-end;
  padding: 1.2vw;
  transition: background 0.3s ease;
}

.btn-edit {
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
  text-decoration: none;
  transition: background-color 0.2s ease;
}

.btn-edit:hover {
  background: rgba(255, 255, 255, 0.3);
}

.profile-body {
  position: relative;
  padding: 0 2vw 2vw 2vw;
}

.avatar {
  width: 130px;
  height: 130px;
  border-radius: 50%;
  background: linear-gradient(135deg, #3a3cc4, #9149e4);
  border: 4px solid white;
  display: flex;
  align-items: center;
  justify-content: center;
  position: relative;
  top: -45px;
  margin-bottom: -35px;
  overflow: hidden;
}

.avatar img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.avatar-letter {
  color: white;
  font-size: 2em;
  font-weight: 700;
}

.profile-main h1 {
  font-size: 1.5em;
  font-weight: 700;
  margin-bottom: 4px;
}

.email {
  color: rgb(120, 120, 120);
  font-size: 0.95em;
  margin-bottom: 10px;
}

.points-badge {
  display: inline-flex;
  align-items: center;
  gap: 6px;
  background: #e9f9ee;
  color: #16a34a;
  font-size: 0.9em;
  font-weight: 600;
  padding: 5px 12px;
  border-radius: 10px;
}

.bio-section {
  margin-top: 1.5vw;
}

.bio-section h3 {
  font-size: 1em;
  font-weight: 700;
  margin-bottom: 6px;
}

.bio-section p {
  color: rgb(90, 90, 90);
  font-size: 0.98em;
}

.stats-card,
.achievements-card {
  border: 1px solid rgb(228, 228, 228);
  border-radius: 20px;
  padding: 1.8vw 2vw;
}

.stats-card h2,
.achievements-card h2 {
  font-size: 1.2em;
  font-weight: 700;
  margin-bottom: 1.2vw;
}

.stats-grid {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 1.2vw;
}

.stats-grid li {
  display: flex;
  align-items: center;
  justify-content: space-between;
  border: 1px solid rgb(230, 230, 230);
  border-radius: 16px;
  padding: 1.2vw 1.4vw;
}

.stat-number {
  font-size: 1.6em;
  font-weight: 700;
  color: rgb(20, 20, 20);
}

.stat-label {
  font-size: 0.9em;
  color: rgb(130, 130, 130);
  margin-top: 2px;
}

.icon-box {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 42px;
  height: 42px;
  border-radius: 12px;
  font-size: 1.3em;
  flex-shrink: 0;
}

.icon-box.blue { background: #e8f0fe; color: #3b82f6; }
.icon-box.orange { background: #fff1e8; color: #f97316; }
.icon-box.purple { background: #f2e9fe; color: #a855f7; }
.icon-box.green { background: #e9f9ee; color: #22c55e; }

.achievements-grid {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 1.2vw;
}

.achievements-grid li {
  display: flex;
  flex-direction: column;
  align-items: center;
  text-align: center;
  border: 1px solid rgb(230, 230, 230);
  border-radius: 16px;
  padding: 2vw 1vw;
}

.achievement-icon {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 56px;
  height: 56px;
  border-radius: 50%;
  background: rgb(240, 240, 240);
  color: rgb(180, 180, 180);
  font-size: 1.6em;
  margin-bottom: 0.8vw;
}

.achievement-title {
  font-weight: 600;
  font-size: 0.98em;
  color: rgb(40, 40, 40);
  margin-bottom: 2px;
}

.achievement-desc {
  font-size: 0.85em;
  color: rgb(150, 150, 150);
}

@media (max-width: 900px) {
  .stats-grid,
  .achievements-grid {
    grid-template-columns: repeat(2, 1fr);
  }

  .profile-info {
    flex-direction: column;
    gap: 1vw;
  }
}
</style>