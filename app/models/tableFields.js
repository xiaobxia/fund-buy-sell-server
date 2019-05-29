/**
 * resBase 非敏感数据，面向用户
 */
module.exports = {
  createQueryValidateModel (fieldList) {
    let validateOption = {}
    fieldList.map((field) => {
      validateOption[field.field] = {
        type: field.type,
        required: field.required
      }
    })
    return validateOption
  },
  createQueryModel (fieldList, queryData) {
    let validateOption = {}
    fieldList.map((field) => {
      if (field.required) {
        if (field.regExp) {
          validateOption[field.field] = new RegExp(queryData[field.field], 'i')
        } else {
          validateOption[field.field] = queryData[field.field]
        }
      } else {
        if (queryData[field.field] !== undefined) {
          if (field.regExp) {
            validateOption[field.field] = new RegExp(queryData[field.field], 'i')
          } else {
            validateOption[field.field] = queryData[field.field]
          }
        }
      }
    })
    return validateOption
  },
  createUpdateValidateModel (fieldList) {
    let validateOption = {}
    fieldList.map((field) => {
      validateOption[field.field] = {
        type: field.type,
        required: false
      }
    })
    return validateOption
  },
  createUpdateModel (fieldList, updateData) {
    let data = {}
    fieldList.map((field) => {
      if (updateData[field.field] !== undefined) {
        data[field.field] = updateData[field.field]
      }
    })
    return data
  },
  user: {
    resBase: [
      { field: '_id', alias: 'user_id' },
      { field: 'name' },
      { field: 'token' },
      { field: 'roles' }
    ]
  },
  schedule: {
    resBase: [
      { field: '_id', alias: 'schedule_id' },
      { field: 'name' },
      { field: 'describe' },
      { field: 'type' },
      { field: 'open',
        format: function (value) {
          return value === 'open'
        }
      }
    ]
  },
  logAudit: {
    resBase: [
      { field: '_id', alias: 'log_id' },
      { field: 'log_type' },
      { field: 'user_id' },
      { field: 'user_name' },
      { field: 'platform' }
    ]
  },
  dictionary: {
    resBase: [
      { field: '_id', alias: 'dictionary_id' },
      { field: 'key' },
      { field: 'describe' },
      { field: 'type' },
      { field: 'value' }
    ]
  },
  customer: {
    update: [
      { field: 'buy_type', type: 'string' },
      { field: 'can_use_day', type: 'number' },
      { field: 'status', type: 'number' },
      { field: 'reward', type: 'number' },
      { field: 'if_count_day', type: 'boolean' },
      { field: 'if_test', type: 'boolean' },
      { field: 'if_buy', type: 'boolean' },
      { field: 'wechat', type: 'string' }
    ]
  }
}
