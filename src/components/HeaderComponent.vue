<script setup>
import { RouterLink } from 'vue-router'
</script>
<template>
    <header>
        <h1>NexStudy</h1>
        <nav>
            <ul>
                <li>
                     <RouterLink to="/home">Home</RouterLink>
                </li>
                <li>
                    <RouterLink to="#">Metas diárias</RouterLink>
                </li>
                <li>
                    <RouterLink to="#">Planilha</RouterLink>
                </li>
                <li>
                    <RouterLink to="#">Notas</RouterLink>
                </li>
                <li>
                    <RouterLink to="#">IA Assistente</RouterLink>
                </li>
                <li>
                    <RouterLink to="/profile">Perfil</RouterLink>
                </li>
            </ul>
        </nav>
    </header>
</template>

<style>
header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 1vw 4vw;
    border-bottom: 1px solid rgb(92, 92, 92);
    border-color: rgb(214, 218, 218);
}

ul {
    list-style: none;
    display: flex;
    gap: 3vw;
}

ul li a {
    text-decoration: none;
    color: rgb(92, 92, 92);
    font-weight: 500;
    font-size: 1.3em;
    padding: 8px 15px;
    border-radius: 10px;
    transition: color 0.1s, background-color 0.1s;
}

ul li a:hover {
    background-color: rgb(23, 24, 24);
    color: #edf1fe;
}
</style>