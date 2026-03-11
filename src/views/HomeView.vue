<template>
  <div class="home">
    <div class="hero">
      <h1>Central de CNDs</h1>
      <p class="subtitle">Gerencie e consulte suas Certidões Negativas de Débito</p>
    </div>

    <div class="actions">
      <RouterLink to="/consultar" class="action-btn">
        <span class="action-btn__label">Consultar CND</span>
        <span class="action-btn__arrow">→</span>
      </RouterLink>

      <RouterLink to="/registrar" class="action-btn action-btn--inverted">
        <span class="action-btn__label">Registrar CND</span>
        <span class="action-btn__arrow">→</span>
      </RouterLink>
    </div>
  </div>
</template>

<script setup>
import { RouterLink } from 'vue-router'
</script>

<style scoped>
.home {
  min-height: 100vh;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 2rem;
  background: #fff;
}

.hero {
  text-align: center;
  margin-bottom: 3rem;
  max-width: 480px;
}

.hero h1 {
  color: #000;
  font-size: 2.5rem;
  font-weight: 900;
  text-transform: uppercase;
  letter-spacing: 0.1em;
  margin-bottom: 0.75rem;
}

.subtitle {
  color: #000;
  font-size: 1rem;
  font-weight: 400;
}

.actions {
  display: flex;
  flex-direction: column;
  gap: 1rem;
  width: 100%;
  max-width: 420px;
}

.action-btn {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 1.25rem 1.75rem;
  border: 2px solid #000;
  border-radius: 0;
  text-decoration: none;
  font-size: 1rem;
  font-weight: 700;
  text-transform: uppercase;
  letter-spacing: 0.08em;
  transition: all 0.15s ease;
  background: #fff;
  color: #000;
}

.action-btn:hover {
  background: #000;
  color: #fff;
  box-shadow: 6px 6px 0 #000;
  transform: translate(-3px, -3px);
}

.action-btn--inverted {
  background: #000;
  color: #fff;
}

.action-btn--inverted:hover {
  background: #fff;
  color: #000;
  box-shadow: 6px 6px 0 #000;
  transform: translate(-3px, -3px);
}

.action-btn__label {
  flex: 1;
}

.action-btn__arrow {
  font-size: 1.25rem;
  line-height: 1;
}

@media (max-width: 480px) {
  .hero h1 {
    font-size: 1.85rem;
  }
}
</style>
