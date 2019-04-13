<template>
  <v-card>
    <v-card-title>
      <h1>معلومات عن الاستاذ</h1>
    </v-card-title>
    <v-divider></v-divider>
    <v-card-text>
      <v-layout row wrap>
        <v-flex xs12 sm5>
          <span class="headline font-weight-bold">الاسم الثلاثي :</span>
          <span class="title">{{ doc.name }}</span>
        </v-flex>
        <v-flex xs12 sm5>
          <span class="headline font-weight-bold">الهاتف :</span>
          <span class="title">{{ arabicNum(doc.phone) }}</span>
        </v-flex>
        <v-flex xs12 sm5>
          <span class="headline font-weight-bold">الكلية / المعهد :</span>
          <span class="title">{{ doc.faculty }}</span>
        </v-flex>
        <v-flex xs12 sm5>
          <span class="headline font-weight-bold">الفرع :</span>
          <span class="title">{{ doc.facultySection }}</span>
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
    }
  }
};
</script>
