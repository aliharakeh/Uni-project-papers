<template>
  <v-container>
    <!-- loading while getting data -->
    <Loading v-if="loading"/>

    <!-- Content -->
    <div v-else>

      <!-- title -->
      <v-layout row wrap class="mb-2">
        <v-flex xs12 class="text-xs-center">
          <h1>طلب منحة ولادة</h1>
        </v-flex>
      </v-layout>

      <!-- Doctor Info -->
      <DoctorInfoCard :doc="doc" />

      <!-- Partners -->
      <PartnerInfoCard :doc="doc" />

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
              <date label="التاريخ" @ready="birthdate = $event" :value="birthdate"/>
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
              <v-text-field label="قيمة المبلغ المقبوض من المصدر الاخر" type="text" @input="money = $event.replace(/\D/g, '').replace(/\B(?=(\d{3})+(?!\d))/g, ',')" @change="ConvertToArabicNum($event, 1)" v-model="money"></v-text-field>
            </v-flex>
            <v-flex xs12 sm5 v-if="prevOrOutsidePaper === '1'">
              <date label="التاريخ" @ready="date = $event" :value="date"/>
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
import Loading from "@/components/Loading"
import DoctorInfoCard from "@/components/Doctor/DoctorInfoCard"
import PartnerInfoCard from "@/components/Partner/PartnerInfoCard"
import date from "@/components/DatePicker"
export default {
  components: {
    Loading,
    DoctorInfoCard,
    PartnerInfoCard,
    date
  },
  props: ['id'],
  data () {
    return {
      loading: false,
      doc: null,
      prevOrOutsidePaper: null,
      money: null,
      date: null,
      birthdate: null,
      child: null
    }
  },
  created () {
    this.loading = true
    var pp = this.$route.path
    var p = pp.split('/')
    console.log(pp)

    if (p[3] === '-1') { // get data from data.json
      fs.readFile(path.join(remote.app.getPath('documents')) + '/data.json', 'utf8', (err, data) => {
        if (err) throw err

        this.doc = JSON.parse(data)
        this.birthdate = this.doc.birthdate
        this.prevOrOutsidePaper = this.doc.prevOrOutsidePaper
        if (this.prevOrOutsidePaper === '1') {
          this.money = this.doc.money
          this.date = this.doc.date
        }
        this.$db.findOne({_id: this.id}, (err, data1) => {
          if (err) {
            console.log(err.message)
            return
          }
          this.doc.children = data1.children
          this.child = this.doc.child
        })
        this.loading = false
      })
    } else {
      this.$db.findOne({_id: this.id}, (err, data2) => {
        if (err) {
          console.log(err.message)
          return
        }
        this.doc = data2
        this.loading = false
      })
    }
  },
  methods: {
    goBack () {
      if (confirm('هل انت متاكد من الخروج من هذه الصفحة ؟')) {
        this.$router.push('/')
      }
    },
    saveToJsonCheck () {
      if (confirm('هل انت متاكد من حفظ هذه المعلومات ؟')) {
        if (this.child === null || this.birthdate === null) {
          alert('لم يتم ملئ كل المعلومات بعد')
          return
        } else if (this.prevOrOutsidePaper === null) {
          alert('لم يتم ملئ كل المعلومات بعد')
          return
        } else if (this.prevOrOutsidePaper === '1' && (!this.money || !this.date)) {
          alert('لم يتم ملئ كل المعلومات بعد')
          return
        }
        this.saveToJson()
      }
    },
    saveToJson () {
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
    ConvertToArabicNum (nn, flag) {
      if (!nn) {
        return ''
      }
      var n = nn.split('')
      var ar = ''
      var ennum = ['0', '1', '2', '3', '4', '5', '6', '7', '8', '9']
      var arnum = ['٠', '١', '٢', '٣', '٤', '٥', '٦', '٧', '٨', '٩']
      n.forEach(element => {
        if (ennum.includes(element)) {
          ar += arnum[element]
        } else if (element === ',') {
          ar += '،'
        } else {
          ar += element
        }
      })
      if (flag === 1) {
        this.money = ar
        return
      }
      return ar
    }
  }
}
</script>