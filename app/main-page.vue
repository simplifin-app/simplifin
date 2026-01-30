<script setup>
import { ref, computed, onMounted, watch } from 'vue'
import { Chart, registerables } from 'chart.js'
import { SankeyController, Flow } from 'chartjs-chart-sankey'

Chart.register(...registerables, SankeyController, Flow)

const income = ref([
  { name: 'Einkommen', items: [{ name: 'Hauptjob', amount: 6500 }] },
  { name: 'andere Einkünfte', items: [{ name: 'Dividenden', amount: 200 }] },
])

const expenses = ref([
  {
    name: 'Wohnen',
    items: [
      { name: 'Miete', amount: 2000 },
      { name: 'Nebenkosten', amount: 300 },
    ],
  },
  {
    name: 'Versicherungen',
    items: [
      { name: 'Krankenkasse', amount: 400 },
      { name: 'Privathaftpflicht', amount: 20 },
    ],
  },
  { name: 'Transport', items: [{ name: 'SBB Abo', amount: 150 }] },
  { name: 'Lebensmittel', items: [{ name: 'Migros/Coop', amount: 800 }] },
  { name: 'Sparen', items: [{ name: 'Säule 3a', amount: 600 }] },
  { name: 'Investieren', items: [{ name: 'ETF Sparplan', amount: 1000 }] },
  { name: 'alltägliche Ausgaben', items: [{ name: 'Hobby', amount: 200 }] },
])

const chartCanvas = ref(null)
let chartInstance = null

const totalIncome = computed(() => {
  return income.value.reduce(
    (acc, cat) => acc + cat.items.reduce((iAcc, item) => iAcc + item.amount, 0),
    0
  )
})

const totalExpenses = computed(() => {
  return expenses.value.reduce(
    (acc, cat) => acc + cat.items.reduce((iAcc, item) => iAcc + item.amount, 0),
    0
  )
})

const chartData = computed(() => {
  const data = []
  const labels = {}
  const incomeCategories = income.value
  const expenseCategories = expenses.value

  const addLabel = (id, label) => {
    labels[id] = label
  }

  addLabel('Gesamt', 'Gesamt')
  addLabel('Rest', 'Überschuss')
  addLabel('Defizit', 'Defizit')

  // Income items to categories
  incomeCategories.forEach((cat, cIdx) => {
    const catId = `ic_${cIdx}`
    addLabel(catId, cat.name)

    cat.items.forEach((item, iIdx) => {
      const amount = Number(item.amount) || 0
      if (amount > 0) {
        const itemId = `ii_${cIdx}_${iIdx}`
        addLabel(itemId, item.name || 'Unbenannt')
        data.push({ from: itemId, to: catId, flow: amount })
      }
    })

    // Category to Total
    const catTotal = cat.items.reduce(
      (acc, item) => acc + (Number(item.amount) || 0),
      0
    )
    if (catTotal > 0) {
      data.push({ from: catId, to: 'Gesamt', flow: catTotal })
    }
  })

  // Total to Expense categories
  expenseCategories.forEach((cat, cIdx) => {
    const catId = `ec_${cIdx}`
    addLabel(catId, cat.name)

    const catTotal = cat.items.reduce(
      (acc, item) => acc + (Number(item.amount) || 0),
      0
    )
    if (catTotal > 0) {
      data.push({ from: 'Gesamt', to: catId, flow: catTotal })
    }

    // Category to items
    cat.items.forEach((item, iIdx) => {
      const amount = Number(item.amount) || 0
      if (amount > 0) {
        const itemId = `ei_${cIdx}_${iIdx}`
        addLabel(itemId, item.name || 'Unbenannt')
        data.push({ from: catId, to: itemId, flow: amount })
      }
    })
  })

  // Handle surplus/deficit
  const diff = totalIncome.value - totalExpenses.value
  if (diff > 0) {
    data.push({ from: 'Gesamt', to: 'Rest', flow: diff })
  } else if (diff < 0) {
    data.push({ from: 'Defizit', to: 'Gesamt', flow: Math.abs(diff) })
  }

  return { data, labels }
})

const updateChart = () => {
  const { data, labels } = chartData.value
  if (chartInstance) {
    chartInstance.data.datasets[0].data = data
    chartInstance.data.datasets[0].labels = labels
    chartInstance.update()
  } else if (chartCanvas.value) {
    chartInstance = new Chart(chartCanvas.value, {
      type: 'sankey',
      data: {
        datasets: [
          {
            label: 'Finanzfluss',
            data: data,
            labels: labels,
            colorFrom: (_c) => '#499FF3',
            colorTo: (_c) => '#F39D49',
            colorMode: 'gradient',
            size: 'max',
          },
        ],
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
          legend: { display: false },
          tooltip: {
            callbacks: {
              label: (context) => {
                const item = context.raw
                return `${labels[item.from]} → ${labels[item.to]}: ${item.flow.toLocaleString('de-CH')} CHF`
              },
            },
          },
        },
      },
    })
  }
}

onMounted(() => {
  updateChart()
})

watch(
  chartData,
  () => {
    updateChart()
  },
  { deep: true }
)

const addItem = (categoryList, catIndex) => {
  categoryList[catIndex].items.push({ name: 'Neu', amount: 0 })
}

const removeItem = (categoryList, catIndex, itemIndex) => {
  categoryList[catIndex].items.splice(itemIndex, 1)
}
</script>

<template>
  <div class="app-container">
    <main class="main-content">
      <div class="calculator-grid">
        <div class="inputs-section">
          <section>
            <h2>Einnahmen</h2>
            <div
              v-for="(cat, cIdx) in income"
              :key="cat.name"
              class="category-group"
            >
              <h3>{{ cat.name }}</h3>
              <div
                v-for="(item, iIdx) in cat.items"
                :key="iIdx"
                class="input-row"
              >
                <input v-model="item.name" type="text" placeholder="Name" />
                <input
                  v-model.number="item.amount"
                  type="number"
                  placeholder="Betrag"
                />
                <button
                  class="remove-btn"
                  @click="removeItem(income, cIdx, iIdx)"
                >
                  ×
                </button>
              </div>
              <button class="add-btn" @click="addItem(income, cIdx)">
                + Hinzufügen
              </button>
            </div>
          </section>

          <section>
            <h2>Ausgaben</h2>
            <div
              v-for="(cat, cIdx) in expenses"
              :key="cat.name"
              class="category-group"
            >
              <h3>{{ cat.name }}</h3>
              <div
                v-for="(item, iIdx) in cat.items"
                :key="iIdx"
                class="input-row"
              >
                <input v-model="item.name" type="text" placeholder="Name" />
                <input
                  v-model.number="item.amount"
                  type="number"
                  placeholder="Betrag"
                />
                <button
                  class="remove-btn"
                  @click="removeItem(expenses, cIdx, iIdx)"
                >
                  ×
                </button>
              </div>
              <button class="add-btn" @click="addItem(expenses, cIdx)">
                + Hinzufügen
              </button>
            </div>
          </section>
        </div>

        <div class="chart-section">
          <h2>Visualisierung</h2>
          <div class="canvas-container">
            <canvas ref="chartCanvas"></canvas>
          </div>
          <div class="summary">
            <p>Einnahmen: {{ totalIncome.toLocaleString('de-CH') }} CHF</p>
            <p>Ausgaben: {{ totalExpenses.toLocaleString('de-CH') }} CHF</p>
            <p
              :class="{
                positive: totalIncome >= totalExpenses,
                negative: totalIncome < totalExpenses,
              }"
            >
              Differenz:
              {{ (totalIncome - totalExpenses).toLocaleString('de-CH') }} CHF
            </p>
          </div>
        </div>
      </div>
    </main>
  </div>
</template>

<style>
body {
  margin: 0;
  font-family: Verdana, sans-serif;
  background-color: #f4f4f9;
}

.app-container {
  min-height: 100vh;
}

.main-content {
  padding: 20px;
}

.calculator-grid {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 40px;
}

.category-group {
  margin-bottom: 20px;
  background: white;
  padding: 15px;
  border-radius: 8px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.05);
  border: 1px solid #e1e8ed;
}

.category-group h3 {
  margin-top: 0;
  font-size: 1rem;
  color: #499ff3;
  border-bottom: 2px solid #f4f4f9;
  padding-bottom: 8px;
  margin-bottom: 12px;
}

.input-row {
  display: flex;
  gap: 8px;
  margin-bottom: 8px;
}

.input-row input {
  padding: 10px;
  border: 1px solid #dcdde1;
  border-radius: 6px;
  font-size: 0.9rem;
  transition: border-color 0.2s;
}

.input-row input:focus {
  outline: none;
  border-color: #499ff3;
}

.input-row input[type='text'] {
  flex: 2;
  min-width: 0;
}

.input-row input[type='number'] {
  flex: 1;
  min-width: 0;
}

.remove-btn {
  background: #f39d49;
  color: white;
  border: none;
  border-radius: 6px;
  padding: 0 12px;
  cursor: pointer;
  transition: opacity 0.2s;
}

.remove-btn:hover {
  opacity: 0.8;
}

.add-btn {
  background: #f8f9fa;
  color: #499ff3;
  border: 2px dashed #499ff3;
  border-radius: 6px;
  padding: 8px 12px;
  cursor: pointer;
  width: 100%;
  margin-top: 8px;
  font-weight: bold;
  transition: all 0.2s;
}

.add-btn:hover {
  background: #499ff3;
  color: white;
}

.canvas-container {
  height: 600px;
  background: white;
  padding: 20px;
  border-radius: 12px;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.05);
  border: 1px solid #e1e8ed;
}

.summary {
  margin-top: 20px;
  padding: 20px;
  background: #fff;
  border-radius: 12px;
  border: 1px solid #e1e8ed;
  display: flex;
  justify-content: space-between;
  align-items: center;
  font-weight: bold;
}

.summary p {
  margin: 0;
}

.positive {
  color: #499ff3;
}
.negative {
  color: #f39d49;
}

@media (max-width: 1024px) {
  .calculator-grid {
    grid-template-columns: 1fr;
  }
}
</style>
