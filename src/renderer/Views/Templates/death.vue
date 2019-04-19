<template>
  <v-container>

    <!-- loading while getting data -->
    <Loading v-if="loading"/>

    <!-- Content -->
    <div v-else>

      <!-- title -->
      <v-layout row wrap class="mb-2">
        <v-flex xs12 class="text-xs-center">
          <h1>طلب مساعدة بسب وفاة منتسب</h1>
        </v-flex>
      </v-layout>

      <!-- Doctor Info -->
      <DoctorInfoCard :doc="doc" />

      <!-- family Data -->
      <familyData
        :data="data"
        :family="family"
        @updateItem="updateItem($event)"
        @insertItem="insertItem($event)"
        @deleteItem="deleteItem($event)"
      />

      <!-- death date -->
      <v-card class="mt-4">
        <v-card-title>
          <h1>تاريخ الوفاة</h1>
        </v-card-title>
        <v-divider></v-divider>
        <v-card-text>
          <v-container>
            <v-layout>
              <v-flex xs12 sm6>
                <date label="تاريخ الوفاة" @ready="deathDate = $event" :value="deathDate"/>
              </v-flex>
            </v-layout>
          </v-container>
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
import familyData from "@/components/Family/FamilyData(Death)"
import date from "@/components/DatePicker"
export default {
  components: {
    Loading,
    DoctorInfoCard,
    familyData,
    date
  },
  props: ['id'],
  data () {
    return {
      loading: false,
      doc: null,
      family: [],
      data: [],
      deathDate: null
    }
  },
  created () {
    var rangeOfAcquaintance = ''
    var childAcquaintance = ''
    this.loading = true
    var pp = this.$route.path
    var p = pp.split('/')
    console.log(pp)

    if (p[3] === '-1') { // get data from data.json
      fs.readFile(path.join(remote.app.getPath('documents')) + '/data.json', 'utf8', (err, data2) => {
        if (err) throw err

        this.doc = JSON.parse(data2)
        this.data = this.doc.deadMembers
        this.deathDate = this.doc.deathDate
        this.$db.findOne({_id: this.id}, (err, data3) => {
          if (err) {
            console.log(err.message)
            return
          }
          this.doc.gender === 'ذكر' ? rangeOfAcquaintance = 'زوجته' : rangeOfAcquaintance = 'زوجها'
          data3.partners.forEach(partner => {
            this.family.push({
              name: partner.name,
              birthDate: partner.birthDate,
              rangeOfAcquaintance: rangeOfAcquaintance
            })
          })
          data3.children.forEach(child => {
            child.gender === 'ذكر' ? childAcquaintance = 'ابنه' : childAcquaintance = 'ابنته'
            this.family.push({
              name: child.name,
              birthDate: child.birthDate,
              rangeOfAcquaintance: childAcquaintance
            })
          })
          data3.family.forEach(member => {
            this.family.push({
              name: member.name,
              rangeOfAcquaintance: member.type
            })
          })
        })
        this.loading = false
      })
    } else {
      this.$db.findOne({_id: this.id}, (err, doc) => {
        if (err) {
          console.log(err.message)
          return
        }
        this.doc = doc
        this.doc.gender === 'ذكر' ? rangeOfAcquaintance = 'زوجته' : rangeOfAcquaintance = 'زوجها'
        doc.partners.forEach(partner => {
          this.family.push({
            name: partner.name,
            birthDate: partner.birthDate,
            rangeOfAcquaintance: rangeOfAcquaintance,
            address: doc.address
          })
        })
        doc.children.forEach(child => {
          child.gender === 'ذكر' ? childAcquaintance = 'ابنه' : childAcquaintance = 'ابنته'
          this.family.push({
            name: child.name,
            birthDate: child.birthDate,
            rangeOfAcquaintance: childAcquaintance,
            address: doc.address
          })
        })
        doc.family.forEach(member => {
          this.family.push({
            name: member.name,
            rangeOfAcquaintance: member.type
          })
        })
        this.loading = false
      })
    }
  },
  methods: {
    deleteItem (index) {
      this.data.splice(index, 1)
    },
    updateItem(item){
      Object.assign(this.data[item.index], item.editedItem)
    },
    insertItem(item) {
      this.data.push(item)
    },
    goBack () {
      if (confirm('هل انت متاكد من الخروج من هذه الصفحة ؟')) {
        this.$router.push('/')
      }
    },
    saveToJsonCheck () {
      if (confirm('هل انت متاكد من حفظ هذه المعلومات ؟')) {
        if (!this.data.length || !this.deathDate) {
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
        type: 'مساعدة_وفاة',
        phone: this.doc.phone,
        faculty: this.doc.faculty,
        facultySection: this.doc.facultySection,
        address: this.doc.address,
        deadMembers: this.data,
        deathDate: this.deathDate
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
          this.$router.push('/PDFdeath')
        }
      )
    }
  }
}
</script>