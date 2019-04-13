<template>
  <v-container>

    <!-- loading while getting data -->
    <v-layout row v-if="loading" class="mt-5">
        <v-flex xs12 class="text-xs-center">
            <v-progress-circular indeterminate :size="70" :width="7" color="primary"></v-progress-circular>
        </v-flex>
    </v-layout>

    <!-- Content -->
    <div v-else>

      <!-- title -->
      <v-layout row wrap class="mb-2">
        <v-flex xs12 class="text-xs-center">
          <h1>طلب منحة تعليم</h1>
        </v-flex>
      </v-layout>

      <!-- Doctor Info -->
      <v-card>
        <v-card-title>
          <h1>معلومات عن الاستاذ</h1>
        </v-card-title>
        <v-divider></v-divider>
        <v-card-text>
          <v-layout row wrap>
            <v-flex xs12 sm5>
              <span class="headline font-weight-bold">الاسم الثلاثي : </span>
              <span class="title">{{ doc.name }}</span>
            </v-flex>
            <v-flex xs12 sm5>
              <span class="headline font-weight-bold">الهاتف : </span>
              <span class="title">{{ ConvertToArabicNum(doc.phone, -1) }}</span>
            </v-flex>
            <v-flex xs12 sm5>
              <span class="headline font-weight-bold">الكلية / المعهد : </span>
              <span class="title">{{ doc.faculty }}</span>
            </v-flex>
            <v-flex xs12 sm5>
              <span class="headline font-weight-bold">الفرع : </span>
              <span class="title">{{ doc.facultySection }}</span>
            </v-flex>
          </v-layout>
        </v-card-text>
      </v-card>

      <!-- Partners Work -->
      <v-card class="mt-4">
        <v-card-title>
          <h1>{{ getGender() }}</h1>
        </v-card-title>
        <v-divider></v-divider>
        <v-card-text>
          <v-layout row wrap v-for="(person, i) in partners" :key="i">
            <v-flex xs12 sm5>
              <span class="headline font-weight-bold">- الاسم : </span>
              <span class="title">{{ person.name }}</span>
            </v-flex>
            <v-flex xs12 sm5>
              <span class="headline font-weight-bold">قطاع العمل : </span>
              <span class="title">{{ workPlace(person) }}</span>
            </v-flex>
            <v-flex xs12 sm5 v-if="person.insuranceNumSection">
              <span class="headline font-weight-bold">رقم الضمان : </span>
              <span class="title">{{ ConvertToArabicNum(person.insuranceNum, -1) }}</span>
            </v-flex>
            <v-flex xs12 class="mt-4">
              <h2>هل تم تقاضي هذه المنحة سابقا او من اي مصدر اخر؟</h2>
              <h1>
                <v-radio-group v-model="person.prevOrOutsidePaper">
                  <v-radio label="نعم" value='1'></v-radio>
                  <v-radio label="لا" value='0'></v-radio>
                </v-radio-group>
              </h1>
            </v-flex>
            <v-flex xs12 sm5 v-if="person.prevOrOutsidePaper === '1'" class="ml-4">
              <v-text-field label="قيمة المبلغ المقبوض من المصدر الاخر" type="text" @input="person.money = $event.replace(/\D/g, '').replace(/\B(?=(\d{3})+(?!\d))/g, ',')" @change="ConvertToArabicNum($event, i)" v-model="person.money"></v-text-field>
            </v-flex>
          </v-layout>
        </v-card-text>
      </v-card>

      <!-- children data -->
      <v-card class="mt-4">
        <v-card-title>
          <h1>اسماء الاولاد المستفيدين</h1>
        </v-card-title>
        <v-divider></v-divider>
        <v-card-text>
          <div>
            <v-toolbar flat color="white">
              <v-dialog v-model="dialog" max-width="500px">
                <v-btn slot="activator" color="primary" dark class="mb-2">ادخال معلومات</v-btn>
                <v-card>
                  <v-card-title>
                    <span class="headline">{{ formTitle }}</span>
                  </v-card-title>

                  <v-card-text>
                    <v-container grid-list-md>
                      <v-layout wrap>
                        <v-flex xs12 sm6>
                          <v-select
                            :items="doc.children"
                            item-text="name"
                            label="اسم الولد"
                            return-object
                            @change="updateEditedItem"
                            v-model="selectedChild"
                          ></v-select>
                        </v-flex>
                        <v-flex xs12 sm6>
                          <v-text-field v-model="editedItem.educationPlace" label="اسم المدرسة او الجامعة"></v-text-field>
                        </v-flex>
                        <v-flex xs12 sm6>
                          <v-select
                            :items="types"
                            label="نوع التعليم"
                            @change="updateEditedItem1($event)"
                            v-model="selectedEducationType"
                          ></v-select>
                        </v-flex>
                        <v-flex xs12 sm6>
                          <v-select
                            :items="levels"
                            label="مرحلة التعليم"
                            @change="updateEditedItem2($event)"
                            v-model="selectedEducationLevel"
                          ></v-select>
                        </v-flex>
                        <v-flex xs12 sm6>
                          <v-text-field v-model="editedItem.class" label="الصف"></v-text-field>
                        </v-flex>
                      </v-layout>
                    </v-container>
                  </v-card-text>

                  <v-card-actions>
                    <v-spacer></v-spacer>
                    <v-btn color="error" @click.native="close" class="mx-2">الغاء</v-btn>
                    <v-btn color="primary" @click.native="save">حفظ</v-btn>
                  </v-card-actions>
                </v-card>
              </v-dialog>
            </v-toolbar>
            <v-data-table
              :headers="headers"
              :items="childrenData"
              hide-actions
              class="elevation-1"
            >
              <template slot="items" slot-scope="props">
                <td class="text-xs-center">{{ props.item.name }}</td>
                <td class="text-xs-center">{{ ConvertToArabicDate(props.item.birthDate) }}</td>
                <td class="text-xs-center">{{ props.item.educationPlace }}</td>
                <td class="text-xs-center">{{ props.item.educationType }}</td>
                <td class="text-xs-center">{{ props.item.educationLevel}}</td>
                <td class="text-xs-center">{{ props.item.class}}</td>
                <td class="text-xs-center">
                  <v-btn icon class="ml-2" @click="editItem(props.item)">
                    <v-icon color="info">edit</v-icon>
                  </v-btn>
                  <v-btn icon @click="deleteItem(props.item)">
                    <v-icon color="error">delete</v-icon>
                  </v-btn>
                </td>
              </template>
              <template slot="no-data">
                <h1>لا يوجد معلومات بعد</h1>
              </template>
            </v-data-table>
          </div>
        </v-card-text>
      </v-card>

      <v-layout row justify-center align-center class="mt-2">
        <v-btn color="primary" @click="saveToJsonCheck">حفظ</v-btn>
        <v-btn color="error" @click="goBack">الغاء</v-btn>
      </v-layout>

    </div>

  </v-container>
</template>

<script>
import fs from 'fs'
import path from 'path'
import { remote } from 'electron'

export default {
  props: ['id'],
  data () {
    return {
      loading: false,
      doc: null,
      partners: null,
      dialog: false,
      headers: [
        { text: 'اسم الولد', sortable: false, align: 'center', class: 'font-weight-bold' },
        { text: 'تاريخ الولادة', sortable: false, align: 'center', class: 'font-weight-bold' },
        { text: 'اسم المدرسة او الجامعة', sortable: false, align: 'center', class: 'font-weight-bold' },
        { text: 'نوع التعليم', sortable: false, align: 'center', class: 'font-weight-bold' },
        { text: 'مرحلة التعليم', sortable: false, align: 'center', class: 'font-weight-bold' },
        { text: 'الصف', sortable: false, align: 'center', class: 'font-weight-bold' },
        { text: 'خيارات', sortable: false, align: 'center', class: 'font-weight-bold' }
      ],
      types: ['خاص مجاني', 'خاص غير مجاني', 'رسمي'],
      levels: ['روضة', 'ابتدائي', 'متوسط', 'ثانوي', 'جامعي', 'مهني'],
      editedIndex: -1,
      editedItem: {
        name: '',
        birthDate: '',
        educationPlace: '',
        educationType: '',
        educationLevel: '',
        class: ''
      },
      defaultItem: {
        name: '',
        birthDate: '',
        educationPlace: '',
        educationType: '',
        educationLevel: '',
        class: ''
      },
      childrenData: [],
      selectedChild: null,
      selectedEducationType: null,
      selectedEducationLevel: null
    }
  },
  created () {
    this.loading = true
    var pp = this.$route.path
    var p = pp.split('/')
    console.log(pp)

    if (p[3] === '-1') { // get data from data.json
      fs.readFile(path.join(remote.app.getPath('documents')) + '/data.json', 'utf8', (err, data) => {
        if (err) throw err

        this.doc = JSON.parse(data)
        this.$db.findOne({_id: this.id}, (err, data1) => {
          if (err) {
            console.log(err.message)
            return
          }
          this.doc.children = data1.children
          this.childrenData = this.doc.childrenData
          this.partners = this.doc.partners
        })
        this.loading = false
      })
    } else {
      this.$db.findOne({_id: this.id}, (err, doc) => {
        if (err) {
          console.log(err.message)
          return
        }
        this.doc = doc
        this.partners = doc.partners
        this.partners.forEach(partner => {
          this.$set(partner, 'money', null)
          this.$set(partner, 'prevOrOutsidePaper', null)
        })
        this.loading = false
      })
    }
  },
  computed: {
    formTitle () {
      return this.editedIndex === -1 ? 'ادخال خانة جديدة' : 'تعديل خانة'
    }
  },
  watch: {
    dialog (val) {
      val || this.close()
    }
  },
  methods: {

    getGender () {
      return this.doc.gender === 'ذكر' ? 'معلومات عن الزّوجة' : 'معلومات عن الزّوج'
    },
    workPlace (person) {
      if (person.workSector === '') {
        return 'لا يعمل'
      }
      return person.workSector
    },
    editItem (item) {
      this.editedIndex = this.childrenData.indexOf(item)
      this.editedItem = Object.assign({}, item)
      this.dialog = true

      const childIndex = this.doc.children.findIndex(child => child.name === this.editedItem.name)
      this.selectedChild = this.childrenData[childIndex]
      this.selectedEducationType = this.selectedChild.educationType
      this.selectedEducationLevel = this.selectedChild.educationLevel
    },
    deleteItem (item) {
      const index = this.childrenData.indexOf(item)
      confirm('هل انت متاكد من الغاء هذه الخانة؟') && this.childrenData.splice(index, 1)
    },
    close () {
      this.dialog = false
      setTimeout(() => {
        this.editedItem = Object.assign({}, this.defaultItem)
        this.editedIndex = -1
        this.selectedChild = null
        this.selectedEducationType = null
        this.selectedEducationLevel = null
      }, 300)
    },
    save () {
      var flag = 0
      for (var property in this.editedItem) {
        if (this.editedItem[property] === '' || this.editedItem[property] === null) {
          flag = 1
        }
      }

      if (flag === 1) {
        alert('لم يتم ملئ كل الخانات بعد')
        return
      }

      if (this.editedIndex > -1) {
        Object.assign(this.childrenData[this.editedIndex], this.editedItem)
      } else {
        this.childrenData.push(this.editedItem)
      }
      this.close()
    },
    updateEditedItem (item) {
      if (item !== null) {
        this.editedItem.name = item.name
        this.editedItem.birthDate = item.birthDate
      }
    },
    updateEditedItem1 (val) {
      this.editedItem.educationType = val
    },
    updateEditedItem2 (val) {
      this.editedItem.educationLevel = val
    },
    goBack () {
      if (confirm('هل انت متاكد من الخروج من هذه الصفحة ؟')) {
        this.$router.push('/')
      }
    },
    saveToJsonCheck () {
      if (confirm('هل انت متاكد من حفظ هذه المعلومات ؟')) {
        if (!this.childrenData.length) {
          alert('لم يتم ملئ كل المعلومات بعد')
          return
        }
        for (var i in this.partners) {
          if (this.partners[i].prevOrOutsidePaper === null || (this.partners[i].prevOrOutsidePaper === '1' && this.partners[i].money === null)) {
            alert('لم يتم ملئ كل المعلومات بعد')
            return
          }
        }
        this.saveToJson()
      }
    },
    saveToJson () {
      this.loading = true
      const data = {
        number: this.doc.number,
        name: this.doc.name,
        gender: this.doc.gender,
        type: 'منحة_تعليم',
        phone: this.doc.phone,
        faculty: this.doc.faculty,
        facultySection: this.doc.facultySection,
        address: this.doc.address,
        partners: this.partners,
        childrenData: this.childrenData
      }
      console.log(data)
      fs.writeFile(path.join(remote.app.getPath('documents'), '/data.json'),
        JSON.stringify(data, null, 2),
        'utf-8',
        (err) => {
          this.loading = false
          if (err) {
            console.log(err.message)
            return
          }
          this.$router.push('/PDFeducation')
        }
      )
    },

    ConvertToArabicNum (nn, flag) {
      if (!nn) {
        return ''
      }
      var n = nn.split('')
      var ar = ''
      var ennum = ['0', '1', '2', '3', '4', '5', '6', '7', '8', '9']
      var arnum = ['٠', '١', '٢', '٣', '٤', '٥', '٦', '٧', '٨', '٩']
      n.forEach(element => {
        if (ennum.includes(element)) {
          ar += arnum[element]
        } else if (element === ',') {
          ar += '،'
        } else {
          ar += element
        }
      })
      if (flag !== -1) {
        this.partners[flag].money = ar
        return
      }
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



