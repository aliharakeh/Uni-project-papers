<template>
  <v-container>
    <!-- loading while getting data -->
    <Loading v-if="loading"/>

    <!-- Content -->
    <div v-else>

      <!-- title -->
      <v-layout row wrap class="mb-2">
        <v-flex xs12 class="text-xs-center">
          <h1>{{ title }}</h1>
        </v-flex>
        <v-flex xs12 class="text-xs-center">
          <h1>{{ frenchTitle }}</h1>
        </v-flex>
      </v-layout>

      <!-- Doctor Info -->
      <DoctorInfoCard :doc="doc" />

      <!-- Partners -->
      <PartnerInfoCard :doc="doc" />

      <!-- Medical Data -->
      <medical
        :family="family"
        :medicalData="medicalData"
        @insertItem="insertItem($event)"
        @deleteItem="deleteItem($event)"
      />

      <!-- Medical Costs -->
      <medicalCosts
        :medicalCostsData="medicalCostsData"
        @editItem="editItem($event)"
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
import PartnerInfoCard from "@/components/Partner/PartnerInfoCard"
import medical from "@/components/MedicalData"
import medicalCosts from "@/components/MedicalCostsData"
export default {
  components: {
    Loading,
    DoctorInfoCard,
    PartnerInfoCard,
    medical,
    medicalCosts
  },
  props: ['id'],
  data() {
    return {
      title: '',
      frenchTitle: '',
      doc: {},
      loading: false,
      medicalData: [],
      family: [],
      medicalCostsData: [],
      linkedFamily: []
    }
  },
  created() {
    this.title = this.$route.path.includes('teeth') ? 'طلب مساعدة اسنان' : 'طلب مساعدة مرضية'
    this.frenchTitle = this.$route.path.includes('teeth') ? 'Demande d\'aide medicale dentaire': 'Demande d\'aide medicale';
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
        this.medicalData = this.doc.medicalData
        this.medicalCostsData = this.doc.medicalCostsData
        this.linkedFamily = this.doc.linkedFamily
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
              birthDate: member.birthDate,
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
            birthDate: member.birthDate,
            rangeOfAcquaintance: member.type
          })
        })
        this.loading = false
      })
    }
  },
  methods: {
    deleteItem(index) {
      this.medicalData.splice(index, 1)
      const name = this.linkedFamily[index].name
      this.linkedFamily.splice(index, 1)
      const memberIndex = this.medicalCostsData.findIndex(member => member.name === name)
      this.medicalCostsData.splice(memberIndex, 1)
    },
    insertItem(editedItem) {
      this.medicalData.push(editedItem)
      this.linkedFamily.push({
        name: editedItem.name,
        birthDate: editedItem.birthDate,
        rangeOfAcquaintance: editedItem.rangeOfAcquaintance
      })
      this.medicalCostsData.push({
        name: editedItem.name,
        doctorsCost: null,
        medicineCost: null,
        otherCosts: null,
        costsSum: null,
        externalHelpValue: null
      })
    },
    editItem(data){
      Object.assign(this.medicalCostsData[data.index], data.editedItem)
    },
    goBack () {
      return confirm('هل انت متاكد من الخروج من هذه الصفحة ؟') && this.$router.push('/')
    },
    saveToJsonCheck () {
      if (confirm('هل انت متاكد من حفظ هذه المعلومات ؟')) {
        if (!this.linkedFamily.length || !this.medicalData.length) {
          alert('لم يتم ملئ كل المعلومات بعد')
          return
        }
        for (var property in this.medicalCostsData)
          if (this.medicalCostsData[property] === null) {
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
        type: this.title.includes('أسنان') ? 'مساعدة_أسنان' : 'مساعدة_مرضية',
        phone: this.doc.phone,
        faculty: this.doc.faculty,
        facultySection: this.doc.facultySection,
        address: this.doc.address,
        partners: this.doc.partners,
        medicalData: this.medicalData,
        medicalCostsData: this.medicalCostsData,
        linkedFamily: this.linkedFamily
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
          this.title.includes('أسنان') ? this.$router.push('/PDFteeth') : this.$router.push('/PDFsickness')
        }
      )
    }
  }
}
</script>



