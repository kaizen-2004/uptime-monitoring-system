<template>
    <div ref="wrap" class="wrap">
      <svg
        class="ecg-line"
        :width="svgWidth"
        :height="svgHeight"
        :viewBox="`0 0 ${svgWidth} ${svgHeight}`"
        preserveAspectRatio="none"
      >
        <polyline
          :points="ecgPoints"
          fill="none"
          stroke-width="2"
          stroke-linejoin="round"
          stroke-linecap="round"
          :class="isDown ? 'neon-red' : 'neon-blue animate-ecg'"
        />
      </svg>
  
      <div
        v-if="!$root.isMobile && size !== 'small' && beatList.length > 4 && $root.styleElapsedTime !== 'none'"
        class="d-flex justify-content-between align-items-center word"
        :style="timeStyle"
      >
        <div>{{ timeSinceFirstBeat }}</div>
        <div v-if="$root.styleElapsedTime === 'with-line'" class="connecting-line"></div>
        <div>{{ timeSinceLastBeat }}</div>
      </div>
    </div>
  </template>
  
  <script>
  import dayjs from "dayjs";
  
  export default {
    props: {
      size: {
        type: String,
        default: "big"
      },
      monitorId: {
        type: Number,
        required: true
      },
      heartbeatList: {
        type: Array,
        default: null
      }
    },
    data() {
      return {
        beatWidth: 10,
        beatHeight: 30,
        move: false,
        maxBeat: -1
      };
    },
    computed: {
      isDown() {
        const last = this.beatList.at(-1);
        return last && last.status === 0;
      },
      beatList() {
        return this.heartbeatList || this.$root.heartbeatList[this.monitorId] || [];
      },
      numPadding() {
        const diff = this.beatList.length - this.maxBeat;
        return diff > 0 ? 0 : -diff;
      },
      shortBeatList() {
        if (!this.beatList) return [];
        const placeholders = [];
        let start = this.beatList.length - this.maxBeat;
        if (start < 0) {
          for (let i = start; i < 0; i++) placeholders.push(0);
          start = 0;
        }
        return placeholders.concat(this.beatList.slice(start));
      },
      svgWidth() {
        return this.shortBeatList.length * 10;
      },
      svgHeight() {
        return 30;
      },
      ecgPoints() {
        const spacing = 10;
        const amplitude = 12;
        const baseY = 15;
        const points = [];
        let lastX = 0;
  
        if (this.isDown) {
          for (let i = 0; i <= 40; i++) {
            points.push(`${i * spacing},${baseY}`);
          }
        } else {
          for (let i = 0; i < 40; i++) {
            const x = i * spacing;
            if (i % 10 === 5) {
              points.push(`${x},${baseY}`);
              points.push(`${x + spacing * 0.25},${baseY - amplitude}`);
              points.push(`${x + spacing * 0.5},${baseY + amplitude}`);
              points.push(`${x + spacing * 0.75},${baseY}`);
              lastX = x + spacing;
            } else {
              points.push(`${x},${baseY}`);
              lastX = x;
            }
          }
          points.push(`${lastX + spacing},${baseY}`); // ensure continuous line
        }
  
        return points.join(" ");
      },
      timeStyle() {
        return {
          marginLeft: this.numPadding * this.beatWidth + "px"
        };
      },
      timeSinceFirstBeat() {
        const first = this.shortBeatList.at(this.numPadding);
        const minutes = dayjs().diff(dayjs.utc(first?.time), "minutes");
        return minutes > 60 ? `${(minutes / 60).toFixed(0)}h` : `${minutes}m`;
      },
      timeSinceLastBeat() {
        const last = this.shortBeatList.at(-1);
        const seconds = dayjs().diff(dayjs.utc(last?.time), "seconds");
        const tolerance = this.$root.monitorList[this.monitorId]?.interval * 2 || 120;
        if (seconds < tolerance) return this.$t("now");
        return seconds < 3600
          ? this.$t("time ago", [`${(seconds / 60).toFixed(0)}m`])
          : this.$t("time ago", [`${(seconds / 3600).toFixed(0)}h`]);
      }
    },
    watch: {
      beatList: {
        handler() {
          this.move = true;
          setTimeout(() => (this.move = false), 300);
        },
        deep: true
      }
    },
    mounted() {
      window.addEventListener("resize", this.resize);
      this.resize();
    },
    unmounted() {
      window.removeEventListener("resize", this.resize);
    },
    methods: {
      resize() {
        if (this.$refs.wrap) {
          this.maxBeat = Math.floor(this.$refs.wrap.clientWidth / this.beatWidth);
        }
      }
    }
  };
  </script>
  
  <style scoped lang="scss">
  .wrap {
    overflow: hidden;
    width: 100%;
    white-space: nowrap;
  }
  
  .ecg-line {
    width: 100%;
    height: 30px;
  }
  
  /* Animation */
  .animate-ecg {
    stroke-dasharray: 1000;
    stroke-dashoffset: 1000;
    animation: ecg-scroll 2s linear infinite;
  }
  
  @keyframes ecg-scroll {
    to {
      stroke-dashoffset: 0;
    }
  }
  
  /* Neon styles */
  .neon-blue {
    stroke: #00ffff;
    filter: drop-shadow(0 0 4px #00ffff) drop-shadow(0 0 6px #00ffff);
    animation: pulse-blue 4s linear infinite;
  }
  
  .neon-red {
  stroke: #ff0040;
  filter: drop-shadow(0 0 2px #ff0040) drop-shadow(0 0 6px #ff0040) drop-shadow(0 0 10px #ff0040);
  animation: pulse-red 1.2s ease-in-out infinite;
}
  
  @keyframes pulse-blue {
  0% {
    stroke-dasharray: 5, 10;
    stroke-dashoffset: 0;
  }
  100% {
    stroke-dashoffset: -15;
  }
}

@keyframes pulse-red {
  0% {
    stroke-dasharray: 1, 6;
    stroke-dashoffset: 0;
    opacity: 0.7;
  }
  50% {
    stroke-dasharray: 2, 8;
    stroke-dashoffset: -2;
    opacity: 1;
  }
  100% {
    stroke-dashoffset: -6;
    opacity: 0.7;
  }
}


  .word {
    color: #888;
    font-size: 12px;
  }
  
  .connecting-line {
    flex-grow: 1;
    height: 1px;
    background-color: #ededed;
    margin: 0 10px;
  }
  </style>
  