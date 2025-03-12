<template>
  <div class="game-container">
    <h1>{{ title }}</h1>
    <button @click="incrementScore">Score: {{ score }}</button>

    <div class="player" :style="playerStyle">
      <img src="player.png" alt="Player" />
    </div>

    <ul class="items">
      <li v-for="item in items" :key="item.id" @click="collectItem(item)">
        {{ item.name }}
      </li>
    </ul>
  </div>
</template>

<script>
export default {
  name: 'GameScene',
  data() {
    return {
      title: 'My Godot Game',
      score: 0,
      playerPosition: { x: 100, y: 200 },
      items: [
        { id: 1, name: 'Coin', value: 10 },
        { id: 2, name: 'Gem', value: 50 },
        { id: 3, name: 'Star', value: 100 }
      ]
    }
  },
  computed: {
    playerStyle() {
      return {
        position: 'absolute',
        left: `${this.playerPosition.x}px`,
        top: `${this.playerPosition.y}px`
      }
    }
  },
  methods: {
    incrementScore() {
      this.score += 1
    },
    collectItem(item) {
      this.score += item.value
      this.items = this.items.filter(i => i.id !== item.id)
    }
  }
}
</script>

<style>
.game-container {
  width: 800px;
  height: 600px;
  position: relative;
  background-color: #87ceeb;
}

h1 {
  color: #fff;
  text-shadow: 2px 2px #000;
  text-align: center;
}

button {
  background-color: #ffa500;
  color: #fff;
  border: 2px solid #ff8c00;
  padding: 10px 20px;
  border-radius: 5px;
  font-size: 18px;
}

.player {
  width: 64px;
  height: 64px;
  z-index: 10;
}

.items {
  list-style: none;
  margin-top: 20px;
}

.items li {
  background-color: #fff;
  padding: 10px;
  margin: 5px;
  border-radius: 5px;
  cursor: pointer;
}
</style>