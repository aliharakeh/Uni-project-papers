import Vue from 'vue'
import Router from 'vue-router'

Vue.use(Router)

export default new Router({
  routes: [
    {
      path: '/',
      name: 'Home Page',
      component: require('@/Views/Home').default
    },
    {
      path: '/doctors',
      name: 'Doctors show page',
      component: require('@/Views/Doctors/Index').default
    },
    {
      path: '/doctors/create',
      name: 'Create New Doctor',
      component: require('@/Views/Doctors/Create').default
    },
    {
      path: '/doctors/:id',
      name: 'Doctor edit page',
      props: true,
      component: require('@/Views/Doctors/Edit').default
    },
    {
      path: '/doctors/:id/log',
      name: 'Doctor Log page',
      props: true,
      component: require('@/Views/Doctors/Log').default
    },
    {
      path: '/teeth/:id',
      name: 'teeth help',
      props: true,
      component: require('@/Views/Templates/teeth').default
    },
    {
      path: '/sickness/:id',
      name: 'sickness help',
      props: true,
      component: require('@/Views/Templates/sickness').default
    },
    {
      path: '/marriage/:id',
      name: 'marriage help',
      props: true,
      component: require('@/Views/Templates/marriage').default
    },
    {
      path: '/family/:id',
      name: 'family help',
      props: true,
      component: require('@/Views/Templates/family').default
    },
    {
      path: '/death/:id',
      name: 'death help',
      props: true,
      component: require('@/Views/Templates/death').default
    },
    {
      path: '/birth/:id',
      name: 'birth help',
      props: true,
      component: require('@/Views/Templates/birth').default
    },
    {
      path: '/education/:id',
      name: 'education help',
      props: true,
      component: require('@/Views/Templates/education').default
    },
    {
      path: '/deathfamily/:id',
      name: 'deathfamily help',
      props: true,
      component: require('@/Views/Templates/deathfamily').default
    },
    {
      path: '/statement/:id',
      name: 'statement help',
      props: true,
      component: require('@/Views/Templates/statement').default
    },

    // goBack Pages (Edit Data) //
    {
      path: '/family/:id/-1',
      name: 'family edit',
      props: true,
      component: require('@/Views/Templates/family').default
    },
    {
      path: '/teeth/:id/-1',
      name: 'teeth edit',
      props: true,
      component: require('@/Views/Templates/teeth').default
    },
    {
      path: '/sickness/:id/-1',
      name: 'sickness edit',
      props: true,
      component: require('@/Views/Templates/sickness').default
    },
    {
      path: '/marriage/:id/-1',
      name: 'marriage edit',
      props: true,
      component: require('@/Views/Templates/marriage').default
    },
    {
      path: '/death/:id/-1',
      name: 'death edit',
      props: true,
      component: require('@/Views/Templates/death').default
    },
    {
      path: '/birth/:id/-1',
      name: 'birth edit',
      props: true,
      component: require('@/Views/Templates/birth').default
    },
    {
      path: '/education/:id/-1',
      name: 'education edit',
      props: true,
      component: require('@/Views/Templates/education').default
    },
    {
      path: '/deathfamily/:id/-1',
      name: 'deathfamily edit',
      props: true,
      component: require('@/Views/Templates/deathfamily').default
    },
    {
      path: '/statement/:id/-1',
      name: 'statement edit',
      props: true,
      component: require('@/Views/Templates/statement').default
    },
    //

    // PDF files path //
    {
      path: '/PDFbirth',
      name: 'birth pdf',
      props: true,
      component: require('@/Views/PDF/birthPDF').default
    },
    {
      path: '/PDFdeath',
      name: 'death pdf',
      props: true,
      component: require('@/Views/PDF/deathPDF').default
    },
    {
      path: '/PDFeducation',
      name: 'education pdf',
      props: true,
      component: require('@/Views/PDF/educationPDF').default
    },
    {
      path: '/PDFfamily',
      name: 'family pdf',
      props: true,
      component: require('@/Views/PDF/familyPDF').default
    },
    {
      path: '/PDFmarriage',
      name: 'marriage pdf',
      props: true,
      component: require('@/Views/PDF/marriagePDF').default
    },
    {
      path: '/PDFteeth',
      name: 'teeth pdf',
      props: true,
      component: require('@/Views/PDF/teethPDF').default
    },
    {
      path: '/PDFsickness',
      name: 'sickness pdf',
      props: true,
      component: require('@/Views/PDF/sicknessPDF').default
    },
    {
      path: '/PDFdeathfamily',
      name: 'deathfamily pdf',
      props: true,
      component: require('@/Views/PDF/deathfamilyPDF').default
    },
    {
      path: '/PDFstatement',
      name: 'statement pdf',
      props: true,
      component: require('@/Views/PDF/statementPDF').default
    },
    //

    {
      path: '*',
      redirect: '/'
    }
  ]
})
