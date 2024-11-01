
import { ADMIN_ROUTE, DEVICE_ROUTE, LOGIN_ROUTE, REGISTRATION_ROUTE, SHOPS_ROUTE } from "./const";
import AdminPage from "./pages/AdminPage";
import AuthPage from "./pages/AuthPage";
import DivacePage from "./pages/DevicePage";
import ShopPage from "./pages/ShopPage";

export const authRoutes = [{
    path: ADMIN_ROUTE,
    Component: AdminPage
    
}]


export const publicRoutes = [{
    path: SHOPS_ROUTE,
    Component: ShopPage
},
{
    path: DEVICE_ROUTE + "/:id",
    Component:DivacePage
},
{
    path: LOGIN_ROUTE,
    Component:AuthPage
},{
    path: REGISTRATION_ROUTE,
    Component:AuthPage
},
]