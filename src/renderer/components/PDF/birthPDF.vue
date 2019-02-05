<template>
  <v-container fluid>
    
    <!-- section 1 -->
    <v-layout row justify-space-between class="mt-2">
      <div dir="rtl">
        <h1>الجمهورية اللبنانية</h1>
        <h2>صندوق تعاضد أفراد الهيئة</h2>
        <h2>التعليمية في الجامعة اللبنانية</h2>
      </div>
        <div dir="rtl" style="text-align: center;border: 2px solid black;" class="px-4 py-3">
          <h4>نموذج رقم<br>(٦)<br>ولادة</h4>
        </div>
    </v-layout>

    <!-- section 2 -->
    <v-layout column class="mt-4">
      <v-flex xs6 offset-xs-3>
        <div style="text-align:center;">
          <h1 class="display-1 font-weight-bold">طلب منحة ولادة</h1>
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
      </table>
    </v-layout>

    <!-- section 5 -->
    <div style="text-align:center; margin-top: 15px;">
      <h1 class="display-1 font-weight-bold">افادة بعمل الزوج (ة) </h1>
    </div>
    <v-layout column class="mt-4" style="font-size: 20px; page-break-inside: avoid;">
      <table style="width: 100%;" dir="rtl" class="mb-3" 
          v-for="partner in doc.partners" :key="partner.name">

        <tr v-if="checkWork(partner) === 'متعاقد'">
          <td style=" text-align: center;"> ان الزوج (ة) : {{ partner.name }}</td>
          <td>
              متعاقد <i class="material-icons icons">check_box</i>
          </td>
          <td> يعمل في : &nbsp;
            <bdi>{{ partner.workSector }} <i class="material-icons icons">check_box</i></bdi>
          </td>
        </tr>

        <tr v-else-if="checkWork(partner) === 'لا يعمل'">
          <td style=" text-align: center;"> ان الزوج (ة) : {{ partner.name }}</td>
          <td>
            لا يعمل <i class="material-icons icons">check_box</i> <!-- متقاعد <i class="material-icons icons">check_box_outline_blank</i> -->
          </td>
          <td></td>
        </tr>

        <tr v-if="checkWork(partner) === 'متعاقد' && !checkWorkSector(partner, 'قطاع خاص')">
          <td style=" text-align: center;">رقم الانتساب للتعاونيّة أو للضمان الاجتماعي : </td>
          <td colspan="2">{{ ConvertToArabicNum(partner.insuranceNum) }}</td>
        </tr>

        <tr v-if="partner.externalHelp === '1'">
          <td style=" text-align: center;">المساعدة من مصادر اخرى : {{ partner.externalHelpSource }}</td>
          <td colspan="2">قيمتها : {{ ConvertToArabicNum(partner.externalHelpMoney) }}</td>
        </tr>
      </table>
    </v-layout>
    
    <!-- section 6 -->
    <v-layout column class="mt-3" style="font-size: 20px; page-break-inside: avoid;">
        <div style="border: 2px solid black; padding: 10px;">
            أرجو اعطائي منحة الولادة عن ولدي {{ doc.child }} , المنصوص عنها في المادة ١٤ من المرسوم رقم ٨٦٨١ من نظام المنافع والخدمات التي يقدمها الصندوق. <br>
            واني أصرّح على مسؤوليّتي بأني {{ checkPapers() }} أنا أو زوجتي (زوجي) منحة ولادة من أي مصدر آخر. <br>
            <p v-if="doc.money && doc.date">قيمة المبلغ المقبوض من المصدر الآخر : {{ ConvertToArabicNum(doc.money) }} <br> التاريخ : {{ ConvertToArabic(doc.date) }}</p>
            <p style="text-align: left; margin-top: -20px; margin-bottom: 30px; margin-left:30px">توقيع <b>طالب المنحة</b></p>
        </div>
    </v-layout>

    <!-- section 7 -->
   <v-layout column class="mt-4" style="font-size: 20px; page-break-inside: avoid;">
        <div style="border: 2px solid black; padding: 10px;">
           يحال لجانب ادارة صندوق التعاضد مع الافادة بما يلي : <br>
           ان الراتب الأساسي الصافي للأستاذ : ... ل.ل <br>
           تاريخ حصول الزواج : {{ ConvertToArabic(doc.date) }}
           <p style="text-align: left; margin-top: -40px; margin-left:110px; margin-bottom: 30px;">
             التاريخ : {{ ConvertToArabic(GetDateToday(date)) }} <br>
             توقيع <b>الرئيس المباشر</b><br><br>
             الاسم : 
           </p>
        </div>
    </v-layout>

    <!-- section 8 -->
    <v-layout column class="mt-2" style="font-size: 20px; page-break-inside: avoid;">
        <div style="margin-right: 25px;">
           <b>المستندات المطلوبة : </b>
           <ul>
              <li>وثيقة ولادة , غيره من المستندات عند الاقتضاء.</li>
              <li>مستند عدم استفادة عن الزوج (الزوجة) من المرجع المسؤول عن عمله.</li>
              <li>مستند عن قيمة المبلغ المقبوض من المرجع الآخر.</li>
              <li>اخراج قيد عائلي جديد يظهر اسم المولود.</li>
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
    ConvertToArabic (date) {
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
