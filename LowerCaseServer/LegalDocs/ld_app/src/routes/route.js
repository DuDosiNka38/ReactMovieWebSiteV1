import React from "react";
import { Route, Redirect } from "react-router-dom";
import AuthService from "../services/AuthService";

const AppRoute = ({
	component: Component,
	layout: Layout,
	isAuthProtected,
	...rest
}) => (

		<Route
			{...rest}
      exact
			render={props => {
				if (isAuthProtected && AuthService.getAuthHash() === null) {
					return (
						<Redirect to={{ pathname: "/signin", state: { from: props.location } }} />
					);
				}

				if (!isAuthProtected && AuthService.getAuthHash()) {
					return (
						<Redirect to={{ pathname: "/dashboard", state: { from: props.location } }} />
					);
				}

				return (
					<Layout>
						<Component {...props} />
					</Layout>
				);
			}}
		/>
	);

export default AppRoute;

