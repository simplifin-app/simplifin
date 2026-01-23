<script setup lang="ts">
import { ref } from 'vue'

const nameInput = ref('')

defineEmits(['clicked'])

defineProps({
  name: {
    type: String,
    default: '',
  },
})
</script>

<template>
  <div class="my-div">
    <label>{{ name }}</label>
    <input v-model="nameInput" />
    <button @click="$emit('clicked')">Submit {{ nameInput }}</button>
    <slot />
  </div>
</template>

<style scoped>
.my-div {
  background-color: blue;
}
</style>
