function ConvertToArabicNum(number){
  if (!number)
    return ''
  var numbers = number.split('')
  var arabicNum = ''
  var arabicNums = ['٠', '١', '٢', '٣', '٤', '٥', '٦', '٧', '٨', '٩']
  numbers.forEach(number => {
    arabicNum += arabicNums[number]
  })
  return arabicNum
}

function ConvertToArabicNumMoney (number) {
  if (!number)
    return ''
  var numbers = number.split('')
  var arabicNum = ''
  var arabicNums = ['٠', '١', '٢', '٣', '٤', '٥', '٦', '٧', '٨', '٩']
  numbers.forEach(number => {
    if (number === ',')
      arabicNum += '،'
    else
      arabicNum += arabicNums[number]
  })
  return arabicNum
}

function ConvertToArabicDate (date) {
  if (!date) {
    return ''
  }
  var dd = date.split('-')
  var year = ''
  var month = ''
  var day = ''
  // var flag = 0
  var arnum = ['٠', '١', '٢', '٣', '٤', '٥', '٦', '٧', '٨', '٩']

  var y = dd[0].split('') // year
  y.forEach(element => {
    year += arnum[element]
  })

  var m = dd[1].split('') // month
  if (dd[1] !== '10') {
    m.forEach(element => {
      if (element !== '0') {
        month += arnum[element]
      }
    })
  } else {
    month += '١٠'
  }

  var d = dd[2].split('') // day
  if (dd[2] !== '10' && dd[2] !== '20' && dd[2] !== '30') {
    d.forEach(element => {
      if (element !== '0') {
        day += arnum[element]
      }
    })
  } else {
    if (dd[2] === '10') {
      day += '١٠'
    }
    if (dd[2] === '20') {
      day += '٢٠'
    }
    if (dd[2] === '30') {
      day += '٣٠'
    }
  }
  return year + '/' + month + '/' + day
}

export {
  ConvertToArabicNum,
  ConvertToArabicNumMoney,
  ConvertToArabicDate
}