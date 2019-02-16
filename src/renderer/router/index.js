import Vue from 'vue'
import Router from 'vue-router'

Vue.use(Router)

export default new Router({
  routes: [
    {
      path: '/',
      name: 'Home Page',
      component: require('@/components/Home').default
    },
    {
      path: '/doctors',
      name: 'Doctors show page',
      component: require('@/components/Doctors/Index').default
    },
    {
      path: '/doctors/create',
      name: 'Create New Doctor',
      component: require('@/components/Doctors/Create').default
    },
    {
      path: '/doctors/:id',
      name: 'Doctor edit page',
      props: true,
      component: require('@/components/Doctors/Edit').default
    },
    {
      path: '/doctors/:id/log',
      name: 'Doctor Log page',
      props: true,
      component: require('@/components/Doctors/Log').default
    },
    {
      path: '/teeth/:id',
      name: 'teeth help',
      props: true,
      component: require('@/components/Templates/teeth').default
    },
    {
      path: '/sickness/:id',
      name: 'sickness help',
      props: true,
      component: require('@/components/Templates/sickness').default
    },
    {
      path: '/marriage/:id',
      name: 'marriage help',
      props: true,
      component: require('@/components/Templates/marriage').default
    },
    {
      path: '/family/:id',
      name: 'family help',
      props: true,
      component: require('@/components/Templates/family').default
    },
    {
      path: '/death/:id',
      name: 'death help',
      props: true,
      component: require('@/components/Templates/death').default
    },
    {
      path: '/birth/:id',
      name: 'birth help',
      props: true,
      component: require('@/components/Templates/birth').default
    },
    {
      path: '/education/:id',
      name: 'education help',
      props: true,
      component: require('@/components/Templates/education').default
    },
    {
      path: '/deathfamily/:id',
      name: 'deathfamily help',
      props: true,
      component: require('@/components/Templates/deathfamily').default
    },

    // PDF files path //
    {
      path: '/PDFbirth',
      name: 'birth pdf',
      props: true,
      component: require('@/components/PDF/birthPDF').default
    },
    {
      path: '/PDFdeath',
      name: 'death pdf',
      props: true,
      component: require('@/components/PDF/deathPDF').default
    },
    {
      path: '/PDFeducation',
      name: 'education pdf',
      props: true,
      component: require('@/components/PDF/educationPDF').default
    },
    {
      path: '/PDFfamily',
      name: 'family pdf',
      props: true,
      component: require('@/components/PDF/familyPDF').default
    },
    {
      path: '/PDFmarriage',
      name: 'marriage pdf',
      props: true,
      component: require('@/components/PDF/marriagePDF').default
    },
    {
      path: '/PDFteeth',
      name: 'teeth pdf',
      props: true,
      component: require('@/components/PDF/teethPDF').default
    },
    {
      path: '/PDFsickness',
      name: 'sickness pdf',
      props: true,
      component: require('@/components/PDF/sicknessPDF').default
    },
    {
      path: '/PDFdeathfamily',
      name: 'deathfamily pdf',
      props: true,
      component: require('@/components/PDF/deathfamilyPDF').default
    },
    //

    {
      path: '*',
      redirect: '/'
    }
  ]
})
