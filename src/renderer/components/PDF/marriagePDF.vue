<template>
  <v-container fluid>
    
    <!-- section 1 -->
    <v-layout row justify-space-between class="mt-2">
      <div dir="rtl">
        <h1>الجامعة اللبنانية</h1>
        <h2>صندوق التعاضد</h2>
      </div>
        <div dir="rtl" style="text-align: center;border: 2px solid black;" class="px-4 py-3">
          <h4>نموذج رقم<br>(5)<br>زواج</h4>
        </div>
    </v-layout>

    <!-- section 2 -->
    <v-layout column class="mt-4">
      <v-flex xs6 offset-xs-3>
        <div style="text-align:center;">
          <h1 class="display-1 font-weight-bold">طلب منحة زواج</h1>
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
            <td style="height: 35px;width: 200px; text-align: center">{{ doc.number }}</td>
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
          <td>الهاتف : {{ doc.phone }}</td>
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

        <tr v-if="checkWork(partner) === 1">
          <td style=" text-align: center;"> ان الزوج (ة) : {{ partner.name }}</td>
          <td>
              متقاعد <i class="material-icons icons">check_box</i> <!-- لا يعمل <i class="material-icons icons">check_box_outline_blank</i> -->
          </td>
          <td> يعمل في : &nbsp;
            <!-- <bdi>ادارة عامة <i class="material-icons icons">{{ checkWorkSector(partner, 'ادارة عامة') }}</i> </bdi> <bdi> مؤسّسة عامة <i class="material-icons icons">{{ checkWorkSector(partner, 'مؤسسة عامة') }}</i> </bdi> <br> <bdi> بلدية <i class="material-icons icons">{{ checkWorkSector(partner, 'بلدية') }}</i> </bdi> &nbsp; <bdi> قطاع خاص <i class="material-icons icons">{{ checkWorkSector(partner, 'قطاع خاص') }}</i> </bdi> -->
            <bdi>{{ partner.workSector }} <i class="material-icons icons">check_box</i></bdi>
          </td>
        </tr>

        <tr v-else-if="checkWork(partner) === 2">
          <td style=" text-align: center;"> ان الزوج (ة) : {{ partner.name }}</td>
          <td>
              لا يعمل <i class="material-icons icons">check_box</i> <!-- متقاعد <i class="material-icons icons">check_box_outline_blank</i> -->
          </td>
        </tr>

        <tr v-if="checkWork(partner) === 1">
          <td style=" text-align: center;">رقم الانتساب للتعاونيّة أو للضمان الاجتماعي : </td>
          <td colspan="2">{{ partner.insuranceNum }}</td>
        </tr>

        <tr v-if="checkWork(partner) === 1">
          <td style=" text-align: center;">المساعدة من مصادر اخرى : </td>
          <td colspan="2">قيمتها : </td>
        </tr>
      </table>
    </v-layout>
    
    <!-- section 6 -->
    <v-layout column class="mt-3" style="font-size: 20px; page-break-inside: avoid;">
        <div style="border: 2px solid black; padding: 5px;">
            أرجو اعطائي منحة الزواج المنصوص عنها في المادة 13 من المرسوم رقم 8681 من نظام المنافع والخدمات التي يقدمها الصندوق. <br>
            واني أصرّح على مسؤوليّتي بأني {{ checkPapers() }} أنا أو زوجتي (زوجي) منحة زواج من أي مصدر آخر كما أني لم أتقاض هذه المنحة سابقا". <br>
            <p v-if="doc.money && doc.date">قيمة المبلغ المقبوض من المصدر الآخر : {{ doc.money }} &nbsp; &nbsp; &nbsp; &nbsp; التاريخ : {{ doc.date }}</p>
            <p style="text-align: left; margin-top: -10px; margin-bottom: 25px; margin-left:30px">توقيع <b>طالب المحنة</b></p>
        </div>
    </v-layout>

    <!-- section 7 -->
   <v-layout column class="mt-4" style="font-size: 20px; page-break-inside: avoid;">
        <div style="border: 2px solid black; padding: 5px;">
           يحال لجانب ادارة صندوق التعاضد مع الافادة بما يلي : <br>
           ان الراتب الأساسي الصافي للأستاذ : ... ل.ل <br>
           تاريخ حصول الزواج : {{ doc.marriageDate }}
           <p style="text-align: left; margin-top: -40px; margin-left:110px">
             التاريخ : {{ date.getDate() }} / {{ date.getMonth() + 1 }} / {{ date.getFullYear() }} <br>
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
              <li>وثيقة زواج , غيره من المستندات عند الاقتضاء.</li>
              <li>مستند عدم استفادة عن الزوج (الزوجة) من المرجع المسؤول عن عمله.</li>
              <li>اخراج قيد جديد يظهر اسم الزوجة.</li>
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
    GetDate (date, index) {
      const d = date.split('-')
      return d[index]
    },

    checkWork (partner) {
      if (partner.work === 'متقاعد') {
        return 1
      }
      if (partner.work === 'لا يعمل') {
        return 2
      }
      return false
    },

    checkPapers () {
      if (this.doc.prevOrOutsidePaper === '1') {
        return 'أتقاضى'
      }
      return 'لم أتقاض'
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
