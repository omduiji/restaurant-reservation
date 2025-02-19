<template>
  <div class="fixed inset-0 bg-gray-600 bg-opacity-50 flex justify-center items-center">
    <div class="bg-white p-4 rounded w-[1200px]">
      <h2 class="text-3xl font-bold mb-1 text-left">
        Reservation Settings for {{ branch.name }}
      </h2>
      <p class="text-lg font-semibold mb-6 text-left">
        opening hours: {{ branch.opening_from }} - {{ branch.opening_to }}
      </p>
  
      <ValidationObserver v-slot="{ handleSubmit }">
        <form @submit.prevent="handleSubmit(save)">
          <div class="mb-4">
            <label class="block mb-2 text-left font-bold">Reservation Duration (minutes)</label>
            <ValidationProvider
              v-slot="{ errors }"
              name="Reservation Duration"
              rules="required|numeric|min:1"
            >
              <input
                v-model="reservationDuration"
                type="number"
                class="border p-2 w-full"
              >
              <span class="text-red-500 block">{{ errors[0] }}</span>
            </ValidationProvider>
          </div>
  
          <div class="mb-4">
            <label class="block mb-2 text-left font-bold">Tables</label>
            <MultiSelectDropdown
              v-model="selectedTable"
              :options="tables"
              :multiple="true"
              :close-on-select="false"
              :clear-on-select="false"
              :preserve-search="true"
              placeholder="Select tables"
              label="name"
              track-by="id"
              class="w-full"
              select-label=""
              deselect-label=""
              selected-label="Table selected"
            />
          </div>
  
          <div class="flex flex-col gap-y-6 mb-6">
            <label class="block text-left font-bold">Time Slots</label>
            <div
              v-for="(slots, day) in sortedReservationTimes"
              :key="day"
              class="flex flex-wrap gap-4"
            >
              <div class="flex items-center justify-between gap-x-12 basis-full">
                <label class="block text-left font-bold">{{ capitalize(day) }}</label>
                <div
                  v-if="day === 'saturday'"
                  class="flex gap-x-4"
                >
                  <button
                    type="button"
                    class="bg-white text-gray-500 px-4 py-2 border-gray-500 border rounded-lg"
                    @click="applySaturdaySlots"
                  >
                    Apply to All Days
                  </button>
                  <button
                    type="button"
                    class="bg-primary-100 text-white px-4 py-2 rounded-lg hover:bg-primary-700"
                    @click="addSlot(day)"
                  >
                    Add Slot
                  </button>
                </div>
                <button
                  v-else
                  type="button"
                  class="bg-primary-100 text-white px-4 py-2 rounded-lg hover:bg-primary-700"
                  @click="addSlot(day)"
                >
                  Add Slot
                </button>
              </div>
  
              <div
                v-for="(slot, index) in slots"
                :key="index"
                class="flex mb-2 items-center justify-start gap-x-2"
              >
                <ValidationProvider
                  v-slot="{ errors }"
                  :name="`Start time for ${capitalize(day)} slot ${index + 1}`"
                  rules="required"
                >
                  <div class="flex flex-col">
                    <input
                      v-model="slot[0]"
                      type="time"
                      class="border p-2"
                    >
                    <span class="text-red-500 h-6">{{ errors[0] }}</span>
                  </div>
                </ValidationProvider>
  
                <ValidationProvider
                  v-slot="{ errors }"
                  :name="`End time for ${capitalize(day)} slot ${index + 1}`"
                  rules="required"
                >
                  <div class="flex flex-col">
                    <input
                      v-model="slot[1]"
                      type="time"
                      class="border p-2"
                    >
                    <span class="text-red-500 h-6">{{ errors[0] }}</span>
                  </div>
                </ValidationProvider>
  
                <button
                  type="button"
                  class="bg-white text-gray-500 px-4 py-2 border-gray-500 border rounded-lg mb-6"
                  @click="removeSlot(day, index)"
                >
                  Remove
                </button>
              </div>
            </div>
          </div>
  
          <div class="flex justify-end gap-x-4">
            <button
              type="submit"
              class="bg-primary-100 text-white px-4 py-2 rounded-lg hover:bg-primary-700"
            >
              Save
            </button>
            <button
              type="button"
              class="bg-white text-gray-500 px-4 py-2 border-gray-500 border rounded-lg"
              @click="$emit('close')"
            >
              Cancel
            </button>
          </div>
        </form>
      </ValidationObserver>
    </div>
  </div>
</template>
  
  <script>
  import { ValidationObserver, ValidationProvider } from 'vee-validate';
  import { required, numeric, min } from 'vee-validate/dist/rules';
  import { extend } from 'vee-validate';
  import { updateBranch } from '../services/api';
  
  extend('required', required);
  extend('numeric', numeric);
  extend('min', min);
  
  export default {
    components: {
      ValidationObserver,
      ValidationProvider
    },
    props: ['branch'],
    data() {
      return {
        reservationDuration: this.branch.reservation_duration,
        tables: this.branch.sections.flatMap(section => section.tables),
        selectedTable: [],
        reservationTimes: this.branch.reservation_times || {
          saturday: [],
          sunday: [],
          monday: [],
          tuesday: [],
          wednesday: [],
          thursday: [],
          friday: [],
        },
      };
    },
    computed: {
      sortedReservationTimes() {
        const times = { ...this.reservationTimes };
        const sorted = Object.keys(times).sort((a, b) => (a === 'saturday' ? -1 : b === 'saturday' ? 1 : 0));
        return sorted.reduce((acc, key) => {
          acc[key] = times[key];
          return acc;
        }, {});
      },
    },
    methods: {
      addSlot(day) {
        if (this.reservationTimes[day].length < 3) {
          this.reservationTimes[day].push(['', '']);
        }
      },
      removeSlot(day, index) {
        this.reservationTimes[day].splice(index, 1);
      },
      async save() {
        try {
          const response = await updateBranch(this.branch.id, {
            reservation_duration: this.reservationDuration,
            reservation_times: this.reservationTimes,
          });
          if (response.ok) {
            this.$emit('save');
            this.$emit('close');
          } else {
            console.error('Failed to update branch');
          }
        } catch (error) {
          console.error('API error:', error);
        }
      },
      capitalize(day) {
        return day.charAt(0).toUpperCase() + day.slice(1);
      },
      applySaturdaySlots() {
        const saturdaySlots = this.reservationTimes.saturday;
        Object.keys(this.reservationTimes).forEach(day => {
          if (day !== 'saturday') {
            this.reservationTimes[day] = [...saturdaySlots];
          }
        });
      },
    },
  };
  </script>
  
  

<style>
/* Add your styles here */
.multiselect__tag{
    @apply bg-primary-100 text-white px-4 py-2 rounded-lg;
}
.multiselect__tag-icon:after{
    @apply text-white bg-transparent mx-2;
}
.multiselect__tag-icon{
    @apply text-white bg-transparent;
}
.multiselect__tag-icon:hover{
    @apply text-white bg-transparent;
}
.multiselect__tag-icon:after{
    @apply text-white bg-transparent;
}
.multiselect__element .multiselect__option--highlight {
    @apply bg-primary-100 text-white;
}
.multiselect__element .multiselect__option--highlight span {
    @apply bg-primary-100 text-white;
}
</style>
