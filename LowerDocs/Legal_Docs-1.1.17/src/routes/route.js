import React from "react";
import { Route, Redirect } from "react-router-dom";


const AppRoute = ({
	component: Component,
	layout: Layout,
	isAuthProtected,
	isUserLoggedIn,
	isMountDataLoaded,
	getLocalStorage,
	...rest
}) => (
		<Route
			{...rest} 
			
			render={props => { 
				if (isAuthProtected && !isUserLoggedIn && isMountDataLoaded) { 
					return (
						<Redirect to={{ pathname: "/login", state: { from: props.location } }} />
					);				
				} 

				if (!isAuthProtected && isUserLoggedIn && isMountDataLoaded) { 
					return (
						<Redirect to={{ pathname: "/home", state: { from: props.location } }} />
					);				
				} 

				return (
					<Layout>
						<Component {...props } />
					</Layout>
				);
			}}
		/>
	);

export default AppRoute;

