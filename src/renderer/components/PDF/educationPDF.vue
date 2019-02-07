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
          <h4>نموذج رقم<br>(٤)<br>تعليم</h4>
        </div>
    </v-layout>

    <!-- section 2 -->
    <v-layout column class="mt-4">
      <v-flex xs6 offset-xs-3>
        <div style="text-align:center;">
          <h1 class="display-1 font-weight-bold">طلب منحة تعليم</h1>
          <h1 class="display-1 font-weight-bold">عن العام الدراسي &nbsp;&nbsp;&nbsp; ٢٠ - &nbsp;&nbsp;&nbsp; ٢٠</h1>
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
			<h1 class="display-1 font-weight-bold">أسماء الأولاد المستفيدين</h1>
		</div>
    <v-layout row class="mt-4" style="font-size: 20px; page-break-inside: avoid;">
      <table class="t" dir="rtl">
        <tr>
          <th>اسم الولد</th>
          <th colspan="3">
            <bdi>تاريخ الولادة</bdi>
            <v-layout row justify-space-around>
              <bdi>اليوم</bdi>
              <bdi>الشهر</bdi>
              <bdi>السنة</bdi>
            </v-layout>
          </th>
          <th>اسم المدرسة أو الجامعة</th>
          <th>نوع التعليم</th>
					<th>مرحلة التعليم</th>
					<th>الصف</th>
					<th>قيمة المنحة المقبوضة من مصادر أخرى</th>
					<th>قيمة المنحة المستحقة</th>
        </tr>
        <tr v-for="childrenData in doc.childrenData" :key="childrenData.name">
          <td>{{ childrenData.name }}</td>
          <td style="width: 60px;">{{ GetDate(ConvertToArabicDate(childrenData.birthDate), 2) }}</td>
          <td style="width: 60px;">{{ GetDate(ConvertToArabicDate(childrenData.birthDate), 1) }}</td>
          <td style="width: 60px;">{{ GetDate(ConvertToArabicDate(childrenData.birthDate), 0) }}</td>
          <td>{{ childrenData.educationPlace }}</td>
          <td>{{ childrenData.educationType }}</td>
          <td>{{ childrenData.educationLevel }}</td>
					<td>{{ childrenData.class }}</td>
					<td>{{ ConvertToArabicNum(childrenData.outsideCertificateMoney) }} ل.ل</td>
					<td>{{ ConvertToArabicNum(childrenData.allowedCertificateMoney) }} ل.ل</td>
        </tr>
      </table>
    </v-layout>

    <!-- section 6 --> <!-- <i class="material-icons icons">check_box</i> --> <!-- <i class="material-icons icons">check_box</i></bdi> -->
    <div style="text-align:center; margin-top: 15px;">
      <h1 class="display-1 font-weight-bold">افادة بعمل الزوج (ة) </h1>
    </div>
    <v-layout column class="mt-4" style="font-size: 20px; page-break-inside: avoid;">
      <table style="width: 100%;" dir="rtl" class="mb-3" 
          v-for="partner in doc.partners" :key="partner.name">

        <tr v-if="checkWork(partner) === 'متعاقد'">
          <td style=" text-align: center;">
            ان الزوج (ة) : <b>{{ partner.name }}</b> &nbsp;&nbsp;-&nbsp;&nbsp; 
            <b>متعاقد </b>&nbsp;&nbsp;-&nbsp;&nbsp;
            يعمل في : <b>{{ partner.workSector }}</b>
          </td>
        </tr>
        <tr v-else-if="checkWork(partner) === 'لا يعمل'">
          <td style=" text-align: center;">
            ان الزوج (ة) : <b>{{ partner.name }}</b> &nbsp;&nbsp;-&nbsp;&nbsp; 
            <b>لا يعمل</b>
          </td>
        </tr>
        <tr v-if="checkWork(partner) === 'متعاقد' && !checkWorkSector(partner, 'قطاع خاص')">
          <td style=" text-align: center;">
            رقم الانتساب للتعاونيّة أو للضمان الاجتماعي : <b>{{ ConvertToArabicNum(partner.insuranceNum) }} </b>
          </td>
        </tr>
        <tr v-if="partner.externalHelp === '1'">
          <td style=" text-align: center;">
            المساعدة من مصادر أخرى : <b>{{ partner.externalHelpSource }}</b> &nbsp;&nbsp;-&nbsp;&nbsp; 
            قيمتها : <b>{{ ConvertToArabicNum(partner.externalHelpMoney) }} ل.ل</b>
          </td>
        </tr>
        <tr v-if="partner.prevOrOutsidePaper === '1'">
            <td style="text-align: center;">
                تقاضى (ت) الزوج (ة) مساعدة أو منحة تعليم عن أولاده أو عن أحدهم المذكور أسماؤهم أعلاه , قيمتها : <b>{{ ConvertToArabicNum(partner.money) }} ل.ل </b>
            </td>
        </tr>
        <tr v-else>
            <td style="text-align: center;">
                لم يتقاضى (ت) الزوج (ة) مساعدة أو منحة تعليم عن أولاده أو عن أحدهم المذكور أسماؤهم أعلاه.
            </td>
        </tr>
      </table>
    </v-layout>

		<!-- section 7 -->
		<v-layout column class="mt-4" style="font-size: 20px; margin-bottom: 50px; page-break-inside: avoid;">
			<p>
				أصرّح على مسؤوليّتي الشّخصية والقانونية بأن أولادي المذكورة أسماؤهم في هذا الطلب لا يتعاطون أي عمل مأجور ولا زالوا في عهدتي ولا أزال أتقاضى التعويض العائلي عنهم , ولا أستفيد من أية منحة دراسية عنهم من مصادر أخرى. <br>
				التاريخ : {{ ConvertToArabicDate(GetDateToday(date)) }} <br><br>
				<b>التوقيع : </b>
			</p>
		</v-layout>

		<!-- section 8 -->
    <v-layout row class="mt-4" style="font-size: 20px; page-break-inside: avoid;">
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
							<p style="padding: 5px;">
								مع التأكيد أن الدكتور : {{ doc.name }} <br>
								كان في الخدمة الفعلية خلال العام الدراسي موضوع هذا الطلب <br>
								<b>الرئيس المباشر</b><br><br>
								<b>التوقيع :</b><br><br>
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
