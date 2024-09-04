import React from "react";
import Grid from "@mui/material/Grid";

import {
	Card,
	CardContent,
	CardHeader,
	Button,
	Typography,
	List,
	ListItem,
	Tab,
	Tabs,
	TextField,
	CircularProgress,
	RadioGroup,
	Radio,
	FormControlLabel,
	InputAdornment,
} from "@mui/material";
import currencyIcon from "../../common/CurrencyIcon";

const moment = require("moment");

const UserTrade = ({
	classes,
	state,
	activeStock,
	activeMoney,
	marketAmount,
	limitAmount,
	limitPrice,
	trading,
	errors,
	currentUserFiatWallet,
	currentUserCryptoWallet,
	changeBuySell,
	handlebuyChange,
	handleInputChange,
	createMarketOrder,
	createLimitOrder,
	handleopenChange,
	cancelUserOrder,
	getCurrentTradeBidValue,
	getCurrentTradeAskValue,
	maintenance,
}) => (
	<Grid item xs={12} md={3} sm={12} className="col-03 rightCol">
		<div className="buySellBox tabBox">
			<div className="headTitle">
				<Typography component="h6">Trade</Typography>

				<Button
					variant="contained"
					color="primary"
					className={
						state.currentTrade === "buy"
							? "trade-buy-button active"
							: "trade-buy-button"
					}
					onClick={() => changeBuySell("buy")}
				>
					Buy
				</Button>
				<Button
					variant="contained"
					color="secondary"
					className={
						state.currentTrade === "sell"
							? "trade-sell-button active"
							: "trade-sell-button"
					}
					onClick={() => changeBuySell("sell")}
				>
					Sell
				</Button>
			</div>

			<Card className="">
				<CardHeader
					title={
						<RadioGroup
							aria-label="gender"
							name="gender1"
							onChange={handlebuyChange}
							value={state.buyTabValue}
						>
							<FormControlLabel
								value="buy"
								control={<Radio />}
								label="Market"
							/>
							<FormControlLabel
								value="sell"
								control={<Radio />}
								label="Limit"
							/>
						</RadioGroup>
					}
				/>

				<CardContent>
					{state.buyTabValue === "buy" ? (
						<div className="subData">
							<Grid container>
								<Grid
									item
									md={6}
									sm={6}
									xs={6}
									style={{
										display: "flex",
										flexDirection: "row",
										justifyContent: "flex-start",
										alignItems: "center",
									}}
								>
									<div className="currentMarket">
										<img
											src={currencyIcon(activeStock)}
											width="20"
											alt={activeStock}
										/>
										<span>
											{activeStock} / {activeMoney}
										</span>
									</div>
								</Grid>
								<Grid
									item
									md={6}
									sm={6}
									xs={6}
									style={{ textAlign: "right" }}
								>
									<Typography component="h2">
										{state.currentTrade === "buy"
											? `Available: ${parseFloat(
													currentUserFiatWallet.walletAmount
											  ).toFixed(2)} ${
													currentUserFiatWallet.coin
											  }`
											: `Available: ${parseFloat(
													currentUserCryptoWallet.walletAmount
											  ).toFixed(8)} ${
													currentUserCryptoWallet.coin
											  }`}
									</Typography>
								</Grid>
							</Grid>

							<TextField
								type="number"
								error={errors.marketAmount ? true : false}
								value={marketAmount}
								onChange={handleInputChange("marketAmount")}
								fullWidth={true}
								placeholder={
									`I want to ${state.currentTrade} (in ` +
									(state.currentTrade === "buy"
										? `${activeMoney})`
										: `${activeStock})`)
								}
								className={classes.input}
								InputProps={{
									startAdornment: (
										<InputAdornment>
											{" "}
											Amount{" "}
										</InputAdornment>
									),
								}}
							/>

							<TextField
								type="number"
								name="marketApprox"
								fullWidth={true}
								disabled
								className={classes.textField}
								value={
									state.currentTrade === "buy"
										? state.marketLastBuy
										: state.marketLastSell
								}
								InputProps={{
									startAdornment: (
										<InputAdornment> Price </InputAdornment>
									),
								}}
							/>

							<TextField
								type="number"
								name="marketSubtotal"
								fullWidth={true}
								disabled
								className={classes.textField}
								value={
									state.currentTrade === "buy"
										? state.marketApprox
										: state.marketSubtotal
								}
								InputProps={{
									startAdornment: (
										<InputAdornment>
											{" "}
											Total{" "}
											{state.currentTrade === "buy"
												? `${activeStock}`
												: `${activeMoney}`}
										</InputAdornment>
									),
								}}
							/>

							<div className="inline fee">
								<Typography component="h5"></Typography>

								<Typography component="h5">
									Fee: {state.takerFee * 100} %
								</Typography>
							</div>
							{state.currentTrade === "buy" ? (
								state.orderProcess ? (
									<Button
										variant="contained"
										color="primary"
										className={
											state.currentTrade === "buy"
												? "btn buyMarket"
												: "btn sellMarket"
										}
									>
										<CircularProgress
											size={24}
											color="secondary"
										/>
									</Button>
								) : (
									<Button
										variant="contained"
										color="primary"
										onClick={() => createMarketOrder("buy")}
										disabled={
											state.orderProcess || maintenance
										}
										className={
											state.currentTrade === "buy"
												? "btn buyMarket"
												: "btn sellMarket"
										}
									>
										Buy
									</Button>
								)
							) : state.orderProcess ? (
								<Button
									variant="contained"
									color="primary"
									className={
										state.currentTrade === "buy"
											? "btn buyMarket"
											: "btn sellMarket"
									}
								>
									<CircularProgress size={24} />
								</Button>
							) : (
								<Button
									variant="contained"
									color="primary"
									onClick={() => createMarketOrder("sell")}
									disabled={state.orderProcess || maintenance}
									className={
										state.currentTrade === "buy"
											? "btn buyMarket"
											: "btn sellMarket"
									}
								>
									Sell
								</Button>
							)}
						</div>
					) : (
						<div className="limitData">
							<div className="subData">
								<Grid container>
									<Grid
										item
										md={6}
										sm={6}
										xs={6}
										style={{
											display: "flex",
											flexDirection: "row",
											justifyContent: "flex-start",
											alignItems: "center",
										}}
									>
										<div className="currentMarket">
											<img
												src={currencyIcon(activeStock)}
												width="20"
												alt={activeStock}
											/>
											<span>
												{activeStock} / {activeMoney}
											</span>
										</div>
									</Grid>
									<Grid
										item
										md={6}
										sm={6}
										xs={6}
										style={{ textAlign: "right" }}
									>
										<Typography component="h2">
											{state.currentTrade === "buy"
												? `Available: ${parseFloat(
														currentUserFiatWallet.walletAmount
												  ).toFixed(2)} ${
														currentUserFiatWallet.coin
												  }`
												: `Available: ${parseFloat(
														currentUserCryptoWallet.walletAmount
												  ).toFixed(8)} ${
														currentUserCryptoWallet.coin
												  }`}
										</Typography>
									</Grid>
								</Grid>

								<TextField
									type="number"
									error={errors.limitAmount ? true : false}
									value={limitAmount}
									onChange={handleInputChange("limitAmount")}
									fullWidth={true}
									placeholder={`I want to ${state.currentTrade} (in ${activeStock})`}
									className={classes.input}
									InputProps={{
										startAdornment: (
											<InputAdornment position="end">
												{" "}
												Amount{" "}
											</InputAdornment>
										),
									}}
								/>

								<TextField
									type="number"
									error={errors.limitPrice ? true : false}
									value={limitPrice}
									onChange={handleInputChange("limitPrice")}
									fullWidth={true}
									placeholder={`I want to ${state.currentTrade} (in ${activeMoney})`}
									className={classes.input}
									InputProps={{
										startAdornment: (
											<InputAdornment
												onClick={
													state.currentTrade === "buy"
														? getCurrentTradeBidValue
														: getCurrentTradeAskValue
												}
												position="end"
											>
												{state.currentTrade === "buy"
													? `Price`
													: `Price`}
											</InputAdornment>
										),
									}}
								/>

								<TextField
									type="number"
									value={
										limitPrice && limitAmount
											? parseFloat(
													limitPrice * limitAmount
											  ).toFixed(4)
											: 0
									}
									fullWidth={true}
									placeholder={`Total ${activeMoney}`}
									className={classes.input}
									disabled
									InputProps={{
										startAdornment: (
											<InputAdornment position="end">
												{" "}
												Total {activeMoney}
											</InputAdornment>
										),
									}}
								/>

								<div className="space15"> </div>

								{state.currentTrade === "buy" ? (
									state.orderProcess ? (
										<Button
											variant="contained"
											color="primary"
											className={
												state.currentTrade === "buy"
													? "btn buyMarket"
													: "btn sellMarket"
											}
										>
											<CircularProgress
												size={24}
												color="secondary"
											/>
										</Button>
									) : (
										<Button
											variant="contained"
											color="primary"
											onClick={() =>
												createLimitOrder("buy")
											}
											disabled={
												state.orderProcess ||
												maintenance
											}
											className={
												state.currentTrade === "buy"
													? "btn buyMarket"
													: "btn sellMarket"
											}
										>
											Buy
										</Button>
									)
								) : state.orderProcess ? (
									<Button
										variant="contained"
										color="primary"
										className={
											state.currentTrade === "buy"
												? "btn buyMarket"
												: "btn sellMarket"
										}
									>
										<CircularProgress size={24} />
									</Button>
								) : (
									<Button
										variant="contained"
										color="primary"
										onClick={() => createLimitOrder("sell")}
										disabled={
											state.orderProcess || maintenance
										}
										className={
											state.currentTrade === "buy"
												? "btn buyMarket"
												: "btn sellMarket"
										}
									>
										Sell
									</Button>
								)}
							</div>
						</div>
					)}

					{maintenance && (
						<p className="unavailableText">{`${activeStock}${activeMoney} trading is currently disabled due to maintenance.`}</p>
					)}
				</CardContent>
			</Card>
		</div>

		<div className="openAllBox tabBox">
			<Card className="">
				<CardHeader
					title={
						<Tabs
							scrollButtons="auto"
							variant="scrollable"
							onChange={handleopenChange}
							value={state.openTabValue}
							textColor="primary"
							indicatorColor="primary"
						>
							<Tab
								value="open"
								className={classes.tabRoot}
								label="OPEN"
							/>
							<Tab
								value="all"
								className={classes.tabRoot}
								label="ALL"
							/>
						</Tabs>
					}
				/>
				<CardContent>
					{state.openTabValue === "open" ? (
						<List className="openallList tradingOpenALLBox">
							{trading.pendingOrders.map((order, index) => (
								<ListItem
									className={
										order.side === 1 ? "redBorder" : ""
									}
									key={index}
								>
									<Typography component="h3">
										<span> {order.market} - </span>{" "}
										{order.type === 1
											? `${order.amount} @ ${order.price}`
											: `${order.dealStock} @ ${(
													parseFloat(
														order.dealMoney
													) /
													parseFloat(order.dealStock)
											  ).toFixed(2)}`}
									</Typography>

									<Typography component="h4">
										{order.side === 1 ? "Sell" : "Buy"} -{" "}
										{order.type === 1 ? "Limit" : "Market"}
									</Typography>

									<Typography component="h5">
										{moment(order.createTime).format(
											"LLLL"
										)}
									</Typography>

									<Button
										variant="contained"
										color="secondary"
										className={classes.button}
										onClick={() =>
											cancelUserOrder(order._id)
										}
									>
										Cancel
									</Button>
								</ListItem>
							))}
						</List>
					) : (
						<List className="openallList tradingOpenALLBox">
							{trading.orders.map((order, index) => {
								if (
									parseFloat(order.amount) > 0 ||
									parseFloat(order.price) > 0
								) {
									return (
										<ListItem
											className={
												order.side === 1
													? "redBorder"
													: ""
											}
											key={index}
										>
											{/* <Typography component="h3">
                                        <span> {order.market} </span>
                                        {`${(order.type === 1 || order.side === 1) ? order.amount : ((parseFloat(order.amount)/parseFloat(order.price)) > 0.0001) ? (order.market.includes('BTX') ? parseFloat(order.dealStock) :(parseFloat(order.amount)/parseFloat(order.price))).toFixed(4) : (order.market.includes('BTX') ? parseFloat(order.dealStock) : parseFloat(order.amount)/parseFloat(order.price)).toFixed(8)} @ ${(parseFloat(order.dealMoney)/parseFloat(order.dealStock)).toFixed(2)}`}
                                    </Typography> */}

											<Typography component="h3">
												<span> {order.market} - </span>{" "}
												{order.type === 1
													? `${order.amount} @ ${order.price}`
													: `${order.dealStock} @ ${(
															parseFloat(
																order.dealMoney
															) /
															parseFloat(
																order.dealStock
															)
													  ).toFixed(2)}`}
											</Typography>

											<Typography component="h4">
												{order.side === 1
													? "Sell"
													: "Buy"}{" "}
												-{" "}
												{order.type === 1
													? "Limit"
													: "Market"}
											</Typography>

											<Typography component="h5">
												{moment(
													order.createTime
												).format("LLLL")}
											</Typography>
										</ListItem>
									);
								} else {
									return undefined;
								}
							})}
						</List>
					)}
				</CardContent>
			</Card>
		</div>
	</Grid>
);

UserTrade.propTypes = {};

export default UserTrade;
