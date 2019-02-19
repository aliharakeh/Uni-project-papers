<template>
  <v-container fluid>

    <!-- loading while getting data -->
    <v-layout row v-if="loading" class="mt-5">
        <v-flex xs12 class="text-xs-center">
            <v-progress-circular indeterminate :size="70" :width="7" color="primary"></v-progress-circular>
        </v-flex>
    </v-layout>

    <!-- choose doc -->
    <v-layout row wrap v-if="!loading" justify-center>
      <v-flex xs12 sm6 offset-sm-6>
        <v-combobox
          v-model="docID"
          :items="docs"
          :item-text="comboBoxText"
          item-value="_id"
          label="اختيار استاذ"
        >
        </v-combobox>
      </v-flex>
    </v-layout>

    <!-- choose template -->
    <v-layout row wrap justify-space-around v-if="docID">
      <v-flex xs6 v-for="template in templates" :key="template.title">
        <v-hover>
          <v-card
          class="ma-3"
          :to="template.link + '/' + docID._id"
          raised
          slot-scope="{ hover }"
          :class="`elevation-${hover ? 12 + ' blue lighten-4' : 5}`"
          >
            <v-card-title>
              <v-layout columns justify-center>
                <h1 class="headline font-weight-bold">{{ template.title }}</h1>
              </v-layout>
            </v-card-title>
          </v-card>
        </v-hover>
      </v-flex>
    </v-layout>
  </v-container>
</template>

<script>
  export default {
    data () {
      return {
        docID: null,
        docs: null,
        loading: null,
        templates: [
          {
            title: 'طلب مساعدة مرضية',
            link: '/sickness'
          },
          {
            title: 'طلب مساعدة اسنان',
            link: '/teeth'
          },
          {
            title: 'طلب منحة زواج',
            link: '/marriage'
          },
          {
            title: 'طلب منحة ولادة',
            link: '/birth'
          },
          {
            title: 'طلب منحة تعليم',
            link: '/education'
          },
          {
            title: 'طلب مساعدة بسبب وفاة منتسب',
            link: '/death'
          },
          {
            title: 'تعهد من المنتسب حول ذوي عهدته',
            link: '/family'
          },
          {
            title: 'طلب مساعدة بسبب وفاة أحد أفراد عائلة المنتسب أو ذوي عهدته',
            link: '/deathfamily'
          },
          {
            title: 'طلب إفادة',
            link: '/statement'
          }
        ]
      }
    },
    created () {
      this.loading = true
      this.$db.find({}, {_id: 1, name: 1, number: 1}, (err, docs) => {
        if (err) {
          alert('لم يتم العثور على الاساتذة')
          return
        }
        this.docs = docs
        this.loading = false
      })
    },
    methods: {
      comboBoxText: item => item.name + ' - ' + item.number
    }
  }
</script>
