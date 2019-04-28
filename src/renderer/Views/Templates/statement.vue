<template>
  <v-container>
    <!-- loading while getting data -->
    <Loading v-if="loading"/>

    <!-- Content -->
    <div v-else>  

      <!-- title -->
      <v-layout row wrap class="mb-2">
        <v-flex xs12 class="text-xs-center">
          <h1>طلب إفادة</h1>
        </v-flex>
      </v-layout>

      <!-- Doctor Info -->
      <DoctorInfoCard :doc="doc" />

      <!-- ifede Data -->
      <v-card class="mt-4">
        <v-card-title>
          <h1>معلومات تتعلق بالإفادة</h1>
        </v-card-title>
        <v-divider></v-divider>
        <v-card-text>
          <v-layout row wrap>
            <v-flex xs12 sm5>
              <v-text-field label="طلب إفادة عن" type="text" v-model="ifede"></v-text-field>
            </v-flex>
          </v-layout>
          <v-layout wrap>
            <textarea
              v-model="text"
              dir="rtl"
              rows="6"
              style="width: 100%; border: 2px solid black; font-size: 20px; font-weight: bold; padding: 5px;"
            ></textarea>
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

export default {
  components: {
    Loading,
    DoctorInfoCard
  },
  props: ['id'],
  data () {
    return {
      loading: false,
      doc: null,
      ifede: null,
      text: 'أرجو إعطائي إفادة تثبت أن '
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
        this.ifede = this.doc.ifede
        this.text = this.doc.text
        this.loading = false
      })
    } else {
      this.$db.findOne({_id: this.id}, (err, data1) => {
        if (err) {
          console.log(err.message)
          return
        }
        this.doc = data1
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
        if (!this.ifede || !this.text) {
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
        type: 'طلب إفادة',
        phone: this.doc.phone,
        faculty: this.doc.faculty,
        facultySection: this.doc.facultySection,
        address: this.doc.address,
        ifede: this.ifede,
        text: this.text
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
          this.$router.push('/PDFstatement')
        }
      )
    }
  }
}
</script>