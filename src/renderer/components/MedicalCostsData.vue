<template>
  <v-card class="mt-4">
    <v-card-title>
      <h1>نفقات المعالجة حسب نوعها</h1>
    </v-card-title>
    <v-divider></v-divider>
    <v-card-text>
      <div>
        <v-dialog v-model="dialog" max-width="500px">
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
                      v-model="editedItem.doctorsCost"
                      label="اجور اطباء"
                      @input="editedItem.doctorsCost = $event.replace(/\D/g, '').replace(/\B(?=(\d{3})+(?!\d))/g, ',')"
                    ></v-text-field>
                  </v-flex>
                  <v-flex xs12 sm6>
                    <v-text-field
                      type="text"
                      v-model="editedItem.medicineCost"
                      label="ثمن ادوية"
                      @input="editedItem.medicineCost = $event.replace(/\D/g, '').replace(/\B(?=(\d{3})+(?!\d))/g, ',')"
                    ></v-text-field>
                  </v-flex>
                  <v-flex xs12 sm6>
                    <v-text-field
                      type="text"
                      v-model="editedItem.otherCosts"
                      label="مختلف"
                      @input="editedItem.otherCosts = $event.replace(/\D/g, '').replace(/\B(?=(\d{3})+(?!\d))/g, ',')"
                    ></v-text-field>
                  </v-flex>
                  <v-flex xs12 sm6>
                    <v-text-field
                      type="text"
                      v-model="editedItem.externalHelpValue"
                      label="قيمة المساعدة من مصدر اخر"
                      @input="editedItem.externalHelpValue = $event.replace(/\D/g, '').replace(/\B(?=(\d{3})+(?!\d))/g, ',')"
                    ></v-text-field>
                  </v-flex>
                </v-layout>
              </v-container>
            </v-card-text>
            <v-card-actions>
              <v-spacer></v-spacer>
              <v-btn color="error" @click.native="close" class="mx-2">الغاء</v-btn>
              <v-btn color="primary" @click.native="edit">حفظ</v-btn>
            </v-card-actions>
          </v-card>
        </v-dialog>
        <v-data-table
          :headers="headers"
          :items="medicalCostsData"
          hide-actions
          class="elevation-1"
        >
          <template slot="items" slot-scope="props">
            <td class="text-xs-center">{{ props.item.name }}</td>
            <td class="text-xs-center">{{ arabicMoney(props.item.doctorsCost) }}</td>
            <td class="text-xs-center">{{ arabicMoney(props.item.medicineCost) }}</td>
            <td class="text-xs-center">{{ arabicMoney(props.item.otherCosts) }}</td>
            <td class="text-xs-center">{{ arabicMoney(props.item.costsSum) }}</td>
            <td class="text-xs-center">{{ arabicMoney(props.item.externalHelpValue) }}</td>
            <td class="text-xs-center">
              <v-btn icon class="ml-2" @click="editItem(props.item)">
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
import {ConvertToArabicNumMoney, removeCommas} from "@/Helpers.js"
export default {
  props: ['medicalCostsData'],
  data() {
    return {
      dialog: false,
      headers: [
        { text: 'اسم المريض', sortable: false, align: 'center', class: 'font-weight-bold' },
        { text: 'اجور اطباء', sortable: false, align: 'center', class: 'font-weight-bold' },
        { text: 'ثمن ادوية', sortable: false, align: 'center', class: 'font-weight-bold' },
        { text: 'مختلف', sortable: false, align: 'center', class: 'font-weight-bold' },
        { text: 'مجموع النفقات', sortable: false, align: 'center', class: 'font-weight-bold' },
        { text: 'قيمة المساعدة من مصادر اخر', sortable: false, align: 'center', class: 'font-weight-bold' },
        { text: 'خيارات', sortable: false, align: 'center', class: 'font-weight-bold' }
      ],
      editedIndex: -1,
      editedItem: {
        name: '',
        doctorsCost: null,
        medicineCost: null,
        otherCosts: null,
        costsSum: null,
        externalHelpValue: null
      },
      defaultItem: {
        name: '',
        doctorsCost: null,
        medicineCost: null,
        otherCosts: null,
        costsSum: null,
        externalHelpValue: null
      },
    }
  },
  methods: {
    arabicMoney(val) {
      return ConvertToArabicNumMoney(val)
    },
    removecommas(val) {
      return removeCommas(val)
    },
    editItem(item) {
      this.editedIndex = this.medicalCostsData.indexOf(item)
      this.editedItem = Object.assign({}, item)
      this.dialog = true
    },
    close() {
      this.dialog = false
      setTimeout(() => {
        this.editedItem = Object.assign({}, this.defaultItem)
        this.editedIndex = -1
      }, 300)
    },
    edit() {
      var flag = 0
      var tempsum = ''
      for (var property in this.editedItem2)
        if (property !== 'costsSum' && this.editedItem[property] === null) {
          flag = 1
          break
        }
      if (flag === 1) {
        alert('لم يتم ملئ كل الخانات بعد')
        return
      }
      tempsum = Number(this.removecommas(this.editedItem.doctorsCost)) +
                Number(this.removecommas(this.editedItem.otherCosts)) +
                Number(this.removecommas(this.editedItem.medicineCost)) + ''
      this.editedItem.costsSum = tempsum.replace(/\D/g, '').replace(/\B(?=(\d{3})+(?!\d))/g, ',')
      if (this.editedIndex > -1)
        this.$emit('editItem', {
          index: this.editedIndex,
          editedItem: this.editedItem
        })
      this.close()
    },
  }
}
</script>
