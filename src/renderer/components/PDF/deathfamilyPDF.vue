<template>
  <v-container fluid style="width: 21cm; height: 29cm;">
    
    <!-- section 1 -->
    <v-layout row justify-space-between class="mt-1">
      <div dir="rtl">
        <h1>الجمهورية اللبنانية</h1>
        <h3>صندوق تعاضد</h3>
      </div>
        <div dir="rtl" style="text-align: center;border: 2px solid black;" class="px-4 py-3">
          <h4>نموذج رقم<br>(٨)<br>وفاة</h4>
        </div>
    </v-layout>

    <!-- section 2 -->
    <v-layout column class="mt-1">
      <v-flex xs6 offset-xs-3>
        <div style="text-align:center;">
          <h1 style="font-size: 30px;">طلب مساعدة بسبب وفاة أحد أفراد عائلة المنتسب أو ذوي عهدته</h1>
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

    <!-- section 5 --> <!-- <i class="material-icons icons">check_box</i> --> <!-- <i class="material-icons icons">check_box</i></bdi> -->
    <div style="text-align:center; margin-top: 10px;">
      <h1 style="font-size: 25px;">{{ getGender(1) }}</h1>
    </div>
    <v-layout column class="mt-1 fontsize" style="page-break-inside: avoid;">
      <table style="width: 100%;" dir="rtl" class="mb-2" 
          v-for="partner in doc.partners" :key="partner.name">

        <tr v-if="checkWork(partner) === 'متعاقد'">
          <td>
           - {{ getGender(2) }} : <b>{{ partner.name }}</b> &nbsp;&nbsp;-&nbsp;&nbsp; 
            <b>متعاقد </b>&nbsp;&nbsp;-&nbsp;&nbsp;
            يعمل في : <b>{{ partner.workSector }}</b>
          </td>
          <td v-if="checkWork(partner) === 'متعاقد' && !checkWorkSector(partner, 'قطاع خاص')">
           - رقم الانتساب للتعاونيّة أو للضمان الاجتماعي : <b>{{ ConvertToArabicNum(partner.insuranceNum) }} </b>
          </td>
        </tr>

        <tr v-else-if="checkWork(partner) === 'لا يعمل'">
          <td>
           - {{ getGender(2) }} : <b>{{ partner.name }}</b> &nbsp;&nbsp;-&nbsp;&nbsp; 
            <b>لا يعمل</b>
          </td>
          <td v-if="checkWork(partner) === 'متعاقد' && !checkWorkSector(partner, 'قطاع خاص')">
           - رقم الانتساب للتعاونيّة أو للضمان الاجتماعي : <b>{{ ConvertToArabicNum(partner.insuranceNum) }} </b>
          </td>
        </tr>

        <tr v-if="partner.externalHelp === '1'">
          <td colspan="2">
           - المساعدة من مصادر أخرى : <b>{{ partner.externalHelpSource }}</b> &nbsp;&nbsp;-&nbsp;&nbsp; 
            قيمتها : <b>{{ ConvertToArabicNum(partner.externalHelpMoney) }} ل.ل</b>
          </td>
        </tr>
      </table>
    </v-layout>

    <!-- section 6 -->
    <v-layout column class="mt-1 fontsize" style="page-break-inside: avoid;">
      <table style="width: 100%;" dir="rtl">
        <tr>
          <td colspan="2">
            - أرجو إعطائي منحة وفاة عن  <b>{{ doc.relative }}</b> ، المنصوص عنها في المادة ١٢ من المرسوم رقم ٨٦٨١ من نظام المنافع والخدمات التي يقدمها الصندوق.
          </td>
        </tr>
        <tr>
          <td colspan="2">
            - إني أصرّح على مسؤوليّتي بأني <b>{{ checkPapers() }}</b> أنا أو {{ getGender(3) }} منحة ولادة من أي مصدر آخر.
          </td>
        </tr>
        <tr v-if="checkPapers() === 'أتقاضى'">
          <td colspan="2">
            - قيمة المبلغ المقبوض من المصدر الآخر : <b> {{ ConvertToArabicNumMoney(doc.money) }} ل.ل </b> &nbsp;-&nbsp; في تاريخ : {{ ConvertToArabicDate(doc.date) }}
          </td>
        </tr>
        <tr>
          <td colspan="2" style="text-align: left; padding-bottom: 40px; padding-left: 100px;">
             توقيع <b>طالب المنحة</b>
          </td>
        </tr>
      </table>
    </v-layout>

    <!-- section 7 -->
   <v-layout column class="mt-1 fontsize" style="page-break-inside: avoid;">
     <table style="width: 100%;" dir="rtl" class="mb-2">
       <tr>
         <td colspan="2">
            - يحال لجانب ادارة صندوق التعاضد مع الافادة بما يلي : 
         </td>
       </tr>
       <tr>
         <td>
           - إن الراتب الأساسي الشهري للأستاذ : 
         </td>
         <td>
           <div style="width: 450px;height: 30px; border: 1px solid black;">
            <p style="text-align: left;">ل.ل &nbsp;</p>
          </div>
         </td>
       </tr>
       <tr>
         <td>
           - تاريخ حصول الوفاة : {{ ConvertToArabicDate(doc.deathdate) }}
         </td>
         <td style="text-align: center;">
           التاريخ : {{ ConvertToArabicDate(GetDateToday(date)) }}
         </td>
       </tr>
       <tr>
         <td style="padding-bottom: 45px;">
           - <b> الإسم : </b>
         </td>
         <td style="text-align: center; padding-bottom: 45px;">
           توقيع <b>الرئيس المباشر </b>
         </td>
       </tr>
     </table>
    </v-layout>

    <!-- section 8 -->
    <v-layout column class="mt-1 fontsize" style="page-break-inside: avoid;">
      <div style="margin-right: 25px;">
        <u><b>المستندات المطلوبة : </b></u>
        <ul>
          <li>وثيقة وفاة ، إخراج قيد عائلي جديد غیره من المستندات عند الاقتضاء.</li>
          <li>مستند عدم استفادة عن الزوج (الزوجة) من المرجع المسؤول عن عمله.</li>
          <li>مستند عن قيمة المبلغ المقبوض من المرجع الآخر.</li>
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

    getGender (flag) {
      if (flag === 1) {
        return this.doc.gender === 'ذكر' ? 'إفادة بعمل الزّوجة' : 'إفادة بعمل الزّوج'
      } else if (flag === 2) {
        return this.doc.gender === 'ذكر' ? 'إن الزّوجة' : 'إن الزّوج'
      }
      return this.doc.gender === 'ذكر' ? 'زوجتي' : 'زوجي'
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

    ConvertToArabicNumMoney (nn) {
      if (!nn) {
        return ''
      }
      var n = nn.split('')
      var ar = ''
      var arnum = ['٠', '١', '٢', '٣', '٤', '٥', '٦', '٧', '٨', '٩']
      n.forEach(element => {
        if (element === ',') {
          ar += '،'
        } else {
          ar += arnum[element]
        }
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
    height: 28px;
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
