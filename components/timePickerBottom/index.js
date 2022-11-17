import {
    format
} from '../../utils/util'

Component({
    //定义组件生命周期函数
    lifetimes: {
        attached() {
            //初始化时间选择器
            this._initDateTimePickerFn()
        },
        detached() {}
    },
    //组件相关配置项
    options: {
        multipleSlots: true // 开启使用多个插槽
    },
    //组件的属性列表
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
    //组件的初始数据
    data: {
        rangeList: [],
        rangeValue: [],
        dateDetails: ['年', '月', '时', '分', '秒'],
        dateTime: ''
    },


    //组件的方法列表
    methods: {
        //初始化时间选择器
        _initDateTimePickerFn() {
            try {
                const {
                    value,
                    mode,
                    valueFormat
                } = this.data

                if (mode != 'datetime' && mode != 'date' && mode != 'time') {
                    throw new CommonException('请输入合法的时间选择器类型！', -1)
                }
                //初始化时间
                this.setData({
                    dateTime: value
                })
                //获取到当前时间
                let showTimeValue = this._validateShowTime(value, mode, valueFormat)

                // 获取年份
                const currentYear = showTimeValue.substring(0, showTimeValue.indexOf('-'))
                const currentMouth = showTimeValue.split(" ")[0].split('-')[1]
                const yearList = this._gotDateTimeList({
                    _start: Number(currentYear) - 100,
                    _end: Number(currentYear) + 100,
                    _type: 0
                })
                // 获取月份
                const monthList = this._gotDateTimeList({
                    _start: 1,
                    _end: 12,
                    _type: 1
                })
                //获取天数
                const dayList = this._gotDayList(currentYear, currentMouth)
                // 获取小时
                const hourList = this._gotDateTimeList({
                    _start: 0,
                    _end: 23,
                    _type: 2
                })
                // 获取分钟
                const munithList = this._gotDateTimeList({
                    _start: 0,
                    _end: 59,
                    _type: 3
                })
                // 获取秒
                const secondList = this._gotDateTimeList({
                    _start: 0,
                    _end: 59,
                    _type: 4
                })

                let rangeList = new Array()

                switch (mode) {
                    case "datetime":
                        rangeList.push(yearList)
                        rangeList.push(monthList)
                        rangeList.push(dayList)
                        rangeList.push(hourList)
                        rangeList.push(munithList)
                        rangeList.push(secondList)
                        break
                    case "date":
                        rangeList.push(yearList)
                        rangeList.push(monthList)
                        rangeList.push(dayList)
                        break
                    case "time":
                        rangeList.push(hourList)
                        rangeList.push(munithList)
                        rangeList.push(secondList)
                        break
                }

                this.setData({
                    rangeList
                }, () => {
                    this._echoDateTime(showTimeValue) // 初始化时间显示
                })
            } catch (err) {
                console.log(err)
            }
        },
        //验证显示的时间是否合法
        //@param {Number} _value 要验证的时间
        //@param {Number} _mode  选择器类型
        _validateShowTime(_value, _mode, valueFormat) {
            let currentTime = format(_value, valueFormat)
            let showTimeValue = _value.trim() || currentTime
            console.log();
            return showTimeValue
        },
        //获取年份、月份、小时、分钟、秒
        //@param {Number} _start 开始值
        //@param {Number} _end   结束值
        //@param {Number} _type  类型
        _gotDateTimeList({
            _start,
            _end,
            _type
        }) {
            let resultDataList = new Array()
            for (let i = _start; i <= _end; i++) {
                resultDataList.push(this._addZore(i) + this.data.dateDetails[_type])
            }
            return resultDataList
        },
        //获取天数
        //@param {Number} _year  年份
        //@param {Number} _mouth  月份
        _gotDayList(_year, _mouth) {
            let now = new Date(_year, _mouth, 0)
            const dayLength = now.getDate()
            let dayList = new Array()
            for (let i = 1; i <= dayLength; i++) {
                dayList.push(this._addZore(i) + '日')
            }
            return dayList
        },
        //补零
        //@param {Number} _num  数值
        _addZore(_num) {
            return _num < 10 ? '0' + _num : _num.toString()
        },
        //回显时间
        //@param {Number} _showTimeValue  初始化时要显示的时间
        _echoDateTime(_showTimeValue) {
            const rangeList = this.data.rangeList
            let rangeValue = new Array()
            const list = _showTimeValue.split(/[\-|\:|\s]/)
            list.map((el, index) => {
                rangeList[index].map((item, itemIndex) => {
                    item.indexOf(el) !== -1 && rangeValue.push(itemIndex)
                })
            })
            this.setData({
                rangeValue
            })
        },
        //点击确定时触发的回调函数
        //@param {Number} ev
        selectChangeFn(ev) {

            let mode = this.data.mode
            const selectValues = ev.detail.value
            console.log("selectValues", selectValues);
            const rangeList = this.data.rangeList
            let dateTime = ''
            selectValues.map((el, index) => {
                dateTime += rangeList[index][el].substring(0, rangeList[index][el].length - 1)
                if (mode === "datetime" || mode === "date") {
                    if (index == 0 || index == 1) {
                        dateTime += '-'
                    } else if (index == 3 || (index == 4 && index != selectValues.length - 1)) {
                        dateTime += ':'
                    } else if (index == 2 && index != selectValues.length - 1) {
                        dateTime += ' '
                    }
                } else {
                    if (index == 0 || index == 1) {
                        dateTime += ':'
                    }
                }
            })


            this.setData({
                dateTime: dateTime
            })

            // 触发父组件把值传递给父组件
            this.triggerEvent('change', {
                value: dateTime
            })
        },
        // 当具体的一项的值发生改变时触发
        // @param {Number} ev
        selectColumnChangeFn(ev) {
            const {
                column,
                value
            } = ev.detail
            let {
                rangeList,
                rangeValue
            } = this.data
            let selectValue = Number(rangeList[column][value]
                .substring(0, rangeList[column][value].length - 1))
            if (column === 1) { // 改变月份 
                const currentYear = Number(rangeList[0][rangeValue[0]]
                    .substring(0, rangeList[0][rangeValue[0]].length - 1))
                const dayList = this._gotDayList(currentYear, selectValue)
                rangeList[column + 1] = dayList
            }
            this.setData({
                rangeList
            })
        }
    }
})
// 自定义异常
function CommonException(errMsg, code) {
    this.errMsg = errMsg
    this.code = code
}


 