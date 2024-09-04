import React, { Component } from "react";
import { connect } from "react-redux";
import MetaTags from "react-meta-tags";
import {
	Row,
	Col,
	Card,
	CardBody,
	Input,
	Label,
	Modal,
	Table,
} from "reactstrap";
import { AvForm, AvField } from "availity-reactstrap-validation";
import Select from "react-select";
import makeAnimated from "react-select/animated";
import { withRouter, Link } from "react-router-dom";
import moment from "moment";
import ReactDataTable from "../../common/ReactDataTable";
import { apiUrl } from "../../config";
import Swal from "sweetalert2";
import PropTypes from "prop-types";
import {
	create,
	update,
	remove,
	clearResponse,
	getTags,
	getCategories,
} from "../../store/article/actions";
import { toast } from "react-toastify";
import isEmpty from "../../validation/isEmpty";

import { CKEditor } from "@ckeditor/ckeditor5-react";
import DecoupledEditor from "@ckeditor/ckeditor5-build-decoupled-document";
import Dropzone from "react-dropzone";

import HasAnyPermission from "../../common/Permission";
import hasPermission from "../../common/HasPermission";

const animatedComponents = makeAnimated();

class Article extends Component {
	state = {
		currentAssets: "",
		details: {
			image: "",
			thumbnail: "",
			name: "",
			caption: "",
			details: "",
			keywords: "",
			description: "",
			difficultyLevel: "Beginner",
			readingTime: 0,
			articleTags: [],
			category: "",
		},
		isModalOpen: false,
		errors: {
			image: { message: "" },
			thumbnail: { message: "" },
		},
	};

	componentDidMount = () => {
		this.props.getTags();
		this.props.getCategories();
	};

	columns = () => [
		{
			label: "Image",
			name: "action",
			options: {
				filter: false,
				sort: false,
				customBodyRender: (rowData) => {
					return rowData.image ? (
						<img
							alt=""
							style={{ height: 35, width: 35 }}
							src={`${apiUrl}/api/guest/get_image/${rowData?.image}`}
						/>
					) : rowData.thubmnail ? (
						<img
							alt=""
							style={{ height: 35, width: 35 }}
							src={`${apiUrl}/api/guest/get_image/${rowData?.thubmnail}`}
						/>
					) : (
						"Image Not Available"
					);
				},
			},
		},
		{
			label: "Name",
			name: "name",
			options: {
				filter: false,
				sort: false,
			},
		},
		{
			label: "Caption",
			name: "caption",
			options: {
				filter: false,
				sort: false,
			},
		},
		{
			label: "Difficulty Level",
			name: "difficultyLevel",
			options: {
				filter: false,
				sort: false,
			},
		},
		{
			label: "Tags (topics)",
			name: "articleTags",
			options: {
				filter: false,
				sort: false,
				customBodyRender: (articleTags) =>
					articleTags.map((tag) => tag.name + ", "),
			},
		},
		{
			label: "Reading Time (minutes)",
			name: "readingTime",
			options: {
				filter: false,
				sort: false,
			},
		},

		{
			label: "Details",
			name: "details",
			options: {
				filter: false,
				sort: false,
				customBodyRender: (details) => (
					<div
						dangerouslySetInnerHTML={{
							__html: details?.substr(0, 50),
						}}
					></div>
				),
			},
		},

		{
			label: "SEO Keywords",
			name: "keywords",
			options: {
				filter: false,
				sort: false,
				customBodyRender: (keywords) => (
					<div
						dangerouslySetInnerHTML={{
							__html: keywords?.substr(0, 50),
						}}
					></div>
				),
			},
		},
		{
			label: "SEO Description",
			name: "description",
			options: {
				filter: false,
				sort: false,
				customBodyRender: (description) => (
					<div
						dangerouslySetInnerHTML={{
							__html: description?.substr(0, 50),
						}}
					></div>
				),
			},
		},
		{
			label: "Actions",
			name: "action",
			options: {
				filter: false,
				sort: false,
				empty: true,
				download: false,
				display: hasPermission(
					["article update", "article delete", "article view"],
					this.props.auth.currentUserRolePermissions
				),
				viewColumns: hasPermission(
					["article update", "article delete", "article view"],
					this.props.auth.currentUserRolePermissions
				),
				customBodyRender: (data) => {
					return (
						<div className="text-center">
							<HasAnyPermission
								permission={["article update", "article view"]}
							>
								<button
									onClick={(e) => this.openModal(data)}
									type="button"
									className="btn btn-soft-primary waves-effect waves-light"
								>
									<i className="bx bx-edit-alt font-size-16 align-middle"></i>
								</button>
							</HasAnyPermission>
							&nbsp;
							<HasAnyPermission permission={["article delete"]}>
								<button
									onClick={(e) => this.remove(data._id)}
									type="button"
									className="btn btn-soft-danger waves-effect waves-light"
								>
									<i className="bx bx-trash font-size-16 align-middle"></i>
								</button>
							</HasAnyPermission>
						</div>
					);
				},
			},
		},
	];

	resultFormatter = (result) => {
		return result.data.map((item) => {
			return {
				...item,
				action: item,
			};
		});
	};

	save = (event, data) => {
		const { details } = this.state;
		if (details?._id) {
			this.props.update({
				...details,
				thumbnail: this.state.details.thumbnail,
			});
		} else {
			this.props.create(details);
		}
		this.closeModal();
	};

	remove = (id) => {
		Swal.fire({
			title: "Are you sure?",
			text: "Do you really want to delete Articles?",
			icon: "warning",
			showCancelButton: true,
			confirmButtonColor: "#3085d6",
			cancelButtonColor: "#d33",
			confirmButtonText: "Confirm",
		}).then((result) => {
			if (result.value) {
				this.props.remove(id);
			}
		});
	};

	openModal = (data = null) => {
		this.setState({
			isModalOpen: true,
			details:
				data === null
					? this.state.details
					: {
							...data,
							id: data._id,
							articleTags: data.articleTags.map((tag) => tag._id),
							category: data.category?._id,
					  },
		});
	};

	closeModal = () => {
		this.setState({
			isModalOpen: false,
		});
		this.clearForm();
	};

	clearForm = () => {
		this.setState({
			details: {
				name: "",
				caption: "",
				details: "",
				keywords: "",
				description: "",
			},
			errors: {
				image: { message: "" },
				thumbnail: { message: "" },
			},
		});
	};

	selectedFile = (selectedFiles, docType) => {
		if (isEmpty(selectedFiles)) {
			let errors = this.state.errors;
			errors[docType].message =
				"Invalid file format please upload jpeg, png.";
			this.setState({ errors });
		} else {
			const details = this.state.details;
			let droppedFile = {};
			selectedFiles.map((file) => {
				droppedFile = file;
				return true;
			});
			details[docType] = droppedFile;
			this.setState({ details });
		}
	};

	onEditorChange = (data) => {
		this.setState((prevState) => ({
			details: { ...prevState.details, details: data },
		}));
	};

	handleChange = (event) => {
		const details = this.state.details;
		details[event.target.name] = event.target.value;
		this.setState({ details });
	};

	getTagOptions = () => {
		return this.props.article.tags
			? this.props.article.tags?.map((item) => ({
					label: item.name,
					value: item._id,
			  }))
			: [
					{
						label: "Tags",
						value: "",
					},
			  ];
	};

	setTagSelectOptions = () => {
		const tagOptions = this.getTagOptions();
		return this.state.details.articleTags
			? this.state.details.articleTags?.map((item) =>
					tagOptions.find((tag) => tag.value === item)
			  )
			: [];
	};

	couldHaveAddUpdatePermission = () => {
		const isUpdatePermission = hasPermission(
			["article update"],
			this.props.auth.currentUserRolePermissions
		);
		const isAddPermission = hasPermission(
			["article add"],
			this.props.auth.currentUserRolePermissions
		);
		if (isUpdatePermission && isAddPermission) return true;
		else if (isUpdatePermission && this.state.details?._id) return true;
		else if (isAddPermission && isEmpty(this.state.details._id))
			return true;
		else return false;
	};

	render() {
		if (!isEmpty(this.props.article.response?.message)) {
			toast.success(this.props.article.response.message, {
				onOpen: () => {
					this.props.clearResponse();
					this.refreshTableData();
				},
			});
		}

		console.log(
			"this.state.details.articleTags:: ",
			this.state.details.articleTags,
			this.setTagSelectOptions()
		);

		return (
			<React.Fragment>
				<div className="page-content">
					<MetaTags>
						<title>Articles | Admin</title>
					</MetaTags>
					<div className="container-fluid">
						<Row>
							<Col>
								<Card>
									<CardBody>
										<div className="table-rep-plugin">
											<div className="table-responsive">
												<HasAnyPermission
													permission={[
														"article list",
													]}
												>
													<ReactDataTable
														url={`${apiUrl}/api/admin/article/all_article`}
														columns={this.columns()}
														resultFormatter={
															this.resultFormatter
														}
														setRefresh={(refresh) =>
															(this.refreshTableData =
																refresh)
														}
														disableFilterIcon={true}
														disableSearchIcon={true}
														origin={
															<div className="row">
																<div className="col-auto h4">
																	Academy
																	&nbsp;
																	<HasAnyPermission
																		permission={[
																			"article add",
																		]}
																	>
																		<button
																			onClick={(
																				e
																			) =>
																				this.openModal()
																			}
																			type="button"
																			className="btn btn-soft-primary waves-effect waves-light"
																		>
																			<i className="bx bx-plus-medical font-size-16 align-middle"></i>
																		</button>
																	</HasAnyPermission>
																</div>
															</div>
														}
														rowsPerPage={100}
													/>
												</HasAnyPermission>
											</div>
										</div>
									</CardBody>
								</Card>
							</Col>
						</Row>
					</div>
				</div>

				<Modal
					size="lg"
					isOpen={this.state.isModalOpen}
					centered={true}
				>
					<div className="modal-header">
						<h5 className="modal-title mt-0">Articles</h5>
						<button
							type="button"
							onClick={() => this.closeModal()}
							className="close"
							data-dismiss="modal"
							aria-label="Close"
						>
							<span aria-hidden="true">&times;</span>
						</button>
					</div>

					<div className="modal-body">
						<AvForm
							className="custom-form mt-4 pt-2"
							onValidSubmit={(e, v) => {
								this.save(e, v);
							}}
							disabled={!this.couldHaveAddUpdatePermission()}
						>
							<Row>
								<Col className="col-6">
									<Dropzone
										onDrop={(selectedFile) =>
											this.selectedFile(
												selectedFile,
												"thumbnail"
											)
										}
										accept="image/png, image/jpeg, image/webp, application/pdf"
									>
										{({ getRootProps, getInputProps }) => (
											<div className="dropzone">
												{this.state.details.thumbnail
													?.path ? (
													<div className="dropzon-input">
														<div className="imgBox">
															<img
																width="200px"
																src={URL.createObjectURL(
																	this.state
																		.details
																		.thumbnail
																)}
																alt={
																	this.state
																		.details
																		.thumbnail
																		?.path
																}
															/>
														</div>
														{
															this.state.details
																.thumbnail?.path
														}
													</div>
												) : (
													<div
														className="dz-message needsclick mt-2"
														{...getRootProps()}
													>
														<input
															{...getInputProps()}
														/>
														<div className="mb-3">
															<i className="display-4 text-muted bx bxs-cloud-upload" />
														</div>
														<h4>
															Drop files here or
															click to upload.
														</h4>
													</div>
												)}
											</div>
										)}
									</Dropzone>
								</Col>

								<Col className="col-6">
									<Dropzone
										onDrop={(selectedFile) =>
											this.selectedFile(
												selectedFile,
												"image"
											)
										}
										accept="image/png, image/jpeg, image/webp, application/pdf"
									>
										{({ getRootProps, getInputProps }) => (
											<div className="dropzone">
												{this.state.details.image
													?.path ? (
													<div className="dropzon-input">
														<div className="imgBox">
															<img
																width="200px"
																src={URL.createObjectURL(
																	this.state
																		.details
																		.image
																)}
																alt={
																	this.state
																		.details
																		.image
																		?.path
																}
															/>
														</div>
														{
															this.state.details
																.image?.path
														}
													</div>
												) : (
													<div
														className="dz-message needsclick mt-2"
														{...getRootProps()}
													>
														<input
															{...getInputProps()}
														/>
														<div className="mb-3">
															<i className="display-4 text-muted bx bxs-cloud-upload" />
														</div>
														<h4>
															Drop files here or
															click to upload.
														</h4>
													</div>
												)}
											</div>
										)}
									</Dropzone>
								</Col>
							</Row>

							<div className="mb-3">
								<label htmlFor="name" className="form-label">
									Name
								</label>
								<AvField
									type="text"
									className="form-control"
									name="name"
									value={this.state.details.name}
									onChange={this.handleChange}
								/>
							</div>

							<div className="mb-3">
								<label
									htmlFor="difficultyLevel"
									className="form-label font-size-13 text-muted"
								>
									Difficulty Level
								</label>
								<select
									value={this.state.details.difficultyLevel}
									onChange={this.handleChange}
									className="form-control"
									name="difficultyLevel"
								>
									<option disabled value="">
										Difficulty Level
									</option>
									{[
										"Beginner",
										"Intermediate",
										"Advanced",
									].map((item) => (
										<option key={item} value={item}>
											{item}
										</option>
									))}
								</select>
							</div>

							<div className="mb-3">
								<label
									htmlFor="articleTags"
									className="form-label font-size-13 text-muted"
								>
									Tags
								</label>

								<Select
									defaultValue={this.setTagSelectOptions()}
									isMulti={true}
									options={this.getTagOptions()}
									classNamePrefix="select2-selection"
									closeMenuOnSelect={false}
									components={animatedComponents}
									name="articleTags"
									onChange={(selectedOptions) => {
										const values = selectedOptions.map(
											(item) => item.value
										);
										const target = {
											name: "articleTags",
											value: values,
										};
										this.handleChange({ target });
									}}
								/>
							</div>
							<div className="mb-3">
								<label
									htmlFor="category"
									className="form-label font-size-13 text-muted"
								>
									Category
								</label>
								<select
									value={this.state.details.category}
									onChange={this.handleChange}
									className="form-control"
									name="category"
								>
									<option disabled value="">
										Category
									</option>
									{this.props.article.categories?.map(
										(item) => (
											<option
												key={item._id}
												value={item._id}
											>
												{item.name}
											</option>
										)
									)}
								</select>
							</div>

							<div className="mb-3">
								<CKEditor
									editor={DecoupledEditor}
									config={{
										ckfinder: {
											uploadUrl: `${apiUrl}/api/guest/save_image`,
											link: {
												decorators: {
													addTargetToExternalLinks: {
														mode: "automatic",
														callback: (url) =>
															/^(https?:)?\/\//.test(
																url
															),
														attributes: {
															target: "_blank",
															rel: "noopener noreferrer",
														},
													},
												},
											},
										},
										// plugins: [ Link ],
									}}
									data={this.state.details.details}
									onReady={(editor) => {
										editor.ui
											.getEditableElement()
											.parentElement.insertBefore(
												editor.ui.view.toolbar.element,
												editor.ui.getEditableElement()
											);
										this.editor = editor;
									}}
									onChange={(event, editor) => {
										const data = editor.getData();
										this.onEditorChange(data);
									}}
								/>
							</div>

							<div className="mb-3">
								<label
									htmlFor="keywords"
									className="form-label"
								>
									Seo keywords
								</label>
								<AvField
									type="text"
									className="form-control"
									name="keywords"
									value={this.state.details.keywords}
									onChange={this.handleChange}
								/>
							</div>
							<div className="mb-3">
								<label
									htmlFor="readingTime"
									className="form-label"
								>
									Reading Time (minutes)
								</label>
								<AvField
									type="number"
									className="form-control"
									name="readingTime"
									onChange={this.handleChange}
									value={this.state.details.readingTime}
								/>
							</div>
							<div className="mb-3">
								<label
									htmlFor="description"
									className="form-label"
								>
									Seo description
								</label>
								<AvField
									type="text"
									className="form-control"
									name="description"
									value={this.state.details.description}
									onChange={this.handleChange}
								/>
							</div>

							<div className="modal-footer">
								<button
									type="button"
									className="btn btn-danger"
									onClick={() => this.closeModal()}
								>
									Close
								</button>
								{this.couldHaveAddUpdatePermission() && (
									<button
										type="submit"
										className="btn btn-primary"
									>
										Save
									</button>
								)}
							</div>
						</AvForm>
					</div>
				</Modal>
			</React.Fragment>
		);
	}
}

Article.propTypes = {
	auth: PropTypes.object.isRequired,
};

const mapStateToProp = (state) => ({
	auth: state.auth,
	article: state.article,
});

export default connect(mapStateToProp, {
	create,
	update,
	remove,
	clearResponse,
	getTags,
	getCategories,
})(withRouter(Article));
