<template>
    <div>
        <div :style="depthMargin">
            <!-- Checkbox -->
            <div v-if="isSelectMode" class="select-input-wrapper">
                <input
                    class="form-check-input select-input"
                    type="checkbox"
                    :aria-label="$t('Check/Uncheck')"
                    :checked="isSelected(monitor.id)"
                    @click.stop="toggleSelection"
                />
            </div>

            <router-link :to="monitorURL(monitor.id)" class="item" :class="{ 'disabled': ! monitor.active }">
                <div class="monitor-list-item-card">
                    <span class="monitor-name">{{ monitor.name }}</span> 
                    <div v-if="$root.userHeartbeatBar == 'normal'" class="heartbeat-wrapper">
                        <HeartbeatBar ref="heartbeatBar" size="small" :monitor-id="monitor.id" />
                    </div>
                    <div v-if="$root.userHeartbeatBar == 'bottom'" class="heartbeat-wrapper bottom-style">
                        <HeartbeatBar ref="heartbeatBar" size="small" :monitor-id="monitor.id" />
                    </div>
                    <Uptime :monitor="monitor" type="24" :pill="true" />
                    <div v-if="monitor.tags.length > 0" class="tags gap-1">
                        <Tag v-for="tag in monitor.tags" :key="tag" :item="tag" :size="'sm'" />
                    </div>
                </div>
            </router-link>
        </div>

        <transition name="slide-fade-up">
            <div v-if="!isCollapsed" class="childs">
                <MonitorListItem
                    v-for="(item, index) in sortedChildMonitorList"
                    :key="index"
                    :monitor="item"
                    :isSelectMode="isSelectMode"
                    :isSelected="isSelected"
                    :select="select"
                    :deselect="deselect"
                    :depth="depth + 1"
                    :filter-func="filterFunc"
                    :sort-func="sortFunc"
                />
            </div>
        </transition>
    </div>
</template>

<script>
import HeartbeatBar from "../components/HeartbeatBar.vue";
import Tag from "../components/Tag.vue";
import Uptime from "../components/Uptime.vue";
import { getMonitorRelativeURL } from "../util.ts";

export default {
    name: "MonitorListItem",
    components: {
        Uptime,
        HeartbeatBar,
        Tag,
    },
    props: {
        /** Monitor this represents */
        monitor: {
            type: Object,
            default: null,
        },
        /** If the user is in select mode */
        isSelectMode: {
            type: Boolean,
            default: false,
        },
        /** How many ancestors are above this monitor */
        depth: {
            type: Number,
            default: 0,
        },
        /** Callback to determine if monitor is selected */
        isSelected: {
            type: Function,
            default: () => {}
        },
        /** Callback fired when monitor is selected */
        select: {
            type: Function,
            default: () => {}
        },
        /** Callback fired when monitor is deselected */
        deselect: {
            type: Function,
            default: () => {}
        },
        /** Function to filter child monitors */
        filterFunc: {
            type: Function,
            default: () => {}
        },
        /** Function to sort child monitors */
        sortFunc: {
            type: Function,
            default: () => {},
        }
    },
    data() {
        return {
            isCollapsed: true,
        };
    },
    computed: {
        sortedChildMonitorList() {
            let result = Object.values(this.$root.monitorList);

            // Get children
            result = result.filter(childMonitor => childMonitor.parent === this.monitor.id);

            // Run filter on children
            result = result.filter(this.filterFunc);

            result.sort(this.sortFunc);

            return result;
        },
        hasChildren() {
            return this.sortedChildMonitorList.length > 0;
        },
        depthMargin() {
            return {
                marginLeft: `${31 * this.depth}px`,
            };
        },
    },
    watch: {
        isSelectMode() {
            // TODO: Resize the heartbeat bar, but too slow
            // this.$refs.heartbeatBar.resize();
        }
    },
    beforeMount() {

        // Always unfold if monitor is accessed directly
        if (this.monitor.childrenIDs.includes(parseInt(this.$route.params.id))) {
            this.isCollapsed = false;
            return;
        }

        // Set collapsed value based on local storage
        let storage = window.localStorage.getItem("monitorCollapsed");
        if (storage === null) {
            return;
        }

        let storageObject = JSON.parse(storage);
        if (storageObject[`monitor_${this.monitor.id}`] == null) {
            return;
        }

        this.isCollapsed = storageObject[`monitor_${this.monitor.id}`];
    },
    methods: {
        /**
         * Changes the collapsed value of the current monitor and saves
         * it to local storage
         * @returns {void}
         */
        changeCollapsed() {
            this.isCollapsed = !this.isCollapsed;

            // Save collapsed value into local storage
            let storage = window.localStorage.getItem("monitorCollapsed");
            let storageObject = {};
            if (storage !== null) {
                storageObject = JSON.parse(storage);
            }
            storageObject[`monitor_${this.monitor.id}`] = this.isCollapsed;

            window.localStorage.setItem("monitorCollapsed", JSON.stringify(storageObject));
        },
        /**
         * Get URL of monitor
         * @param {number} id ID of monitor
         * @returns {string} Relative URL of monitor
         */
        monitorURL(id) {
            return getMonitorRelativeURL(id);
        },
        /**
         * Toggle selection of monitor
         * @returns {void}
         */
        toggleSelection() {
            if (this.isSelected(this.monitor.id)) {
                this.deselect(this.monitor.id);
            } else {
                this.select(this.monitor.id);
            }
        },
    },
};
</script>

<style lang="scss" scoped>
@import "../assets/vars.scss";

.monitor-list-item-card {
    display: flex;
    flex-direction: column;
    gap: 0.5rem;
    padding: 12px 16px;
    border-radius: $border-radius;
    background-color: $light-bg;
    box-shadow: 0 2px 4px rgba(0, 0, 0, 0.05);
    align-items: center;
    text-align: center;
    min-height: 180px;
    flex: 1 1 0;
    box-sizing: border-box;
    width: 100%;
    transition: background-color 0.3s ease;

    .dark & {
        background-color: $dark-bg2;
        box-shadow: none;
    }

    &:hover {
        background-color: $highlight-white;
        .dark & {
            background-color: $dark-bg;
        }
    }
}

.small-padding {
    padding-left: 5px !important;
    padding-right: 5px !important;
}

.collapse-padding {
    padding-left: 8px !important;
    padding-right: 2px !important;
}

// .monitor-item {
//     width: 100%;
// }

.tags {
    margin-top: 6px;
    padding-left: 0px;
    display: flex;
    flex-wrap: wrap;
    gap: 4px;
    justify-content: center;
}

.collapsed {
    transform: rotate(-90deg);
}

.animated {
    transition: all 0.2s $easing-in;
}

.select-input-wrapper {
    float: left;
    margin-top: 15px;
    margin-left: 8px;
    margin-right: 12x;
    padding-left: 4px;
    position: relative;
    z-index: 15;
}

.monitor-item .info {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    gap: 0.5rem;
}
.monitor-item .badge {
    font-size: clamp(1rem, 2vw, 1.3rem);
    font-weight: bold;
    margin-bottom: 0.5rem;
    min-width: 60px;
    padding: 0.5em 1em;
}
.monitor-item .monitor-name {
    font-size: clamp(1rem, 2vw, 1.2rem);
    font-weight: 600;
    word-break: break-word;
    text-align: center;
    margin-bottom: 4px;
    width: 100%;
    color: $light-font-color;
}

@media (max-width: 900px) {
    .monitor-list-item-card {
        min-height: 120px;
        padding: 8px 4px;
    }
    .monitor-item .monitor-name {
        font-size: clamp(0.9rem, 3vw, 1rem);
    }
    .monitor-item .badge {
        font-size: clamp(0.9rem, 3vw, 1rem);
        min-width: 48px;
        padding: 0.3em 0.7em;
    }
}
.heartbeat-wrapper {
    width: 100%;
    display: flex;
    justify-content: center;
    align-items: center;
    margin: 0.5rem 0 0.2rem 0;
}
.heartbeat-wrapper :deep(canvas),
.heartbeat-wrapper :deep(svg),
.heartbeat-wrapper :deep(.heartbeat-bar) {
    width: 100% !important;
    max-width: 100%;
    min-width: 0;
    display: block;
}

@media (max-width: 900px) {
    .monitor-list-item-card {
        min-height: 120px;
        padding: 8px 4px;
    }
    .monitor-name {
        font-size: clamp(0.9rem, 3vw, 1rem);
    }
}
</style>
