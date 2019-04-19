<template>
  <v-menu
    v-model="menu"
    :close-on-content-click="false"
    :nudge-right="40"
    lazy
    transition="scale-transition"
    offset-y
    full-width
    min-width="290px"
  >
    <template v-slot:activator="{ on }">
      <v-text-field
        v-model="date"
        :label="label"
        prepend-icon="event"
        readonly
        v-on="on"
      ></v-text-field>
    </template>
    <v-date-picker @input="valueChanged($event)"></v-date-picker>
  </v-menu>
</template>

<script>
export default {
  props: ['label', 'dialog', 'value'],
  data() {
    return {
      menu: false,
      date: this.value
    }
  },
  watch: {
    dialog(val) {
      if(!this.dialog)
        this.date = null
    }
  },
  methods: {
    valueChanged(val) {
      this.menu = false
      this.date = val
      // notify parent component and send him the date
      this.$emit('ready', this.date)
    }
  }
}
</script>

