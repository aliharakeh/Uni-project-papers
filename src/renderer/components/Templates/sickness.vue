<template>
  <v-container>

    <!-- loading while getting data -->
    <v-layout row v-if="loading" class="mt-5">
        <v-flex xs12 class="text-xs-center">
            <v-progress-circular indeterminate :size="70" :width="7" color="primary"></v-progress-circular>
        </v-flex>
    </v-layout>

    <!-- Content -->
    <div v-else>

      <!-- title -->
      <v-layout row wrap class="mb-2">
        <v-flex xs12 class="text-xs-center">
          <h1>طلب مساعدة مرضية</h1>
        </v-flex>
        <v-flex xs12 class="text-xs-center">
          <h1>Demande d'aide medicale</h1>
        </v-flex>
      </v-layout>

      <!-- Doctor Info -->
      <v-card>
        <v-card-title>
          <h1>معلومات عن الاستاذ</h1>
        </v-card-title>
        <v-divider></v-divider>
        <v-card-text>
          <v-layout row wrap>
            <v-flex xs12 sm5>
              <span class="headline font-weight-bold">الاسم الثلاثي : </span>
              <span class="title">{{ doc.name }}</span>
            </v-flex>
            <v-flex xs12 sm5>
              <span class="headline font-weight-bold">الهاتف : </span>
              <span class="title">{{ ConvertToArabicNum(doc.phone) }}</span>
            </v-flex>
            <v-flex xs12 sm5>
              <span class="headline font-weight-bold">الكلية / المعهد : </span>
              <span class="title">{{ doc.faculty }}</span>
            </v-flex>
            <v-flex xs12 sm5>
              <span class="headline font-weight-bold">الفرع : </span>
              <span class="title">{{ doc.facultySection }}</span>
            </v-flex>
          </v-layout>
        </v-card-text>
      </v-card>

      <!-- Partners Work -->
      <v-card class="mt-4">
        <v-card-title>
          <h1>معلومات عن الزوج او الزوجة</h1>
        </v-card-title>
        <v-divider></v-divider>
        <v-card-text>
          <v-layout row wrap v-for="(person, i) in doc.partners" :key="i">
            <v-flex xs12 sm5>
              <span class="headline font-weight-bold">- الاسم :</span>
              <span class="title">{{ person.name }}</span>
            </v-flex>
            <v-flex xs12 sm5>
              <span class="headline font-weight-bold">قطاع العمل : </span>
              <span class="title">{{ workPlace(person) }}</span>
            </v-flex>
            <v-flex xs12 sm5 v-if="person.insuranceNum">
              <span class="headline font-weight-bold">رقم الضمان : </span>
              <span class="title">{{ ConvertToArabicNum(person.insuranceNum) }}</span>
            </v-flex>
          </v-layout>
        </v-card-text>
      </v-card>

      <!-- Medical Data -->
      <v-card class="mt-4">
        <v-card-title>
          <h1>المعلومات الصحية</h1>
        </v-card-title>
        <v-divider></v-divider>
        <v-card-text>
          <div>
            <v-toolbar flat color="white">
              <v-dialog v-model="dialog" max-width="500px">
                <v-btn slot="activator" color="primary" dark class="mb-2">ادخال معلومات</v-btn>
                <v-card>
                  <v-card-title>
                    <span class="headline">ادخال خانة جديدة</span>
                  </v-card-title>
                  <v-card-text>
                    <v-container grid-list-md>
                      <v-layout wrap>
                        <v-flex xs12 sm6>
                          <v-select
                            :items="family"
                            item-text="name"
                            label="اسم المريض"
                            return-object
                            @change="updateEditedItem"
                            v-model="selected"
                          ></v-select>
                        </v-flex>
                        <v-flex xs12 sm6>
                          <v-dialog
                            ref="dialogA"
                            v-model="editedItem.medicalStartDateModal"
                            :return-value.sync="editedItem.medicalStartDate"
                            persistent
                            lazy
                            full-width
                            width="290px"
                          >
                            <v-text-field
                              slot="activator"
                              v-model="editedItem.medicalStartDate"
                              label="تاريخ ابتداء العلاج"
                              prepend-icon="event"
                              readonly
                            ></v-text-field>
                            <v-date-picker v-model="editedItem.medicalStartDate" scrollable locale="ar-lb">
                              <v-spacer></v-spacer>
                              <v-btn flat color="primary" @click="editedItem.medicalStartDateModal = false">Cancel</v-btn>
                              <v-btn flat color="primary" @click="$refs.dialogA.save(editedItem.medicalStartDate)">OK</v-btn>
                            </v-date-picker>
                          </v-dialog>
                        </v-flex>
                        <v-flex xs12 sm6>
                          <v-dialog
                            ref="dialogB"
                            v-model="editedItem.medicalEndDateModal"
                            :return-value.sync="editedItem.medicalEndDate"
                            persistent
                            lazy
                            full-width
                            width="290px"
                          >
                            <v-text-field
                              slot="activator"
                              v-model="editedItem.medicalEndDate"
                              label="تاريخ انتهاء العلاج"
                              prepend-icon="event"
                              readonly
                            ></v-text-field>
                            <v-date-picker v-model="editedItem.medicalEndDate" scrollable locale="ar-lb">
                              <v-spacer></v-spacer>
                              <v-btn flat color="primary" @click="editedItem.medicalEndDateModal = false">Cancel</v-btn>
                              <v-btn flat color="primary" @click="$refs.dialogB.save(editedItem.medicalEndDate)">OK</v-btn>
                            </v-date-picker>
                          </v-dialog>
                        </v-flex>
                      </v-layout>
                    </v-container>
                  </v-card-text>

                  <v-card-actions>
                    <v-spacer></v-spacer>
                    <v-btn color="error" @click.native="close" class="mx-2">الغاء</v-btn>
                    <v-btn color="primary" @click.native="save">حفظ</v-btn>
                  </v-card-actions>
                </v-card>
              </v-dialog>
            </v-toolbar>
            <v-data-table
              :headers="headers"
              :items="medicalData"
              hide-actions
              class="elevation-1"
            >
              <template slot="items" slot-scope="props">
                <td class="text-xs-center">{{ props.item.name }}</td>
                <td class="text-xs-center">{{ ConvertToArabicDate(props.item.birthDate) }}</td>
                <td class="text-xs-center">{{ props.item.rangeOfAcquaintance }}</td>
                <td class="text-xs-center">{{ ConvertToArabicDate(props.item.medicalStartDate) }}</td>
                <td class="text-xs-center">{{ ConvertToArabicDate(props.item.medicalEndDate) }}</td>
                <td class="text-xs-center">
                  <v-btn icon @click="deleteItem(props.item)">
                    <v-icon color="error">delete</v-icon>
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

      <!-- medical treatment costs -->
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
                        <v-text-field type="number" v-model="editedItem2.doctorsCost" label="اجور اطباء"></v-text-field>
                      </v-flex>
                      <v-flex xs12 sm6>
                        <v-text-field type="number" v-model="editedItem2.medicineCost" label="ثمن ادوية"></v-text-field>
                      </v-flex>
                      <v-flex xs12 sm6>
                        <v-text-field type="number" v-model="editedItem2.otherCosts" label="مختلف"></v-text-field>
                      </v-flex>
                      <v-flex xs12 sm6>
                        <v-text-field type="number" v-model="editedItem2.externalHelpValue" label="قيمة المساعدة من مصدر اخر"></v-text-field>
                      </v-flex>
                      <!-- <v-flex xs12 sm6>
                        <v-text-field type="number" v-model="editedItem2.acceptedCosts" label="النفقات الموافق عليها"></v-text-field>
                      </v-flex>
                      <v-flex xs12 sm6>
                        <v-text-field type="number" v-model="editedItem2.earnedHelpValue" label="قيمة المساعدة المستحقة"></v-text-field>
                      </v-flex> -->
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
                <td class="text-xs-center">{{ ConvertToArabicNum(props.item.doctorsCost) }}</td>
                <td class="text-xs-center">{{ ConvertToArabicNum(props.item.medicineCost) }}</td>
                <td class="text-xs-center">{{ ConvertToArabicNum(props.item.otherCosts) }}</td>
                <td class="text-xs-center">{{ ConvertToArabicNum(props.item.costsSum) }}</td>
                <td class="text-xs-center">{{ ConvertToArabicNum(props.item.externalHelpValue) }}</td>
                <td class="text-xs-center">{{ props.item.acceptedCosts}}</td>
                <td class="text-xs-center">{{ props.item.earnedHelpValue}}</td>
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

      <v-layout column justify-center align-center class="mt-2">
          <v-btn color="primary" @click="saveToJson">طباعة</v-btn>
      </v-layout>

    </div>

  </v-container>
</template>

<script>
import fs from 'fs'
import path from 'path'
import { remote } from 'electron'

export default {
  props: ['id'],
  data () {
    return {
      doc: null,
      dialog: false,
      loading: false,
      headers: [
        { text: 'اسم المريض', sortable: false, align: 'center', class: 'font-weight-bold' },
        { text: 'تاريخ الولادة', sortable: false, align: 'center', class: 'font-weight-bold' },
        { text: 'درجة القرابة للمنتسب', sortable: false, align: 'center', class: 'font-weight-bold' },
        { text: 'تاريخ ابتداء العلاج', sortable: false, align: 'center', class: 'font-weight-bold' },
        { text: 'تاريخ انتهاء العلاج', sortable: false, align: 'center', class: 'font-weight-bold' },
        { text: 'خيارات', sortable: false, align: 'center', class: 'font-weight-bold' }
      ],
      medicalData: [],
      editedItem: {
        name: '',
        birthDate: '',
        rangeOfAcquaintance: '',
        medicalStartDate: null,
        medicalEndDate: null,
        medicalStartDateModal: false,
        medicalEndDateModal: false
      },
      defaultItem: {
        name: '',
        birthDate: '',
        rangeOfAcquaintance: '',
        medicalStartDate: '',
        medicalEndDate: '',
        medicalStartDateModal: false,
        medicalEndDateModal: false
      },
      family: [],
      selected: null,
      dialog2: false,
      headers2: [
        { text: 'اسم المريض', sortable: false, align: 'center', class: 'font-weight-bold' },
        { text: 'اجور اطباء', sortable: false, align: 'center', class: 'font-weight-bold' },
        { text: 'ثمن ادوية', sortable: false, align: 'center', class: 'font-weight-bold' },
        { text: 'مختلف', sortable: false, align: 'center', class: 'font-weight-bold' },
        { text: 'مجموع النفقات', sortable: false, align: 'center', class: 'font-weight-bold' },
        { text: 'قيمة المساعدة من مصادر اخر', sortable: false, align: 'center', class: 'font-weight-bold' },
        { text: 'النفقات الموافق عليها', sortable: false, align: 'center', class: 'font-weight-bold' },
        { text: 'قيمة المساعدة المستحقة', sortable: false, align: 'center', class: 'font-weight-bold' },
        { text: 'خيارات', sortable: false, align: 'center', class: 'font-weight-bold' }
      ],
      medicalCostsData: [],
      editedIndex2: -1,
      editedItem2: {
        name: '',
        doctorsCost: null,
        medicineCost: null,
        otherCosts: null,
        costsSum: null,
        externalHelpValue: null
        // acceptedCosts: null,
        // earnedHelpValue: null
      },
      defaultItem2: {
        name: '',
        doctorsCost: null,
        medicineCost: null,
        otherCosts: null,
        costsSum: null,
        externalHelpValue: null
        // acceptedCosts: null,
        // earnedHelpValue: null
      },
      linkedFamily: []
    }
  },
  created () {
    this.loading = true
    this.$db.findOne({_id: this.id}, (err, doc) => {
      if (err) {
        console.log(err.message)
        return
      }

      this.doc = doc

      doc.partners.forEach(partner => {
        this.family.push({
          name: partner.name,
          birthDate: partner.birthDate,
          rangeOfAcquaintance: 'زوجته / زوجها'
        })
      })

      doc.children.forEach(child => {
        this.family.push({
          name: child.name,
          birthDate: child.birthDate,
          rangeOfAcquaintance: 'ابنه / ابنته'
        })
      })

      doc.family.forEach(member => {
        this.family.push({
          name: member.name,
          birthDate: member.birthDate,
          rangeOfAcquaintance: member.type
        })
      })

      this.loading = false
    })
  },
  watch: {
    dialog (val) {
      val || this.close()
    },
    dialog2 (val) {
      val || this.close2()
    }
  },
  methods: {
    workPlace (person) {
      if (person.workSector === '') {
        return 'لا يعمل'
      }
      return person.workSector
    },
    deleteItem (item) {
      const index = this.medicalData.indexOf(item)
      confirm('هل انت متاكد من الغاء هذه الخانة؟') && this.medicalData.splice(index, 1)
      this.updateTable2(index)
    },
    updateTable2 (index) {
      const name = this.linkedFamily[index].name
      this.linkedFamily.splice(index, 1)
      const memberIndex = this.medicalCostsData.findIndex(member => member.name === name)
      this.medicalCostsData.splice(memberIndex, 1)
    },
    close () {
      this.dialog = false
      setTimeout(() => {
        this.editedItem = Object.assign({}, this.defaultItem)
        this.selected = null
      }, 300)
    },
    save () {
      var flag = 0
      for (var property in this.editedItem) {
        if (this.editedItem[property] === '' || this.editedItem[property] === null) {
          flag = 1
        }
      }

      if (flag === 1) {
        alert('لم يتم ملئ كل الخانات بعد')
        return
      }

      this.medicalData.push(this.editedItem)
      this.linkedFamily.push({
        name: this.editedItem.name,
        birthDate: this.editedItem.birthDate,
        rangeOfAcquaintance: this.editedItem.rangeOfAcquaintance
      })
      this.medicalCostsData.push({
        name: this.editedItem.name,
        doctorsCost: null,
        medicineCost: null,
        otherCosts: null,
        costsSum: null,
        externalHelpValue: null
        // acceptedCosts: null,
        // earnedHelpValue: null
      })

      this.close()
    },
    updateEditedItem (item) {
      if (item !== null) {
        this.editedItem.name = item.name
        this.editedItem.birthDate = item.birthDate
        this.editedItem.rangeOfAcquaintance = item.rangeOfAcquaintance
      }
    },
    editItem2 (item) {
      this.editedIndex2 = this.medicalCostsData.indexOf(item)
      this.editedItem2 = Object.assign({}, item)
      this.dialog2 = true
    },
    close2 () {
      this.dialog2 = false
      setTimeout(() => {
        this.editedItem2 = Object.assign({}, this.defaultItem2)
        this.editedIndex2 = -1
      }, 300)
    },
    save2 () {
      var flag = 0
      for (var property in this.editedItem2) {
        if (property !== 'costsSum' && this.editedItem2[property] === null) {
          flag = 1
        }
      }

      if (flag === 1) {
        alert('لم يتم ملئ كل الخانات بعد')
        return
      }

      this.editedItem2.costsSum = Number(this.editedItem2.doctorsCost) +
                                  Number(this.editedItem2.otherCosts) +
                                  Number(this.editedItem2.medicineCost) + ''

      if (this.editedIndex2 > -1) {
        Object.assign(this.medicalCostsData[this.editedIndex2], this.editedItem2)
      }

      this.close2()
    },
    saveToJson () {
      this.loading = true
      const data = {
        number: this.doc.number,
        name: this.doc.name,
        type: 'مساعدة_مرضية',
        phone: this.doc.phone,
        faculty: this.doc.faculty,
        facultySection: this.doc.facultySection,
        address: this.doc.address,
        partners: this.doc.partners,
        medicalData: this.medicalData,
        medicalCostsData: this.medicalCostsData
      }
      console.log(data)
      fs.writeFile(path.join(remote.app.getPath('documents'), '/data.json'),
        JSON.stringify(data, null, 2),
        'utf-8',
        (err) => {
          this.loading = false
          if (err) {
            console.log(err.message)
            return
          }
          this.$router.push('/PDFsickness')
        }
      )
    },

    ConvertToArabicNum (nn) {
      if (!nn) {
        return ''
      }
      var n = nn.split('')
      var ar = ''
      var arnum = ['٠', '١', '٢', '٣', '٤', '٥', '٦', '٧', '٨', '٩']
      n.forEach(element => {
        ar += arnum[element]
      })
      return ar
    },
    ConvertToArabicDate (date) {
      if (!date) {
        return ''
      }
      var dd = date.split('-')
      var year = ''
      var month = ''
      var day = ''
      var arnum = ['٠', '١', '٢', '٣', '٤', '٥', '٦', '٧', '٨', '٩']

      var y = dd[0].split('') // year
      y.forEach(element => {
        year += arnum[element]
      })

      var m = dd[1].split('') // month
      m.forEach(element => {
        month += arnum[element]
      })

      var d = dd[2].split('') // day
      d.forEach(element => {
        day += arnum[element]
      })

      return year + '/' + month + '/' + day
    }
  }
}
</script>



