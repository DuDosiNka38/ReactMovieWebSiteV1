import {makeAutoObservable} from "mobx";

export default class DeviceStore{

    constructor(){

        this._rooms = []
        this._selectedRooms = {}
        this._selectedUser = {}
        this._message=[]
 
makeAutoObservable(this)

}



setSelectedUser(selectedUser){
    this._selectedUser= selectedUser
}

setRooms(Rooms){
    this._rooms = Rooms
}


setSelectedRooms(selectedRooms){
    this._selectedRooms = selectedRooms
}


setMessage(message){
    this._message = message
}


get rooms(){
        return this._devices
        
        }
    
        get SelectedUser(){
            return this._selectedUser
            
            }


 get SelectedRooms(){
     return this.selectedRooms
                    }

get message(){
return this._message
}






}