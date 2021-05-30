function getParam(location, paramKey) {
  let params = location.split('?')[1]
  let paramsArr = params.split('&')
  let obj = {}
  for (let i = 0; i < paramsArr.length; i++) {
    obj[paramsArr[i].split('=')[0]] = paramsArr[i].split('=')[1]
  }
  if(paramKey == ''){
    return obj
  }
  return obj[paramKey]
}
let res = getParam('https://flight.qunar.com/pageconfig/list?type=shark_test&name=jim', 'name')
console.log(res);