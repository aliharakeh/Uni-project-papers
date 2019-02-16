<template>
  <v-container fluid style="width: 21cm; height: 29cm;">
    
    <!-- section 1 -->
    <v-layout row justify-space-between class="mt-2">
      <div dir="rtl">
        <h1>الجمهورية اللبنانية</h1>
        <h3>صندوق تعاضد أفراد الهيئة</h3>
        <h3>التعليميّة في الجامعة اللبنانية</h3>
      </div>
        <div dir="rtl" style="text-align: center;border: 2px solid black;" class="px-4 py-3">
          <h4>نموذج رقم<br>(٤)<br>تعليم</h4>
        </div>
    </v-layout>

    <!-- section 2 -->
    <v-layout column class="mt-2">
      <v-flex xs6 offset-xs-3>
        <div style="text-align:center;">
          <h1 style="font-size: 29px;">طلب منحة تعليم</h1>
          <h1 style="font-size: 29px;">عن العام الدراسي &nbsp;&nbsp;&nbsp; ٢٠ - &nbsp;&nbsp;&nbsp; ٢٠</h1>
        </div>
      </v-flex>
    </v-layout>

    <!-- section 3 -->
    <v-layout row justify-space-between class="mt-2 fontsize">
      <div>
        <table dir="rtl">
          <tr>
            <th style="text-align: center; padding: 2px;">رقم الانتساب</th>
          </tr>
          <tr style=" border: 2px solid black;">
            <td style="width: 200px; text-align: center">{{ ConvertToArabicNum(doc.number) }}</td>
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
		<div style="text-align:center; margin-top: 10px;">
			<h1 style="font-size: 25px;">أسماء الأولاد المستفيدين </h1>
		</div>
    <v-layout row class="mt-2 fontsize" style="page-break-inside: avoid;">
      <table class="t" dir="rtl">
        <tr>
          <th>اسم الولد</th>
          <th>تاريخ الولادة</th>
          <th>اسم المدرسة أو الجامعة</th>
          <th>نوع التعليم</th>
					<th>مرحلة التعليم</th>
					<th>الصف</th>
          <th colspan="2" style="padding: 1px;">
            <table>
              <tr>
                <td colspan="2"> حقل مخصص لإدارة الصندوق </td>
              </tr>
              <tr>
                <td style="width: 120px;">قيمة المنحة المقبوضة من مصادر أخرى</td>
                <td style="width: 120px;">قيمة المنحة المستحقة</td>
              </tr>
            </table>
          </th>
			  </tr>
        <tr v-for="childrenData in doc.childrenData" :key="childrenData.name">
          <td>{{ childrenData.name }}</td>
          <td>{{ ConvertToArabicDate(childrenData.birthDate) }}</td>
          <td>{{ childrenData.educationPlace }}</td>
          <td>{{ childrenData.educationType }}</td>
          <td>{{ childrenData.educationLevel }}</td>
					<td>{{ childrenData.class }}</td>
					<td></td><td></td>
        </tr>
      </table>
    </v-layout>

    <!-- section 6 --> <!-- <i class="material-icons icons">check_box</i> --> <!-- <i class="material-icons icons">check_box</i></bdi> -->
    <div style="text-align:center; margin-top: 10px;">
      <h1 style="font-size: 25px;">{{ getGender(1) }}</h1>
    </div>
    <v-layout column class="mt-2 fontsize" style="page-break-inside: avoid;">
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

		<!-- section 7 -->
		<v-layout column class="mt-2 fontsize" style="margin-bottom: 10px; page-break-inside: avoid;">
			<p>
			-	أصرّح على مسؤوليّتي الشّخصية والقانونية بأن أولادي المذكورة أسماؤهم في هذا الطلب لا يتعاطون أي عمل مأجور ولا زالوا في عهدتي ولا أزال أتقاضى التعويض العائلي عنهم , ولا أستفيد من أية منحة دراسية عنهم من مصادر أخرى في التاريخ : {{ ConvertToArabicDate(GetDateToday(date)) }}
			&nbsp;&nbsp;&nbsp;&nbsp;&nbsp; -	<b>التوقيع : </b>
			</p>
		</v-layout>

		<!-- section 8 -->
    <v-layout row class="mt-2 fontsize" style="page-break-inside: avoid;">
        <table dir="rtl" style="width: 100%;">
					<tr>
						<td style="border: 2px solid black; width: 50%;">
							<u><b>المستندات المرافقة :</b></u><br>
							١- <br>
							٢- <br>
							٣- <br>
							٤- <br>
							٥- <br>
							٦- 
						</td>
						<td>
							<p>
							-	مع التأكيد أن الدكتور : {{ doc.name }} <br>
							-	كان في الخدمة الفعلية خلال العام الدراسي موضوع هذا الطلب. <br>
							-	<b>الرئيس المباشر :</b><br><br>
							-	<b>التوقيع :</b><br><br>
							</p>
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

    checkWorkSector (partner, workSector) {
      if (partner.workSector === workSector) {
        return 1
      }
      return 0
    },

    getGender (flag) {
      if (flag === 1) {
        return this.doc.gender === 'ذكر' ? 'إفادة بعمل الزّوجة' : 'إفادة بعمل الزّوج'
      }
      return this.doc.gender === 'ذكر' ? 'إن الزّوجة' : 'إن الزّوج'
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
    height: 25px;
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
