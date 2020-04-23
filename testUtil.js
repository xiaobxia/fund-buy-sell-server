const axios = require('axios')
axios({
  method: 'get',
  url: ``
}).then((data) => {
  if (data.data.success) {
    console.log(data.data.data)
  } else {
    console.log(data)
  }
})
