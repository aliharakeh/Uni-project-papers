<template>
  <v-container>

    <!-- loading while getting data -->
    <v-layout row v-if="loading" class="mt-5">
        <v-flex xs12 class="text-xs-center">
            <v-progress-circular indeterminate :size="70" :width="7" color="primary"></v-progress-circular>
        </v-flex>
    </v-layout>

    <!-- content to show -->
    <v-card v-else>
      <v-card-title>
        <h1>اضافة استاذ جديد</h1>
      </v-card-title>
      <v-divider></v-divider>
      <v-card-text>
        <!-- doctor's info -->
        <h1 class="mr-4">الاستاذ</h1>

        <!-- name and phone -->
        <v-layout row wrap justify-space-around>
          <v-flex xs5>
            <v-text-field type="number" label="رقم الاستاذ" v-model="doc.number"></v-text-field>
          </v-flex>
          <v-flex xs5>
            <v-text-field label="الاسم" v-model="doc.name"></v-text-field>
          </v-flex>
          <v-flex xs5>
            <v-text-field label="الهاتف" v-model="doc.phone"></v-text-field>
          </v-flex>
          <v-flex xs5>
            <v-text-field label="الكلية" v-model="doc.faculty"></v-text-field>
          </v-flex>
          <v-flex xs5>
            <v-text-field label="الفرع" v-model="doc.facultySection"></v-text-field>
          </v-flex>
          <v-flex xs5>
            <v-text-field label="مكان السكن" v-model="doc.address"></v-text-field>
          </v-flex>
        </v-layout>

        <v-divider class="my-3"></v-divider>

        <!-- partners -->
        <h1 class="mr-4">
          الزوج / الزوجة
          <v-btn
            color="primary"
            @click="doc.partners.push(Object.assign({}, defaultPartner))"
          >اضافة خانة</v-btn>
        </h1>
        <div v-for="(partner, i) in doc.partners" :key="i">
          <h2 class="mr-4">
            ({{ i + 1 }})
            <v-btn icon @click="remove(0, i)">
              <v-icon color="error">delete</v-icon>
            </v-btn>
          </h2>
          <v-layout row wrap justify-space-around>
            <v-flex xs5>
              <v-text-field label="الاسم" v-model="partner.name"></v-text-field>
            </v-flex>
            <v-flex xs5>
              <v-dialog
                ref="dialogA"
                v-model="partner.modal"
                :return-value.sync="partner.birthDate"
                persistent
                lazy
                full-width
                width="290px"
              >
                <v-text-field
                  slot="activator"
                  v-model="partner.birthDate"
                  label="تاريخ الولادة"
                  prepend-icon="event"
                  readonly
                ></v-text-field>
                <v-date-picker v-model="partner.birthDate" scrollable locale="ar-lb">
                  <v-spacer></v-spacer>
                  <v-btn flat color="primary" @click="partner.modal = false">Cancel</v-btn>
                  <v-btn flat color="primary" @click="saveDate('dialogA', i, partner.birthDate)">OK</v-btn>
                </v-date-picker>
              </v-dialog>
            </v-flex>
            <v-flex xs5>
              <v-select
                :items="workStates"
                label="العمل"
                @change="checkWorkState($event, i)"
              ></v-select>
            </v-flex>
            <v-flex xs5 v-if="partner.workStateExtra">
              <v-text-field label="يعمل في" v-model="partner.work"></v-text-field>
            </v-flex>
            <v-flex xs5 v-if="partner.isWorking">
              <v-select
                :items="workSector"
                label="قطاع العمل"
                @change="checkWorkSector($event, i)"
              ></v-select>
            </v-flex>
            <v-flex xs5 v-if="partner.insuranceNumSection">
              <v-text-field type="number" label="رقم الضمان" v-model="partner.insuranceNum"></v-text-field>
            </v-flex>
          </v-layout>
        </div>

        <v-divider class="my-3"></v-divider>

        <!-- children -->
        <h1 class="mr-4">
          الاولاد
          <v-btn
          color="primary"
          @click="doc.children.push(Object.assign({}, defaultChild))"
          >اضافة خانة</v-btn>
        </h1>
        <div v-for="(child, j) in doc.children" :key="'child' + j">
          <h2 class="mr-4">
            ({{ j + 1 }})
            <v-btn icon @click="remove(1, j)">
              <v-icon color="error">delete</v-icon>
            </v-btn>
          </h2>
          <v-layout row wrap justify-space-around>
            <v-flex xs5>
              <v-text-field label="الاسم" v-model="child.name"></v-text-field>
            </v-flex>
            <v-flex xs5>
              <v-dialog
                ref="dialogB"
                v-model="child.modal"
                :return-value.sync="child.birthDate"
                persistent
                lazy
                full-width
                width="290px"
              >
                <v-text-field
                  slot="activator"
                  v-model="child.birthDate"
                  label="تاريخ الولادة"
                  prepend-icon="event"
                  readonly
                ></v-text-field>
                <v-date-picker v-model="child.birthDate" scrollable locale="ar-lb">
                  <v-spacer></v-spacer>
                  <v-btn flat color="primary" @click="child.modal = false">Cancel</v-btn>
                  <v-btn flat color="primary" @click="saveDate('dialogB', j, child.birthDate)">OK</v-btn>
                </v-date-picker>
              </v-dialog>
            </v-flex>
          </v-layout>
        </div>

        <v-divider class="my-3"></v-divider>

        <!-- family -->
        <h1 class="mr-4">
          العائلة
          <v-btn
          color="primary"
          @click="doc.family.push(Object.assign({}, defaultFamily))"
          >اضافة خانة</v-btn>
        </h1>
        <div v-for="(member, k) in doc.family" :key="'member' + k">
          <h2 class="mr-4">
            ({{ k + 1 }})
            <v-btn icon @click="remove(2, k)">
              <v-icon color="error">delete</v-icon>
            </v-btn>
          </h2>
          <v-layout row wrap justify-space-around>
            <v-flex xs5>
              <v-text-field label="الاسم" v-model="member.name"></v-text-field>
            </v-flex>
            <v-flex xs5>
              <v-dialog
                ref="dialogC"
                v-model="member.modal"
                :return-value.sync="member.birthDate"
                persistent
                lazy
                full-width
                width="290px"
              >
                <v-text-field
                  slot="activator"
                  v-model="member.birthDate"
                  label="تاريخ الولادة"
                  prepend-icon="event"
                  readonly
                ></v-text-field>
                <v-date-picker v-model="member.birthDate" scrollable locale="ar-lb">
                  <v-spacer></v-spacer>
                  <v-btn flat color="primary" @click="member.modal = false">Cancel</v-btn>
                  <v-btn flat color="primary" @click="saveDate('dialogC', k, member.birthDate)">OK</v-btn>
                </v-date-picker>
              </v-dialog>
            </v-flex>
            <v-flex xs5>
              <v-select
                :items="family"
                label="درجة القرابة"
                v-model="member.type"
              ></v-select>
            </v-flex>
            <v-flex xs5>
              <v-text-field label="مكان السكن" v-model="member.address"></v-text-field>
            </v-flex>
          </v-layout>
        </div>

        <v-layout row wrap justify-center class="mt-3">
          <v-btn color="primary" @click="save">حفظ</v-btn>
          <v-btn color="error" to="/doctors">الغاء</v-btn>
        </v-layout>

      </v-card-text>
    </v-card>

  </v-container>
</template>

<script>
export default {
  props: ['id'],
  data () {
    return {
      loading: false,
      loadingDialog: false,
      doc: {
        number: '',
        name: '',
        phone: '',
        faculty: '',
        facultySection: '',
        address: '',
        partners: [],
        children: [],
        family: [],
        logs: [] // in Log.vue
      },
      workStates: ['متقاعد', 'لا يعمل', 'خيارات اخرى'],
      workSector: ['ادارة عامة', 'مؤسسة عامة', 'بلدية', 'قطاع خاص'],
      defaultPartner: {
        name: '',
        birthDate: null,
        work: '',
        workSector: '',
        insuranceNum: null,
        modal: false,
        workStateExtra: false,
        insuranceNumSection: true,
        isWorking: true
      },
      defaultChild: {
        name: '',
        birthDate: null,
        modal: false
      },
      family: ['اب', 'ام', 'اخت', 'اخ'],
      defaultFamily: {
        name: '',
        address: '',
        birthDate: null,
        type: '',
        modal: false
      }
    }
  },
  created () {
    this.doc.partners.push(Object.assign({}, this.defaultPartner))
    this.doc.children.push(Object.assign({}, this.defaultChild))
    this.doc.family.push(Object.assign({}, this.defaultFamily))
  },
  methods: {
    checkWorkState (selectedValue, partnerIndex) {
      if (selectedValue === this.workStates[2]) {
        this.doc.partners[partnerIndex].workStateExtra = true
        this.doc.partners[partnerIndex].work = null
        this.doc.partners[partnerIndex].insuranceNumSection = true
        this.doc.partners[partnerIndex].isWorking = true
      } else if (selectedValue === this.workStates[0]) {
        this.doc.partners[partnerIndex].workStateExtra = false
        this.doc.partners[partnerIndex].work = selectedValue
        this.doc.partners[partnerIndex].insuranceNumSection = true
        this.doc.partners[partnerIndex].isWorking = true
      } else {
        this.doc.partners[partnerIndex].insuranceNumSection = false
        this.doc.partners[partnerIndex].isWorking = false
      }
    },
    checkWorkSector (selectedValue, partnerIndex) {
      this.doc.partners[partnerIndex].workSector = selectedValue
      if (selectedValue === this.workSector[3]) {
        this.doc.partners[partnerIndex].insuranceNumSection = false
        this.doc.partners[partnerIndex].insuranceNum = null
      } else {
        this.doc.partners[partnerIndex].insuranceNumSection = true
      }
    },
    saveDate (refKey, refIndex, date) {
      this.$refs[refKey][refIndex].save(date)
    },
    save () {
      var flag = 0
      for (var property in this.doc) {
        if (property === 'family' || property === 'partners' || property === 'logs' || property === 'children') {
          for (var i in this.doc[property]) {
            var item = this.doc[property][i]
            for (var prop in item) {
              if (item[prop] === '' || item[prop] === null) {
                flag = 1
              }
            }
          }
        } else if (this.doc[property] === '' || this.doc[property] === null) {
          flag = 1
        }
      }
      if (flag === 1) {
        alert('لم يتم ملئ كل الخانات بعد')
        return
      }
      this.loading = true
      this.$db.insert(this.doc, (err, newDoc) => {
        if (err) {
          console.log(err.message)
          return
        }
        this.loading = false
        this.$router.push('/doctors')
      })
    },
    remove (type, index) {
      switch (type) {
        case 0:
          this.doc.partners.splice(index, 1)
          break
        case 1:
          this.doc.children.splice(index, 1)
          break
        case 2:
          this.doc.family.splice(index, 1)
          break
        default:
          break
      }
    }
  }
}
</script>

