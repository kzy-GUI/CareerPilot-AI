<template>
  <div class="card">
    <h2>{{ icon }} {{ title }}</h2>
    <p>{{ description }}</p>
    <button @click="$emit('navigate', route)">{{ buttonText }}</button>
  </div>
</template>

<script setup>
defineProps({
  icon: String,
  title: String,
  description: String,
  buttonText: String,
  route: String
})

defineEmits(['navigate'])
</script>

<style scoped>
.card {
  background: white;
  border-radius: 16px;
  box-shadow: 0 4px 12px rgba(0,0,0,0.08);
  padding: 30px 20px;
  width: 240px;
  text-align: center;
}

.card h2 {
  font-size: 1.4em;
  margin-top: 0;
}

.card p {
  color: #666;
  font-size: 0.95em;
  line-height: 1.5;
}

button {
  background: #007bff;
  color: white;
  border: none;
  padding: 10px 24px;
  border-radius: 8px;
  font-size: 1em;
  cursor: pointer;
  margin-top: 10px;
}

button:hover {
  background: #0056b3;
}
</style>