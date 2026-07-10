<script setup>
import LoginComponent from '../components/LoginComponent.vue';
</script>

<template>
    <div class="container">
        <div class="container-text">
            <h1>NexStudy</h1>
            <h2>Seu futuro começa <br> <span>com um plano.</span></h2>
            <p>Transforme sua rotina de estudos com uma plataforma moderna que <br> combina organização, gamificação e
                progresso real. Cada dia é uma nova conquista.</p>
            <ul>
                <li>
                    Metas diárias
                </li>
                <li>
                    Controle de progresso
                </li>
                <li>
                    Gamificação
                </li>
                <li>
                    conquistas
                </li>
            </ul>
        </div>
        <div class="login-container">
            <div class="login-card">
                <LoginComponent />
            </div>
        </div>
    </div>
</template>

<style scoped>
.container {
    display: flex;
    justify-content: space-between;
    margin: 4vw 7vw;
}

.container-text h2 {
    font-size: 4rem;
    margin: 26px 0 20px 0;
}

.container-text p {
    font-size: 1.3rem;
    margin-bottom: 20px;
    color: rgb(87, 92, 87);
    margin-bottom: 3vw;
}

.login-card {
    background: white;
    border-radius: 30px;
    box-shadow: 0 10px 25px rgba(0, 0, 0, 0.1);
    padding: 2.5vw;
    border: 3px solid rgb(218, 223, 223, 0.5);
}

h1 {
    font-weight: 800;
    font-size: 2rem;
}

h1,
h2 span {
    background: linear-gradient(90deg, #3f41c4, #ae6ee2);
    -webkit-background-clip: text;
    /* fundo recortado exatamente no formato das letras. */
    background-clip: text;
    color: transparent;
    /* texto transparente para o fundo em degradê aparecer */
}

.container-text ul {
    display: grid;
    grid-template-columns: repeat(2, 1fr);
    gap: 15px;
    padding: 0;
}

.container-text ul li {
    background-color: white;
    border: 3px solid rgb(218, 223, 223, 0.5);
    font-size: 1.2em;
    padding: 1.3vw;
    border-radius: 20px;
    border: 2px solid rgb(218, 223, 223, 0.5);
    box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
    font-weight: 500;
}
</style>