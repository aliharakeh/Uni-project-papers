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
          <h1>طلب منحة ولادة</h1>
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
              <span class="headline font-weight-bold">الاسم : </span>
              <span class="title">{{ person.name }}</span>
            </v-flex>
            <v-flex xs12 sm5>
              <span class="headline font-weight-bold">قطاع العمل : </span>
              <span class="title">{{ workPlace(person) }}</span>
            </v-flex>
            <v-flex xs12 sm5 v-if="person.insuranceNumSection">
              <span class="headline font-weight-bold">رقم الضمان : </span>
              <span class="title">{{ ConvertToArabicNum(person.insuranceNum) }}</span>
            </v-flex>
          </v-layout>
        </v-card-text>
      </v-card>

      <!-- child needing the certificate -->
      <v-card class="mt-4">
        <v-card-title>
          <h1>اعطاء المنحة عن</h1>
        </v-card-title>
        <v-divider></v-divider>
        <v-card-text>
          <v-layout row wrap>
            <v-flex xs12 sm5>
              <v-select
                :items="doc.children"
                item-text="name"
                label="الاسم والشهرة"
                v-model="child"
              ></v-select>
            </v-flex>
            <v-flex xs12 sm5>
              <v-dialog
                ref="dialogA"
                v-model="birthdateModal"
                :return-value.sync="birthdate"
                persistent
                lazy
                full-width
                width="290px"
                >
                <v-text-field
                  slot="activator"
                  v-model="birthdate"
                  label="التاريخ"
                  prepend-icon="event"
                  readonly
                ></v-text-field>
                <v-date-picker v-model="birthdate" scrollable locale="ar-lb">
                  <v-spacer></v-spacer>
                  <v-btn flat color="primary" @click="birthdateModal = false">Cancel</v-btn>
                  <v-btn flat color="primary" @click="$refs.dialogA.save(birthdate)">OK</v-btn>
                </v-date-picker>
              </v-dialog>
              </v-flex>
          </v-layout>
        </v-card-text>
      </v-card>

      <!-- prev certificate verification -->
      <v-card class="mt-4">
        <v-card-title>
          <h1>هل تم تقاضي هذه المنحة سابقا او من اي مصدر آخر ؟</h1>
        </v-card-title>
        <v-divider></v-divider>
        <v-card-text>
          <v-layout row wrap>
            <v-flex xs12>
              <h1>
                <v-radio-group v-model="prevOrOutsidePaper" :mandatory="true">
                  <v-radio label="نعم" value=1></v-radio>
                  <v-radio label="لا" value=0></v-radio>
                </v-radio-group>
              </h1>
            </v-flex>
            <v-flex xs12 sm5 v-if="prevOrOutsidePaper === '1'" class="ml-4">
              <v-text-field label="قيمة المبلغ المقبوض من المصدر الاخر" type="text" v-model="money"></v-text-field>
            </v-flex>
            <v-flex xs12 sm5 v-if="prevOrOutsidePaper === '1'">
              <v-dialog
                  ref="dialog"
                  v-model="dateModal"
                  :return-value.sync="date"
                  persistent
                  lazy
                  full-width
                  width="290px"
                >
                  <v-text-field
                    slot="activator"
                    v-model="date"
                    label="التاريخ"
                    prepend-icon="event"
                    readonly
                  ></v-text-field>
                  <v-date-picker v-model="date" scrollable locale="ar-lb">
                    <v-spacer></v-spacer>
                    <v-btn flat color="primary" @click="dateModal = false">Cancel</v-btn>
                    <v-btn flat color="primary" @click="$refs.dialog.save(date)">OK</v-btn>
                  </v-date-picker>
                </v-dialog>
            </v-flex>
          </v-layout>
        </v-card-text>
      </v-card>

      <v-layout row justify-center align-center class="mt-2">
        <v-btn color="primary" @click="saveToJsonCheck">حفظ</v-btn>
        <v-btn color="error" @click="goBack">الغاء</v-btn>
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
      loading: false,
      doc: null,
      prevOrOutsidePaper: null,
      money: null,
      date: null,
      birthdate: null,
      birthdateModal: false,
      dateModal: false,
      child: null
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

      this.loading = false
    })
  },

  watch: {
    money: function (newValue) {
      const result = newValue.replace(/\D/g, '').replace(/\B(?=(\d{3})+(?!\d))/g, ',')
      this.money = result
    }
  },

  methods: {

    workPlace (person) {
      if (person.workSector === '') {
        return 'لا يعمل'
      }
      return person.workSector
    },
    goBack () {
      if (confirm('هل انت متاكد من الخروج من هذه الصفحة ؟')) {
        this.$router.push('/')
      }
    },
    saveToJsonCheck () {
      if (confirm('هل انت متاكد من حفظ هذه المعلومات ؟')) {
        this.saveToJson()
      }
    },
    saveToJson () {
      if (this.child === null || this.birthdate === null) {
        alert('لم يتم ملئ كل الخانات بعد')
        return
      } else if (this.prevOrOutsidePaper === null) {
        alert('لم يتم ملئ كل الخانات بعد')
        return
      } else if (this.prevOrOutsidePaper === '1' && (!this.money || !this.date)) {
        alert('لم يتم ملئ كل الخانات بعد')
        return
      }
      this.loading = true
      const data = {
        number: this.doc.number,
        name: this.doc.name,
        gender: this.doc.gender,
        type: 'منحة_ولادة',
        phone: this.doc.phone,
        faculty: this.doc.faculty,
        facultySection: this.doc.facultySection,
        address: this.doc.address,
        partners: this.doc.partners,
        prevOrOutsidePaper: this.prevOrOutsidePaper,
        date: this.date,
        birthdate: this.birthdate,
        money: this.money,
        child: this.child
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
          this.$router.push('/PDFbirth')
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
    }
  }
}
</script>



