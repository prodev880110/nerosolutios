const messages = {
	en: {
		translations: {
			signup: {
				title: "Sign up",
				toasts: {
					success: "User created successfully! Please login!",
					fail: "Error creating user. Check the reported data.",
				},
				form: {
					name: "Name",
					email: "Email",
					password: "Password",
				},
				buttons: {
					submit: "Register",
					login: "Already have an account? Log in!",
				},
			},
			login: {
				title: "Login",
				logoName: "Login",
				brandName: "Panel",
				form: {
					company: "Client Company Code",
					email: "Email",
					password: "Password",
				},
				buttons: {
					submit: "Login",
					register: "Don't have an account? Register!",
				},
			},
    //   companies: {
    //      title: "Register Company",
    //      form: {
    //        name: "Company Name",
    //        plan: "Plan",
    //        token: "Token",
    //        submit: "Register",
    //        success: "Company created successfully!",
    //      },
	companies: {
		title: "Companies",
		table: {
			name: "Name",
			email: "Email",
			profile: "Profile",
			actions: "Actions",
		},
		buttons: {
			add: "Add Company",
		},
		toasts: {
			deleted: "Company deleted sucessfully.",
		},
		confirmationModal: {
		deleteTitle: "Delete",
		deleteMessage:
			"All data will be lost. Open calls from this Company will be moved to the queue.",
		},
       },
			auth: {
				toasts: {
					success: "Login successfully!",
				},
			},
			dashboard: {
				charts: {
					perDay: {
						title: "Tickets today: ",
					},
				},
				messages: {
				  inAttendance: {
					title: "In Service"
				  },
				  waiting: {
					title: "Waiting"
				  },
				  closed: {
					title: "Finished"
				  }
				}
			  },
			connections: {
				title: "Connections",
				toasts: {
					deleted: "WhatsApp connection deleted sucessfully!",
				},
				confirmationModal: {
					deleteTitle: "Delete",
					deleteMessage: "Are you sure? It cannot be reverted.",
					disconnectTitle: "Disconnect",
					disconnectMessage: "Are you sure? You'll need to read QR Code again.",
				},
				buttons: {
					add: "Add WhatsApp",
					disconnect: "Disconnect",
					tryAgain: "Try Again",
					qrcode: "QR CODE",
					newQr: "New QR CODE",
					connecting: "Connectiing",
				},
				toolTips: {
					disconnected: {
						title: "Failed to start WhatsApp session",
						content:
							"Make sure your cell phone is connected to the internet and try again, or request a new QR Code",
					},
					qrcode: {
						title: "Waiting for QR Code read",
						content:
							"Click on 'QR CODE' button and read the QR Code with your cell phone to start session",
					},
					connected: {
						title: "Connection established",
					},
					timeout: {
						title: "Connection with cell phone has been lost",
						content:
							"Make sure your cell phone is connected to the internet and WhatsApp is open, or click on 'Disconnect' button to get a new QRcode",
					},
				},
				table: {
					name: "Name",
					status: "Status",
					lastUpdate: "Last Update",
					default: "Default",
					actions: "Actions",
					session: "Session",
				},
			},
			whatsappModal: {
				title: {
					add: "Add WhatsApp",
					edit: "Edit WhatsApp",
				},
				form: {
					name: "Name",
					default: "Default",
				},
				buttons: {
					okAdd: "Add",
					okEdit: "Save",
					cancel: "Cancel",
				},
				success: "WhatsApp saved successfully.",
			},
			qrCode: {
				message: "Read QrCode to start the session",
			},
			contacts: {
				title: "Contacts",
				toasts: {
					deleted: "Contact deleted sucessfully!",
				},
				searchPlaceholder: "Search ...",
				confirmationModal: {
					deleteTitle: "Delete",
					importTitlte: "Import contacts",
					deleteMessage:
						"Are you sure you want to delete this contact? All related tickets will be lost.",
					importMessage: "Do you want to import all contacts from the phone?",
				},
				buttons: {
					import: "Import Contacts",
					add: "Add Contact",
				},
				table: {
					name: "Name",
					whatsapp: "WhatsApp",
					email: "Email",
					actions: "Actions",
				},
			},
			contactModal: {
				title: {
					add: "Add contact",
					edit: "Edit contact",
				},
				form: {
					mainInfo: "Contact details",
					extraInfo: "Additional information",
					name: "Name",
					number: "Whatsapp number",
					email: "Email",
					extraName: "Field name",
					extraValue: "Value",
				},
				buttons: {
					addExtraInfo: "Add information",
					okAdd: "Add",
					okEdit: "Save",
					cancel: "Cancel",
				},
				success: "Contact saved successfully.",
			},
			quickAnswersModal: {
				title: {
				  add: "Add Quick Reply",
				  edit: "Edit Quick Reply",
				},
				form: {
				  shortcut: "Shortcut",
				  message: "Quick Reply",
				},
				buttons: {
				  okAdd: "Add",
				  okEdit: "Save",
				  cancel: "Cancel",
				},
				success: "Quick Reply successfully saved.",
			  },
			queueModal: {
				title: {
					add: "Add queue",
					edit: "Edit queue",
				},
				form: {
					name: "Name",
					color: "Color",
					greetingMessage: "Greeting Message",
				},
				buttons: {
					okAdd: "Add",
					okEdit: "Save",
					cancel: "Cancel",
				},
			},
			userModal: {
				title: {
					add: "Add user",
					edit: "Edit user",
				},
				form: {
					name: "Name",
					email: "Email",
					password: "Password",
					profile: "Profile",
				},
				buttons: {
					okAdd: "Add",
					okEdit: "Save",
					cancel: "Cancel",
				},
				success: "User saved successfully.",
			},
			companyModal: {
				title: {
					add: "Add Company",
					edit: "Edit Company",
				},
				form: {
					name: "Name",
					email: "Email",
					password: "Password",
					profile: "Profile",
				},
				buttons: {
					okAdd: "Add",
					okEdit: "Save",
					cancel: "Cancel",
				},
				success: "User saved successfully.",
			},
      scheduleModal: {
         title: {
           add: "New Schedule",
           edit: "Edit Schedule",
         },
         form: {
           body: "Message",
           contact: "Contact",
           sendAt: "Schedule Date",
           sentAt: "Send Date",
         },
         buttons: {
           okAdd: "Add",
           okEdit: "Save",
           cancel: "Cancel",
         },
         success: "Schedule saved successfully.",
       },
       tagModal: {
         title: {
           add: "New Tag",
           edit: "Edit Tag",
         },
         form: {
           name: "Name",
           color: "Color",
         },
         buttons: {
           okAdd: "Add",
           okEdit: "Save",
           cancel: "Cancel",
         },
         success: "Tag successfully saved.",
       },
			chat: {
				noTicketMessage: "Select a ticket to start chatting.",
			},
			ticketsManager: {
				buttons: {
					newTicket: "New",
				},
			},
			ticketsQueueSelect: {
				placeholder: "Queues",
			},
			tickets: {
				toasts: {
					deleted: "The ticket you were on has been deleted.",
				},
				notification: {
					message: "Message from",
				},
				tabs: {
					open: { title: "Inbox" },
					closed: { title: "Resolved" },
					search: { title: "Search" },
				},
				search: {
					placeholder: "Search tickets and messages.",
				},
				buttons: {
					showAll: "All",
				},
			},
			transferTicketModal: {
				title: "Transfer Ticket",
				fieldLabel: "Type to search for users",
				noOptions: "No user found with this name",
				buttons: {
					ok: "Transfer",
					cancel: "Cancel",
				},
			},
			ticketsList: {
				pendingHeader: "Queue",
				assignedHeader: "Working on",
				noTicketsTitle: "Nothing here!",
				noTicketsMessage: "No tickets found with this status or search term.",
				buttons: {
					accept: "Accept",
				},
			},
			newTicketModal: {
				title: "Create Ticket",
				fieldLabel: "Type to search for a contact",
				add: "Add",
				buttons: {
					ok: "Save",
					cancel: "Cancel",
				},
			},
			mainDrawer: {
				listItems: {
					dashboard: "Dashboard",
					connections: "Connections",
					tickets: "Tickets",
					quickMessages: "Quick Replies",
					contacts: "Contacts",
					queues: "Queues & Chatbot",
					tags: "tags",
					administration: "Administration",
					users: "Users",
					settings: "Settings",
					companies: "Companies",
					helps: "Help",
					messagesAPI: "API",
					schedules: "Schedules",
					campaigns: "Campaigns",
					annoucements: "Informations",
					chats: "Internal Chat",
				},
				appBar: {
					user: {
						profile: "Profile",
						logout: "Logout",
					},
				},
			},
      messagesAPI: {
         title: "API",
         textMessage: {
           number: "Number",
           body: "Message",
           token: "Registered token",
         },
         mediaMessage: {
           number: "Number",
           body: "File name",
           media: "File",
           token: "Registered token",
         },
       },
			notifications: {
				noTickets: "No notifications.",
			},
      quickMessages: {
         title: "Quick Answers",
         buttons: {
           add: "New Answer",
         },
         dialog: {
           shortcode: "Shortcut",
           message: "Response",
         },
       },
       contactLists: {
         title: "Contact Lists",
         table: {
           name: "Name",
           contacts: "Contacts",
           actions: "Actions",
         },
         buttons: {
           add: "New List",
         },
         dialog: {
           name: "Name",
           company: "Company",
           okEdit: "Edit",
           okAdd: "Add",
           add: "Add",
           edit: "Edit",
           cancel: "Cancel",
         },
         confirmationModal: {
           deleteTitle: "Delete",
           deleteMessage: "This action cannot be reversed.",
         },
         toasts: {
           deleted: "Record deleted",
         },
       },
       contactListItems: {
         title: "Contacts",
         searchPlaceholder: "Search",
         buttons: {
           add: "New",
           lists: "Lists",
           import: "Import",
         },
         dialog: {
           name: "Name",
           number: "Number",
           whatsapp: "Whatsapp",
           email: "Email",
           okEdit: "Edit",
           okAdd: "Add",
           add: "Add",
           edit: "Edit",
           cancel: "Cancel",
         },
         table: {
           name: "Name",
           number: "Number",
           whatsapp: "Whatsapp",
           email: "Email",
           actions: "Actions",
         },
         confirmationModal: {
           deleteTitle: "Delete",
           deleteMessage: "This action cannot be reversed.",
           importMessage: "Do you want to import contacts from this worksheet?",
           importTitle: "Import",
         },
         toasts: {
           deleted: "Record deleted",
         },
       },
       campaigns: {
         title: "Campaigns",
         searchPlaceholder: "Search",
         buttons: {
           add: "New Campaign",
           contactLists: "Contact Lists",
         },
         table: {
           name: "Name",
           whatsapp: "Connection",
           contactList: "Contact List",
           status: "Status",
           scheduledAt: "Schedule",
           completedAt: "Completed",
           confirmation: "Confirmation",
           actions: "Actions",
         },
         dialog: {
           new: "New Campaign",
           update: "Edit Campaign",
           readonly: "View Only",
           form: {
             name: "Name",
             message1: "Message 1",
             message2: "Message 2",
             message3: "Message 3",
             message4: "Message 4",
             message5: "Message 5",
             confirmationMessage1: "Confirmation Message 1",
             confirmationMessage2: "Confirmation Message 2",
             confirmationMessage3: "Confirmation Message 3",
             confirmationMessage4: "Confirmation Message 4",
             confirmationMessage5: "Confirmation Message 5",
             messagePlaceholder: "Message Content",
             whatsapp: "Connection",
             status: "Status",
             scheduledAt: "Schedule",
             confirmation: "Confirmation",
             contactList: "Contact List",
           },
           buttons: {
             add: "Add",
             edit: "Update",
             okadd: "Okay",
             cancel: "Cancel Shots",
             restart: "Restart Shots",
             close: "Close",
             attach: "Attach File",
           },
         },
         confirmationModal: {
           deleteTitle: "Delete",
           deleteMessage: "This action cannot be reversed.",
         },
         toasts: {
           success: "Operation performed successfully",
           cancel: "Campaign cancelled",
           restart: "Campaign restarted",
           deleted: "Record deleted",
         },
       },
       announcements: {
         title: "Information",
         searchPlaceholder: "Search",
         buttons: {
           add: "Add Newsletter",
           contactLists: "Newsletter Lists",
         },
         table: {
           priority: "Priority",
           title: "Title",
           text: "Text",
           mediaName: "File",
           status: "Status",
           actions: "Actions",
         },
         dialog: {
           edit: "Newsletter Edit",
           add: "Add Newsletter",
           update: "Edit Newsletter",
           readonly: "View Only",
           form: {
             priority: "Priority",
             title: "Title",
             text: "Text",
             mediaPath: "File",
             status: "Status",
           },
           buttons: {
             add: "Add",
             edit: "Update",
             okadd: "Okay",
             cancel: "Cancel",
             close: "Close",
             attach: "Attach File",
           },
         },
         confirmationModal: {
           deleteTitle: "Delete",
          deleteMessage: "This action cannot be reversed.",
         },
         toasts: {
           success: "Operation performed successfully",
           deleted: "Record deleted",
         },
       },
       campaignsConfig: {
         title: "Campaign Settings",
       },
           
			queues: {
				title: "Queues",
				table: {
					name: "Name",
					color: "Color",
					greeting: "Greeting message",
					actions: "Actions",
				},
				buttons: {
					add: "Add queue",
				},
				confirmationModal: {
					deleteTitle: "Delete",
					deleteMessage:
						"Are you sure? It cannot be reverted! Tickets in this queue will still exist, but will not have any queues assigned.",
				},
			},
			queueSelect: {
				inputLabel: "Queues",
			},
			quickAnswers: {
				title: "Quick Answers",
				table: {
				  shortcut: "Shortcut",
				  message: "Quick Reply",
				  actions: "Actions",
				},
				buttons: {
				  add: "Add Quick Reply",
				},
				toasts: {
				  deleted: "Quick Reply successfully deleted.",
				},
				searchPlaceholder: "Search...",
				confirmationModal: {
				  deleteTitle:
					"Are you sure you want to delete this Quick Reply: ",
				  deleteMessage: "This action cannot be reversed.",
				},
			  },
			users: {
				title: "Users",
				table: {
					name: "Name",
					email: "Email",
					profile: "Profile",
					actions: "Actions",
				},
				buttons: {
					add: "Add user",
				},
				toasts: {
					deleted: "User deleted sucessfully.",
				},
				confirmationModal: {
				deleteTitle: "Delete",
				deleteMessage:
					"All user data will be lost. Open calls from this user will be moved to the queue.",
				},
       },
       helps: {
         title: "Help Center",
       },
       schedules: {
         title: "Schedules",
         confirmationModal: {
           deleteTitle: "Are you sure you want to delete this Schedule?",
           deleteMessage: "This action cannot be reversed.",
         },
         table: {
           contact: "Contact",
           body: "Message",
           sendAt: "Schedule Date",
           sentAt: "Send Date",
           status: "Status",
           actions: "Actions",
         },
         buttons: {
           add: "New Schedule",
         },
         toasts: {
           deleted: "Schedule successfully deleted.",
         },
       },
       tags: {
         title: "Tag",
         confirmationModal: {
           deleteTitle: "Are you sure you want to delete this Tag?",
           deleteMessage: "This action cannot be reversed.",
         },
         table: {
           name: "Name",
           color: "Color",
           tickets: "Tagged Records",
           actions: "Actions",
         },
         buttons: {
           add: "New Tag",
         },
         toasts: {
           deleted: "Tag successfully deleted.",
         },
       },
			settings: {
				success: "Settings saved successfully.",
				title: "Settings",
				settings: {
					userCreation: {
						name: "User creation",
						options: {
							enabled: "Enabled",
							disabled: "Disabled",
						},
					},
					timeCreateNewTicket: {
					  name: "Welcome message after",
					  note: "Select the time it will take to open a new ticket if the customer contacts you again",
					  options: {
						"10": "10 Seconds",
						"30": "30 Seconds",
						"60": "1 minute",
						"300": "5 minutes",
						"1800" : "30 minutes",
						"3600" : "1 hour",
						"7200" : "2 hours",
						"21600" : "6 hours",
						"43200" : "12 hours",
						"86400" : "24 hours",
						"172800" : "48 hours",
					  },
					},
					call: {
					  name: "Accept calls",
					  options: {
						enabled: "Enabled",
						disabled: "Disabled",
					  },
					},
					CheckMsgIsGroup: {
					  name: "Ignore Group Messages",
					  options: {
						  enabled: "Enabled",
						  disabled: "Disabled",
					  },
					},
				  },
			},
			messagesList: {
				header: {
					assignedTo: "Assigned to:",
					buttons: {
						return: "Return",
						resolve: "Resolve",
						reopen: "Reopen",
						accept: "Accept",
					},
				},
			},
			messagesInput: {
				placeholderOpen: "Type a message",
				placeholderClosed: "Reopen or accept this ticket to send a message.",
				signMessage: "Sign",
			},
			contactDrawer: {
				header: "Contact details",
				buttons: {
					edit: "Edit contact",
				},
				extraInfo: "Other information",
			},
			ticketOptionsMenu: {
				delete: "Delete",
				transfer: "Transfer",
				confirmationModal: {
					title: "Delete ticket #",
					titleFrom: "from contact ",
					message: "Attention! All ticket's related messages will be lost.",
				},
				buttons: {
					delete: "Delete",
					cancel: "Cancel",
				},
			},
			confirmationModal: {
				buttons: {
					confirm: "Ok",
					cancel: "Cancel",
				},
			},
			messageOptionsMenu: {
				delete: "Delete",
				reply: "Reply",
				confirmationModal: {
					title: "Delete message?",
					message: "This action cannot be reverted.",
				},
			},
			backendErrors: {
				ERR_NO_OTHER_WHATSAPP:
					"There must be at lest one default WhatsApp connection.",
				ERR_NO_DEF_WAPP_FOUND:
					"No default WhatsApp found. Check connections page.",
				ERR_WAPP_NOT_INITIALIZED:
					"This WhatsApp session is not initialized. Check connections page.",
				ERR_WAPP_CHECK_CONTACT:
					"Could not check WhatsApp contact. Check connections page.",
				ERR_WAPP_INVALID_CONTACT: "This is not a valid whatsapp number.",
				ERR_WAPP_DOWNLOAD_MEDIA:
					"Could not download media from WhatsApp. Check connections page.",
				ERR_INVALID_CREDENTIALS: "Authentication error. Please try again.",
				ERR_SENDING_WAPP_MSG:
					"Error sending WhatsApp message. Check connections page.",
				ERR_DELETE_WAPP_MSG: "Couldn't delete message from WhatsApp.",
				ERR_OTHER_OPEN_TICKET:
					"There's already an open ticket for this contact.",
				ERR_SESSION_EXPIRED: "Session expired. Please login.",
				ERR_USER_CREATION_DISABLED:
					"User creation was disabled by administrator.",
				ERR_NO_PERMISSION: "You don't have permission to access this resource.",
				ERR_DUPLICATED_CONTACT: "A contact with this number already exists.",
				ERR_NO_SETTING_FOUND: "No setting found with this ID.",
				ERR_NO_CONTACT_FOUND: "No contact found with this ID.",
				ERR_NO_TICKET_FOUND: "No ticket found with this ID.",
				ERR_NO_USER_FOUND: "No user found with this ID.",
				ERR_NO_WAPP_FOUND: "No WhatsApp found with this ID.",
				ERR_CREATING_MESSAGE: "Error while creating message on database.",
				ERR_CREATING_TICKET: "Error while creating ticket on database.",
				ERR_FETCH_WAPP_MSG:
					"Error fetching the message in WhtasApp, maybe it is too old.",
				ERR_QUEUE_COLOR_ALREADY_EXISTS:
					"This color is already in use, pick another one.",
				ERR_WAPP_GREETING_REQUIRED:
					"Greeting message is required if there is more than one queue.",
			},
		},
	},
};

export { messages };
