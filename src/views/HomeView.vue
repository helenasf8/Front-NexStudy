<template>
    <main>
        <div class="home-container-info">
            <ul class="home-info">
                <li class="orange">
                    <div>
                        <span class="mdi mdi-star-outline"></span>
                        <p>
                            pontos totais
                        </p>
                    </div>
                    <p class="bold">450</p>
                </li>
                <li class="red">
                    <div>
                        <span class="mdi mdi-fire"></span>
                        <p>
                            Dias de sequência
                        </p>
                    </div>
                    <p class="bold">5</p>
                </li>
                <li class="blue">
                    <div>
                        <span class="mdi mdi-trophy"></span>
                        <p>
                            550 up nível </p>
                    </div>
                    <p class="bold">
                        Nível 1
                    </p>
                </li>
                <li class="green">
                    <div>
                        <span class="mdi mdi-bullseye"></span>
                        <p>
                            Metas Diárias
                        </p>
                    </div>
                    <p class="bold">
                        1/3
                    </p>
                </li>
            </ul>
        </div>
        <div class="home-container-progress">
            <h2>
                Progresso Diário
            </h2>
            <div>
                <p>
                    Meta do dia
                </p>
                <p>
                    33%
                </p>
            </div>
            <div class="progress-bar">
                <div class="progress"></div>
            </div>
        </div>
        <div class="home-container-achievement">
            <h2>
                Conquistas
            </h2>
            <ul class="achivements-list">
                <li>
                    <span class="mdi mdi-star-outline"></span>
                    <div>
                        <h3>Primeira Semana</h3>
                        <p>Complete 7 dias seguidos</p>
                    </div>
                </li>
                <li>
                    <span class="mdi mdi-book-open-blank-variant-outline"></span>
                    <div>
                        <h3>Estudante Dedicado</h3>
                        <p>Complete 50 exercícios</p>
                    </div>
                </li>
                <li>
                    <span class="mdi mdi-trophy-outline"></span>
                    <div>
                        <h3>Mestre dos Estudos</h3>
                        <p>Alcance nível 5</p>
                    </div>
                </li>
                <li>
                    <span class="mdi mdi-medal-outline"></span>
                    <div>
                        <h3>Perfeccionista</h3>
                        <p>Complete todas as metas por 3 dias</p>
                    </div>
                </li>
            </ul>
        </div>
    </main>
</template>

<style>
.home-info {
    margin: 3vw 2vw;
    column-gap: 1vw;
}

.home-info ul {
    display: flex;
    align-content: center;
}

.home-info li {
    display: flex;
    justify-content: space-between;
    flex: 1;
    color: #edf1fe;
    font-size: 1.2em;
    padding: 1.2vw;
    border-radius: 20px;
    border: 2px solid rgb(218, 223, 223, 0.5);
    box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
    font-weight: 500;
}

.bold {
    font-size: 1.8em;
    font-weight: bold;
    padding: 5px 10px 0 0;
}

.home-info li div span {
    font-size: 2.8em;
}

.orange {
    background: linear-gradient(135deg, #0e20c2, #0960e2);
}

.red {
    background: linear-gradient(135deg, #9328eb, #a801eb);
}

.blue {
    background: linear-gradient(135deg, #e00b99, #e92581);
}

.green {
    background: linear-gradient(135deg, #db1e5d, #9e135f);
}

.home-container-progress,
.home-container-achievement {
    margin: 3vw 2vw;
    border: 2px solid rgb(218, 223, 223);
    border-radius: 15px;
    padding: 1.5vw;
    box-shadow: 0 2px 4px rgba(139, 138, 138, 0.1);
}

h2 {
    margin-bottom: 1vw;
    font-weight: bold;
    font-size: 1.3em;
}

.home-container-progress div {
    display: flex;
    justify-content: space-between;
    margin-bottom: 0.5vw;
    color: rgb(71, 71, 71);
    font-size: 0.9em;
}

.progress-bar {
    width: 100%;
    height: 12px;
    background-color: #e5e7eb;
    border-radius: 999px;
    overflow: hidden;
}

.progress {
    width: 60%;
    /*controla o progresso */
    height: 100%;
    background: #2563eb;
    border-radius: 999px;
}

ul.achivements-list {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(600px, 1fr));
    gap: 1rem;
}

.achivements-list li {
    background: rgb(233, 238, 238, 0.8);
    border-radius: 15px;
    border: 2px solid rgb(218, 223, 223);
    padding: 0.8vw 1.5vw;
    display: flex;
    gap: 15px;
    align-items: center;
    color: rgb(71, 71, 71);
    font-size: 1.1em;
}

h3 {
    color: rgb(22, 22, 22);
}

.achivements-list li span {
    font-size: 2.5em;
    color: rgb(110, 107, 107);
    background: rgb(218, 223, 223, 0.6);
    padding: 4px 12px;
    border-radius: 10px;
}
</style>