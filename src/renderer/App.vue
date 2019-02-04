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
        <v-btn absolute dark fab bottom left color="primary" v-if="showButton" @click="pdf()">
          <h1>طباعة</h1>
        </v-btn>
      </v-toolbar-items>
    </v-toolbar>
    <v-content>
      <router-view></router-view>
    </v-content>
    <v-footer v-if="show && !home">
      <span class="px-3">&copy; 2019 - By Mohammad Hammoud & Ali Harakeh </span>
    </v-footer>
  </v-app>
</template>

<script>
  import {remote} from 'electron'
  import fs from 'fs'

  export default {
    data () {
      return {
        show: true,
        doc: ''
      }
    },
    computed: {
      home () {
        return this.$route.path === '/'
      },

      showButton () {
        return this.$route.path.startsWith('/PDF')
      }
    },
    methods: {
      pdf () {
        this.show = false
        remote.getCurrentWindow().webContents.printToPDF({
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
              defaultPath: remote.app.getPath('documents') + '//' + this.doc.name + '_' + this.doc.number + '_' + this.doc.type + '.pdf', // --> give a default name
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
                  this.$router.push('/')
                }
                alert('PDF saved !!')
                this.show = true
                this.$router.push('/')
              })
            }
          )
        })
      }
    }
  }
</script>
