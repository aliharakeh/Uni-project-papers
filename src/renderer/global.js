let currentDoc = -1;

function setCurrentDoc(doc_num){
  currentDoc = doc_num;
}

function getCurrentDoc() {
  return currentDoc;
}

export {
  setCurrentDoc,
  getCurrentDoc
}
