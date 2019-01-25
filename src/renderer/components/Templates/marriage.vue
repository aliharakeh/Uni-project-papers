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
          <h1>طلب منحة زواج</h1>
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
              <span class="title">{{ doc.phone }}</span>
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
            <v-flex xs12 sm5 v-if="person.insuranceNum">
              <span class="headline font-weight-bold">رقم الضمان : </span>
              <span class="title">{{ person.insuranceNum }}</span>
            </v-flex>
          </v-layout>
        </v-card-text>
      </v-card>

      <!-- prev certificate verification -->
      <v-card class="mt-4">
        <v-card-title>
          <h1>هل تم تقاضي هذه المنحة سابقا او من اي مصدر اخر؟</h1>
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
            <v-flex xs12 sm5 v-if="prevOrOutsidePaper == 1" class="ml-4">
              <v-text-field label="قيمة المبلغ المقبوض من المصدر الاخر" type="number" v-model="money"></v-text-field>
            </v-flex>
            <v-flex xs12 sm5 v-if="prevOrOutsidePaper == 1">
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

      <!-- marriage date -->
      <v-card class="mt-4">
        <v-card-title>
          <h1>تاريخ الزواج</h1>
        </v-card-title>
        <v-divider></v-divider>
        <v-card-text>
          <v-layout row wrap>
            <v-flex xs12 sm5>
                  <v-dialog
                      ref="dialogA"
                      v-model="marriageDateModal"
                      :return-value.sync="marriageDate"
                      persistent
                      lazy
                      full-width
                      width="290px"
                    >
                      <v-text-field
                        slot="activator"
                        v-model="marriageDate"
                        label="التاريخ"
                        prepend-icon="event"
                        readonly
                      ></v-text-field>
                      <v-date-picker v-model="marriageDate" scrollable locale="ar-lb">
                        <v-spacer></v-spacer>
                        <v-btn flat color="primary" @click="marriageDateModal = false">Cancel</v-btn>
                        <v-btn flat color="primary" @click="$refs.dialogA.save(marriageDate)">OK</v-btn>
                      </v-date-picker>
                    </v-dialog>
                </v-flex>
          </v-layout>
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
      loading: false,
      doc: null,
      prevOrOutsidePaper: null,
      money: null,
      date: null,
      dateModal: false,
      marriageDate: null,
      marriageDateModal: null
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
  methods: {
    workPlace (person) {
      return person.workSector + ' - ' + person.work
    },
    saveToJson () {
      if (this.marriageDate === null) {
        alert('لم يتم ملئ كل الخانات بعد')
        return
      } else if (this.prevOrOutsidePaper === null) {
        alert('لم يتم ملئ كل الخانات بعد')
        return
      } else if (this.prevOrOutsidePaper === '1' && (this.money === null || this.date === null)) {
        alert('لم يتم ملئ كل الخانات بعد')
        return
      }
      this.loading = true
      const data = {
        number: this.doc.number,
        name: this.doc.name,
        type: 'منحة_زواج',
        phone: this.doc.phone,
        faculty: this.doc.faculty,
        facultySection: this.doc.facultySection,
        address: this.doc.address,
        partners: this.doc.partners,
        prevOrOutsidePaper: this.prevOrOutsidePaper,
        date: this.date,
        money: this.money,
        marriageDate: this.marriageDate
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
          this.$router.push('/PDFmarriage')
        }
      )
    }
  }
}
</script>



