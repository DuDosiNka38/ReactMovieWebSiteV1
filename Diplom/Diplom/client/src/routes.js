import { ADMIN_ROUTE, LOGIN_ROUTE, REGISTRATION_ROUTE, ROOMS_ROUTE } from "./const";
import AdminPage from "./pages/AdminPage";
import AuthPage from "./pages/AuthPage";
import GameSetup from "./pages/GameSetup";
import RoomsPage from "./pages/RoomsPages";


export const authRoutes = [{
    path: ADMIN_ROUTE,
    Component: AdminPage
    
}

]


export const publicRoutes = [
{
    path: LOGIN_ROUTE,
    Component:AuthPage
},{
    path: REGISTRATION_ROUTE,
    Component:AuthPage
},{
    path: ROOMS_ROUTE,
    Component:RoomsPage
},
{
    path: ROOMS_ROUTE + "/:id",
    Component:GameSetup
}




]