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
          <h1>تعهد من المنتسب حول ذوي عهدته</h1>
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
              <span class="title">{{ ConvertToArabicNum(doc.phone) }}</span>
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

      <!-- family Data -->
      <v-card class="mt-4">
        <v-card-title>
          <h1>معلومات تتعلق بذوي العهدة</h1>
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
                      <v-layout wrap justify-center>
                        <v-flex xs12 sm6>
                          <v-select
                            :items="family"
                            item-text="name"
                            label="الاسم والشهرة"
                            return-object
                            @change="updateEditedItem"
                            v-model="selected"
                          ></v-select>
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
              :items="data"
              hide-actions
              class="elevation-1"
            >
              <template slot="items" slot-scope="props">
                <td class="text-xs-center">{{ props.item.name }}</td>
                <td class="text-xs-center">{{ ConvertToArabicDate(props.item.birthDate) }}</td>
                <td class="text-xs-center">{{ props.item.rangeOfAcquaintance }}</td>
                <td class="text-xs-center">{{ props.item.address }}</td>
                <td class="text-xs-center">
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
      dialog: false,
      headers: [
        { text: 'الاسم والشهرة', sortable: false, align: 'center', class: 'font-weight-bold' },
        { text: 'تاريخ الولادة', sortable: false, align: 'center', class: 'font-weight-bold' },
        { text: 'صلة القرابة', sortable: false, align: 'center', class: 'font-weight-bold' },
        { text: 'عنوان السكن', sortable: false, align: 'center', class: 'font-weight-bold' },
        { text: 'خيارات', sortable: false, align: 'center', class: 'font-weight-bold' }
      ],
      family: [],
      editedIndex: -1,
      editedItem: {
        name: '',
        birthDate: null,
        rangeOfAcquaintance: '',
        address: '',
        modal: false
      },
      defaultItem: {
        name: '',
        birthDate: null,
        rangeOfAcquaintance: '',
        address: '',
        modal: false
      },
      selected: null,
      data: []
    }
  },
  created () {
    this.loading = true
    this.$db.findOne({_id: this.id}, (err, doc) => {
      if (err) {
        console.log(err.message)
        return
      }

      this.doc = doc

      // doc.partners.forEach(partner => {
      //   this.family.push({
      //     name: partner.name,
      //     birthDate: partner.birthDate,
      //     rangeOfAcquaintance: 'زوجته / زوجها',
      //     address: doc.address
      //   })
      // })

      // doc.children.forEach(child => {
      //   this.family.push({
      //     name: child.name,
      //     birthDate: child.birthDate,
      //     rangeOfAcquaintance: 'ابنه / ابنته',
      //     address: doc.address
      //   })
      // })

      doc.family.forEach(member => {
        this.family.push({
          name: member.name,
          birthDate: member.birthDate,
          rangeOfAcquaintance: member.type,
          address: member.address
        })
      })

      this.loading = false
    })
  },
  computed: {
    formTitle () {
      return this.editedIndex === -1 ? 'ادخال خانة جديدة' : 'تعديل خانة'
    }
  },
  methods: {
    updateEditedItem (item) {
      if (item !== null) {
        this.editedItem.name = item.name
        this.editedItem.birthDate = item.birthDate
        this.editedItem.rangeOfAcquaintance = item.rangeOfAcquaintance
        this.editedItem.address = item.address
      }
    },
    deleteItem (item) {
      const index = this.data.indexOf(item)
      confirm('هل انت متاكد من الغاء هذه الخانة؟') && this.data.splice(index, 1)
    },
    close () {
      this.dialog = false
      setTimeout(() => {
        this.editedItem = Object.assign({}, this.defaultItem)
        this.editedIndex = -1
        this.selected = null
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
        Object.assign(this.data[this.editedIndex], this.editedItem)
      } else {
        this.data.push(this.editedItem)
      }
      this.close()
    },
    goBack () {
      if (confirm('هل انت متاكد من الخروج من هذه الصفحة ؟')) {
        this.$router.push('/')
      }
    },
    saveToJsonCheck () {
      if (confirm('هل انت متاكد من حفظ هذه المعلومات ؟')) {
        this.saveToJson()
      }
    },
    saveToJson () {
      this.loading = true
      const data = {
        number: this.doc.number,
        name: this.doc.name,
        type: 'ذوي_عهدته',
        phone: this.doc.phone,
        faculty: this.doc.faculty,
        facultySection: this.doc.facultySection,
        address: this.doc.address,
        family: this.data
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
          this.$router.push('/PDFfamily')
        }
      )
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



