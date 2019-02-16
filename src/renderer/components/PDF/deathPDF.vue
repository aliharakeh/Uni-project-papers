<template>
  <v-container fluid style="width: 21cm; height: 29cm;">
    
    <!-- section 1 -->
    <v-layout row justify-space-between class="mt-2">
        <div dir="rtl">
            <h1>الجمهورية اللبنانية</h1>
            <h2>صندوق التعاضد</h2>
        </div>
        <div dir="rtl" style="text-align: center;border: 2px solid black;" class="px-4 py-3">
          <h4>نموذج رقم<br>(٧)<br>وفاة</h4>
        </div>
    </v-layout>

    <!-- section 2 -->
    <v-layout column class="mt-2">
      <v-flex xs6 offset-xs-3>
        <div style="text-align:center;">
          <h1 style="font-size: 31px;">طلب مساعدة بسبب وفاة منتسب</h1>
         </div>
      </v-flex>
    </v-layout>

    <!-- section 3 -->
    <v-layout row justify-space-between class="mt-2 fontsize">
        <div>
        <table dir="rtl">
          <tr>
            <th style="width: 200px; text-align: center; padding: 5px;">رقم الانتساب</th>
          </tr>
          <tr style=" border: 2px solid black;">
            <td style="text-align: center">{{ ConvertToArabicNum(doc.number) }}</td>
          </tr>
        </table>
      </div>

      <div>
        <table dir="rtl" class="t">
          <tr>
            <th style="width: 200px;">رقم تسجيل الطلب لدى الصندوق</th>
            <th style="width: 130px;">تاريخ تسجيله</th>
          </tr>
          <tr>
            <td style="width: 200px;"></td>
            <td style="width: 130px;"></td>
          </tr>
        </table>
      </div>
    </v-layout>

    <!-- section 4 -->
    <v-layout row class="mt-2 fontsize">
      <table style="width: 100%;" dir="rtl">
        <tr>
          <td style="width: 15%;"></td>
          <td>اسم المنتسب وشهرته : <b>{{ doc.name }}</b></td>
          <td>الهاتف : <b>{{ ConvertToArabicNum(doc.phone) }}</b></td>
        </tr>
        <tr>
          <td style="width: 15%;"></td>
          <td>الكلية/المعهد : <b>{{ doc.faculty }}</b></td>
          <td>الفرع : <b>{{ doc.facultySection }}</b></td>
        </tr>
      </table>
    </v-layout>

    <!-- section 5 -->
    <v-layout column class="mt-2 fontsize" style="page-break-inside: avoid;">
      <table dir="rtl" class="t">
        <tr>
          <td colspan="3" style="text-align : right;">
            - نحن الموقعين أدناه أفراد عائلة المرحوم : <b>{{ doc.name }}</b> ، من الكلية/المعهد : <b>{{ doc.faculty }}</b> ، الفرع : <b>{{ doc.facultySection }}</b> <br>
            - نرجو إعطائنا مساعدة الوفاة المنصوص في المادّة ١١ من المرسوم رقم ٨٦٨١ تاريخ ١٩٩٦/٦/٩ من نظام المنافع والخدمات التي يقدمها الصندوق وذلك بالإستناد إلى المستندات المرفقة في تاريخ : {{ ConvertToArabicDate(GetDateToday(date)) }}
          </td>
        </tr>
        <tr>
            <th>الاسم والشهرة</th>
            <th>صلة القربى</th>
            <th>التوقيع</th>
        </tr>
        <tr v-for="deadMembers in doc.deadMembers" :key="deadMembers.name">
            <td> {{ deadMembers.name }} </td>
            <td style="width: 33%;"> {{ deadMembers.rangeOfAcquaintance }} </td>
            <td style="width: 33%;"></td>
        </tr>
      </table>
    </v-layout>

   <!-- section 6 -->
   <v-layout column class="mt-1 fontsize" style="page-break-inside: avoid;">
    <table style="width: 100%;" dir="rtl" class="mb-2">
       <tr>
         <td colspan="2">
            - يحال لجانب ادارة صندوق التعاضد مع الافادة بما يلي : 
         </td>
       </tr>
       <tr>
         <td colspan="2">
          - إن المرحوم : <b>{{ doc.name }}</b> ، المتوفي بتاريخ : {{ ConvertToArabicDate(doc.deathDate) }} ، كان أستاذ في الكلية/المعهد : <b>{{ doc.faculty }}</b> ، الفرع : <b>{{ doc.facultySection }}</b> حتى تاريخ وفاته.
         </td>
       </tr>
       <tr>
         <td>
           - إن الراتب الأساسي الصافي للأستاذ المتوفي بتاريخ حصول الوفاة هو : 
         </td>
         <td>
           <div style="width: 380px;height: 30px; border: 1px solid black;">
            <p style="text-align: left;">ل.ل &nbsp;</p>
          </div>
         </td>
       </tr>
       <tr>
          <td>
           - <b> الإسم : </b>
         </td>
         <td style="text-align: center;">
           التاريخ : {{ ConvertToArabicDate(GetDateToday(date)) }}
         </td>
       </tr>
       <tr>
         <td></td>
         <td style="text-align: center; padding-bottom: 45px;">
           توقيع <b>الرئيس المباشر </b>
         </td>
       </tr>
     </table>
    </v-layout>

    <!-- section 7 -->
    <v-layout column class="mt-1 fontsize" style="page-break-inside: avoid;">
        <div style="margin-right: 25px;">
          <u><b>المستندات المطلوبة : </b></u>
          <ul>
            <li>وثيقة وفاة ، اخراج قيد عائلي.</li>
            <li>تفويض من كاتب العدل بإسم أحد الأشخاص المستفيدين بالنيابة عنهم لقبض المساعدة.</li>
          </ul>
        </div>
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

    checkWorkSector (partner, workSector) {
      if (partner.workSector === workSector) {
        return 1
      }
      return 0
    },

    checkPapers () {
      if (this.doc.prevOrOutsidePaper === '1') {
        return 'أتقاضى'
      }
      return 'لم أتقاض'
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

  .fontsize {
    font-size: 15px;
  }

  table {
    border-collapse: collapse;
    border: 2px solid black;
  }

  td {
    padding: 3px;
  }

  .t {
    border: 2px solid black;
    border-collapse: collapse;
    width: 100%;
    text-align: center;
  }

  .t td, .t th {
    border: 2px solid black;
    height: 28px;
    padding: 3px;
  }

  .icons{
    font-size: 19px;
    margin-top: 5px;
  }

  .rightborder{
    border-right: 2px solid black;
  }

</style>
