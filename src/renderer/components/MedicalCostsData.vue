<template>
  <v-card class="mt-4">
    <v-card-title>
      <h1>نفقات المعالجة حسب نوعها</h1>
    </v-card-title>
    <v-divider></v-divider>
    <v-card-text>
      <div>
        <v-dialog v-model="dialog2" max-width="500px">
          <v-card>
            <v-card-title>
              <span class="headline">تعديل خانة</span>
            </v-card-title>
            <v-card-text>
              <v-container grid-list-md>
                <v-layout wrap>
                  <v-flex xs12 sm6>
                    <v-text-field
                      type="text"
                      v-model="editedItem2.doctorsCost"
                      label="اجور اطباء"
                      @input="editedItem2.doctorsCost = $event.replace(/\D/g, '').replace(/\B(?=(\d{3})+(?!\d))/g, ',')"
                    ></v-text-field>
                  </v-flex>
                  <v-flex xs12 sm6>
                    <v-text-field
                      type="text"
                      v-model="editedItem2.medicineCost"
                      label="ثمن ادوية"
                      @input="editedItem2.medicineCost = $event.replace(/\D/g, '').replace(/\B(?=(\d{3})+(?!\d))/g, ',')"
                    ></v-text-field>
                  </v-flex>
                  <v-flex xs12 sm6>
                    <v-text-field
                      type="text"
                      v-model="editedItem2.otherCosts"
                      label="مختلف"
                      @input="editedItem2.otherCosts = $event.replace(/\D/g, '').replace(/\B(?=(\d{3})+(?!\d))/g, ',')"
                    ></v-text-field>
                  </v-flex>
                  <v-flex xs12 sm6>
                    <v-text-field
                      type="text"
                      v-model="editedItem2.externalHelpValue"
                      label="قيمة المساعدة من مصدر اخر"
                      @input="editedItem2.externalHelpValue = $event.replace(/\D/g, '').replace(/\B(?=(\d{3})+(?!\d))/g, ',')"
                    ></v-text-field>
                  </v-flex>
                </v-layout>
              </v-container>
            </v-card-text>
            <v-card-actions>
              <v-spacer></v-spacer>
              <v-btn color="error" @click.native="close2" class="mx-2">الغاء</v-btn>
              <v-btn color="primary" @click.native="save2">حفظ</v-btn>
            </v-card-actions>
          </v-card>
        </v-dialog>
        <v-data-table
          :headers="headers2"
          :items="medicalCostsData"
          hide-actions
          class="elevation-1"
        >
          <template slot="items" slot-scope="props">
            <td class="text-xs-center">{{ props.item.name }}</td>
            <td class="text-xs-center">{{ ConvertToArabicNumMoney(props.item.doctorsCost) }}</td>
            <td class="text-xs-center">{{ ConvertToArabicNumMoney(props.item.medicineCost) }}</td>
            <td class="text-xs-center">{{ ConvertToArabicNumMoney(props.item.otherCosts) }}</td>
            <td class="text-xs-center">{{ ConvertToArabicNumMoney(props.item.costsSum) }}</td>
            <td class="text-xs-center">{{ ConvertToArabicNumMoney(props.item.externalHelpValue) }}</td>
            <td class="text-xs-center">
              <v-btn icon class="ml-2" @click="editItem2(props.item)">
                <v-icon color="info">edit</v-icon>
              </v-btn>
            </td>
          </template>
          <template slot="no-data">
            <h1>لا يوجد معلومات بعد</h1>
          </template>
        </v-data-table>
      </div>
    </v-card-text>
  </v-card>
</template>

<script>
import {ConvertToArabicDate} from "@/Helpers.js"
import date from "@/components/DatePicker"
export default {
  components: {
    date
  },
  props: [''],
  data() {
    return {

    }
  }
}
</script>
