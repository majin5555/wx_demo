// components/calendar/calendar.js
Component({
  options: {
    styleIsolation: 'apply-shared'
  },
  properties: {

    /**
     * 选中的日期
     */
    selected: {
      type: Array,
      value: [],
      observer(newVal, oldVal) {
        this.getWeek(new Date())
      }
    },


    /**
     * 是否多选日期
     */
    multiple: {
      type: String,
      value: "single" //single Multiple  section
    },

    /**
     * 是否不能修改
     */
    readonly: {
      type: Boolean,
      value: false
    },

  },

  /**
   * 组件的初始数据
   */
  data: {
    selectDay: '', // 当前选择日期
    selectDays: [], //多选日期
    canlender: {
      "weeks": []
    },
    currentMonth: null,
    nowMonth: new Date().getMonth() + 1,
    nowDate: new Date().getDate(),
    isSection: false, //是否是区间
    minTime: '', //最小时间（区间选择 字符串）
    maxTime: '', //最大时间（区间选择 字符串）
    startDate: [], //开始时间（区间选择,显示开始文字）
    endDate: [], //结束时间（区间选择，显示结束文字）
  },
  ready() {
    let sdays = this.data.selected;
    sdays.forEach(v => {
      this.data.selectDays.push(v);
    })
    this.getWeek(new Date());
    //获取最大最小时间
    this._getMinMax(sdays)
    // 是否是区间
    this._range(this.data.canlender, this.data.minTime, this.data.maxTime)
    this.setData({
      isSection: this.properties.multiple === "section" ? true : false
    })

  },
  /**
   * 组件的方法列表
   */
  methods: {

    //选择日期
    selectDay(e) {
      if (this.data.readonly) {
        return
      }
      let index = e.currentTarget.dataset.index;
      let week = e.currentTarget.dataset.week;
      let canlender = this.data.canlender;

      let month = canlender.weeks[week][index].month < 10 ? "0" + canlender.weeks[week][index].month : canlender.weeks[week][index].month
      let date = canlender.weeks[week][index].date < 10 ? "0" + canlender.weeks[week][index].date : canlender.weeks[week][index].date
      let datestr = canlender.year + "-" + month + "-" + date;
      let selectDays = this.data.selectDays;

      if (selectDays.indexOf(datestr) == -1) {
        //single Multiple  section
        if (this.data.multiple === "Multiple") {
          //多选
          selectDays.push(datestr);
        } else if (this.data.multiple === "single") {
          selectDays = []; //只保留最后选的
          selectDays.push(datestr);
        } else {
          if (this.data.selectDays.length >= 2) selectDays = []
          //区间选择
          selectDays.push(datestr);
          //获取最大最小时间
          this._getMinMax(selectDays)

        }
      }
      this.data.selectDays = selectDays;
      this.getWeek(datestr);
      this._range(this.data.canlender, this.data.minTime, this.data.maxTime)
  
      this.triggerEvent('getdate', selectDays)
    },


    // 前一月|| 后一月
    dataBefor(e) {
      let num = 0;
      let types = e.currentTarget.dataset.type;

      if (e.currentTarget.dataset.id === "0") {
        num = -1;
      } else {
        num = 1
      }
      let year = this.data.canlender.year + "-" + this.data.canlender.month + "-" + this.data.canlender.date
      let _date = this.getDate(year, num, types === 'month' ? "month" : "day");
      this.getWeek(_date);
      //计算区间
      this._range(this.data.canlender, this.data.minTime, this.data.maxTime)
    },

    // 获取日历内容
    getWeek(dateData) {
      let selected = this.data.selected
      let selectDays = this.data.selectDays
      // 判断当前是 安卓还是ios ，传入不容的日期格式
      if (typeof dateData !== 'object') {
        dateData = dateData.replace(/-/g, "/")
      }
      let _date = new Date(dateData);
      let year = _date.getFullYear(); //年
      let month = _date.getMonth() + 1; //月
      let date = _date.getDate(); //日
      let day = _date.getDay(); // 天
      let canlender = [];

      let dates = {
        firstDay: new Date(year, month - 1, 1).getDay(),
        lastMonthDays: [], // 上个月末尾几天
        currentMonthDys: [], // 本月天数
        nextMonthDays: [], // 下个月开始几天
        endDay: new Date(year, month, 0).getDay(),
        weeks: []
      }
      // 循环上个月末尾几天添加到数组
      for (let i = dates.firstDay; i > 0; i--) {
        let dd = new Date(year, month - 1, -(i - 1));
        let checked = false;
        selectDays.forEach(v => {
          let selDate = v.split('-');
          let ddstr = this.dateStr(dd);
          if (ddstr == v) {
            checked = true;
          }
        })
        dates.lastMonthDays.push({
          'date': dd.getDate() + '',
          'month': month - 1,
          checked,

        })
      }
      // 循环本月天数添加到数组
      for (let i = 1; i <= new Date(year, month, 0).getDate(); i++) {
        let checked = false;
        selectDays.forEach(v => {
          let selDate = v.split('-');
          if (Number(year) === Number(selDate[0]) && Number(month) === Number(selDate[1]) && Number(i) === Number(selDate[2])) {
            checked = true
          }
        })
        dates.currentMonthDys.push({
          'date': i + "",
          'month': month,
          checked,

        })
      }
      // 循环下个月开始几天 添加到数组
      for (let i = 1; i < 7 - dates.endDay; i++) {
        dates.nextMonthDays.push({
          'date': i + '',
          'month': month + 1,
        })
      }

      canlender = canlender.concat(dates.lastMonthDays, dates.currentMonthDys, dates.nextMonthDays)
      // 拼接数组  上个月开始几天 + 本月天数+ 下个月开始几天
      for (let i = 0; i < canlender.length; i++) {
        if (i % 7 == 0) {
          dates.weeks[parseInt(i / 7)] = new Array(7);
        }
        dates.weeks[parseInt(i / 7)][i % 7] = canlender[i]
      }

      // 渲染数据
      this.setData({
        selectDay: month + "月" + date + "日",
        "canlender.weeks": dates.weeks,
        'canlender.month': month,
        'canlender.date': date,
        "canlender.day": day,
        'canlender.year': year,
        range: false,
        startDate: [],
        endDate: [],
        // minTime: [],
        // maxTime: [],
      })
      month = month < 10 ? "0" + month : month
      date = date < 10 ? "0" + date : date

    },

    /**
     * 时间计算
     */
    getDate(date, AddDayCount, str = 'day') {
      if (typeof date !== 'object') {
        date = date.replace(/-/g, "/")
      }
      let dd = new Date(date)
      switch (str) {
        case 'day':
          dd.setDate(dd.getDate() + AddDayCount) // 获取AddDayCount天后的日期
          break;
        case 'month':
          dd.setMonth(dd.getMonth() + AddDayCount) // 获取AddDayCount天后的日期
          break;
        case 'year':
          dd.setFullYear(dd.getFullYear() + AddDayCount) // 获取AddDayCount天后的日期
          break;
      }
      let y = dd.getFullYear()
      let m = (dd.getMonth() + 1) < 10 ? '0' + (dd.getMonth() + 1) : (dd.getMonth() + 1) // 获取当前月份的日期，不足10补0
      let d = dd.getDate() < 10 ? '0' + dd.getDate() : dd.getDate() // 获取当前几号，不足10补0
      this.setData({
        currentMonth: m
      })
      return y + '-' + m + '-' + d
    },
    //日期转字符串
    dateStr(calendar) {
      let year = calendar.getFullYear();
      let month = calendar.getMonth() + 1;
      let date = calendar.getDate();
      month = month < 10 ? "0" + month : month;
      date = date < 10 ? "0" + date : date;
      let datestr = year + "-" + month + "-" + date;
      return datestr;
    },
    format(dd) {
      let y = dd.getFullYear()
      let m = (dd.getMonth() + 1) < 10 ? '0' + (dd.getMonth() + 1) : (dd.getMonth() + 1)
      let d = dd.getDate() < 10 ? '0' + dd.getDate() : dd.getDate()
      return y + '-' + m + '-' + d
    },

    //获取最小 最大时间
    _getMinMax(selectDays) {
      let selectDaysCopy = selectDays
      //-变化/ 兼容ios
      selectDaysCopy = selectDaysCopy.map((item) => {
        return item.replace(/-/g, "/")
      })

      if (selectDaysCopy.length > 1) {
        if (this._getTime(selectDaysCopy[0]) - this._getTime(selectDaysCopy[1]) > 0) {
          this.data.minTime = selectDaysCopy[1]
          this.data.maxTime = selectDaysCopy[0]
        } else {
          this.data.minTime = selectDaysCopy[0]
          this.data.maxTime = selectDaysCopy[1]
        }
      }
    },
    //计算区间
    _range(canlender, minTime, maxTime) {
      // 区间 并且 数量大于 1
      if (this.data.multiple === "section" && this.data.selectDays.length > 1) {
        canlender.weeks.forEach((item) => {
          item.forEach((item1) => {
            const dateTime = this._getTime(canlender.year + "/" + item1.month + "/" + item1.date)

            if (this._getTime(minTime) < dateTime && dateTime < this._getTime(maxTime)) {
              item1.range = true
            }
          })
        })
        //分解 min  max 到 startDate  endDate （显示结束隐藏）
        let startDate = this._getTimeItem([minTime])
        let endDate = this._getTimeItem([maxTime])

        this.setData({
          "canlender.weeks": canlender.weeks,
          startDate: startDate,
          endDate: endDate
        })
      }
    },

    //获取时间戳
    _getTime(time) {
      return new Date(time).getTime()
    },
    //获取时间（分解的 ，用于显示开始文字）
    _getTimeItem(timeArray) {
      let array = []
      timeArray.map((v) => {
        array = v.split('/').map((item) => {
          return Number(item)
        })
      })
      return array
    }
  }
})