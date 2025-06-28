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
			allTransactions: []
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
					return data

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
						return (errorMsg.message)


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
				setStore({})
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

				const data = await res.json()
				setStore({ ...getStore(), balance: data.balance, totalDeposits: data.deposits, totalWithdrawals: data.withdrawals, accountNumber: data.account_number, allTransactions: data.all_transactions })
				console.log(data)
				return data
			},
			handleTransaction: async (transactionData) => {
				const token = localStorage.getItem('token');
				if (!token) {
					console.error("No authentication token found. Please log in.");
					return;
				}

				const res = await fetch(process.env.BACKEND_URL + "api/transactions", {
					method: 'POST',
					headers: {
						'Authorization': `Bearer ${token}`,
						'Content-Type': 'application/json',
					},
					body: JSON.stringify(transactionData),
				});

				if (!res.ok) {
					console.error('API request failed:', res.status, res.statusText);
					const errorDetails = await res.json().catch(() => ({ message: 'No error message from server' }));
					console.error('Error details:', errorDetails);
					throw new Error(errorDetails.message || 'Something went wrong with the transaction.');
				}

				const data = await res.json();
				console.log(data)
				setStore({ ...getStore(), balance: parseInt(data.new_balance), totalDeposits: parseInt(data.total_deposits), totalWithdrawals: parseInt(data.total_withdrawals), allTransactions: data.transactions })
				return data;
			},
			handleDelete: async (id) => {
				const token = localStorage.getItem('token'); // 
				const url = process.env.BACKEND_URL + `api/user/${id}`;

				try {
					const res = await fetch(url, {
						method: 'DELETE',
						headers: {
							'Authorization': `Bearer ${token}`,
						},

					});

					if (!res.ok) {
						let errorMessage = "An unknown error occurred.";
						try {
							const errorData = await res.json();
							errorMessage = errorData.message || errorMessage;
						} catch (parseError) {
							errorMessage = `Error ${res.status}: ${res.statusText || "Unable to process request"}`;
							console.warn("Could not parse error response JSON:", parseError, res);
						}
						console.error(`Failed to delete user ${id}: ${errorMessage}`);
						throw new Error(errorMessage);
					}

					if (res.status === 204) {
						return "User deleted successfully!";
					} else {
						const data = await res.json();
						return data.message || "User deleted successfully!";
					}

				} catch (error) {
					console.error("Network or unexpected error during deletion:", error);
					throw error;
				}
			},
		},

	};
};

export default getState;
