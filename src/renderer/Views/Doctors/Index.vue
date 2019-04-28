<template>
  <v-container>

    <!-- loading while getting data -->
    <Loading v-if="loading"/>

    <!-- content to show -->
    <v-card class="mt-4" v-else>
      <v-card-title>
        <v-layout row wrap justify-space-between align-end>
          <v-flex xs4>
            <h1>الاساتذة</h1>
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
        <v-btn color="primary" dark to="/doctors/create">ادخال معلومات</v-btn>
        <v-data-table
          :headers="headers"
          :items="doctors"
          :search="search"
          class="elevation-5"
        >
          <template slot="items" slot-scope="props">
            <td class="subheading text-xs-center">{{ props.item.number }}</td>
            <td class="subheading text-xs-center">{{ props.item.name }}</td>
            <td class="subheading text-xs-center">{{ props.item.faculty }}</td>
            <td class="subheading text-xs-center">{{ props.item.facultySection}}</td>
            <td class="text-xs-center">
              <v-btn icon>
                <v-icon
                  color="info"
                  @click="editItem(props.item._id)"
                >
                  edit
                </v-icon>
              </v-btn>
              <v-btn icon @click="viewLog(props.item._id)">
                <v-icon color="success">info</v-icon>
              </v-btn>
              <v-btn icon @click="deleteItem(props.item._id)">
                <v-icon color="error">delete</v-icon>
              </v-btn>
            </td>
          </template>
          <template slot="pageText" slot-scope="props">
            اظهار <bdi>{{ props.pageStart }} - {{ props.pageStop }}</bdi> من <bdi>{{ props.itemsLength }}</bdi>
          </template>
          <template slot="no-data">
            <h1>لا يوجد معلومات بعد</h1>
          </template>
          <template slot="no-results">
            <h1>لا يوجد معلومات عن  هذا البحث</h1>
          </template>
        </v-data-table>
      </v-card-text>
    </v-card>

  </v-container>
</template>

<script>
import Loading from "@/components/Loading"
export default {
   components: {
    Loading
  },
  data () {
    return {
      headers: [
        {
          text: 'الرقم',
          value: 'number',
          align: 'center',
          sortable: true,
          class: 'title'
        },
        {
          text: 'الاسم',
          value: 'name',
          align: 'center',
          sortable: true,
          class: 'title'
        },
        {
          text: 'الكلية',
          value: 'faculty',
          align: 'center',
          sortable: true,
          class: 'title'
        },
        {
          text: 'الفرع',
          value: 'facultySection',
          align: 'center',
          sortable: true,
          class: 'title'
        },
        {
          text: 'خيارات',
          value: 'actions',
          align: 'center',
          sortable: false,
          class: 'title'
        }
      ],
      doctors: [],
      loading: false,
      search: ''
    }
  },
  created () {
    this.loading = true
    this.$db.find({}, {number: 1, name: 1, faculty: 1, facultySection: 1}, (err, docs) => {
      if (err) {
        console.log(err.message)
        return
      }
      this.doctors = docs
      this.loading = false
    })
  },
  methods: {
    editItem (id) {
      this.$router.push(`/doctors/${id}`)
    },
    deleteItem (id) {
      if (confirm('هل انت متاكد من الغاء هذا الاستاذ؟')) {
        this.loading = true
        this.$db.remove({ _id: id }, {}, (err, numRemoved) => {
          if (err) {
            console.log(err.message)
            return
          }
          this.loading = false
          let deletedDocIndex = this.doctors.findIndex(doc => doc._id === id)
          this.doctors.splice(deletedDocIndex, 1)
          alert('تم الغاء الاستاذ بنجاح')
        })
      }
    },
    viewLog (id) {
      this.$router.push(`/doctors/${id}/log`)
    }
  }
}
</script>
