<template>
  <v-container fluid>
    sadasdsadsa
    <medical
    :family="family"
    :medicalData="medicalData"
    @insertItem="insertItem($event)"
    @deleteItem="deleteItem($event)"
    />
  </v-container>
</template>

<script>
import medical from "@/components/MedicalData"
  export default {
    components:{
      medical
    },
    data(){
      return{
        family: [
          {
            name: 'a',
            birthDate: '1111-1-1',
            rangeOfAcquaintance: 'r1'
          },
          {
            name: 'b',
            birthDate: '2222-2-2',
            rangeOfAcquaintance: 'r2'
          }
        ],
        linkedFamily: [],
        medicalData: [],
        medicalCostsData: []
      }
    },
    methods:{
      deleteItem(index) {
        this.medicalData.splice(index, 1)
        const name = this.linkedFamily[index].name
        this.linkedFamily.splice(index, 1)
        const memberIndex = this.medicalCostsData.findIndex(member => member.name === name)
        this.medicalCostsData.splice(memberIndex, 1)
      },
      insertItem(editedItem) {
        this.medicalData.push(editedItem)
        this.linkedFamily.push({
          name: editedItem.name,
          birthDate: editedItem.birthDate,
          rangeOfAcquaintance: editedItem.rangeOfAcquaintance
        })
        this.medicalCostsData.push({
          name: editedItem.name,
          doctorsCost: null,
          medicineCost: null,
          otherCosts: null,
          costsSum: null,
          externalHelpValue: null
        })
      }
    },
  }
</script>
