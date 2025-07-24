<template>
    <div class="shadow-box table-shadow-box" style="overflow-x: hidden;">
        <h1 class="mb-3">{{ $t("History") }}</h1>
        <table class="table table-borderless table-hover">
            <thead>
                <tr>
                    <th>{{ $t("Name") }}</th>
                    <th>{{ $t("Status") }}</th>
                    <th>{{ $t("DateTime") }}</th>
                    <th>{{ $t("Message") }}</th>
                </tr>
            </thead>
            <tbody>
                <tr v-for="(beat, index) in displayedRecords" :key="index" :class="{ 'shadow-box': $root.windowWidth <= 550}">
                    <td class="name-column"><router-link :to="`/dashboard/${beat.monitorID}`">{{ $root.monitorList[beat.monitorID]?.name }}</router-link></td>
                    <td><Status :status="beat.status" /></td>
                    <td :class="{ 'border-0':! beat.msg}"><Datetime :value="beat.time" /></td>
                    <td class="border-0">{{ beat.msg }}</td>
                </tr>
                <tr v-if="importantHeartBeatListLength === 0">
                    <td colspan="4">
                        {{ $t("No important events") }}
                    </td>
                </tr>
            </tbody>
        </table>
        <div class="d-flex justify-content-center kuma_pagination">
            <pagination
                v-model="page"
                :records="importantHeartBeatListLength"
                :per-page="perPage"
                :options="paginationConfig"
            />
        </div>
    </div>
</template>

<script>
import Status from "../components/Status.vue";
import Datetime from "../components/Datetime.vue";
import Pagination from "v-pagination-3";

export default {
    components: {
        Status,
        Datetime,
        Pagination,
    },
    data() {
        return {
            page: 1,
            perPage: 25,
            initialPerPage: 25,
            paginationConfig: {
                hideCount: true,
                chunksNavigation: "scroll",
            },
            importantHeartBeatListLength: 0,
            displayedRecords: [],
        };
    },
    watch: {
        perPage() {
            this.$nextTick(() => {
                this.getImportantHeartbeatListPaged();
            });
        },
        page() {
            this.getImportantHeartbeatListPaged();
        },
    },
    mounted() {
        this.getImportantHeartbeatListLength();
        this.$root.emitter.on("newImportantHeartbeat", this.onNewImportantHeartbeat);
        this.initialPerPage = this.perPage;
        window.addEventListener("resize", this.updatePerPage);
        this.updatePerPage();
    },
    beforeUnmount() {
        this.$root.emitter.off("newImportantHeartbeat", this.onNewImportantHeartbeat);
        window.removeEventListener("resize", this.updatePerPage);
    },
    methods: {
        onNewImportantHeartbeat(heartbeat) {
            if (this.page === 1) {
                this.displayedRecords.unshift(heartbeat);
                if (this.displayedRecords.length > this.perPage) {
                    this.displayedRecords.pop();
                }
                this.importantHeartBeatListLength += 1;
            }
        },
        getImportantHeartbeatListLength() {
            this.$root.getSocket().emit("monitorImportantHeartbeatListCount", null, (res) => {
                if (res.ok) {
                    this.importantHeartBeatListLength = res.count;
                    this.getImportantHeartbeatListPaged();
                }
            });
        },
        getImportantHeartbeatListPaged() {
            const offset = (this.page - 1) * this.perPage;
            this.$root.getSocket().emit("monitorImportantHeartbeatListPaged", null, offset, this.perPage, (res) => {
                if (res.ok) {
                    this.displayedRecords = res.data;
                }
            });
        },
        updatePerPage() {
            // You may want to adjust this logic for the new page layout
            this.perPage = this.initialPerPage;
        },
    },
};
</script>
