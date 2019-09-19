const mongoose = require('mongoose');

function Cycle(key, options) {
    mongoose.SchemaType.call(this, key, options, 'Cycle');
}

Cycle.prototype = Object.create(mongoose.SchemaType.prototype);

/**
 * 参数可以是任意类型的数据，如果数据类型不匹配，抛出错误
 * @param val
 * @returns {number}
 */
Cycle.prototype.cast = function (val) {
    /**
    * 
    * @param val 任务周期 M-D|W H:M:S
    * @example 每月1日10点   -1| 10:0:0
    * @example 情人节        2-14| 0:0:0
    * @example 每周六晚7:30  -|6 19:30:0
    * @example 每天8点       -| 8:0:0 
    */

    let dayAndTime: Array<String> = val.split(' ')

    if (!dayAndTime[0]) {
        throw new Error('schema type of Cycle is error')
    }
    let dayOrWeekday = dayAndTime[0].split('|')
    if (!dayOrWeekday[0]) {
        throw new Error('schema type of Cycle is error')
    }
    this.Weekday = parseInt(dayOrWeekday[1])
    if (this.Weekday && (this.Weekday < 1 || this.Weekday > 7)) {
        throw new Error('Weekday of Cycle is error')
    }
    let monthAndDay = dayOrWeekday[0].split('-')
    this.Month = parseInt(monthAndDay[0])
    this.Day = parseInt(monthAndDay[1])

    if (this.Month && (this.Month < 1 || this.Month > 12)) {
        throw new Error('Month of Cycle is error')
    }
    if (this.Day && (this.Day < 1 && this.Day > 31)) {
        throw new Error('Day of Cycle is error')
    }
    try {
        this.getNextDay()
    } catch (e) {
        throw new Error('getNextDay of Cycle is error')
    }
    return val


};
Cycle.prototype.getNextDay = (): Date => {
    let date = new Date()
    let year = date.getFullYear()
    if (this.Day) {
        if (this.Month) {
            return new Date(`${year}-${this.Month}-${this.Day}`)
        }
        let month = new Date().getMonth()
        return new Date(year, month, this.Day)
    }
    if (this.Weekday) {
        let dayOff = this.Weekday - date.getDay()
        dayOff = dayOff > 0 ? dayOff : dayOff + 7
        return new Date(date.setDate(date.getDate() + dayOff))
    }
    return null
}


// 添加到Schema.Types
mongoose.Schema.Types.Cycle = Cycle;
export {
   Cycle 
} 

// export class Cycle extends mongoose.SchemaType {
//     constructor(key, options) {
//         super(key, options, 'Cycle')
//     }
//     //每年X月
//     // everyYeay:{type:number,min:1,max:31},
//     //每月
//     Month: number
//     //每天
//     Day: number
//     //每周X日
//     Weekday: number

//     /**
//      * 
//      * @param val 任务周期 M-D|W H:M:S
//      * @example 每月1日10点   -1| 10:0:0
//      * @example 情人节        2-14| 0:0:0
//      * @example 每周六晚7:30  -|6 19:30:0
//      * @example 每天8点       -| 8:0:0 
//      */
//     cast(val: String):String {
//         let dayAndTime: Array<String> = val.split(' ')

//         if (!dayAndTime[0]) {
//             throw new Error('schema type of Cycle is error')
//         }
//         let dayOrWeekday = dayAndTime[0].split('|')
//         if (!dayOrWeekday[0]) {
//             throw new Error('schema type of Cycle is error')
//         }
//         this.Weekday = parseInt(dayOrWeekday[1])
//         if (this.Weekday && (this.Weekday < 1 || this.Weekday > 7)) {
//             throw new Error('Weekday of Cycle is error')
//         }
//         let monthAndDay = dayOrWeekday[0].split('-')
//         this.Month = parseInt(monthAndDay[0])
//         this.Day = parseInt(monthAndDay[1])

//         if (this.Month && (this.Month < 1 || this.Month > 12)) {
//             throw new Error('Month of Cycle is error')
//         }
//         if (this.Day && (this.Day < 1 && this.Day > 31)) {
//             throw new Error('Day of Cycle is error')
//         }
//         try{
//             this.getNextDay()
//         }catch(e){
//             throw new Error('getNextDay of Cycle is error')
//         }
//         return val
//     }
//     getNextDay():Date {
//         let date = new Date()
//         let year = date.getFullYear()
//         if (this.Day) {
//             if (this.Month) {
//                 return new Date(`${year}-${this.Month}-${this.Day}`)
//             }
//             let month = new Date().getMonth()
//             return new Date(year, month, this.Day)
//         }
//         if (this.Weekday) {
//             let dayOff = this.Weekday - date.getDay()
//             dayOff = dayOff > 0 ? dayOff : dayOff + 7
//             return new Date(date.setDate(date.getDate() + dayOff))
//         }
//         return null
//     }
//     getNextTime() {

//     }
// }
//Cycle.prototype.$conditionalHandlers = mongoose.Schema.Types.String.prototype.$conditionalHandlers;
//mongoose.SchemaTypes.Cycle=Cycle
//Schema.Types.Cycle = Cycle;