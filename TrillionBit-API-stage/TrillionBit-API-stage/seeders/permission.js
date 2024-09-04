const RolePermission = require("../models/RolePermission");
const Role = require("../models/Role");
const Admin = require("../models/Admin");
let data = [
	{
		name: "user list",
		type: "user",
	},
	{
		name: "user block un-block",
		type: "user",
	},
	{
		name: "user change password",
		type: "user",
	},
	{
		name: "user verification",
		type: "user",
	},
	{
		name: "user wallet details view",
		type: "user",
	},
	{
		name: "user view",
		type: "user",
	},
	{
		name: "user update",
		type: "user",
	},
	{
		name: "user delete",
		type: "user",
	},
	{
		name: "user crypto withdrawal list",
		type: "user",
	},
	{
		name: "user crypto withdrawal update",
		type: "user",
	},
	{
		name: "user fiat withdrawal list",
		type: "user",
	},
	{
		name: "user fiat withdrawal update",
		type: "user",
	},
	{
		name: "user crypto deposit list",
		type: "user",
	},
	{
		name: "user crypto deposit update",
		type: "user",
	},
	{
		name: "user fiat deposit list",
		type: "user",
	},
	{
		name: "user fiat deposit update",
		type: "user",
	},
	{
		name: "user order list",
		type: "user",
	},
	{
		name: "webhook setting",
		type: "webhook",
	},
	{
		name: "assets add",
		type: "assets",
	},
	{
		name: "assets list",
		type: "assets",
	},
	{
		name: "assets view",
		type: "assets",
	},
	{
		name: "assets update",
		type: "assets",
	},
	{
		name: "assets delete",
		type: "assets",
	},
	{
		name: "announcements add",
		type: "announcements",
	},
	{
		name: "announcements list",
		type: "announcements",
	},
	{
		name: "announcements view",
		type: "announcements",
	},
	{
		name: "announcements update",
		type: "announcements",
	},
	{
		name: "announcements delete",
		type: "announcements",
	},
	{
		name: "bitgo setting",
		type: "bitgo",
	},
	{
		name: "eth setting",
		type: "eth",
	},
	{
		name: "xrp setting",
		type: "xrp",
	},
	{
		name: "market add",
		type: "market",
	},
	{
		name: "market list",
		type: "market",
	},
	{
		name: "market view",
		type: "market",
	},
	{
		name: "market update",
		type: "market",
	},
	{
		name: "market delete",
		type: "market",
	},
	{
		name: "trading level list",
		type: "trading level",
	},
	{
		name: "trading level add",
		type: "trading level",
	},
	{
		name: "trading level view",
		type: "trading level",
	},
	{
		name: "trading level update",
		type: "trading level",
	},
	{
		name: "trading level delete",
		type: "trading level",
	},
	{
		name: "assets currency list",
		type: "assets currency",
	},
	{
		name: "assets currency add",
		type: "assets currency",
	},
	{
		name: "assets currency view",
		type: "assets currency",
	},
	{
		name: "assets current update",
		type: "assets currency",
	},
	{
		name: "assets current delete",
		type: "assets currency",
	},
	{
		name: "bitex lend plan add",
		type: "bitex lend plan",
	},
	{
		name: "bitex lend plan list",
		type: "bitex lend plan",
	},
	{
		name: "bitex lend plan view",
		type: "bitex lend plan",
	},
	{
		name: "bitex lend plan update",
		type: "bitex lend plan",
	},
	{
		name: "bitex lend plan delete",
		type: "bitex lend plan",
	},
	{
		name: "bitex lend orders list",
		type: "bitex lend",
	},
	{
		name: "refferal setting add",
		type: "refferal setting",
	},
	{
		name: "refferal setting view",
		type: "refferal setting",
	},
	{
		name: "refferal setting update",
		type: "refferal setting",
	},
	{
		name: "wallet bonuses add",
		type: "wallet bonuses",
	},
	{
		name: "wallet bonuses view",
		type: "wallet bonuses",
	},
	{
		name: "wallet bonuses update",
		type: "wallet bonuses",
	},
	{
		name: "wallet bonuses delete",
		type: "wallet bonuses",
	},
	{
		name: "agent setting view",
		type: "agent setting",
	},
	{
		name: "agent setting update",
		type: "agent setting",
	},
	{
		name: "margin setting list",
		type: "margin setting",
	},
	{
		name: "margin setting view",
		type: "margin setting",
	},
	{
		name: "margin setting add",
		type: "margin setting",
	},
	{
		name: "margin setting update",
		type: "margin setting",
	},
	{
		name: "margin setting delete",
		type: "margin setting",
	},
	{
		name: "blog add",
		type: "blog",
	},
	{
		name: "blog list",
		type: "blog",
	},
	{
		name: "blog view",
		type: "blog",
	},
	{
		name: "blog update",
		type: "blog",
	},
	{
		name: "blog delete",
		type: "blog",
	},
	{
		name: "article list",
		type: "article",
	},
	{
		name: "article add",
		type: "article",
	},
	{
		name: "article view",
		type: "article",
	},
	{
		name: "article update",
		type: "article",
	},
	{
		name: "article delete",
		type: "article",
	},
	{
		name: "role list",
		type: "role",
	},
	{
		name: "role add",
		type: "role",
	},
	{
		name: "role view",
		type: "role",
	},
	{
		name: "role update",
		type: "role",
	},
	{
		name: "role list",
		type: "role",
	},
	{
		name: "role delete",
		type: "role",
	},

	{
		name: "admin list",
		type: "admin",
	},
	{
		name: "admin add",
		type: "admin",
	},
	{
		name: "admin view",
		type: "admin",
	},
	{
		name: "admin update",
		type: "admin",
	},
	{
		name: "admin delete",
		type: "admin",
	},
	{
		name: "permission list",
		type: "permission",
	},
	{
		name: "permission add",
		type: "permission",
	},
	{
		name: "permission update",
		type: "permission",
	},
	{
		name: "permission delete",
		type: "permission",
	},
	{
		name: "permission view",
		type: "permission",
	},
	{
		name: "app version setting list",
		type: "app version setting",
	},
	{
		name: "app version setting add",
		type: "app version setting",
	},
	{
		name: "app version setting update",
		type: "app version setting",
	},

	{
		name: "wallet maintenance list",
		type: "wallet maintenance",
	},
	{
		name: "wallet maintenance add",
		type: "wallet maintenance",
	},
	{
		name: "wallet maintenance view",
		type: "wallet maintenance",
	},
	{
		name: "wallet maintenance update",
		type: "wallet maintenance",
	},

	{
		name: "wallet maintenance delete",
		type: "wallet maintenance",
	},

	{
		name: "trading maintenance list",
		type: "trading maintenance",
	},
	{
		name: "trading maintenance add",
		type: "trading maintenance",
	},
	{
		name: "trading maintenance view",
		type: "trading maintenance",
	},
	{
		name: "trading maintenance update",
		type: "trading maintenance",
	},

	{
		name: "trading maintenance delete",
		type: "trading maintenance",
	},

	{
		name: "maintenance list",
		type: "maintenance",
	},
	{
		name: "maintenance add",
		type: "maintenance",
	},
	{
		name: "maintenance view",
		type: "maintenance",
	},
	{
		name: "maintenance update",
		type: "maintenance",
	},
	
	{
		name: "maintenance delete",
		type: "maintenance",
	},

	{
		name: "bank detail list",
		type: "bank detail",
	},
	{
		name: "bank detail add",
		type: "bank detail",
	},
	{
		name: "bank detail view",
		type: "bank detail",
	},
	{
		name: "bank detail update",
		type: "bank detail",
	},

	{
		name: "bank detail delete",
		type: "bank detail",
	},
];

module.exports = {
	insert: async () => {
		try {
			await RolePermission.deleteMany({});
			await RolePermission.remove({});
			const newRolePermission = await RolePermission.insertMany(data);
			const permissions = newRolePermission.map((per) => {
				return {
					permissionId: per._id,
					permission: per.name,
				};
			});
			let role = await Role.findOne({
				name: "super admin",
			});
			if (role) {
				role.permissions = permissions;
				role.save();
			} else {
				let roleData = {
					name: "super admin",
					type: "admin",
					permissions: permissions,
				};
				role = await new Role(roleData).save();
			}
			if (role) {
				const admin = await Admin.findOne({
					email: "admin@bitexuae.com",
				});
				if (admin) {
					admin.roles = [role._id];
					await admin.save();
					console.log("Data successfully inserted.. ");
				} else {
					let adminData = {
						name: "super admin",
						email: "admin@bitexuae.com",
						password:
							"$2y$10$eniSNOXSJ87CAhlS9jRlvOINK.7XKGkj.MeOtv3g44io6avSvE5nK",
					};
					await Admin(adminData).save();
					console.log("Data successfully inserted.. ");
				}
			}
			return true;
		} catch (error) {
			console.log("Error", error);
			return true;
		}
	},
};
