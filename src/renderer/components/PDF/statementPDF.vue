<template>
  <v-container fluid style="width: 21cm; height: 29cm;">
    
    <!-- section 1 -->
    <v-layout row justify-space-between class="mt-2">
      <div dir="rtl">
        <h2>الجمهورية اللّبنانية</h2>
        <h3>صندوق التعاضد أفراد الهيئة</h3>
        <h3>التعليمية في الجامعة اللّبنانية</h3>
      </div>
    </v-layout>

    <!-- section 2 -->
    <v-layout column class="mt-4">
      <v-flex xs6 offset-xs-3>
        <div style="text-align:center;">
          <h1 style="font-size: 30px;">حضرة مدير صندوق التعاضد المحترم</h1>
         </div>
      </v-flex>
    </v-layout>

    <!-- section 3 -->
    <v-layout row justify-space-between class="mt-4" style="font-size: 18px;">
      <table dir="rtl" style="width: 100%; text-align: right;">
        <tr>
          <td>- المستدعي : <b>{{ doc.name }}</b></td>
          <td>- الموضوع : طلب إفادة  <b>{{ doc.ifede }}</b></td>
        </tr>
      </table>
    </v-layout>

    <!-- section 4 -->
    <v-layout row justify-space-between class="mt-3" style="font-size: 18px;">
      <table dir="rtl" class="t" width="100%">
        <tr>
          <td>
           - أنا الموقع أدنا الدكتور(ة) : <b>{{ doc.name }}</b> ، أستاذ في كلية : <b>{{ doc.faculty }}</b> ، الفرع : <b>{{ doc.facultySection }}</b> ، رقم الإنتساب إلى الصندوق : <b>{{ ConvertToArabicNum(doc.number) }}</b>
          </td>
        </tr>
        <tr>
          <td>
            - {{ doc.text }}
          </td>
        </tr>
      </table>
    </v-layout>

    <!-- section 5 -->
    <v-layout row class="mt-3" style="font-size: 18px;">
      <table style="font-weight: bold;" width="100%" dir="rtl">
        <tr>
          <td style="text-align: right;">
           - بيروت في : {{ ConvertToArabicDate(GetDateToday(date)) }}
          </td>
          <td style="text-align: right; width: 50%;">
            - الاسم :
          </td>
        </tr>
        <tr>
          <td style="text-align: right;">
            - طابع مالي ١٠٠٠ ل.ل
          </td>
          <td style="text-align: right;">
           - التوقيع :
          </td>
        </tr>
      </table>
    </v-layout>
  </v-container>
</template>

<script>
import fs from 'fs'
import path from 'path'
import { remote } from 'electron'

export default{
  data () {
    return {
      doc: '',
      date: null
    }
  },

  created () {
    // get data from data.json
    fs.readFile(path.join(remote.app.getPath('documents')) + '/data.json', 'utf8', (err, data) => {
      if (err) throw err
      this.doc = JSON.parse(data)
      console.log(this.doc)
    })

    this.date = new Date()
  },

  methods: {

    GetDateToday (d) {
      var month = d.getMonth() + 1
      return d.getFullYear() + '-' + month + '-' + d.getDate()
    },

    checkWork (partner) {
      if (partner.workSector === '') {
        return 'لا يعمل'
      }
      return 'متعاقد'
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
      // var flag = 0
      var arnum = ['٠', '١', '٢', '٣', '٤', '٥', '٦', '٧', '٨', '٩']

      var y = dd[0].split('') // year
      y.forEach(element => {
        year += arnum[element]
      })

      var m = dd[1].split('') // month
      if (dd[1] !== '10') {
        m.forEach(element => {
          if (element !== '0') {
            month += arnum[element]
          }
        })
      } else {
        month += '١٠'
      }

      var d = dd[2].split('') // day
      if (dd[2] !== '10' && dd[2] !== '20' && dd[2] !== '30') {
        d.forEach(element => {
          if (element !== '0') {
            day += arnum[element]
          }
        })
      } else {
        if (dd[2] === '10') {
          day += '١٠'
        }
        if (dd[2] === '20') {
          day += '٢٠'
        }
        if (dd[2] === '30') {
          day += '٣٠'
        }
      }
      return year + '/' + month + '/' + day
    }
  }
}
</script>

<style scoped>

  .t {
    border: 2px solid black;
    border-collapse: collapse;
    width: 100%;
    text-align: right;
  }
  td {
    padding: 6px;
  }

</style>
