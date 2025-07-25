<template>
    <span :class="className" :title="title">{{ uptime }}</span>
</template>

<script>
import { DOWN, MAINTENANCE, PENDING, UP } from "../util.ts";

export default {
    props: {
        /** Monitor this represents */
        monitor: {
            type: Object,
            default: null,
        },
        /** Type of monitor */
        type: {
            type: String,
            default: null,
        },
        /** Is this a pill? */
        pill: {
            type: Boolean,
            default: false,
        },
    },

    computed: {
        uptime() {
            if (this.type === "maintenance") {
                return this.$t("statusMaintenance");
            }

            let key = this.monitor.id + "_" + this.type;

            if (this.$root.uptimeList[key] !== undefined) {
                let result = Math.round(this.$root.uptimeList[key] * 10000) / 100;
                // Only perform sanity check on status page. See louislam/uptime-kuma#2628
                if (this.$route.path.startsWith("/status") && result > 100) {
                    return "100%";
                } else {
                    return result + "%";
                }
            }

            return this.$t("notAvailableShort");
        },

        color() {
    switch (this.lastHeartBeat.status) {
        case MAINTENANCE:
            return "maintenance";
        case DOWN:
            return "down";
        case UP:
            return "up";
        case PENDING:
            return "warning";
        default:
            return "secondary";
    }
},

        lastHeartBeat() {
            if (this.monitor.id in this.$root.lastHeartbeatList && this.$root.lastHeartbeatList[this.monitor.id]) {
                return this.$root.lastHeartbeatList[this.monitor.id];
            }

            return {
                status: -1,
            };
        },

        className() {
            if (this.pill) {
                return `badge rounded-pill bg-${this.color}`;
            }

            return "";
        },

        title() {
            if (this.type === "1y") {
                return `1${this.$t("-year")}`;
            }
            if (this.type === "720") {
                return `30${this.$t("-day")}`;
            }
            return `24${this.$t("-hour")}`;
        }
    },
};
</script>

<style lang="scss" scoped>
@import "../assets/vars.scss";

.badge {
    min-width: 62px;
    font-weight: 600;
    padding: 0.25rem 0.75rem;
    font-size: 0.95rem;
    text-align: center;
    border-radius: 999px;
    color: white;
}

.bg-up {
    background-color: $primary;
}
.bg-down {
    background-color: $danger;
}
.bg-maintenance {
    background-color: $maintenance;
}
.bg-warning {
    background-color: $warning;
    color: #000; // readable on yellow
}
.bg-secondary {
    background-color: $secondary-text;
}

</style>
