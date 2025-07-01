export const Endpoints = {
	// Auth
	AuthLogin: "/auth/login",
	AuthSignUp: "/auth/sign-up",
	AuthMe: "/auth/me",
	// Crews
	CrewsCreate: "/crews",
	CrewsList: "/crews",
	CrewsGet: "/crews/:code",
	CrewsUpdate: "/crews/:id",
	CrewsDelete: "/crews/:id",
	CrewsJoinByCode: "/crews/join",
	CrewsLeave: "/crews/leave",
	CrewsUpdateAdmin: "/crews/:userId/admin",
	CrewsAcceptMember: "/crews/accept-member",
	CrewsKickMember: "/crews/kick-member",
	// Users
	UsersCreate: "/users",
	UsersList: "/users",
	UsersGet: "/users/:id",
	UsersUpdate: "/users/:id",
	UsersDelete: "/users/:id",
};
