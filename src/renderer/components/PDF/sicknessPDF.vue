<template>
  <v-container fluid>
    
    <!-- section 1 -->
    <v-layout row justify-space-between class="mt-2">
      <div dir="rtl">
        <h1>الجمهورية اللبنانية</h1>
        <h3>صندوق تعاضد أفراد الهيئة</h3>
        <h3>التعليميّة في الجامعة اللبنانية</h3>
      </div>
        <div dir="rtl" style="text-align: center;border: 2px solid black;" class="px-4 py-3">
          <h4>نموذج رقم<br>(٩)<br>مرضية</h4>
        </div>
    </v-layout>

    <!-- section 2 -->
    <v-layout column class="mt-4">
      <v-flex xs6 offset-xs-3>
        <div style="text-align:center;">
          <h1 class="display-1 font-weight-bold">طلب مساعدة مرضيّة</h1>
          <h1 class="display-1 font-weight-bold">Demande d'aide medicale</h1>
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
    <v-layout row class="mt-4" style="font-size: 20px; page-break-inside: avoid;">
      <table class="t" dir="rtl">
        <tr>
          <th colspan="8"><h1 class="display-1 font-weight-bold">معلومات عن المرضى موضوع المساعدة</h1></th>
        </tr>
        <tr>
          <th>اسم المريض</th>
          <th colspan="3">
            <bdi>تاريخ الولادة</bdi>
            <v-layout row justify-space-around>
              <bdi>يوم</bdi>
              <bdi>شهر</bdi>
              <bdi>سنة</bdi>
            </v-layout>
          </th>
          <th>درجة القرابة للمنتسب</th>
          <th colspan="2">
            <bdi>تاريخ ابتداء وانتهاء العلاج</bdi>
            <v-layout row justify-space-around>
              <bdi>الابتداء</bdi>
              <bdi>الانتهاء</bdi>
            </v-layout>
          </th>
        </tr>
        <tr v-for="medicData in doc.medicalData" :key="medicData.name">
          <td>{{ medicData.name }}</td>
          <td style="width: 60px;">{{ GetDate(ConvertToArabicDate(medicData.birthDate), 2) }}</td>
          <td style="width: 60px;">{{ GetDate(ConvertToArabicDate(medicData.birthDate), 1) }}</td>
          <td style="width: 60px;">{{ GetDate(ConvertToArabicDate(medicData.birthDate), 0) }}</td>
          <td>{{ medicData.rangeOfAcquaintance }}</td>
          <td>{{ ConvertToArabicDate(medicData.medicalStartDate) }}</td>
          <td>{{ ConvertToArabicDate(medicData.medicalEndDate) }}</td>
        </tr>
      </table>
    </v-layout><br>

    <!-- section 7 -->
    <v-layout row class="mt-4" style="font-size: 20px; page-break-inside: avoid;">
        <table class="t" dir="rtl">
          <tr>
            <th colspan="8"><h1 class="display-1 font-weight-bold">نفقات المعالجة حسب نوعها</h1></th>
          </tr>
          <tr>
              <th>اسم المريض</th>
              <th>أجور الأطباء</th>
              <th>ثمن الأدوية</th>
              <th>مختلف</th>
              <th>مجموع النفقات</th>
              <th>قيمة المساعدة من مصدر آخر</th>
              <th>النفقات الموافق عليها</th>
              <th>قيمة المساعدة المستحقة</th>
          </tr>
          <tr v-for="medicCost in doc.medicalCostsData" :key="medicCost.name">
              <td>{{ medicCost.name }}</td>
              <td>{{ ConvertToArabicNum(medicCost.doctorsCost) }}</td>
              <td>{{ ConvertToArabicNum(medicCost.medicineCost) }}</td>
              <td>{{ ConvertToArabicNum(medicCost.otherCosts) }}</td>
              <td>{{ ConvertToArabicNum(medicCost.costsSum) }}</td>
              <td>{{ ConvertToArabicNum(medicCost.externalHelpValue) }}</td>
              <td></td>
              <td></td>
          </tr>
        </table>
    </v-layout><br>

    <!-- section 8 -->
    <v-layout row class="mt-4" style="font-size: 22px; page-break-inside: avoid;">
        <table dir="rtl" style="width: 100%;">
            <tr>
                <th colspan="2"><h1 class="display-1 font-weight-bold">المستندات المرافقة</h1></th>
            </tr>
            <tr> <td>١-</td> <td class="rightborder">٥-</td> </tr>
            <tr> <td>٢-</td> <td class="rightborder">٦-</td> </tr>
            <tr> <td>٣-</td> <td class="rightborder">٧-</td> </tr>
            <tr> <td>٤-</td> <td class="rightborder">٨-</td> </tr>
        </table>
    </v-layout><br>

    <!-- section 9 -->
    <div style="text-align:center; page-break-inside: avoid;">
        <h2>
            التاريخ : <br>
            توقيع المنتسب : <br>
            ختم وتوقيع الرئيس المباشر : <br>
            الاسم : 
        </h2>
    </div>

  </v-container>
</template>

<script>
import fs from 'fs'
import path from 'path'
import { remote } from 'electron'

export default{
  data () {
    return {
      doc: ''
    }
  },

  created () {
    // get data from data.json
    fs.readFile(path.join(remote.app.getPath('documents')) + '/data.json', 'utf8', (err, data) => {
      if (err) throw err
      this.doc = JSON.parse(data)
      console.log(this.doc)
    })
  },

  methods: {
    GetDate (date, index) {
      const d = date.split('/')
      return d[index]
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
