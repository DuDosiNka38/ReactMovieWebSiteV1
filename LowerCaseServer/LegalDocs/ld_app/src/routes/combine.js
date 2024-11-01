import { authProtectedRoutes, publicRoutes } from "./index";

export default (type, args) => {
  const Routes = [...publicRoutes, ...authProtectedRoutes];

  const Route = {...Routes.find((x) => x.type === type)};

  if(!Route){
    console.group("Combine Route");

    console.log(`Route is not exists: ${type} (${JSON.stringify(args)})`);
    console.groupEnd();
    return "#";
  }

  if(Route.path && Route.path.indexOf(":") === -1)
    return Route.path;

  for(let param in args){
    Route.path = Route.path.replace(`:${param}`, args[param]);
  }

  return  Route.path;
  
};