<template>
    <main>
        <div class="profile">
            <h3 class="title">Customizar perfil</h3>
            <div class="perfil">
                <span class="mdi mdi-account-outline"></span>
            </div>
            <div class="camera">
                <span class="mdi mdi-camera-outline"></span>
            </div>
            <p class="description">
                Clique na câmera para alterar sua foto de perfil.
            </p>
        </div>
    </main>
</template>

<style>
.profile {
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 20px;
    margin-top: 3vw;
}

.title {
    font-size: 24px;
    color: #4d4b4b;
}

p.description {
    font-size: 1.1em;
    font-weight: 500;
    color: #4d4b4b;
    text-align: center;
    max-width: 300px;
}

.perfil {
    width: 170px;
    height: 170px;
    border-radius: 50%;
    background: #6250c7;
    border: 3px solid #afadad;
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 90px;
    color: #fff;
}

.camera {
    width: 60px;
    height: 60px;
    border-radius: 50%;
    background-color: #ebecee;
    border: 3px solid #afadad;
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 30px;
    color: #303030;
    cursor: pointer;
    position: absolute;
    top: 17.7vw;
    left: 52vw;
}
</style>