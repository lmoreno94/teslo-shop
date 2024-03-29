import {
	AdminPanelSettings,
	CategoryOutlined,
	ConfirmationNumberOutlined,
} from "@mui/icons-material";
import {
	Divider,
	ListItem,
	ListItemIcon,
	ListItemText,
	ListSubheader,
} from "@mui/material";
import React, { Fragment } from "react";

export const IsAdminLateral = () => {
	return (
		<Fragment>
			<Divider />
			<ListSubheader>Admin Panel</ListSubheader>

			<ListItem button>
				<ListItemIcon>
					<CategoryOutlined />
				</ListItemIcon>
				<ListItemText primary={"Productos"} />
			</ListItem>
			<ListItem button>
				<ListItemIcon>
					<ConfirmationNumberOutlined />
				</ListItemIcon>
				<ListItemText primary={"Ordenes"} />
			</ListItem>

			<ListItem button>
				<ListItemIcon>
					<AdminPanelSettings />
				</ListItemIcon>
				<ListItemText primary={"Usuarios"} />
			</ListItem>
		</Fragment>
	);
};
