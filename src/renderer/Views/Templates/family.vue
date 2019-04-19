<template>
  <v-container>

    <!-- loading while getting data -->
    <Loading v-if="loading"/>

    <!-- Content -->
    <div v-else>

      <!-- title -->
      <v-layout row wrap class="mb-2">
        <v-flex xs12 class="text-xs-center">
          <h1>تعهد من المنتسب حول ذوي عهدته</h1>
        </v-flex>
      </v-layout>

      <!-- Doctor Info -->
      <DoctorInfoCard :doc="doc" />

      <!-- family Data -->
      <familyData
        :data="data"
        :family="family"
        @insertItem="data.push($event)"
        @deleteItem="data.splice($event, 1)"
      />

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
import familyData from "@/components/Family/FamilyData(Family)"
export default {
  components: {
    Loading,
    DoctorInfoCard,
    familyData
  },
  props: ['id'],
  data () {
    return {
      loading: false,
      doc: null,
      family: [],
      data: []
    }
  },
  created () {
    this.loading = true
    var pp = this.$route.path
    var p = pp.split('/')
    console.log(pp)

    if (p[3] === '-1') { // get data from data.json
      fs.readFile(path.join(remote.app.getPath('documents')) + '/data.json', 'utf8', (err, data2) => {
        if (err) throw err

        this.doc = JSON.parse(data2)
        this.data = this.doc.family
        this.$db.findOne({_id: this.id}, (err, data3) => {
          if (err) {
            console.log(err.message)
            return
          }
          data3.family.forEach(member => {
            this.family.push({
              name: member.name,
              birthDate: member.birthDate,
              rangeOfAcquaintance: member.type,
              address: member.address
            })
          })
        })
        this.loading = false
      })
    } else {
      this.$db.findOne({_id: this.id}, (err, data1) => {
        if (err) {
          console.log(err.message)
          return
        }
        this.doc = data1
        this.doc.family.forEach(member => {
          this.family.push({
            name: member.name,
            birthDate: member.birthDate,
            rangeOfAcquaintance: member.type,
            address: member.address
          })
        })
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
        if (!this.data.length) {
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
        type: 'ذوي_عهدته',
        phone: this.doc.phone,
        faculty: this.doc.faculty,
        facultySection: this.doc.facultySection,
        address: this.doc.address,
        family: this.data
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
          this.$router.push('/PDFfamily')
        }
      )
    }
  }
}
</script>



