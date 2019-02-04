<template>
  <v-container fluid>

    <!-- section 1 -->
    <v-layout row justify-space-between class="mt-2">
        <div dir="rtl" style="text-align: center;border: 2px solid black;" class="px-4 py-3">
          <h4>نموذج رقم<br>(9)<br>مرضية</h4>
        </div>
        <div dir="rtl">
          <h1>الجمهورية اللبنانية</h1>
          <h3>صندوق تعاضد افراد الهيئة</h3>
          <h3>التعليميّة في الجامعة اللبنانية</h3>
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
      <div>
        <table dir="rtl">
          <tr>
            <th style="height: 35px;width: 200px; text-align: right; padding: 5px;">رقم الانتساب</th>
          </tr>
          <tr style=" border: 2px solid black;">
            <td style="height: 35px;width: 200px;"></td>
          </tr>
        </table>
      </div>
    </v-layout>

    <!-- section 4 -->
    <v-layout row class="mt-4" style="font-size: 18px;">
      <table style="width: 100%;" dir="rtl">
        <tr>
          <td>اسم المنتسب وشهرته : <bdi>{{ doc.doc_name }}</bdi></td>
          <td>الهاتف : <bdi>{{ doc.phone }}</bdi></td>
        </tr>
        <tr>
          <td>الكلية/المعهد : <bdi>{{ doc.faculty }}</bdi></td>
          <td>الفرع : <bdi>{{ doc.faculty_section }}</bdi></td>
        </tr>
      </table>
    </v-layout>

    <!-- section 5 -->
    <v-layout column class="mt-4" style="font-size: 18px;">
      <v-flex xs6 offset-xs-3 class="mb-4">
        <div style="text-align:center;">
          <h1 class="display-1 font-weight-bold"> <bdi>(ة)</bdi>افادة بعمل الزوج </h1>
        </div>
      </v-flex>
      <table
        style="width: 100%;"
        dir="rtl"
        v-for="(person, i) in doc.wifes_or_husbands"
        :key="i"
        class="mb-3"
      >
        <tr>
          <td>ان زوجي : <bdi>{{ person.name }}</bdi></td>
          <td>
            متقاعد <input type="checkbox">&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
            لا يعمل <input type="checkbox">&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
            يعمل في : <bdi>{{ person.work }}</bdi>
          </td>
        </tr>
        <tr>
          <td>
            ادارة عامة <input type="checkbox">&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
            مؤسّسة عامة <input type="checkbox">&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
            بلدية <input type="checkbox">
          </td>
          <td>رقم الانتساب للتعاونيّة : <bdi v-if="person.insurance_type === 1">{{ person.insurance_num }}</bdi></td>
        </tr>
        <tr>
          <td></td>
          <td>او<br>للضمان الاجتماعي : <bdi v-if="person.insurance_type === 2">{{ person.insurance_num }}</bdi></td>
        </tr>
        <tr>
          <td colspan="2">قطاع خاص <input type="checkbox"></td>
        </tr>
        <tr>
          <td>المساعدة من مصادر اخرى : <bdi>{{ person.helpSource }}</bdi></td>
          <td>قيمتها : <bdi>{{ person.helpValue }}</bdi></td>
        </tr>
      </table>
    </v-layout>

    <!-- section 6 -->
    <v-layout row class="mt-4" style="font-size: 18px;">
      <table class="t" dir="rtl">
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
        <tr v-for="(row, i) in rows" :key="i" @contextmenu="showMenu($event, i)">
          <td>
            <select @change="updateRow($event, i)" v-model="row.selectValue">
              <option
                v-for="child in children"
                :key="child.id"
                :value="child.id"
              >{{ child.name }}</option>
            </select>
          </td>
          <td>{{ row.day }}</td>
          <td>{{ row.month }}</td>
          <td>{{ row.year }}</td>
          <td>{{ row.range }}</td>
          <td>{{ row.start }}</td>
          <td>{{ row.end }}</td>
        </tr>
      </table>
    </v-layout>

    <!-- table context menu -->
    <v-menu
      v-model="menu.show"
      :position-x="menu.x"
      :position-y="menu.y"
      absolute
      offset-y
    >
      <v-list>
        <v-list-tile
          v-for="(item, index) in menu.items"
          :key="index"
          @click="item.action"
        >
          <v-list-tile-title>{{ item.title }}</v-list-tile-title>
        </v-list-tile>
      </v-list>
    </v-menu>

  </v-container>
</template>

<script>
export default {
  data () {
    return {
      doc: {
        id: '',
        doc_name: 'فلان بن فلان الفولاني',
        faculty: 'الجامعة اللبنانية - كلية العلوم',
        faculty_section: 'الفرع الاول - الحدث',
        phone: '## - ### ###',
        wifes_or_husbands: [
          {
            id: 1,
            name: 'فلانة زوجة فلان بن فلان الفولاني',
            work: 'مكان ما في هذه الارض', // = 1 (متقاعد) or 2 (لا يعمل) or string (يعمل في)
            work_category: 0, // = 1 (ادارة عامة) or 2 (مؤسّسة عامة) or 3 (بلدية) or 4 (قطاع خاص - no insurance here)
            insurance_num: '435298545547455317865',
            insurance_type: 1, // = 1 (رقم الانتساب للتعاونيّة) or 2 (للضمان الاجتماعي)
            helpSource: 'مصدر من مصادر هذه الارض',
            helpValue: '$10,000'
          },
          {
            id: 2,
            name: 'فلانة زوجة فلان بن فلان الفولاني',
            work: 'مكان ما في هذه الارض', // = 1 (متقاعد) or 2 (لا يعمل) or string (يعمل في)
            work_category: 0, // = 1 (ادارة عامة) or 2 (مؤسّسة عامة) or 3 (بلدية) or 4 (قطاع خاص - no insurance here)
            insurance_num: '435298545547455317865',
            insurance_type: 1, // = 1 (رقم الانتساب للتعاونيّة) or 2 (للضمان الاجتماعي)
            helpSource: 'مصدر من مصادر هذه الارض',
            helpValue: '$10,000'
          }
        ],
        children: [
          {
            id: 1,
            name: 'child1',
            birthDate: '2018-9-23',
            rangeOfAcquaintance: 'close',
            medicalStartDate: '2018-9-1',
            medicalEndDate: '2018-9-23'
          },
          {
            id: 2,
            name: 'child2',
            birthDate: '2017-10-24',
            rangeOfAcquaintance: 'close',
            medicalStartDate: '2017-9-1',
            medicalEndDate: '2017-9-23'
          }
        ]
      },
      rows: [
        {
          day: '',
          month: '',
          year: '',
          range: '',
          start: '',
          end: '',
          selectValue: 0
        }
      ],
      menu: {
        show: false,
        x: 0,
        y: 0,
        items: [
          { title: 'add row', action: this.insertRow },
          { title: 'remove row', action: this.removeRow }
        ]
      },
      selectedRow: -1,
      children: []
    }
  },
  created () {
    // get data from db
    this.children = this.doc.children
    this.children.unshift({
      id: 0,
      name: 'Select an option',
      birthDate: '',
      rangeOfAcquaintance: '',
      medicalStartDate: '',
      medicalEndDate: ''
    })
  },
  methods: {
    updateRow (event, rowNum) {
      if (event.target.value === 'none') {
        return
      }

      let childData = this.children.find(child => child.id + '' === event.target.value)
      let data = childData.birthDate.split('-')
      let selectedRow = this.rows[rowNum]
      selectedRow.day = data[2]
      selectedRow.month = data[1]
      selectedRow.year = data[0]
      selectedRow.range = childData.rangeOfAcquaintance
      selectedRow.start = childData.medicalStartDate
      selectedRow.end = childData.medicalEndDate
      selectedRow.selectValue = event.target.value
    },
    showMenu (e, i) {
      this.selectedRow = i
      e.preventDefault()
      this.menu.show = false
      this.menu.x = e.clientX
      this.menu.y = e.clientY
      this.$nextTick(() => {
        this.menu.show = true
      })
    },
    insertRow () {
      let rowTemplate = {
        day: '',
        month: '',
        year: '',
        range: '',
        start: '',
        end: '',
        selectValue: 0
      }

      this.rows.push(rowTemplate)
    },
    removeRow () {
      if (this.selectedRow >= 0) {
        this.rows.splice(this.selectedRow, 1)
        if (this.rows.length === 0) {
          this.insertRow()
        }
      }
    }
  }
}
</script>

<style scoped>

  table {
    border-collapse: collapse;
  }

  td {
    padding: 5px;
  }

  tr td:first-child {
    padding: 5px 20px 5px 5px;
  }

  table tr{
    border-right: 2px solid black;
    border-left: 2px solid black;
  }

  table tr:first-child {
    border: 2px solid black;
    border-bottom: none;
  }

  table tr:last-child {
    border: 2px solid black;
    border-top: none;
  }

  .t {
    border: 2px solid black;
    width: 100%;
    text-align: center;
  }

  .t td, .t th {
    border: 2px solid black;
    height: 35px;
    padding: 5px;
  }

  select {
    width: 100%;
    outline: none;
  }

</style>
