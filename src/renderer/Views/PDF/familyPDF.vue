<template>
  <v-container fluid style="width: 21cm; height: 29cm;">
    
    <!-- section 1 -->
    <v-layout row justify-space-between class="mt-2">
        <div dir="rtl">
            <h1>الجمهورية اللبنانية</h1>
            <h2>صندوق التعاضد</h2>
        </div>
        <div dir="rtl" style="text-align: center;border: 2px solid black;" class="px-4 py-3">
          <h4>نموذج رقم<br>(١١)<br>تعهد ذوي العهدة</h4>
        </div>
    </v-layout>

    <!-- section 2 -->
    <v-layout column class="mt-2">
      <v-flex xs6 offset-xs-3>
        <div style="text-align:center;">
          <h1 style="font-size: 31px;">تعهّد من المنتسب حول ذوي عهدته</h1>
         </div>
      </v-flex>
    </v-layout>

    <!-- section 3 -->
    <v-layout row justify-space-between class="mt-1 fontsize">
        <div>
        <table dir="rtl">
          <tr>
            <th style="width: 200px; text-align: center; padding: 2px;">رقم الانتساب</th>
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
    <v-layout row class="mt-1 fontsize">
      <table style="width: 100%;" dir="rtl">
        <tr>
          <td style="width: 14%;"></td>
          <td>اسم المنتسب وشهرته : <b>{{ doc.name }}</b></td>
          <td>الهاتف : <b>{{ ConvertToArabicNum(doc.phone) }}</b></td>
        </tr>
        <tr>
          <td style="width: 14%;"></td>
          <td>الكلية/المعهد : <b>{{ doc.faculty }}</b></td>
          <td>الفرع : <b>{{ doc.facultySection }}</b></td>
        </tr>
        <tr>
          <td colspan="3" style="padding-top : 10px;">
            أرجو ادراج عهدة والدي و/أو والدتي و/أو أخوتي على صفحتي الاسمية واعتبارهم على عاتقي وذلك وفقاً للمستندات الثبوتية المرفقة في :
            {{ ConvertToArabicDate(GetDateToday(date)) }}
          </td>
        </tr>
        <tr>
          <td colspan="3" style="text-align: left; padding-left: 60px; padding-bottom: 50px;">
            توقيع <b>الرئيس المباشر </b>
          </td>
        </tr>
      </table>
    </v-layout>

    <!-- section 5 -->
    <v-layout column class="mt-2 fontsize" style="page-break-inside: avoid;">
      <table dir="rtl" class="t">
        <tr>
          <th colspan="5" style="font-size: 20px;">
            معلومات تتعلق بذوي العهدة
          </th>
        </tr>
        <tr>
          <td colspan="5" style="font-size: 15px; text-align: right;">
            - المطلوب من المنتسب أن يذكر في هذه الفقرة المعلومات التالية حول الذين في عهدته والذين يقوم المنتسب بتقديم الرعاية والنفقة القانونية لهم ، مصحوبة بتوقيع المعنيين.
          </td>
        </tr>
        <tr>
          <th>الاسم والشهرة</th>
          <th>تاريخ الولادة</th>
          <th>صلة القربى</th>
          <th>عنوان السكن</th>
          <th>التوقيع</th>
        </tr>
        <tr v-for="family in doc.family" :key="family.name">
            <td> {{ family.name }}</td>
            <td> {{ ConvertToArabicDate(family.birthDate) }} </td>
            <td> {{ family.rangeOfAcquaintance }} </td>
            <td> {{ family.address }} </td>
            <td></td>
        </tr>
      </table>
    </v-layout>

    <!-- section 6 -->
    <v-layout column class="mt-2 fontsize" style="page-break-inside: avoid;">
      <div style="border: 2px solid black; padding: 5px;">
          <p>- أنا الموقع أدناه أتعهد بأن كامل المعلومات الواردة أعلاه هي صحيحة ، وعلى مسؤوليتي القانونية الجزائية والمدنية ، وأن ذوي عهدتي المذكورة أعلاه عاجزين عن كسب العيش وليس باستطاعتهم تحمل نفقات المعالجات الصحية والإستشفائية. </p><br>
          <p style="text-align: left; margin-top: -40px; margin-bottom: 40px; margin-left: 60px"> التاريخ : {{ ConvertToArabicDate(GetDateToday(date)) }} <br> توقيع <b>المنتسب</b></p>
      </div>
    </v-layout>

    <!-- section 7 -->
    <v-layout column class="mt-2 fontsize" style="page-break-inside: avoid;">
        <div style="padding-right: 25px;">
          <u><b>المستندات المطلوبة : </b></u>
          <ul>
            <li>اخراج قيد عائلي للمنتسب يتضمن من هم في عهدته ، يعود تاريخه لثلاثة أشهر على الأكثر.</li>
            <li>افادة من المؤسسات الرسمية الضامنة (تعاونية ، ضمان ، أمن) ، عن الأخوة والأخوات العاملات الذين بلغوا السن القانوني ، بأنهم لا يستفيدون عن الوالدين من أية رعاية صحية.</li>
          </ul>
          <u><b>ملاحظة :</b></u>
          <ul>
          <li> تحول هذه الإستمارة لتحقيق اجتماعي تقوم به ادارة الصندوق أو تكلف القيام به إحدى المؤسسات الرسمية المعنية بذلك. </li>
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

  .fontsize{
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
    height: 30px;
    padding: 3px;
  }

  .icons{
    font-size: 15px;
    margin-top: 5px;
  }

  .rightborder{
    border-right: 2px solid black;
  }

</style>
