<template>
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
                <span class="headline">ادخال خانة جديدة</span>
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
                        @change="updateItem"
                        v-model="selected"
                      ></v-select>
                    </v-flex>
                  </v-layout>
                </v-container>
              </v-card-text>
              <v-card-actions>
                <v-spacer></v-spacer>
                <v-btn color="error" @click.native="close" class="mx-2">الغاء</v-btn>
                <v-btn color="primary" @click.native="insertItem">حفظ</v-btn>
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
            <td class="text-xs-center">{{ arabicDate(props.item.birthDate) }}</td>
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
</template>

<script>
import {ConvertToArabicDate} from "../../Helpers.js"
export default {
  props: ['data', 'family'],
  data() {
    return {
      dialog: false,
      selected: null,
      headers: [
        { text: 'الاسم والشهرة', sortable: false, align: 'center', class: 'font-weight-bold' },
        { text: 'تاريخ الولادة', sortable: false, align: 'center', class: 'font-weight-bold' },
        { text: 'صلة القرابة', sortable: false, align: 'center', class: 'font-weight-bold' },
        { text: 'عنوان السكن', sortable: false, align: 'center', class: 'font-weight-bold' },
        { text: 'خيارات', sortable: false, align: 'center', class: 'font-weight-bold' }
      ],
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
    }
  },
  methods: {
    arabicDate(date) {
      return ConvertToArabicDate(date)
    },
    updateItem(item) {
      if (item !== null) {
        this.editedItem.name = item.name
        this.editedItem.birthDate = item.birthDate
        this.editedItem.rangeOfAcquaintance = item.rangeOfAcquaintance
        this.editedItem.address = item.address
      }
    },
    deleteItem(item) {
      const index = this.data.indexOf(item)
      if (confirm('هل انت متاكد من الغاء هذه الخانة ؟'))
        this.$emit('deleteItem', index)
    },
    close () {
      this.dialog = false
      setTimeout(() => {
        this.editedItem = Object.assign({}, this.defaultItem)
        this.selected = null
      }, 300)
    },
    insertItem () {
      var flag = 0
      for (var property in this.editedItem)
        if (this.editedItem[property] === '' || this.editedItem[property] === null) {
          flag = 1
          break
        }

      if (flag === 1) {
        alert('لم يتم ملئ كل الخانات بعد')
        return
      }

      this.$emit('insertItem', this.editedItem)
      this.close()
    }
  }
}
</script>
