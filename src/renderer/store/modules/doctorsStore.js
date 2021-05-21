import db from '../../database'

const state = {
  docs: [],
  selectedDoc: null
}

const mutations = {
  loadDocs (state, docs) {
    state.docs = docs
  },
  saveDoc (state, docObj) {
    state.docs.push({
      _id: docObj._id,
      name: docObj.name,
      faculty: docObj.faculty,
      facultySection: docObj.facultySection
    })
  },
  saveSelectedDoc (state, selectedDoc) {
    state.selectedDoc = selectedDoc
  }
}

const actions = {
  loadDocs ({commit}) {
    db.find({}, {name: 1, faculty: 1, facultySection: 1}, (err, docs) => {
      if (err) {
        console.log(err.message)
        return
      }
      commit('loadDocs', docs)
    })
  },
  saveDoc ({commit}, docObj) {
    db.insert(docObj, (err, newDoc) => {
      if (err) {
        console.log(err.message)
        return
      }
      commit('saveDoc', newDoc)
    })
  },
  updateDoc ({commit, state}, newDocObj) {
  },
  deleteDoc ({commit, state}, docID) {
  }
}

const getters = {
  docs (state) {
    return state.docs
  },
  selectedDoc (state) {
    return state.selectedDoc
  }
}

export default {
  state,
  mutations,
  actions,
  getters
}
