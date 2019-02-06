<template>
  <v-container fluid>
    
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
    <v-layout column class="mt-4">
      <v-flex xs6 offset-xs-3>
        <div style="text-align:center;">
          <h1 class="display-1 font-weight-bold">تعهد من المنتسب حول ذوي عهدته</h1>
         </div>
      </v-flex>
    </v-layout>

    <!-- section 3 -->
    <v-layout row justify-space-between class="mt-4" style="font-size: 18px;">
        <div>
        <table dir="rtl">
          <tr>
            <th style="height: 35px;width: 200px; text-align: center; padding: 5px;">رقم الانتساب</th>
          </tr>
          <tr style=" border: 2px solid black;">
            <td style="height: 35px;width: 200px; text-align: center">{{ ConvertToArabicNum(doc.number) }}</td>
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
    <v-layout row class="mt-3" style="font-size: 20px;">
      <table style="width: 100%;" dir="rtl">
        <tr>
          <td style=" text-align: center;">اسم المنتسب وشهرته : {{ doc.name }}</td>
          <td>الهاتف : {{ ConvertToArabicNum(doc.phone) }}</td>
        </tr>
        <tr>
          <td style=" text-align: center;">الكلية/المعهد : {{ doc.faculty }}</td>
          <td>الفرع : {{ doc.facultySection }}</td>
        </tr>
        <tr>
            <td style=" text-align: center;" colspan="2">
                <p>أرجو ادراج عهدة والدي و/أو والدتي و/أو أخوتي على صفحتي الاسمية واعتبارهم على عاتقي وذلك وفقاً للمستندات الثبوتية المرفقة في تاريخ : {{ ConvertToArabicDate(GetDateToday(date)) }}</p><br>
                <p style=" text-align: left; margin-top: -40px; margin-left:60px; margin-bottom: 60px;" colspan="2">
                    توقيع <b>الرئيس المباشر</b>
                </p>
            </td>
        </tr>
      </table>
    </v-layout>

    <!-- section 5 -->
    <v-layout column class="mt-4" style="font-size: 20px; page-break-inside: avoid;">
      <table dir="rtl" class="t">
        <tr>
            <th colspan="5">
                <h1 class="display-1 font-weight-bold">معلومات تتعلق بذوي العهدة</h1>
            </th>
        </tr>
        <tr>
            <td colspan="5">
                <h4>المطلوب من المنتسب أن يذكر في هذه الفقرة المعلومات التالية حول الذين في عهدته والذين يقوم المنتسب بتقديم الرعاية والنفقة القانونية لهم , مصحوبة بتوقيع المعنيين.</h4>
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
    <v-layout column class="mt-3" style="font-size: 20px; page-break-inside: avoid;">
        <div style="border: 2px solid black; padding: 10px;">
            <p> أنا الموقع أدناه أتعهد بأن كامل المعلومات الواردة أعلاه هي صحيحة , وعلى مسؤوليتي القانونية الجزائية والمدنية , وأن ذوي عهدتي المذكورة أعلاه عاجزين عن كسب العيش وليس باستطاعتهم تحمل نفقات المعالجات الصحية والإستشفائية. </p><br>
            <p style="text-align: left; margin-top: -20px; margin-bottom: 50px; margin-left:100px"> التاريخ : {{ ConvertToArabicDate(GetDateToday(date)) }} <br> توقيع <b>المنتسب</b></p>
        </div>
    </v-layout><br>

    <!-- section 7 -->
    <v-layout column class="mt-2" style="font-size: 20px; page-break-inside: avoid;">
        <div style="margin-right: 25px;">
           <u><b>المستندات المطلوبة : </b></u>
           <ul>
             <li>اخراج قيد عائلي للمنتسب يتضمن من هم في عهدته , يعود تاريخه لثلاثة أشهر على الأكثر.</li>
             <li>افادة من المؤسسات الرسمية الضامنة (تعاونية, ضمان, أمن) , عن الأخوة والأخوات العاملات الذين بلغوا السن القانوني , بأنهم لا يستفيدون عن الوالدين من أية رعاية صحية.</li>
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
      var arnum = ['٠', '١', '٢', '٣', '٤', '٥', '٦', '٧', '٨', '٩']

      var y = dd[0].split('') // year
      y.forEach(element => {
        year += arnum[element]
      })

      var m = dd[1].split('') // month
      m.forEach(element => {
        month += arnum[element]
      })

      var d = dd[2].split('') // day
      d.forEach(element => {
        day += arnum[element]
      })

      return year + '/' + month + '/' + day
    }

  }
}
</script>

<style scoped>

  table {
    border-collapse: collapse;
    border: 2px solid black;
  }

  td {
    padding: 5px;
  }

  /*table tr{
    border-right: 2px solid black;
    border-left: 2px solid black;
  }*/

  .t {
    border: 2px solid black;
    border-collapse: collapse;
    width: 100%;
    text-align: center;
  }

  .t td, .t th {
    border: 2px solid black;
    height: 35px;
    padding: 5px;
  }

  .icons{
    font-size: 19px;
    margin-top: 5px;
  }

  .rightborder{
    border-right: 2px solid black;
  }

</style>
