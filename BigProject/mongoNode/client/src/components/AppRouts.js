
import {Routes, Route, Navigate} from "react-router-dom"
import { authRoutes, publicRoutes } from "../routes";
import { SHOPS_ROUTE } from "../const";
import { useContext } from "react";
import { Context } from "..";
import { observer } from "mobx-react-lite";

const AppRouter = observer(() => {

    const {user} = useContext(Context)

    console.log(user)


    return (
<Routes>
{user._isAuth && authRoutes.map(({path, Component})=>
<Route key = {path} path = {path} Component = {Component} exact></Route>
)}

{publicRoutes.map(({path, Component})=>
<Route key = {path} path = {path} Component = {Component} exact></Route>
)}

<Route path="*" element={<Navigate replace to = {SHOPS_ROUTE}/>}/>

</Routes>
    
    );
  })
  
  export default AppRouter;