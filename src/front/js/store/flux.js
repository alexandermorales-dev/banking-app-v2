const getState = ({ getStore, getActions, setStore }) => {
	return {
		store: {
			message: null,
			demo: [
				{
					title: "FIRST",
					background: "white",
					initial: "white"
				},
				{
					title: "SECOND",
					background: "white",
					initial: "white"
				}
			]
		},
		actions: {
			// Use getActions to call a function within a fuction
			exampleFunction: () => {
				getActions().changeColor(0, "green");
			},

			getMessage: async () => {
				try {
					// fetching data from the backend
					const resp = await fetch(process.env.BACKEND_URL + "/api/hello")
					const data = await resp.json()
					setStore({ message: data.message })
					// don't forget to return something, that is how the async resolves
					return data;
				} catch (error) {
					console.log("Error loading message from backend", error)
				}
			},
			changeColor: (index, color) => {
				//get the store
				const store = getStore();

				//we have to loop the entire demo array to look for the respective index
				//and change its color
				const demo = store.demo.map((elm, i) => {
					if (i === index) elm.background = color;
					return elm;
				});

				//reset the global store
				setStore({ demo: demo });
			}, createAccount: async (dataToSend) => {

				try {
					const res = await fetch(process.env.BACKEND_URL + "api/signup", {
						method: 'POST',
						headers: {
							'Content-Type': 'application/json',
						},
						body: JSON.stringify(dataToSend),
					});



					const data = await res.json()
					return data.message

				} catch (error) {
					console.log('this is the error: ', error)
				}
			},
			handleLogin: async (userData) => {

				try {
					const res = await fetch(process.env.BACKEND_URL + "api/login", {
						method: 'POST',
						headers: {
							'Content-Type': 'application/json',
						},
						body: JSON.stringify(userData),
					});

					if (!res.ok) {
						const errorMsg = await res.json()
						throw new Error(errorMsg.message)

					}

					const data = await res.json()
					console.log(data)
					setStore({ ...getStore(), currentUser: data.current_user })
					return data.message

				} catch (error) {
					console.log('this is the error: ', error)
				}
			},
			handleLogout: () => {
				setStore({ ...getStore(), currentUser: '' })
			}
		},

	};
};

export default getState;
