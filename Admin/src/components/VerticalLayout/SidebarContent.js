import PropTypes from "prop-types";
import React, { useEffect, useRef, useCallback } from "react";

//Import Icons
import FeatherIcon from "feather-icons-react";
// //Import Scrollbar
import SimpleBar from "simplebar-react";

// MetisMenu
import MetisMenu from "metismenujs";
import { withRouter } from "react-router-dom";
import { Link } from "react-router-dom";
import HasAnyPermission from "../../common/Permission";
//i18n
import { withTranslation } from "react-i18next";

const SidebarContent = (props) => {
	const ref = useRef();
	const activateParentDropdown = useCallback((item) => {
		item.classList.add("active");
		const parent = item.parentElement;
		const parent2El = parent.childNodes[1];
		if (parent2El && parent2El.id !== "side-menu") {
			parent2El.classList.add("mm-show");
		}

		if (parent) {
			parent.classList.add("mm-active");
			const parent2 = parent.parentElement;
			if (parent2) {
				parent2.classList.add("mm-show"); // ul tag
				const parent3 = parent2.parentElement; // li tag
				if (parent3) {
					parent3.classList.add("mm-active"); // li
					parent3.childNodes[0].classList.add("mm-active"); //a
					const parent4 = parent3.parentElement; // ul
					if (parent4) {
						parent4.classList.add("mm-show"); // ul
						const parent5 = parent4.parentElement;
						if (parent5) {
							parent5.classList.add("mm-show"); // li
							parent5.childNodes[0].classList.add("mm-active"); // a tag
						}
					}
				}
			}
			scrollElement(item);
			return false;
		}
		scrollElement(item);
		return false;
	}, []);

	// Use ComponentDidMount and ComponentDidUpdate method symultaniously
	useEffect(() => {
		const pathName = props.location.pathname;

		const initMenu = () => {
			new MetisMenu("#side-menu");
			let matchingMenuItem = null;
			const ul = document.getElementById("side-menu");
			const items = ul.getElementsByTagName("a");
			for (let i = 0; i < items.length; ++i) {
				if (pathName === items[i].pathname) {
					matchingMenuItem = items[i];
					break;
				}
			}
			if (matchingMenuItem) {
				activateParentDropdown(matchingMenuItem);
			}
		};
		initMenu();
	}, [props.location.pathname, activateParentDropdown]);

	useEffect(() => {
		ref.current.recalculate();
	});

	function scrollElement(item) {
		if (item) {
			const currentPosition = item.offsetTop;
			if (currentPosition > window.innerHeight) {
				ref.current.getScrollElement().scrollTop =
					currentPosition - 300;
			}
		}
	}

	return (
		<React.Fragment>
			<SimpleBar style={{ maxHeight: "100%" }} ref={ref}>
				<div id="sidebar-menu">
					<ul className="metismenu list-unstyled" id="side-menu">
						<li className="menu-title">{props.t("Menu")} </li>
						<li>
							<Link to="/dashboard" className="">
								<FeatherIcon icon="home" />
								<span>{props.t("Dashboard")}</span>
							</Link>
						</li>
						<HasAnyPermission
							permission={["user list", "user view"]}
						>
							<li>
								<Link to="/users" className="">
									<FeatherIcon icon="user" />
									<span>{props.t("User")}</span>
								</Link>
							</li>
						</HasAnyPermission>

						{/* <HasAnyPermission
							permission={["user list", "user view"]}
						>
							<li>
								<Link to="/user-holding" className="">
									<i className="mdi mdi-book-account"></i>
									<span>{props.t("User Holdings")}</span>
								</Link>
							</li>
						</HasAnyPermission> */}

						<HasAnyPermission permission={["user order list"]}>
							<li>
								<Link to="/orders" className="">
									<FeatherIcon icon="list" />
									<span>{props.t("Order")}</span>
								</Link>
							</li>
						</HasAnyPermission>

						<HasAnyPermission
							permission={[
								"user fiat deposit list",
								"user crypto deposit list",
							]}
						>
							<li>
								<Link to="/#" className="has-arrow">
									<i className="mdi mdi-book-account"></i>
									<span>{props.t("Deposit")}</span>
								</Link>
								<ul className="sub-menu">
									<HasAnyPermission
										permission={[
											"user crypto deposit list",
										]}
									>
										<li>
											<Link to="/deposit/crypto-deposit">
												{props.t("Crypto Deposit")}
											</Link>
										</li>
									</HasAnyPermission>
									<HasAnyPermission
										permission={["user fiat deposit list"]}
									>
										<li>
											<Link to="/deposit/fiat-deposit">
												{props.t("Fiat Deposit")}
											</Link>
										</li>
									</HasAnyPermission>
								</ul>
							</li>
						</HasAnyPermission>

						<HasAnyPermission
							permission={[
								"user crypto withdrawal list",
								"user fiat withdrawal list",
							]}
						>
							<li>
								<Link to="/#" className="has-arrow">
									<i className="mdi mdi-book-account-outline"></i>

									<span>{props.t("Withdrawal")}</span>
								</Link>
								<ul className="sub-menu">
									<HasAnyPermission
										permission={[
											"user crypto withdrawal list",
										]}
									>
										<li>
											<Link to="/withdrawal/crypto-withdrawal">
												{props.t("Crypto Withdrawal")}
											</Link>
										</li>
									</HasAnyPermission>

									<HasAnyPermission
										permission={[
											"user fiat withdrawal list",
										]}
									>
										<li>
											<Link to="/withdrawal/fiat-withdrawal">
												{props.t("Fiat Withdrawal")}
											</Link>
										</li>
									</HasAnyPermission>
								</ul>
							</li>
						</HasAnyPermission>

						<HasAnyPermission
							permission={["bitex lend orders list"]}
						>
							<li>
								<Link to="/bitex-lend-orders" className="">
									<FeatherIcon icon="user" />
									<span>{props.t("Bitex Lend Orders")}</span>
								</Link>
							</li>
						</HasAnyPermission>

						<HasAnyPermission permission={["assets list"]}>
							<li>
								<Link to="/assets" className="">
									<FeatherIcon icon="list" />
									<span>{props.t("Assets")}</span>
								</Link>
							</li>
						</HasAnyPermission>

						<HasAnyPermission permission={["market list"]}>
							<li>
								<Link to="/markets" className="">
									<i className="bx bx-tone"></i>
									<span>{props.t("Market")}</span>
								</Link>
							</li>
						</HasAnyPermission>

						<HasAnyPermission
							permission={[
								"bitex lend plan list",
								"bitex lend plan view",
							]}
						>
							<li>
								<Link to="/bitex-saving-plans" className="">
									<FeatherIcon icon="file-text" />
									<span>{props.t("Bitex Lend Plans")}</span>
								</Link>
							</li>
						</HasAnyPermission>

						<HasAnyPermission
							permission={["bank detail add", "bank detail list"]}
						>
							<li>
								<Link to="/bank-detail" className="">
									<i class="mdi mdi-bank"></i>
									<span>
										{props.t("Deposit Bank Detail")}
									</span>
								</Link>
							</li>
						</HasAnyPermission>

						<HasAnyPermission
							permission={[
								"trading level add",
								"trading level view",
							]}
						>
							<li>
								<Link to="/#" className="has-arrow">
									<FeatherIcon icon="sliders" />
									<span>{props.t("Trader Levels")}</span>
								</Link>
								<ul className="sub-menu">
									<li>
										<Link to="/trading-level/aed-trading-level">
											{props.t("AED Trader Level")}
										</Link>
									</li>
									<li>
										<Link to="/trading-level/inr-trading-level">
											{props.t("INR Trader Level")}
										</Link>
									</li>
									<li>
										<Link to="/trading-level/usd-trading-level">
											{props.t("USDT Trader Level")}
										</Link>
									</li>
									{/* <li>
										<Link to="/trading-level/agent-trading-level">
											{props.t("Agent Trader Level")}
										</Link>
									</li>
									<li>
										<Link to="/trading-level/subAgent-trading-level">
											{props.t("Sub Agent trader Level")}
										</Link>
									</li> */}
								</ul>
							</li>
						</HasAnyPermission>

						<HasAnyPermission
							permission={[
								"announcements add",
								"announcements list",
							]}
						>
							<li>
								<Link to="/announcements" className="">
									<FeatherIcon icon="file-text" />
									<span>{props.t("Announcements")}</span>
								</Link>
							</li>
						</HasAnyPermission>

						<HasAnyPermission
							permission={["blog list", "blog add"]}
						>
							<li>
								<Link to="/blogs" className="">
									<FeatherIcon icon="list" />
									<span>{props.t("Blogs")}</span>
								</Link>
							</li>
						</HasAnyPermission>

						<HasAnyPermission
							permission={[
								"assets currency view",
								"assets currency add",
							]}
						>
							<li>
								<Link to="/#" className="has-arrow">
									<FeatherIcon icon="sliders" />
									<span>{props.t("Assets Currency")}</span>
								</Link>
								<ul className="sub-menu">
									<li>
										<Link
											to="/assets-currency"
											className=""
										>
											<span>
												{props.t("Assets Currency")}
											</span>
										</Link>
									</li>
									{/* <li>
										<Link
											to="/assets-currency-advanced"
											className=""
										>
											<span>
												{props.t(
													"Assets Currency Setting"
												)}
											</span>
										</Link>
									</li> */}
								</ul>
							</li>
						</HasAnyPermission>

						<HasAnyPermission
							permission={[
								"wallet maintenance list",
								"wallet maintenance add",
								"trading maintenance list",
								"trading maintenance add",
								"maintenance list",
								"maintenance add",
							]}
						>
							<li>
								<Link to="/#" className="has-arrow">
									<i className="bx bx-tone"></i>
									<span>{props.t("Maintenance")}</span>
								</Link>
								<ul className="sub-menu">
									<HasAnyPermission
										permission={[
											"maintenance list",
											"maintenance add",
										]}
									>
										<li>
											<Link
												to="/maintenance"
												className=""
											>
												<span>
													{props.t("App Maintenance")}
												</span>
											</Link>
										</li>
									</HasAnyPermission>
									<HasAnyPermission
										permission={[
											"trading maintenance list",
											"trading maintenance add",
										]}
									>
										<li>
											<Link
												to="/trading-maintenance"
												className=""
											>
												<span>
													{props.t(
														"Trading Maintenance"
													)}
												</span>
											</Link>
										</li>
									</HasAnyPermission>

									<HasAnyPermission
										permission={[
											"wallet maintenance list",
											"wallet maintenance add",
										]}
									>
										<li>
											<Link
												to="/wallet-maintenance"
												className=""
											>
												<span>
													{props.t(
														"Wallet Maintenance"
													)}
												</span>
											</Link>
										</li>
									</HasAnyPermission>
								</ul>
							</li>
						</HasAnyPermission>

						<HasAnyPermission
							permission={[
								"refferal setting view",
								"agent setting view",
								"margin setting list",
								"wallet bonuses view",
								"bitgo setting",
								"xrp setting",
								"assets list",
							]}
						>
							<li>
								<Link to="/#" className="has-arrow">
									<i className="fas fa-cog"></i>
									<span>{props.t("Setting")}</span>
								</Link>

								<ul className="sub-menu">
									{/* <HasAnyPermission
										permission={["bitgo setting"]}
									>
										<li>
											<Link
												to="/exchange-setting"
												className=""
											>
												<span>
													{props.t(
														"Exchange Setting"
													)}
												</span>
											</Link>
										</li>
									</HasAnyPermission> */}
									{/* <HasAnyPermission
										permission={["assets list"]}
									>
										<li>
											<Link
												to="/admin-wallet-address"
												className=""
											>
												<span>
													{props.t(
														"Admin Wallet Address"
													)}
												</span>
											</Link>
										</li>
									</HasAnyPermission> */}

									<HasAnyPermission
										permission={["bitgo setting"]}
									>
										<li>
											<Link
												to="/bitgo-setting"
												className=""
											>
												<span>
													{props.t("BitGo Setting")}
												</span>
											</Link>
										</li>
									</HasAnyPermission>

									<HasAnyPermission
										permission={["xrp setting"]}
									>
										<li>
											<Link
												to="/xrp-setting"
												className=""
											>
												<span>
													{props.t("XRP Setting")}
												</span>
											</Link>
										</li>

										<li>
											<Link
												to="/eth-setting"
												className=""
											>
												<span>
													{props.t("ETH Setting")}
												</span>
											</Link>
										</li>
									</HasAnyPermission>

									<HasAnyPermission
										permission={["refferal setting view"]}
									>
										<li>
											<Link
												to="/referral-setting"
												className=""
											>
												<span>
													{props.t(
														"Referral Settings"
													)}
												</span>
											</Link>
										</li>
									</HasAnyPermission>

									<HasAnyPermission
										permission={["wallet bonuses view"]}
									>
										<li>
											<Link
												to="/wallet-bonus-setting"
												className=""
											>
												<span>
													{props.t(
														"Wallet Bonuse Setting"
													)}
												</span>
											</Link>
										</li>
									</HasAnyPermission>

									{/* <HasAnyPermission
										permission={["agent setting view"]}
									>
										<li>
											<Link
												to="/agent-setting"
												className=""
											>
												<span>
													{props.t("Agent Settings")}
												</span>
											</Link>
										</li>
									</HasAnyPermission> */}

									{/* <HasAnyPermission
										permission={["margin setting list"]}
									>
										<li>
											<Link
												to="/margin-trading-setting"
												className=""
											>
												<span>
													{props.t(
														"Margin Trading Settings"
													)}
												</span>
											</Link>
										</li>
									</HasAnyPermission> */}
								</ul>
							</li>
						</HasAnyPermission>

						<HasAnyPermission
							permission={["article list", "article add"]}
						>
							<li>
								<Link to="/#" className="has-arrow">
									<i className="bx bx-tone"></i>
									<span>{props.t("Academy")}</span>
								</Link>
								<ul className="sub-menu">
									<li>
										<Link to="/articles" className="">
											<span>{props.t("Academy")}</span>
										</Link>
									</li>
									<li>
										<Link
											to="/article-category"
											className=""
										>
											<span>
												{props.t("Academy Category")}
											</span>
										</Link>
									</li>
									<li>
										<Link to="/article-tags" className="">
											<span>
												{props.t("Academy Tags")}
											</span>
										</Link>
									</li>
								</ul>
							</li>
						</HasAnyPermission>

						<HasAnyPermission
							permission={[
								"role add",
								"role list",
								"permission add",
								"permission list",
								"admin add",
								"admin list",
							]}
						>
							<li>
								<Link to="/#" className="has-arrow">
									<i className="fas fa-cog"></i>
									<span>
										{props.t("Admin Role Permissions")}
									</span>
								</Link>
								<ul className="sub-menu">
									<HasAnyPermission
										permission={["admin add", "admin list"]}
									>
										<li>
											<Link to="/admins" className="">
												<span>{props.t("Admins")}</span>
											</Link>
										</li>
									</HasAnyPermission>
									<HasAnyPermission
										permission={["role add", "role list"]}
									>
										<li>
											<Link to="/roles" className="">
												<span>{props.t("Roles")}</span>
											</Link>
										</li>
									</HasAnyPermission>
									<HasAnyPermission
										permission={[
											"permission add",
											"permission list",
										]}
									>
										<li>
											<Link
												to="/role-permissions"
												className=""
											>
												<span>
													{props.t("Permissions")}
												</span>
											</Link>
										</li>
									</HasAnyPermission>
								</ul>
							</li>
						</HasAnyPermission>
					</ul>
				</div>
			</SimpleBar>
		</React.Fragment>
	);
};

SidebarContent.propTypes = {
	location: PropTypes.object,
	t: PropTypes.any,
};

export default withRouter(withTranslation()(SidebarContent));
