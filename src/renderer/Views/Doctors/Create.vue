<template>
  <v-container>
    <!-- loading while getting data -->
    <Loading v-if="loading"/>

    <!-- content to show -->
    <v-card v-else>
      <v-card-title>
        <h1>اضافة استاذ جديد</h1>
      </v-card-title>
      <v-divider></v-divider>
      <v-card-text>
        <!-- doctor's info -->
        <h1 class="mr-4">الاستاذ</h1>

        <v-layout row wrap justify-space-around>
          <v-flex xs5>
            <v-text-field type="number" label="رقم الاستاذ" v-model="doc.number"></v-text-field>
          </v-flex>
          <v-flex xs5>
            <v-text-field label="الاسم" v-model="doc.name"></v-text-field>
          </v-flex>
          <v-flex xs5>
            <v-text-field type="number" label="الهاتف" v-model="doc.phone"></v-text-field>
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
          <v-flex xs5>
            <v-select
              :items="genders"
              label="الجنس"
              v-model="doc.gender"
            ></v-select>
          </v-flex>
          <v-flex xs5>
            <date label="تاريخ الولادة" @ready="doc.birthDate = $event" :value="doc.birthDate"/>
          </v-flex>
        </v-layout>

        <v-divider class="my-3"></v-divider>

        <!-- partners -->
        <h1 class="mr-4">
          {{ partnerTitle }}
          <v-btn
            v-if="doc.partners.length === 0"
            color="primary"
            @click="setOnFocus('partner')"
          >{{ GenderSelection(0) }}</v-btn>
        </h1>
        <div v-for="(partner, i) in doc.partners" :key="i" style="border: 2px solid black">
          <!-- معلومات عن الزوجة -->
          <h2 class="mr-4">
            {{ showGender(0) }} ({{ i + 1 }})
            <v-btn icon @click="remove(0, i)">
              <v-icon color="error">delete</v-icon>
            </v-btn>
            <v-btn
              v-if="doc.partners.length === i+1"
              color="primary"
              @click="setOnFocus('partner')"
            >{{ GenderSelection(0) }}</v-btn>
          </h2>
          <v-layout row wrap justify-space-around>
            <v-flex xs5>
              <v-text-field type="text" label="الاسم" v-model="partner.name" :ref="'partner' + i"></v-text-field>
            </v-flex>
            <v-flex xs5>
              <date label="تاريخ الولادة" @ready="partner.birthDate = $event" :value="partner.birthDate"/>
            </v-flex>
            <v-flex xs5>
              <v-select
                :items="workStates"
                label="العمل"
                @change="checkWorkState($event, i)"
              ></v-select>
            </v-flex>
            <v-flex xs5 v-if="partner.isWorking">
              <v-select
                :items="workSector"
                label="قطاع العمل"
                @change="checkWorkSector($event, i)"
              ></v-select>
            </v-flex>
            <v-flex xs5 v-if="partner.insuranceNumSection && partner.isWorking">
              <v-text-field type="number" label="رقم الضمان" v-model="partner.insuranceNum"></v-text-field>
            </v-flex>
            <v-flex xs12 class="mr-4">
              <h1>هل تم تقاضي اي مساعدة من اي مصدر اخر؟</h1>
            </v-flex>
            <v-flex xs12 class="mr-4">
              <h1>
                <v-radio-group v-model="partner.externalHelp">
                  <v-radio label="نعم" value='1'></v-radio>
                  <v-radio label="لا" value='0'></v-radio>
                </v-radio-group>
              </h1>
            </v-flex>
            <v-flex xs12 sm5 v-if="partner.externalHelp == 1" class="ml-4">
              <v-text-field label="مصدر المساعدة" v-model="partner.externalHelpSource"></v-text-field>
            </v-flex>
            <v-flex xs12 sm5 v-if="partner.externalHelp == 1" class="ml-4">
              <v-text-field label="قيمة المساعدة" type="number" v-model="partner.externalHelpMoney"></v-text-field>
            </v-flex>
          </v-layout>
        </div>

        <v-divider class="my-4"></v-divider>

        <!-- children -->
        <h1 class="mr-4">
          معلومات عن الاولاد
          <v-btn
          color="primary"
          @click="doc.children.push(Object.assign({}, defaultChild))"
          >{{ GenderSelection(1) }}</v-btn>
        </h1>
        <div v-for="(child, j) in doc.children" :key="'child' + j" style="border: 2px solid black">
          <!-- معلومات عن الاولاد -->
          <h2 class="mr-4">
            {{ showGender(1) }} ({{ j + 1 }})
            <v-btn icon @click="remove(1, j)">
              <v-icon color="error">delete</v-icon>
            </v-btn>
          </h2>
          <v-layout row wrap justify-space-around>
            <v-flex xs5>
              <v-text-field label="الاسم" v-model="child.name"></v-text-field>
            </v-flex>
            <v-flex xs5>
              <date label="تاريخ الولادة" @ready="child.birthDate = $event" :value="child.birthDate"/>
            </v-flex>
            <v-flex xs5>
              <v-select
                :items="genders"
                label="الجنس"
                v-model="child.gender"
              ></v-select>
            </v-flex>
          </v-layout>
        </div>

        <v-divider class="my-4"></v-divider>

        <!-- family -->
        <h1 class="mr-4">
           معلومات عن العائلة
          <v-btn
          color="primary"
          @click="doc.family.push(Object.assign({}, defaultFamily))"
          >{{ GenderSelection(2) }}</v-btn>
        </h1>
        <div v-for="(member, k) in doc.family" :key="'member' + k" style="border: 2px solid black">
          <!-- معلومات عن العائلة -->
          <h2 class="mr-4">
            {{ showGender(2) }} ({{ k + 1 }})
            <v-btn icon @click="remove(2, k)">
              <v-icon color="error">delete</v-icon>
            </v-btn>
          </h2>
          <v-layout row wrap justify-space-around>
            <v-flex xs5>
              <v-text-field label="الاسم" v-model="member.name"></v-text-field>
            </v-flex>
            <v-flex xs5>
              <date label="تاريخ الولادة" @ready="member.birthDate = $event" :value="member.birthDate"/>
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
          <v-btn color="error" @click="goBack">الغاء</v-btn>
        </v-layout>
      </v-card-text>
    </v-card>
  </v-container>
</template>

<script>
import Loading from "@/components/Loading"
import date from "@/components/DatePicker"
export default {
   components: {
    Loading,
    date
  },
  props: ['id'],
  data () {
    return {
      loading: false,
      genders: ['ذكر', 'انثى'],
      doc: {
        number: null,
        name: '',
        birthDate: '',
        phone: '',
        faculty: '',
        facultySection: '',
        address: '',
        gender: 'ذكر',
        partners: [],
        children: [],
        family: [],
        logs: [] // in Log.vue
      },
      workStates: ['متعاقد', 'لا يعمل'],
      workSector: ['ادارة عامة', 'مؤسسة عامة', 'بلدية', 'قطاع خاص'],
      defaultPartner: {
        name: '',
        birthDate: null,
        isWorking: false,
        workState: '',
        workSector: '',
        insuranceNum: null,
        insuranceNumSection: true,
        externalHelp: '0',
        externalHelpSource: '',
        externalHelpMoney: null
      },
      defaultChild: {
        name: '',
        gender: '',
        birthDate: null,
      },
      family: ['اب', 'ام', 'اخت', 'اخ'],
      defaultFamily: {
        name: '',
        address: '',
        birthDate: null,
        type: ''
      }
    }
  },
  created () {
    this.doc.partners.push(Object.assign({}, this.defaultPartner))
  },
  computed: {
    partnerTitle () {
      if (this.doc.gender === this.genders[0]) {
        return 'معلومات عن الزوجة'
      }
      return 'معلومات عن الزوج'
    },
    partnerGender () {
      if (this.doc.gender === this.genders[0]) {
        return 'هذه الزوجة'
      }
      return 'هذا الزوج'
    }
  },
  methods: {
     setOnFocus (name) {
      this.doc.partners.push(Object.assign({}, this.defaultPartner))
       setTimeout(() => {
         var length = this.doc.partners.length - 1
         var index = name + length
         console.log(this.$refs)
         console.log(index)
         console.log(this.$refs[index])
         this.$refs[index][0].focus()
       }, 50)

    },
    showGender (type) {
      if (type === 0) {
        if (this.doc.gender === this.genders[0]) {
          return 'زوجة رقم'
        }
        return 'زوج رقم'
      } else if (type === 1) {
        return 'ولد رقم'
      } else {
        return 'فرد رقم'
      }
    },
    GenderSelection (index) {
      var text = ''
      switch (index) {
        case 0:
          if (this.doc.gender === this.genders[0]) {
            text = 'اضافة زوجة'
          } else {
            text = 'اضافة زوج'
          }
          break
        case 1:
          text = 'اضافة ولد'
          break
        case 2:
          text = 'اضافة فرد عائلة'
          break
        default:
          break
      }
      return text
    },
    checkWorkState (selectedValue, partnerIndex) {
      this.doc.partners[partnerIndex].workState = selectedValue
      if (selectedValue === this.workStates[0]) {
        this.doc.partners[partnerIndex].isWorking = true
      } else {
        this.doc.partners[partnerIndex].isWorking = false
        this.doc.partners[partnerIndex].insuranceNumSection = false
        this.doc.partners[partnerIndex].insuranceNum = null
        this.doc.partners[partnerIndex].workSector = ''
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
    confirm (propertyName) {
      if (propertyName === 'partners') {
        var confirmed = true
        for (var index in this.doc.partners) {
          var partner = this.doc.partners[index]
          confirmed = partner.name !== '' && partner.birthDate !== null
          if (confirmed === false) {
            return false
          }
          if (partner.isWorking === true) {
            confirmed = partner.workState !== '' && partner.workSector !== ''
            if (confirmed !== false) {
              if (partner.insuranceNumSection === true) {
                confirmed = partner.insuranceNum !== null && partner.insuranceNum !== ''
              }
            }
            if (confirmed === false) {
              return false
            }
          }
          if (partner.externalHelp === '1') {
            confirmed = partner.externalHelpSource !== '' && partner.externalHelpMoney !== null && partner.externalHelpMoney !== ''
            if (confirmed === false) {
              return false
            }
          }
        }
      } else if (this.doc[propertyName].length !== 0) {
        for (var index1 in this.doc[propertyName]) {
          var item = this.doc[propertyName][index1]
          for (var prop in item) {
            if (item[prop] === '' || item[prop] === null) {
              return false
            }
          }
        }
      }
      return true
    },
    save () {
      if (confirm('هل انت متاكد من حفظ المعلومات ؟')) {
        var flag = true
        for (var property in this.doc) {
          if (property === 'partners' || property === 'family' || property === 'logs' || property === 'children') {
            flag = this.confirm(property)
            if (flag === false) {
              break
            }
          } else if (this.doc[property] === '' || this.doc[property] === null) {
            flag = false
            break
          }
        }
        if (flag === false) {
          alert('لم يتم ملئ كل الخانات بعد')
          return
        }

        this.loading = true
        this.$db.insert(this.doc, (err, newDoc) => {
          if (err) {
            alert('لم يتم حفظ الاستاذ !! الرجاء اعادة الحفظ')
            return
          }
          this.loading = false
          alert('تم حفظ اللأستاذ بنجاح !!')
          this.$router.push('/doctors')
        })
      }
    },
    remove (type, index) {
      switch (type) {
        case 0:
          if (confirm('هل انت متاكد من إلغاء ' + this.partnerGender + ' ؟')) {
            this.doc.partners.splice(index, 1)
          }
          break
        case 1:
          if (confirm('هل انت متاكد من إلغاء هذا الولد ؟')) {
            this.doc.children.splice(index, 1)
          }
          break
        case 2:
          if (confirm('هل انت متاكد من إلغاء هذا الفرد من العائلة ؟')) {
            this.doc.family.splice(index, 1)
          }
          break
        default:
          break
      }
    },
    goBack () {
      if (confirm('هل انت متاكد من الخروج ؟')) {
        this.$router.push('/doctors')
      }
    }
  }
}
</script>
