import {makeAutoObservable} from "mobx";

export default class DeviceStore{

    constructor(){

        this._types = []
        this.selectedType = {}
        this._brands = []
        this.selectedBrand = {}
        this._devices = []
        this.selectedDevice = {}
        this._discription=[]
        this._page = 1
        this._totalCount = 10
        this._limit = 8


this.selectedDisctiption= {}
makeAutoObservable(this)

}


setTypes(types){
    this._types = types
}

setSelectedType(type){
this.selectedType = type

}

setBrands(brands){
    this._brands = brands
}


    setPage(page) {
        this._page = page
    }
    setTotalCount(count) {
        this._totalCount = count
    }



setDevice(device){
    this._devices = device
}

setSelectedBrand(brand){
    this.selectedBrand = brand
    
    }




get types (){
return  this._types 

}
 

get Brands(){
    return this._brands
    
    }

get Device(){
        return this._devices
        
        }
    
get SelectedBrand(){
        return this.selectedBrand
            
            }   
get SelectedType(){
      return this.selectedType
                
                }
 get SelectedDevice(){
     return this.selectedDevice
                    }

get discription(){
return this._discription
}

get selectedDiscription(){
    return this.selectedDiscription
    }

    get page() {
        return this._page
    }
    get limit() {
        return this._limit
    }



}