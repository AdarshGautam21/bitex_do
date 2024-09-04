import axios from "axios";
import { apiUrl } from "../../config";

export const create = (data) =>
	axios
		.post(`${apiUrl}/api/admin/article/save_article`, data, {
			headers: {
				"Content-Type": "multipart/form-data", //application/x-www-form-urlencoded
			},
		})
		.then((response) => response)
		.catch((err) => err.response);

export const update = (data) =>
	axios
		.post(`${apiUrl}/api/admin/article/update_article`, data, {
			headers: {
				"Content-Type": "multipart/form-data", //application/x-www-form-urlencoded
			},
		})
		.then((response) => response)
		.catch((err) => err.response);

export const toggle = (id) =>
	axios
		.get(`${apiUrl}/api/admin/article/remove_article/${id}`)
		.then((response) => response)
		.catch((err) => err.response);

export const feature = (id) =>
	axios
		.get(`${apiUrl}/api/admin/article/make_feature_article/${id}`)
		.then((response) => response)
		.catch((err) => err.response);

export const remove = (id) =>
	axios
		.get(`${apiUrl}/api/admin/article/remove_article/${id}`)
		.then((response) => response)
		.catch((err) => err.response);

export const createTag = (data) =>
	axios
		.post(`${apiUrl}/api/admin/article-tags/create_article_tags`, data)
		.then((response) => response)
		.catch((err) => err.response);

export const updateTag = (data) =>
	axios
		.post(
			`${apiUrl}/api/admin/article-tags/update_article_tags/${data._id}`,
			data
		)
		.then((response) => response)
		.catch((err) => err.response);

export const toggleTag = (id) =>
	axios
		.post(`${apiUrl}/api/admin/article-tags/toggle_article_tags/${id}`)
		.then((response) => response)
		.catch((err) => err.response);

export const removeTag = (id) =>
	axios
		.get(`${apiUrl}/api/admin/article-tags/remove_article_tags/${id}`)
		.then((response) => response)
		.catch((err) => err.response);

export const createCategory = (data) =>
	axios
		.post(
			`${apiUrl}/api/admin/article-categories/create_article_categories`,
			data
		)
		.then((response) => response)
		.catch((err) => err.response);

export const updateCategory = (data) =>
	axios
		.post(
			`${apiUrl}/api/admin/article-categories/update_article_categories/${data._id}`,
			data
		)
		.then((response) => response)
		.catch((err) => err.response);

export const removeCategory = (id) =>
	axios
		.get(
			`${apiUrl}/api/admin/article-categories/remove_article_categories/${id}`
		)
		.then((response) => response)
		.catch((err) => err.response);

export const toggleCategory = (id) =>
	axios
		.post(
			`${apiUrl}/api/admin/article-categories/toggle_article_categories/${id}`
		)
		.then((response) => response)
		.catch((err) => err.response);

export const getTags = () =>
	axios
		.get(`${apiUrl}/api/admin/article-tags/get_active_article_tags`)
		.then((response) => response)
		.catch((err) => err.response);

export const getCategories = () =>
	axios
		.get(
			`${apiUrl}/api/admin/article-categories/get_active_article_categories`
		)
		.then((response) => response)
		.catch((err) => err.response);
