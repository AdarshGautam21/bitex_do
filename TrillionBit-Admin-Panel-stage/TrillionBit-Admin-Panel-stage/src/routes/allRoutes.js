import React from "react";
import { Redirect } from "react-router-dom";

//Dashboard
import Dashboard from "../pages/Dashboard/index";
//User
import User from "../pages/User";
//User
import Order from "../pages/Order";
import Deposit from "../pages/Deposit";
import Withdrawal from "../pages/Withdrawal";
import BitexLend from "../pages/BitexLend";
import Assets from "../pages/Asset";
import Market from "../pages/Market";
import BitexSavingPlan from "../pages/BitexSavingPlan";
import TradingLevel from "../pages/TradingLevel";
import Announcement from "../pages/Announcement";
import AssetsCurrency from "../pages/AssetsCurrency";
import AssetsCurrencyAdvance from "../pages/AssetsCurrency/AssetsCurrencyAdvance";
import Blog from "../pages/Blog";
import Article from "../pages/Article";
import ArticleCategory from "../pages/Article/Category";
import ArticleTag from "../pages/Article/Tag";
import Admin from "../pages/Admin";
import Role from "../pages/Admin/Role";
import Permission from "../pages/Admin/Permission";
import BitGo from "../pages/Setting/BitGo";
import XrpSetting from "../pages/Setting/Xrp";
import EthSetting from "../pages/Setting/Eth";
import ReferralSetting from "../pages/Setting/Referral";
import WalletMaintenance from "../pages/Maintenance/Wallet";
import TradingMaintenance from "../pages/Maintenance/Trading";
import Maintenance from "../pages/Maintenance/Maintenance";
import AdminWalletAddress from "../pages/AdminWalletAddress";
import ExchangeSetting from "../pages/Setting/ExchangeSetting";

import WalletBonus from "../pages/Setting/WalletBonus";
import Agent from "../pages/Setting/Agent";
import MarginTrading from "../pages/Setting/MarginTrading";
import UserDetail from "../pages/User/UserDetail";
// Calendar
import Calendar from "../pages/Calendar/index";

//Chat
import Chat from "../pages/Chat/Chat";

//Email
import EmailInbox from "../pages/Email/email-inbox";
import EmailRead from "../pages/Email/email-read";

//Invoice
import InvoicesList from "../pages/Invoices/invoices-list";
import InvoiceDetail from "../pages/Invoices/invoices-detail";

//Contact
import ContactsGrid from "../pages/Contacts/contacts-grid";
import ContactsList from "../pages/Contacts/ContactList/contacts-list";
import ContactsProfile from "../pages/Contacts/ContactsProfile/contacts-profile";

//Utility
import PagesStarter from "../pages/Utility/StarterPage";
import PageMaintenance from "../pages/Utility/PageMaintenance";
import PagesComingsoon from "../pages/Utility/PageComingsoon";
import PageTimeline from "../pages/Utility/PageTimeline";
import PageFaqs from "../pages/Utility/PageFaqs";
import PagePricing from "../pages/Utility/PagePricing/index";
import Error404 from "../pages/Utility/Error404";
import Error500 from "../pages/Utility/Error500";

// Ui Components
import UiAlert from "../pages/UiElements/UiAlert";
import UiButton from "../pages/UiElements/UiButton";
import UiCard from "../pages/UiElements/UiCard";
import UiCarousel from "../pages/UiElements/UiCarousel";
import UiDropdowns from "../pages/UiElements/UiDropdowns";
import UiGrid from "../pages/UiElements/UiGrid";
import UiImages from "../pages/UiElements/UiImages";
import UiModal from "../pages/UiElements/UiModals";
import UiDrawer from "../pages/UiElements/UiDrawer";
import UiProgressbar from "../pages/UiElements/UiProgressbar";
import UiTabsAccordions from "../pages/UiElements/UiTabsAccordions";
import UiTypography from "../pages/UiElements/UiTypography";
import UiVideo from "../pages/UiElements/UiVideo";
import UiGeneral from "../pages/UiElements/UiGeneral";
import UiColors from "../pages/UiElements/UiColors";

//Extended pages
import Lightbox from "../pages/Extended/Lightbox";
import Rangeslider from "../pages/Extended/Rangeslider";
import SweetAlert from "../pages/Extended/SweetAlert";
import SessionTimeout from "../pages/Extended/SessionTimeout";
import UiRating from "../pages/Extended/UiRating";
import Notifications from "../pages/Extended/Notifications";

//Forms
import FormElements from "../pages/Forms/FormElements/index";
import FormValidation from "../pages/Forms/FormValidation/";
import AdvancedPlugins from "../pages/Forms/AdvancedPlugins";
import FormEditors from "../pages/Forms/FormEditors";
import FormUpload from "../pages/Forms/FormUpload";
import FormWizard from "../pages/Forms/FormWizard";
import FormMask from "../pages/Forms/FormMask";

//Tables
import BasicTable from "../pages/Tables/BasicTables";
import DatatableTables from "../pages/Tables/DatatableTables";
import ResponsiveTables from "../pages/Tables/ResponsiveTables";
import EditableTables from "../pages/Tables/EditableTables";

//Charts
import Apexchart from "../pages/Charts/Apexcharts";
import EChart from "../pages/Charts/EChart";
import ChartjsChart from "../pages/Charts/ChartjsChart";
import KnobCharts from "../pages/Charts/KnobCharts";
import SparklineChart from "../pages/Charts/SparklineChart";

//Icons
import IconBoxicons from "../pages/Icons/IconBoxicons";
import IconMaterialdesign from "../pages/Icons/IconMaterialdesign";
import IconDripicons from "../pages/Icons/IconDripicons";
import IconFontawesome from "../pages/Icons/IconFontawesome";

// Maps
import MapsGoogle from "../pages/Maps/MapsGoogle";
import MapsVector from "../pages/Maps/MapsVector";
import MapsLeaflet from "../pages/Maps/MapsLeaflet";

// Authentication related pages
import Login from "../pages/Authentication/Login";
import Logout from "../pages/Authentication/Logout";
import Register from "../pages/Authentication/Register";
import ForgetPwd from "../pages/Authentication/ForgetPassword";

//AuthenticationInner related pages
import PageLogin from "../pages/AuthenticationInner/PageLogin";
import PageRegister from "../pages/AuthenticationInner/PageRegister";
import RecoverPassword from "../pages/AuthenticationInner/RecoverPassword";
import LockScreen from "../pages/AuthenticationInner/LockScreen";
import ConfirmMail from "../pages/AuthenticationInner/ConfirmMail";
import EmailVerification from "../pages/AuthenticationInner/EmailVerification";
import TwoStepVerfication from "../pages/AuthenticationInner/TwoStepVerfication";
import userProfile from "../pages/Authentication/user-profile";
import BankDetail from "../pages/Admin/BankDetail";
import UserHolding from "../pages/UserHolding";

const userRoutes = [
	//dashboard
	{ path: "/dashboard", exact: true, component: Dashboard },

	//users
	{ path: "/users", exact: true, component: User, permission: ["user list"] },
	//users
	{
		path: "/user-holding",
		exact: true,
		component: UserHolding,
		permission: ["user list"],
	},

	{
		path: "/user-details/:id",
		exact: true,
		component: UserDetail,
		permission: ["user view"],
	},

	//orders
	{
		path: "/orders",
		exact: true,
		component: Order,
		permission: ["user order list"],
	},

	//deposite
	{
		path: "/deposit/:slug",
		exact: true,
		component: Deposit,
		permission: ["user fiat deposit list", "user crypto deposit list"],
	},

	//deposite
	{
		path: "/withdrawal/:slug",
		exact: true,
		component: Withdrawal,
		permission: [
			"user fiat withdrawal list",
			"user crypto withdrawal list",
		],
	},
	//deposite
	{
		path: "/bitex-lend-orders",
		exact: true,
		component: BitexLend,
		permission: ["bitex lend orders list"],
	},
	//deposite
	{
		path: "/assets",
		exact: true,
		component: Assets,
		permission: ["assets list"],
	},

	//deposite
	{
		path: "/markets",
		exact: true,
		component: Market,
		permission: ["market list"],
	},

	//deposite
	{
		path: "/bitex-saving-plans",
		exact: true,
		component: BitexSavingPlan,
		permission: ["bitex lend plan list", "bitex lend plan view"],
	},

	//deposite
	{
		path: "/trading-level/:slug",
		exact: true,
		component: TradingLevel,
		permission: ["trading level add", "trading level view"],
	},

	//deposite
	{
		path: "/announcements",
		exact: true,
		component: Announcement,
		permission: [
			"announcements add",
			"announcements view",
			"announcements list",
		],
	},

	//deposite
	{
		path: "/assets-currency",
		exact: true,
		component: AssetsCurrency,
		permission: ["assets currency view", "assets currency add"],
	},

	{
		path: "/assets-currency-advanced",
		exact: true,
		component: AssetsCurrencyAdvance,
		permission: ["assets currency view", "assets currency add"],
	},

	{
		path: "/blogs",
		exact: true,
		component: Blog,
		permission: ["blog list", "blog add"],
	},

	{
		path: "/articles",
		exact: true,
		component: Article,
		permission: ["article list", "article add"],
	},

	{
		path: "/article-category",
		exact: true,
		component: ArticleCategory,
		permission: ["article list", "article add"],
	},
	{
		path: "/article-tags",
		exact: true,
		component: ArticleTag,
		permission: ["article list", "article add"],
	},
	{
		path: "/admins",
		exact: true,
		component: Admin,
		permission: ["admin add", "admin list"],
	},
	{
		path: "/roles",
		exact: true,
		component: Role,
		permission: ["role add", "role list"],
	},
	{
		path: "/role-permissions",
		exact: true,
		component: Permission,
		permission: ["permission add", "permission list"],
	},
	{
		path: "/bitgo-setting",
		exact: true,
		component: BitGo,
		permission: ["bitgo setting"],
	},
	{
		path: "/xrp-setting",
		exact: true,
		component: XrpSetting,
		permission: ["xrp setting"],
	},
	{
		path: "/eth-setting",
		exact: true,
		component: EthSetting,
		permission: ["xrp setting"],
	},
	{
		path: "/referral-setting",
		exact: true,
		component: ReferralSetting,
		permission: ["refferal setting view"],
	},
	{
		path: "/wallet-bonus-setting",
		exact: true,
		component: WalletBonus,
		permission: ["wallet bonuses add", "wallet bonuses view"],
	},

	{
		path: "/agent-setting",
		exact: true,
		component: Agent,
		permission: ["agent setting view"],
	},
	{
		path: "/margin-trading-setting",
		exact: true,
		component: MarginTrading,
		permission: ["margin setting add", "margin setting list"],
	},
	{
		path: "/trading-maintenance",
		exact: true,
		component: TradingMaintenance,
		permission: ["trading maintenance add", "trading maintenance list"],
	},
	{
		path: "/wallet-maintenance",
		exact: true,
		component: WalletMaintenance,
		permission: ["wallet maintenance add", "wallet maintenance list"],
	},
	{
		path: "/maintenance",
		exact: true,
		component: Maintenance,
		permission: ["maintenance add", "maintenance list"],
	},

	{
		path: "/bank-detail",
		exact: true,
		component: BankDetail,
		permission: ["bank detail add", "bank detail list"],
	},

	{
		path: "/admin-wallet-address",
		exact: true,
		component: AdminWalletAddress,
		permission: ["assets list", "assets add"],
	},

	{
		path: "/exchange-setting",
		exact: true,
		component: ExchangeSetting,
		permission: ["assets list", "assets add"],
	},

	//profile
	{ path: "/profile", component: userProfile },

	//Calendar
	{ path: "/apps-calendar", component: Calendar },

	//Chat
	{ path: "/apps-chat", component: Chat },

	//Email
	{ path: "/email-inbox", component: EmailInbox },
	{ path: "/email-read", component: EmailRead },

	//Invoice
	{ path: "/invoices-list", component: InvoicesList },
	{ path: "/invoices-detail", component: InvoiceDetail },

	//Contact
	{ path: "/contacts-grid", component: ContactsGrid },
	{ path: "/contacts-list", component: ContactsList },
	{ path: "/contacts-profile", component: ContactsProfile },

	//Utility
	{ path: "/pages-starter", component: PagesStarter },
	{ path: "/pages-timeline", component: PageTimeline },
	{ path: "/pages-faqs", component: PageFaqs },
	{ path: "/pages-pricing", component: PagePricing },

	//Components
	{ path: "/ui-alerts", component: UiAlert },
	{ path: "/ui-buttons", component: UiButton },
	{ path: "/ui-cards", component: UiCard },
	{ path: "/ui-carousel", component: UiCarousel },
	{ path: "/ui-dropdowns", component: UiDropdowns },
	{ path: "/ui-grid", component: UiGrid },
	{ path: "/ui-images", component: UiImages },
	{ path: "/ui-modals", component: UiModal },
	{ path: "/ui-drawer", component: UiDrawer },
	{ path: "/ui-progressbars", component: UiProgressbar },
	{ path: "/ui-tabs-accordions", component: UiTabsAccordions },
	{ path: "/ui-typography", component: UiTypography },
	{ path: "/ui-video", component: UiVideo },
	{ path: "/ui-general", component: UiGeneral },
	{ path: "/ui-colors", component: UiColors },

	//Extended pages
	{ path: "/extended-lightbox", component: Lightbox },
	{ path: "/extended-rangeslider", component: Rangeslider },
	{ path: "/extended-sweet-alert", component: SweetAlert },
	{ path: "/extended-session-timeout", component: SessionTimeout },
	{ path: "/extended-rating", component: UiRating },
	{ path: "/extended-notifications", component: Notifications },

	//Forms
	{ path: "/form-elements", component: FormElements },
	{ path: "/form-validation", component: FormValidation },
	{ path: "/form-advanced", component: AdvancedPlugins },
	{ path: "/form-editors", component: FormEditors },
	{ path: "/form-uploads", component: FormUpload },
	{ path: "/form-wizard", component: FormWizard },
	{ path: "/form-mask", component: FormMask },

	//tables
	{ path: "/tables-basic", component: BasicTable },
	{ path: "/tables-datatable", component: DatatableTables },
	{ path: "/tables-responsive", component: ResponsiveTables },
	{ path: "/tables-editable", component: EditableTables },

	//Charts
	{ path: "/charts-apex", component: Apexchart },
	{ path: "/charts-echart", component: EChart },
	{ path: "/charts-chartjs", component: ChartjsChart },
	{ path: "/charts-knob", component: KnobCharts },
	{ path: "/charts-sparkline", component: SparklineChart },

	//Icons
	{ path: "/icons-boxicons", component: IconBoxicons },
	{ path: "/icons-materialdesign", component: IconMaterialdesign },
	{ path: "/icons-dripicons", component: IconDripicons },
	{ path: "/icons-fontawesome", component: IconFontawesome },

	// Maps
	{ path: "/maps-google", component: MapsGoogle },
	{ path: "/maps-vector", component: MapsVector },
	{ path: "/maps-leaflet", component: MapsLeaflet },

	// this route should be at the end of all other routes
	{ path: "/", exact: true, component: () => <Redirect to="/dashboard" /> },
];

const authRoutes = [
	//authencation page
	{ path: "/logout", component: Logout },
	{ path: "/login", component: Login },
	{ path: "/forgot-password", component: ForgetPwd },
	{ path: "/register", component: Register },

	//AuthenticationInner pages
	{ path: "/page-login", component: PageLogin },
	{ path: "/page-register", component: PageRegister },
	{ path: "/page-recoverpw", component: RecoverPassword },
	{ path: "/page-lock-screen", component: LockScreen },
	{ path: "/page-confirm-mail", component: ConfirmMail },
	{ path: "/page-email-verification", component: EmailVerification },
	{ path: "/page-two-step-verification", component: TwoStepVerfication },

	//Utility page
	{ path: "/pages-maintenance", component: PageMaintenance },
	{ path: "/pages-comingsoon", component: PagesComingsoon },
	{ path: "/pages-404", component: Error404 },
	{ path: "/pages-500", component: Error500 },
];

export { userRoutes, authRoutes };
