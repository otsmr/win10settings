import React from "react";

export default class {

    t: Function
    h: Function

    localizationData: any
    fallbackData: any

    constructor(localizationData = {}, fallbackData = {}) {
        this.localizationData = localizationData
        this.fallbackData = fallbackData

        // getString shorthand
        this.t = this.getString
        this.h = this.getHTML
    }

    setLocalizationData(data = {}, fallback = {}) {
        this.localizationData = data
        this.fallbackData = fallback
    }

    makeTranslation(string: string, args: any[]) {
        let outString = string
        for(let i = 1; i <= args.length; i++) {
            outString = outString.replace(`{{${i}}}`, args[i - 1])
        }
        return outString
    }

    getString(key:string, ...args: any[]) {
        if(this.localizationData[key] !== undefined) {
            return this.makeTranslation(this.localizationData[key], args)
        } else if(this.fallbackData[key] !== undefined) {
            return this.makeTranslation(this.fallbackData[key], args)
        } else {
            return key
        }
    }

    getHTML (key:string, ...args: any[]) {
        if(this.localizationData[key] !== undefined) {
    
            return (
                <span dangerouslySetInnerHTML={{
                    __html: this.makeTranslation(this.localizationData[key], args)
                }}></span>
            ) 

        } else if(this.fallbackData[key] !== undefined) {

            return (
                <span dangerouslySetInnerHTML={{
                    __html: this.makeTranslation(this.fallbackData[key], args)
                }}></span>
            ) 

        } else {
            return key
        }
        // return this.getString(key, args)
    }
}