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
			],
			hasAccess: false
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
					console.log(data)
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
						return errorMsg.message
						

					}

					const data = await res.json()
					setStore({ ...getStore(), currentUser: data.current_user, hasAccess: true })
					localStorage.setItem('token', data.token)
					const userInfo = JSON.stringify(data.current_user)
					localStorage.setItem('user', userInfo)
					return data

				} catch (error) {
					console.log('this is the error: ', error)
				}
			},
			handleLogout: () => {
				localStorage.removeItem('token')
				localStorage.removeItem('user')
				setStore({ ...getStore(), currentUser: '', hasAccess: false })
			},
			handleDashboard: async (token) => {
				const res = await fetch(process.env.BACKEND_URL + "api/dashboard", {
					method: 'GET',
					headers: {
						'Authorization': `Bearer ${token}`,
						'Content-Type': 'application/json'
					}
				})

				if (!res.ok) return null


				setStore({
					...getStore(), hasAccess: true
				})

				const data = await res.json()
				return data
			},
			handleTransaction: async (transactionData) => { // Renamed 'transaction' to 'transactionData' for clarity
				const token = localStorage.getItem('token'); // <--- GET TOKEN FROM LOCAL STORAGE
				if (!token) {
					console.error("No authentication token found. Please log in.");
					// Handle unauthenticated state, e.g., redirect to login
					return;
				}

				const res = await fetch(process.env.BACKEND_URL + "api/transactions", {
					method: 'POST',
					headers: {
						'Authorization': `Bearer ${token}`, // <--- USE THE TOKEN FROM LOCAL STORAGE
						'Content-Type': 'application/json',
					},
					body: JSON.stringify(transactionData), // <--- SEND ONLY THE TRANSACTION DATA
				});

				if (!res.ok) {
					console.error('API request failed:', res.status, res.statusText);
					const errorDetails = await res.json().catch(() => ({ message: 'No error message from server' }));
					console.error('Error details:', errorDetails);
					// You might want to throw an error or return a specific error object
					throw new Error(errorDetails.message || 'Something went wrong with the transaction.');
				}

				const data = await res.json();
				console.log('Transaction successful:', data);
				return data;
			}
		},

	};
};

export default getState;
