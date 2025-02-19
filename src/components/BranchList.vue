<template>
  <div class="p-12 flex flex-col gap-y-12">
    <section class="flex items-center justify-between bg-white p-6 rounded-lg">
      <h1 class="text-2xl font-bold">
        Branches with Reservations
      </h1>
      <button
        class="bg-primary-100 text-white px-4 py-2 rounded-lg hover:bg-primary-700"
        @click="showAddBranchPopup"
      >
        Disable Reservations
      </button>
    </section>
    <section class="rounded-lg overflow-hidden bg-white border-white shadow-lg pt-6 flex flex-col gap-y-6">
      <button
        class="bg-white text-gray-500 px-4 py-2 border-gray-500 border rounded-lg w-fit self-end mr-4"
        popovertarget="add-branches-popover"
      >
        Add Branches
      </button>
      <table class="min-w-full bg-white">
        <thead>
          <tr>
            <th class="py-2">
              Branch Name
            </th>
            <th class="py-2">
              Reference
            </th>
            <th class="py-2">
              Number of Tables
            </th>
            <th class="py-2">
              Reservation Duration
            </th>
            <th class="py-2">
              Actions
            </th>
          </tr>
        </thead>
        <tbody>
          <tr
            v-for="branch in branches"
            :key="branch.id"
            class="cursor-pointer"
            @click="editBranch(branch)"
          >
            <td class="py-2">
              {{ branch.name }}
            </td>
            <td class="py-2">
              {{ branch.reference }}
            </td>
            <td class="py-2">
              {{ countTables(branch) }}
            </td>
            <td class="py-2">
              {{ branch.reservation_duration }}
            </td>
            <td class="py-2 flex items-center gap-x-2">
              <button
                class="bg-primary-100 text-white px-4 py-2 rounded-lg hover:bg-primary-700"
                @click="editBranch(branch)"
              >
                Edit
              </button>
              <button
                class="bg-white text-gray-500 px-4 py-2 border-gray-500 border rounded-lg"
                @click="disableReservation(branch)"
              >
                Disable
              </button>
            </td>
          </tr>
        </tbody>
      </table>
    </section>
    
    <AddBranchPopup
      id="add-branches-popover"
      popover
      @close="showAddPopup = false"
      @save="fetchBranches"
    />
    <BranchSettingsForm
      v-if="showSettingsForm"
      :branch="selectedBranch"
      @close="showSettingsForm = false"
      @save="fetchBranches"
    />
  </div>
</template>

<script>
import AddBranchPopup from './AddBranchPopup.vue';
import BranchSettingsForm from './BranchSettingsForm.vue';
import { getBranches, updateBranch } from '../services/api';

export default {
  components: { AddBranchPopup, BranchSettingsForm },
  data() {
    return {
      branches: [],
      showAddPopup: false,
      showSettingsForm: false,
      selectedBranch: null,
    };
  },
  created() {
    this.fetchBranches();
  },
  methods: {
    async fetchBranches() {
      try {
        const response = await getBranches();
        this.branches = response.data.filter(branch => branch.accepts_reservations);
      } catch (error) {
        console.error('Error fetching branches:', error);
      }
    },
    countTables(branch) {
      return branch.sections.reduce((count, section) => {
        return count + section.tables.filter(table => table.accepts_reservations).length;
      }, 0);
    },
    showAddBranchPopup() {
      this.showAddPopup = true;
    },
    editBranch(branch) {
        console.log(branch);
      this.selectedBranch = branch;
      this.showSettingsForm = true;
    },
    async disableReservation(branch) {
      await updateBranch(branch.id, { accepts_reservations: false });
      this.fetchBranches();
    },
  },
};
</script>

<style scoped>
/* Add your styles here */
table {
  @apply w-full border-collapse;
}

th, td {
  @apply  px-6 py-4 text-left;
}

th {
  @apply bg-white text-left;
}

tr:nth-child(even) {
  @apply bg-gray-50;
}

button.bg-white.text-gray-500.px-4.py-2.border-gray-500.border.rounded-lg:hover {
  @apply bg-gray-100;
}
</style>
