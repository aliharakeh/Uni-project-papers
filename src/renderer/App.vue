<template>
  <v-app>
    <v-toolbar app fixed clipped-left v-if="show">
      <v-icon large>assignment</v-icon>
      <v-toolbar-title>
        <h1>صندوق التعاضد</h1>
      </v-toolbar-title>
      <v-toolbar-items>
        <v-btn flat to="/">
          <h2>الصفحة الرئيسية</h2>
        </v-btn>
        <v-btn flat to="/doctors">
          <h2>الأساتذة</h2>
        </v-btn>
        <v-btn color="error" v-if="showButton" @click="goBack">
          <h1>رجوع</h1>
        </v-btn>
        <v-btn absolute dark fab bottom left color="primary" v-if="showButton" @click="pdf()">
          <h1>حفظ</h1>
        </v-btn>
      </v-toolbar-items>
    </v-toolbar>
    <v-content>
      <router-view></router-view>
    </v-content>
    <v-footer v-if="show && !showButton">
      <span class="px-3">&copy; 2018/2019 - By Mohammad Hammoud & Ali Harakeh </span>
    </v-footer>
  </v-app>
</template>

<script>
  import {remote} from 'electron'
  import fs from 'fs'
  import path from 'path'

  export default {
    data () {
      return {
        show: true
      }
    },
    computed: {
      showButton () {
        return this.$route.path.startsWith('/PDF')
      }
    },
    methods: {
      goBack () {
        var doc = ''
        fs.readFile(path.join(remote.app.getPath('documents')) + '/data.json', 'utf8', (err, data) => {
          if (err) {
            alert(err.message)
          } else {
            doc = JSON.parse(data)
            this.$db.find({name: doc.name, number: doc.number}, {}, (err, data) => {
              if (err) {
                alert('لم يتم العثور على الاساتذة')
                return
              }
              var route = this.$route.path
              var docID = data[0]._id
              var pageName = route.substr(4, route.length)
              this.$router.push('/' + pageName + '/' + docID + '/-1')
            })
          }
        })
      },
      pdf () {
        var doc = ''
        var name = ''
        fs.readFile(path.join(remote.app.getPath('documents')) + '/data.json', 'utf8', (err, data) => {
          if (err) {
            alert(err.message)
          } else {
            doc = JSON.parse(data)
            name = doc.name + '_' + this.ConvertToArabicNum(doc.number) + '_' + doc.type + '.pdf'
            this.show = false
            remote.getCurrentWindow().webContents.printToPDF({ // try print function
              pageSize: 'A4',
              marginsType: 2,
              printBackground: false,
              landscape: false
            }, (err, data) => {
              if (err) {
                alert(err.message)
              }
              remote.dialog.showSaveDialog(
                remote.getCurrentWindow(),
                {
                  title: 'Save Destination',
                  defaultPath: remote.app.getPath('documents') + '//' + name, // --> give a default name
                  filters: [{
                    name: 'PDF File',
                    extensions: ['pdf']
                  }]
                },
                filename => {
                  console.log(filename)
                  fs.writeFile(filename, data, (err) => {
                    if (err) {
                      alert(err.message)
                      this.show = true
                      // this.$router.push('/')
                    } else {
                      alert('PDF saved !!')
                      this.show = true
                      this.$router.push('/')
                    }
                  })
                }
              )
              this.show = true
            })
          }
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
      }
    }
  }
</script>
