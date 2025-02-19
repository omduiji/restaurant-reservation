<template>
  <div class="rounded-lg max-h-[800px] w-[800px] bg-white p-4">
    <div class="bg-white p-4 flex flex-col">
      <h2 class="text-xl font-bold mb-4">
        Add Branches
      </h2>
      <div class="w-full mb-4 p-2 rounded-lg flex- flex-col gap-y-4">
        <p
          v-show="selectedBranches.length"
          class="text-lg font-semibold mb-2 text-left"
        >
          Selected Branches:
        </p>
        <ul class="flex gap-x-4 flex-wrap gap-y-2">
          <li
            v-for="branchId in selectedBranches"
            :key="branchId"
            class="flex items-center p-2 bg-gray-100 rounded-lg"
          >
            {{ getBranchName(branchId) }}
            <button
              class="ml-2 text-black h-6 w-6"
              @click="uncheckBranch(branchId)"
            >
              x
            </button>
          </li>
        </ul>
      </div>
      <div class="w-full mb-4 p-2 flex flex-col gap-y-4 overflow-y-auto max-h-64">
        <div
          v-for="branch in branches"
          :key="branch.id"
          class="flex items-center mb-2"
        >
          <input
            v-model="selectedBranches"
            type="checkbox"
            :value="branch.id"
            class="mr-2 accent-primary-100 h-6 w-6"
          >
          <label>{{ branch.name }}</label>
        </div>
      </div>
      <div class="flex justify-end gap-x-4">
        <button
          class="bg-primary-100 text-white px-4 py-2 rounded-lg hover:bg-primary-700"
          @click="save"
        >
          Save
        </button>
        <button
          class="bg-white text-gray-500 px-4 py-2 border-gray-500 border rounded-lg"
          @click="closePopover"
        >
          Cancel
        </button>
      </div>
    </div>
  </div>
</template>

<script>
import { getBranches, updateBranch } from '../services/api';

export default {
  data() {
    return {
      branches: [],
      selectedBranches: [],
    };
  },
  created() {
    this.fetchBranches();
  },
  methods: {
    async fetchBranches() {
      const response = await getBranches();
      this.branches = response.data.filter(branch => !branch.accepts_reservations);
    },
    async save() {
      for (const branchId of this.selectedBranches) {
        await updateBranch(branchId, { accepts_reservations: true });
      }
      this.$emit('save');
      this.closePopover();
    },
    closePopover() {
      document.getElementById('add-branches-popover').hidePopover();
    },
    getBranchName(branchId) {
      const branch = this.branches.find(branch => branch.id === branchId);
      return branch?.reference ? `${branch.name}(${branch.reference})` : branch.name;
    },
    uncheckBranch(branchId) {
      this.selectedBranches = this.selectedBranches.filter(id => id !== branchId);
    }
  },
};
</script>

<style scoped>
/* Add your styles here */
</style>
