import PropTypes from "prop-types"
import MetaTags from "react-meta-tags"
import React from "react"
import { Row, Col, Alert, Container, FormFeedback} from "reactstrap"
//redux
import { useSelector, useDispatch } from "react-redux"
import { withRouter, Link } from "react-router-dom"
// availity-reactstrap-validation
import { AvForm, AvField } from "availity-reactstrap-validation"
// actions
import { login as loginUser } from "../../store/actions"
// import images
import logo from "../../assets/images/logo.png" 
//Import config
import CarouselPage from "../AuthenticationInner/CarouselPage"

const Login = props => {

	const dispatch = useDispatch()
	const errors  = useSelector(state => state.auth.errors);
	let error = "";
	if(errors?.data) {
		error = "Please enter valid credentials.";
	} 
	const handleValidSubmit = async (event, credentials) => {
		dispatch(loginUser(credentials, props.history))
	}

	return (
		<React.Fragment>
			<MetaTags>
				<title>Bitex Admin | Login</title>
			</MetaTags>
			<div className="auth-page">
				<Container fluid className="p-0">
					<Row className="g-0">
						<Col lg={4} md={5} className="col-xxl-3">
							<div className="auth-full-page-content d-flex p-sm-5 p-4">
								<div className="w-100">
									<div className="d-flex flex-column h-100">
										<div className="mb-4 mb-md-5 text-center">
											<Link to="/dashboard" className="d-block auth-logo">
												<img src={logo} alt="" height="28"/> 
											</Link>
										</div>
										<div className="auth-content my-auto">
											<div className="text-center">
												<h5 className="mb-0">Welcome Back !</h5>
												<p className="text-muted mt-2">Sign in to continue to Bitex.</p>
											</div>
											<AvForm
												className="custom-form mt-4 pt-2"
												onValidSubmit={(e, v) => {
													handleValidSubmit(e, v)
												}}
											>
												{error ? <Alert color="danger">{error}</Alert> : null}
												<div className="mb-3">
													<AvField
														name="email"
														label="Email"
														value="admin@themesbrand.com"
														className="form-control"
														placeholder="Enter email"
														type="email"
														required
													/>
												</div>
												<div className="mb-3">
													<div className="d-flex align-items-start">
														<div className="flex-grow-1">
															<label className="form-label">Password</label>
														</div>
														<div className="flex-shrink-0">
															<div className="">
																<Link to="/auth-recoverpw" className="text-muted">Forgot password?</Link>
															</div>
														</div>
													</div>

													<div className="mb-3">
														<AvField
															name="password"
															value="123456"
															type="password"
															className="form-control"
															required
															placeholder="Enter Password"
														/>
													</div>
												</div>
												<div className="row mb-4">
													<div className="col">
														<div className="form-check">
															<input className="form-check-input" type="checkbox" id="remember-check" />
															<label className="form-check-label" htmlFor="remember-check">
																Remember me
															</label>
														</div>
													</div>

												</div>
												<div className="mb-3">
													<button className="btn btn-primary w-100 waves-effect waves-light" type="submit">Log In</button>
												</div>
											</AvForm>
												
											<div className="mt-5 text-center">
												<p className="text-muted mb-0">Don't have an account ? <Link to="/register"
													className="text-primary fw-semibold"> Signup now </Link> </p>
											</div>
										</div>
										<div className="mt-4 mt-md-5 text-center">
											<p className="mb-0">© {new Date().getFullYear()} Bitex</p>
										</div>
									</div>
								</div>
							</div>
						</Col>
						<CarouselPage />
					</Row>
				</Container>
			</div>
		</React.Fragment>
	)
}

Login.propTypes = {
	history: PropTypes.object,
}
export default withRouter(Login)

