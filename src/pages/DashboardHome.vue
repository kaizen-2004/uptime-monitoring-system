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
            <div class="monitor-list-grid">
                <MonitorList />
            </div>
        </div>
    </transition>
    <router-view ref="child" />
</template>

<script>

</script>

<style lang="scss" scoped>
@import "../assets/vars";
.monitor-list-grid {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(320px, 1fr));
    gap: 1.5rem;
    align-items: stretch;
    margin-bottom: 2rem;
}
.num {
    font-size: 30px;
    color: $primary;
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
