import {
    format
} from '../../utils/util'

const date = new Date();
const years = [];
const months = [];
let days = [];
const hours = [];
const minutes = [];
const seconds = [];

let daysInMonth = [31, 28, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31]

for (let i = 1960; i <= date.getFullYear() + 500; i++) {
    years.push(i)
}
for (let i = 1; i <= 12; i++) {
    months.push(_addZore(i))
}
for (let i = 1; i <= 12; i++) {
    days.push(_addZore(i))
}
for (let i = 1; i <= 23; i++) {
    hours.push(_addZore(i))
}
for (let i = 1; i <= 59; i++) {
    minutes.push(_addZore(i))
}
for (let i = 1; i <= 59; i++) {
    seconds.push(_addZore(i))
}
//补零
function _addZore(_num) {
    return _num < 10 ? '0' + _num : _num.toString()
}

Component({
    properties: {
        mode: { // 选择器类型
            type: String,
            require: true
        },
        value: { // 回显的时间
            type: String,
            value: ''
        },
        valueFormat: {
            type: String, //格式化的类型
            value: ''
        },
        placeholder: {
            type: String, //默认值
            value: ''
        }
    },
    data: {
        timeValue: []
    },
    lifetimes: {
        // 生命周期函数，可以为函数，或一个在methods段中定义的方法名
        attached: function () {
            this._initTimeArray();
        },

    },
    methods: {
        /******************************
         * 对外开发的方法（事件）
         */
        bindChange(e) {
            const val = e.detail.value;
            let timeValue = [];
            let returnTime;
            //时间选择器滑动事件，参数：当前选择的时间
            switch (this.data.mode) {
                case "date":
                    timeValue.push(years[val[0]].toString())
                    timeValue.push(months[val[1]])
                    addDays(timeValue)
                    this.setData({
                        years,
                        months,
                        days,
                        hours,
                        minutes,
                        seconds
                    })
                    returnTime = years[val[0]] + "-" + months[val[1]] + "-" + days[val[2]]
                    break
                case "time":
                    returnTime = hours[val[0]] + ":" + minutes[val[1]] + ":" + seconds[val[2]]
                    break
                case "datetime":
                    timeValue.push(years[val[0]].toString())
                    timeValue.push(months[val[1]])
                    addDays(timeValue)
                    this.setData({
                        years,
                        months,
                        days,
                        hours,
                        minutes,
                        seconds
                    })
                    returnTime = years[val[0]] + "-" + months[val[1]] + "-" + days[val[2]] + " " + hours[val[3]] + ":" + minutes[val[4]] + ":" + seconds[val[5]]
                    break
            }

            if (returnTime.includes("undefined")) return
            this.triggerEvent('Change', returnTime)
        },

        /******************************
         * 内部方法
         */
        _initTimeArray() {

            const {
                value,
                mode,
                valueFormat
            } = this.data

            if (mode != 'datetime' && mode != 'date' && mode != 'time') {
                throw new CommonException('请配置合法的时间选择器类型！', -1)
            }


            let mShowTime;
            if (value.length === 0) {
                mShowTime = timeChange(format(value, valueFormat))
            } else {
                mShowTime = timeChange(value).toString()
            }
            //计算timeValue 显示到picker-view 上
            //2022-11-15 13:40:08
            const dateArray = getTimeItem(mode, mShowTime)
            //计算当前年月有多少天
            addDays(dateArray)

            //picker-view 的value值
            let timeValue = [];
            switch (mode) {
                case "date":
                    years.map((v, idx) => {
                        if (v.toString() === dateArray[0]) {
                            timeValue.push(idx)
                        }
                    })
                    months.map((v, idx) => {
                        if (v.toString() === dateArray[1]) {
                            timeValue.push(idx)
                        }
                    })
                    days.map((v, idx) => {
                        if (v.toString() === dateArray[2]) {
                            timeValue.push(idx)
                        }
                    })

                    break
                case "time":
                    hours.map((v, idx) => {
                        if (v.toString() === dateArray[0]) {
                            timeValue.push(idx)
                        }
                    })
                    minutes.map((v, idx) => {
                        if (v.toString() === dateArray[1]) {
                            timeValue.push(idx)
                        }
                    })
                    seconds.map((v, idx) => {
                        if (v.toString() === dateArray[2]) {
                            timeValue.push(idx)
                        }
                    })
                    break
                case "datetime":
                    years.map((v, idx) => {
                        if (v.toString() === dateArray[0]) {
                            timeValue.push(idx)
                        }
                    })
                    months.map((v, idx) => {
                        if (v.toString() === dateArray[1]) {
                            timeValue.push(idx)
                        }
                    })
                    days.map((v, idx) => {
                        if (v.toString() === dateArray[2]) {
                            timeValue.push(idx)
                        }
                    })
                    hours.map((v, idx) => {
                        if (v.toString() === dateArray[3]) {
                            timeValue.push(idx)
                        }
                    })
                    minutes.map((v, idx) => {
                        if (v.toString() === dateArray[4]) {
                            timeValue.push(idx)
                        }
                    })
                    seconds.map((v, idx) => {
                        if (v.toString() === dateArray[5]) {
                            timeValue.push(idx)
                        }
                    })
                    break
            }

            //设置时间数据源
            this.setData({
                years,
                months,
                days,
                hours,
                minutes,
                seconds
            })
            //必须分开写 否则不生效
            this.setData({
                timeValue: timeValue
            })
        },
    },
});
// 自定义异常
function CommonException(errMsg, code) {
    this.errMsg = errMsg
    this.code = code
}

//时间内包含/ 转化成-
function timeChange(value) {
    return value.indexOf('/') >= -1 ? value.replace("/", "-").replace("/", "-") : value
}

//获取当个时间的Item值 保存到数组中
function getTimeItem(mode, value) {
    let itemArray = [];
    switch (mode) {
        case "date":
            [value].map((v) => {
                itemArray = v.split('-').map((item) => {
                    return item
                })
            })
            break

        case "time":
            [value].map((v) => {
                itemArray = v.split(':').map((item) => {
                    return item
                })
            })
            break
        case "datetime":
            [value].map((v) => {
                v.split(' ').forEach((item) => {
                    if (item.includes('-')) {
                        item.split('-').map((item) => {
                            itemArray.push(item)
                        })
                    } else {
                        item.split(':').map((item) => {
                            itemArray.push(item)
                        })
                    }
                })
            })
            break
    }
    return itemArray

}

//添加天数
function addDays(array) {
    days = []
    //计算当前年月有多少天
    const dayNum = getDays(array[0], array[1])
    for (let i = 1; i <= dayNum; i++) {
        days.push(_addZore(i))
    }
}
// 根据年月获取当月的总天数
let getDays = function (year, month) {
    if (month === 2) {
        return ((year % 4 === 0) && ((year % 100) !== 0)) || (year % 400 === 0) ? 29 : 28
    } else {
        return daysInMonth[month - 1]
    }
}