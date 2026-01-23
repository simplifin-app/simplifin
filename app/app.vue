<script setup lang="ts">
import TestComponent from '~/TestComponent.vue'

function myHandler() {}
</script>

<template>
  <div id="my-app">
    <TestComponent name="Thomas" @clicked="myHandler">
      Test
      <input />
    </TestComponent>
    <TestComponent>Some other text</TestComponent>
  </div>
</template>

<style scoped>
#my-app {
  background-color: lightblue;
  height: 100%;
  display: flex;
}
</style>
