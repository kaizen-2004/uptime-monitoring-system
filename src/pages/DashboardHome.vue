<template>
    <transition ref="tableContainer" name="slide-fade" appear>
        <div v-if="$route.name === 'DashboardHome'">
            <!-- Add New Monitor Button-->
            <router-link to="/add" class="btn btn-primary mb-3">
                <font-awesome-icon icon="plus" /> {{ $t("Add New Monitor") }}
            </router-link>
            <!-- Quick Stats at the top -->
            <h1 class="mb-3">
                {{ $t("Quick Stats") }}
            </h1>
            <div class="shadow-box big-padding text-center mb-4">
                <div class="row">
                    <div class="col">
                        <h3>{{ $t("Up") }}</h3>
                        <span class="num" :class="$root.stats.up === 0 && 'text-secondary'">{{ $root.stats.up }}</span>
                    </div>
                    <div class="col">
                        <h3>{{ $t("Down") }}</h3>
                        <span class="num" :class="$root.stats.down > 0 ? 'text-danger' : 'text-secondary'">{{ $root.stats.down }}</span>
                    </div>
                    <div class="col">
                        <h3>{{ $t("Maintenance") }}</h3>
                        <span class="num" :class="$root.stats.maintenance > 0 ? 'text-maintenance' : 'text-secondary'">{{ $root.stats.maintenance }}</span>
                    </div>
                    <div class="col">
                        <h3>{{ $t("Unknown") }}</h3>
                        <span class="num text-secondary">{{ $root.stats.unknown }}</span>
                    </div>
                    <div class="col">
                        <h3>{{ $t("pauseDashboardHome") }}</h3>
                        <span class="num text-secondary">{{ $root.stats.pause }}</span>
                    </div>
                </div>
            </div>

            <!-- Monitors grid below Quick Stats -->
            <div class="shadow-box monitor-list-outer">
                <div class="monitor-list-grid">
                    <MonitorList />
                </div>
            </div>
        </div>
    </transition>
    <router-view ref="child" />
</template>

<script>
import MonitorList from "../components/MonitorList.vue";

export default {
    components: {
        MonitorList,
    },
};
</script>

<style lang="scss" scoped>
.monitor-list-outer {
    background: #fff;
    border-radius: 18px;
    box-shadow: 0 2px 16px rgba(0,0,0,0.08);
    padding: 2rem 1.5rem;
    margin-bottom: 2rem;
}
.dark .monitor-list-outer {
    background: #222b36;
}
.monitor-list-grid {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(260px, 1fr));
    gap: 2rem;
    align-items: stretch;
}
:deep(.monitor-item) {
    background: #e3f2fd;
    border-radius: 18px;
    padding: 1.5rem 1rem;
    box-shadow: 0 2px 8px rgba(0,0,0,0.06);
    font-size: 1.3rem;
    font-family: 'Comic Sans MS', 'Comic Sans', cursive;
    text-align: center;
    margin-bottom: 0;
    transition: box-shadow 0.2s;
}
.dark :deep(.monitor-item) {
    background: #90caf9;
}
@media (max-width: 900px) {
    .monitor-list-grid {
        grid-template-columns: repeat(auto-fit, minmax(180px, 1fr));
        gap: 1rem;
    }
    :deep(.monitor-item) {
        font-size: 1.1rem;
        padding: 1rem 0.5rem;
    }
}
.num {
    font-size: 30px;
    color: #002C5f;
    font-weight: bold;
    display: block;
}

.shadow-box {
    padding: 20px;
}

table {
    font-size: 14px;

    tr {
        transition: all ease-in-out 0.2ms;
    }

    @media (max-width: 550px) {
        table-layout: fixed;
        overflow-wrap: break-word;
    }
}

@media screen and (max-width: 1280px) {
    .name-column {
        min-width: 150px;
    }
}

@media screen and (min-aspect-ratio: 4/3) {
    .name-column {
        min-width: 200px;
    }
}
</style>
