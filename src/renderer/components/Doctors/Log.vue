<template>
  <v-container>

    <!-- no content yet - getting/saving data from/into db -->
    <v-layout row v-if="loading" class="mt-5">
        <v-flex xs12 class="text-xs-center">
            <v-progress-circular indeterminate :size="70" :width="7" color="primary"></v-progress-circular>
        </v-flex>
    </v-layout>

    <!-- content is available -->
    <v-card class="mt-4" v-else>
      <v-card-title>
        <v-layout row wrap justify-space-between align-end>
          <v-flex xs4>
            <h1>الارشيف</h1>
          </v-flex>
          <v-flex xs5>
            <v-text-field
              v-model="search"
              append-icon="search"
              label="بحث"
              single-line
              hide-details
            ></v-text-field>
          </v-flex>
        </v-layout>
      </v-card-title>
      <v-divider></v-divider>
      <v-card-text>
        <div>
          <v-toolbar flat color="white">
            <v-dialog v-model="dialog" max-width="500px">
              <v-btn slot="activator" color="primary" dark class="mb-2">ادخال معلومات</v-btn>
              <v-card>
                <v-card-title>
                  <span class="headline"> إدخال المعلومات</span>
                </v-card-title>
                <v-card-text style="padding-top: 0">
                  <v-container grid-list-md style="padding-top: 0">
                    <v-layout wrap>
                      <v-flex xs12 sm6>
                        <v-select
                          :items="selectOptions"
                          label="نوع المعاملة"
                          v-model="editedItem.type"
                        ></v-select>
                      </v-flex>
                      <v-flex xs12 sm6>
                        <v-dialog
                          ref="dialog"
                          v-model="editedItem.modal"
                          :return-value.sync="editedItem.date"
                          persistent
                          lazy
                          full-width
                          width="290px"
                        >
                          <v-text-field
                            slot="activator"
                            v-model="editedItem.date"
                            label="تاريخ المعاملة"
                            prepend-icon="event"
                            readonly
                          ></v-text-field>
                          <v-date-picker v-model="editedItem.date" scrollable locale="ar-lb">
                            <v-spacer></v-spacer>
                            <v-btn flat color="error" @click="editedItem.modal = false">Cancel</v-btn>
                            <v-btn flat color="primary" @click="$refs.dialog.save(editedItem.date)">OK</v-btn>
                          </v-date-picker>
                        </v-dialog>
                      </v-flex>
                      <v-flex xs12 sm6>
                        <v-text-field type="text" v-model="editedItem.num" label="رقم المعاملة"></v-text-field>
                      </v-flex>
                      <v-flex xs12 sm6>
                        <v-text-field type="text" v-model="editedItem.totalValue" label="المبلغ الكلي" @input="editedItem.totalValue = $event.replace(/\D/g, '').replace(/\B(?=(\d{3})+(?!\d))/g, ',')" ></v-text-field>
                      </v-flex>
                      <v-flex xs12 sm6>
                        <v-text-field v-model="editedItem.decision" label="قرار القبض" @input="editedItem.decision = $event.replace(/\D/g, '').replace(/\B(?=(\d{3})+(?!\d))/g, ',')" ></v-text-field>
                      </v-flex>
                      <v-flex xs12 sm6>
                        <v-text-field type="text" v-model="editedItem.returnedValue" label="المبلغ المعوض" @input="editedItem.returnedValue = $event.replace(/\D/g, '').replace(/\B(?=(\d{3})+(?!\d))/g, ',')" ></v-text-field>
                      </v-flex>
                    </v-layout>
                  </v-container>
                </v-card-text>

                <v-card-actions>
                  <v-spacer></v-spacer>
                  <v-btn color="primary" @click.native="save" class="mx-2">حفظ</v-btn>
                  <v-btn color="error" @click.native="close">الغاء</v-btn>
                </v-card-actions>
              </v-card>
            </v-dialog>
          </v-toolbar>
          <v-data-table
            :headers="headers"
            :items="logs"
            :search="search"
            hide-actions
            class="elevation-5"
          >
            <template slot="items" slot-scope="props">
              <td class="text-xs-center">{{ props.item.type }}</td>
              <td class="text-xs-center">{{ ConvertToArabicDate(props.item.date) }}</td>
              <td class="text-xs-center">{{ ConvertToArabicNum(props.item.num) }}</td>
              <td class="text-xs-center">{{ ConvertToArabicNumMoney(props.item.totalValue) }} ل.ل</td>
              <td class="text-xs-center">{{ ConvertToArabicNumMoney(props.item.decision) }} ل.ل</td>
              <td class="text-xs-center">{{ ConvertToArabicNumMoney(props.item.returnedValue) }} ل.ل</td>
              <td class="text-xs-center">
                <v-btn icon @click="editItem(props.item)">
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
            <template slot="no-results">
              <h1>لا يوجد معلومات عن  هذا البحث</h1>
            </template>
          </v-data-table>
        </div>
      </v-card-text>
    </v-card>

  </v-container>
</template>

<script>
export default {
  props: ['id'],
  data () {
    return {
      logs: null,
      defaultLog: {
        type: '',
        date: null,
        num: '',
        totalValue: '',
        decision: '',
        returnedValue: '',
        modal: false
      },
      dialog: false,
      headers: [
        { text: 'نوع المعاملة', value: 'type', sortable: true, align: 'center', class: 'font-weight-bold' },
        { text: 'تاريخ المعاملة', value: 'date', sortable: true, align: 'center', class: 'font-weight-bold' },
        { text: 'رقم المعاملة', value: 'num', sortable: true, align: 'center', class: 'font-weight-bold' },
        { text: 'المبلغ الكلي', value: 'totalValue', sortable: true, align: 'center', class: 'font-weight-bold' },
        { text: 'قرار القبض', value: 'decision', sortable: true, align: 'center', class: 'font-weight-bold' },
        { text: 'المبلغ المعوض', value: 'returnedValue', sortable: true, align: 'center', class: 'font-weight-bold' },
        { text: 'خيارات', sortable: false, align: 'center', class: 'font-weight-bold' }
      ],
      editedIndex: -1,
      editedItem: {
        type: '',
        date: null,
        num: '',
        totalValue: '',
        decision: '',
        returnedValue: '',
        modal: false
      },
      selectOptions: [
        'طلب مساعدة مرضية',
        'طلب مساعدة اسنان',
        'تعهد من المنتسب حول ذوي عهدته',
        'طلب منحة زواج', 'طلب منحة ولادة',
        'طلب مساعدة بسبب وفاة منتسب',
        'طلب منحة تعليم', 'طلب إفادة',
        'طلب مساعدة بسبب وفاة أحد أفراد عائلة المنتسب أو ذوي عهدته'
      ],
      loading: false,
      search: ''
    }
  },
  created () {
    this.loading = true
    this.$db.findOne({_id: this.id}, (err, doc) => {
      if (err) {
        console.log(err.message)
        return
      }

      this.logs = doc.logs
      this.loading = false
    })
  },
  watch: {
    dialog (val) {
      val || this.close()
    }
  },
  methods: {
    editItem (item) {
      this.editedIndex = this.logs.indexOf(item)
      this.editedItem = Object.assign({}, item)
      this.dialog = true
    },
    deleteItem (item) {
      const index = this.logs.indexOf(item)
      confirm('هل انت متاكد من الغاء هذا الارشيف ؟') && this.logs.splice(index, 1)
      this.beforeDestroy()
    },
    close () {
      this.dialog = false
      setTimeout(() => {
        this.editedItem = Object.assign({}, this.defaultLog)
        this.editedIndex = -1
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
        Object.assign(this.logs[this.editedIndex], this.editedItem)
      } else {
        this.logs.push(this.editedItem)
      }
      this.beforeDestroy()
      this.close()
    },
    beforeDestroy () {
      this.loading = true
      this.$db.update({
        _id: this.id
      },
      {
        $set:
        {
          logs: this.logs
        }
      },
      {},
      (err, numReplaced) => {
        if (err) {
          console.log(err.message)
          return
        }
        this.loading = false
      })
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

