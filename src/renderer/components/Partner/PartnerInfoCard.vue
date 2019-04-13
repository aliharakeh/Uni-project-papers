<template>
  <v-card class="mt-4">
    <v-card-title>
      <h1>{{ getGender() }}</h1>
    </v-card-title>
    <v-divider></v-divider>
    <v-card-text>
      <v-layout row wrap v-for="(partner, index) in doc.partners" :key="'p' + index">
        <v-flex xs12 sm5>
          <span class="headline font-weight-bold">- الاسم :</span>
          <span class="title">{{ partner.name }}</span>
        </v-flex>
        <v-flex xs12 sm5>
          <span class="headline font-weight-bold">قطاع العمل :</span>
          <span class="title">{{ workPlace(partner) }}</span>
        </v-flex>
        <v-flex xs12 sm5 v-if="partner.insuranceNum">
          <span class="headline font-weight-bold">رقم الضمان :</span>
          <span class="title">{{ arabicNum(partner.insuranceNum) }}</span>
        </v-flex>
      </v-layout>
    </v-card-text>
  </v-card>
</template>

<script>
import {ConvertToArabicNum} from "@/Helpers.js"
export default {
  props: ['doc'],
  methods: {
    arabicNum(number) {
      return ConvertToArabicNum(number)
    },
    getGender () {
      return this.doc.gender === 'ذكر' ? 'معلومات عن الزّوجة' : 'معلومات عن الزّوج'
    },
     workPlace (person) {
      if (person.workSector === '')
        return 'لا يعمل'
      return person.workSector
    }
  }
}
</script>

