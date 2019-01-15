<template>
  <v-app>
    <v-toolbar app fixed clipped-left v-if="show">
      <v-icon large>assignment</v-icon>
      <v-toolbar-title>
        <h1>Project 2</h1>
      </v-toolbar-title>
      <v-toolbar-items>
        <v-btn flat to="/">
          <h2>الصفحة الرئيسية</h2>
        </v-btn>
        <v-btn flat to="/doctors">
          <h2>الاساتذة</h2>
        </v-btn>
      </v-toolbar-items>
    </v-toolbar>
    <v-content>
      <router-view></router-view>
    </v-content>
    <v-footer v-if="show && !home">
      <span class="px-3">&copy; 2018 - By Mohammad Hammoud & Ali Harakeh </span>
    </v-footer>
  </v-app>
</template>

<script>
  import {remote} from 'electron'
  import fs from 'fs'
  export default {
    data () {
      return {
        show: true
      }
    },
    computed: {
      home () {
        return this.$route.path === '/'
      }
    },
    methods: {
      pdf () {
        this.show = false
        remote.getCurrentWindow().webContents.printToPDF({
          pageSize: 'A4',
          marginsType: 2,
          printBackground: true,
          landscape: false
        }, (err, data) => {
          if (err) {
            alert(err.message)
          }
          remote.dialog.showSaveDialog(
            remote.getCurrentWindow(),
            {
              title: 'Save Destination',
              defaultPath: remote.app.getPath('downloads'),
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
                }
                alert('PDF was successfully saved !!')
                this.show = true
              })
            }
          )
        })
      }
    }
  }
</script>
