import { call, put, takeEvery, takeLatest } from "redux-saga/effects";
import {
	CREATE_ARTICLE_REQUEST,
	CREATE_ARTICLE_SUCCESS,
	CREATE_ARTICLE_FAILURE,
	UPDATE_ARTICLE_SUCCESS,
	UPDATE_ARTICLE_REQUEST,
	UPDATE_ARTICLE_FAILURE,
	REMOVE_ARTICLE_FAILURE,
	REMOVE_ARTICLE_SUCCESS,
	REMOVE_ARTICLE_REQUEST,
	FEATURE_ARTICLE_FAILURE,
	FEATURE_ARTICLE_SUCCESS,
	FEATURE_ARTICLE_REQUEST,
	TOGGLE_ARTICLE_SUCCESS,
	TOGGLE_ARTICLE_REQUEST,
	TOGGLE_ARTICLE_FAILURE,
	CREATE_ARTICLE_TAG_REQUEST,
	CREATE_ARTICLE_TAG_SUCCESS,
	CREATE_ARTICLE_TAG_FAILURE,
	UPDATE_ARTICLE_TAG_REQUEST,
	UPDATE_ARTICLE_TAG_SUCCESS,
	UPDATE_ARTICLE_TAG_FAILURE,
	REMOVE_ARTICLE_TAG_REQUEST,
	REMOVE_ARTICLE_TAG_SUCCESS,
	REMOVE_ARTICLE_TAG_FAILURE,
	TOGGLE_ARTICLE_TAG_SUCCESS,
	TOGGLE_ARTICLE_TAG_REQUEST,
	TOGGLE_ARTICLE_TAG_FAILURE,
	CREATE_ARTICLE_CATEGORY_SUCCESS,
	CREATE_ARTICLE_CATEGORY_REQUEST,
	CREATE_ARTICLE_CATEGORY_FAILURE,
	UPDATE_ARTICLE_CATEGORY_SUCCESS,
	UPDATE_ARTICLE_CATEGORY_REQUEST,
	UPDATE_ARTICLE_CATEGORY_FAILURE,
	REMOVE_ARTICLE_CATEGORY_SUCCESS,
	REMOVE_ARTICLE_CATEGORY_REQUEST,
	REMOVE_ARTICLE_CATEGORY_FAILURE,
	TOGGLE_ARTICLE_CATEGORY_SUCCESS,
	TOGGLE_ARTICLE_CATEGORY_REQUEST,
	TOGGLE_ARTICLE_CATEGORY_FAILURE,
	ARTICLE_CATEGORY_REQUEST,
	ARTICLE_CATEGORY_SUCCESS,
	ARTICLE_CATEGORY_FAILURE,
	ARTICLE_TAG_REQUEST,
	ARTICLE_TAG_SUCCESS,
	ARTICLE_TAG_FAILURE,
} from "./actionTypes";

import {
	create,
	update,
	remove,
	feature,
	toggle,
	createCategory as createCategoryService,
	toggleCategory as toggleCategoryService,
	createTag as createTagService,
	toggleTag as toggleTagService,
	removeCategory as removeCategoryService,
	removeTag as removeTagService,
	updateCategory as updateCategoryService,
	updateTag as updateTagService,
	getCategories as getCategoriesService,
	getTags as getTagsService,
} from "./services";

function* createArticle({ payload: { data } }) {
	try {
		const formData = new FormData();
		Object.entries(data).forEach(([key, value]) =>
			formData.append(
				key,
				Array.isArray(value) ? JSON.stringify(value) : value
			)
		);
		const response = yield call(create, formData);
		if (response.status === 200) {
			yield put({
				type: CREATE_ARTICLE_SUCCESS,
				payload: response.data,
			});
		} else {
			yield put({
				type: CREATE_ARTICLE_FAILURE,
				payload: [],
			});
		}
	} catch (err) {
		yield put({
			type: CREATE_ARTICLE_FAILURE,
			payload: [],
		});
	}
}

function* updateArticle({ payload: { data } }) {
	try {
		const formData = new FormData();
		Object.entries(data).forEach(([key, value]) =>
			key === "image"
				? formData.append("file", value)
				: formData.append(
						key,
						Array.isArray(value) ? JSON.stringify(value) : value
				  )
		);
		const response = yield call(update, formData);
		if (response.status === 200) {
			yield put({
				type: UPDATE_ARTICLE_SUCCESS,
				payload: response.data,
			});
		} else {
			yield put({
				type: UPDATE_ARTICLE_FAILURE,
				payload: [],
			});
		}
	} catch (err) {
		yield put({
			type: UPDATE_ARTICLE_FAILURE,
			payload: [],
		});
	}
}

function* toggleArticle({ payload: { id } }) {
	try {
		const response = yield call(toggle, id);
		if (response.status === 200) {
			yield put({
				type: TOGGLE_ARTICLE_SUCCESS,
				payload: response.data,
			});
		} else {
			yield put({
				type: TOGGLE_ARTICLE_FAILURE,
				payload: [],
			});
		}
	} catch (err) {
		yield put({
			type: TOGGLE_ARTICLE_FAILURE,
			payload: [],
		});
	}
}

function* featureArticle({ payload: { id } }) {
	try {
		const response = yield call(feature, id);
		if (response.status === 200) {
			yield put({
				type: FEATURE_ARTICLE_SUCCESS,
				payload: response.data,
			});
		} else {
			yield put({
				type: FEATURE_ARTICLE_FAILURE,
				payload: [],
			});
		}
	} catch (err) {
		yield put({
			type: FEATURE_ARTICLE_FAILURE,
			payload: [],
		});
	}
}

function* removeArticle({ payload: { id } }) {
	try {
		const response = yield call(remove, id);
		if (response.status === 200) {
			yield put({
				type: REMOVE_ARTICLE_SUCCESS,
				payload: response.data,
			});
		} else {
			yield put({
				type: REMOVE_ARTICLE_FAILURE,
				payload: [],
			});
		}
	} catch (err) {
		yield put({
			type: REMOVE_ARTICLE_FAILURE,
			payload: [],
		});
	}
}

function* createTag({ payload: { data } }) {
	try {
		const response = yield call(createTagService, data);
		if (response.status === 200) {
			yield put({
				type: CREATE_ARTICLE_TAG_SUCCESS,
				payload: response.data,
			});
		} else {
			yield put({
				type: CREATE_ARTICLE_TAG_FAILURE,
				payload: [],
			});
		}
	} catch (err) {
		yield put({
			type: CREATE_ARTICLE_TAG_FAILURE,
			payload: [],
		});
	}
}

function* updateTag({ payload: { data } }) {
	try {
		const response = yield call(updateTagService, data);
		if (response.status === 200) {
			yield put({
				type: UPDATE_ARTICLE_TAG_SUCCESS,
				payload: response.data,
			});
		} else {
			yield put({
				type: UPDATE_ARTICLE_TAG_FAILURE,
				payload: [],
			});
		}
	} catch (err) {
		yield put({
			type: UPDATE_ARTICLE_TAG_FAILURE,
			payload: [],
		});
	}
}

function* removeTag({ payload: { id } }) {
	try {
		const response = yield call(removeTagService, id);
		if (response.status === 200) {
			yield put({
				type: REMOVE_ARTICLE_TAG_SUCCESS,
				payload: response.data,
			});
		} else {
			yield put({
				type: REMOVE_ARTICLE_TAG_FAILURE,
				payload: [],
			});
		}
	} catch (err) {
		yield put({
			type: REMOVE_ARTICLE_TAG_FAILURE,
			payload: [],
		});
	}
}

function* toggleTag({ payload: { id } }) {
	try {
		const response = yield call(toggleTagService, id);
		if (response.status === 200) {
			yield put({
				type: TOGGLE_ARTICLE_TAG_SUCCESS,
				payload: response.data,
			});
		} else {
			yield put({
				type: TOGGLE_ARTICLE_TAG_FAILURE,
				payload: [],
			});
		}
	} catch (err) {
		yield put({
			type: TOGGLE_ARTICLE_TAG_FAILURE,
			payload: [],
		});
	}
}

function* createCategory({ payload: { data } }) {
	try {
		const response = yield call(createCategoryService, data);
		if (response.status === 200) {
			yield put({
				type: CREATE_ARTICLE_CATEGORY_SUCCESS,
				payload: response.data,
			});
		} else {
			yield put({
				type: CREATE_ARTICLE_CATEGORY_FAILURE,
				payload: [],
			});
		}
	} catch (err) {
		yield put({
			type: CREATE_ARTICLE_CATEGORY_FAILURE,
			payload: [],
		});
	}
}

function* updateCategory({ payload: { data } }) {
	try {
		const response = yield call(updateCategoryService, data);
		if (response.status === 200) {
			yield put({
				type: UPDATE_ARTICLE_CATEGORY_SUCCESS,
				payload: response.data,
			});
		} else {
			yield put({
				type: UPDATE_ARTICLE_CATEGORY_FAILURE,
				payload: [],
			});
		}
	} catch (err) {
		yield put({
			type: UPDATE_ARTICLE_CATEGORY_FAILURE,
			payload: [],
		});
	}
}

function* removeCategory({ payload: { id } }) {
	try {
		const response = yield call(removeCategoryService, id);
		if (response.status === 200) {
			yield put({
				type: REMOVE_ARTICLE_CATEGORY_SUCCESS,
				payload: response.data,
			});
		} else {
			yield put({
				type: REMOVE_ARTICLE_CATEGORY_FAILURE,
				payload: [],
			});
		}
	} catch (err) {
		yield put({
			type: REMOVE_ARTICLE_CATEGORY_FAILURE,
			payload: [],
		});
	}
}

function* toggleCategory({ payload: { id } }) {
	try {
		const response = yield call(toggleCategoryService, id);
		if (response.status === 200) {
			yield put({
				type: TOGGLE_ARTICLE_CATEGORY_SUCCESS,
				payload: response.data,
			});
		} else {
			yield put({
				type: TOGGLE_ARTICLE_CATEGORY_FAILURE,
				payload: [],
			});
		}
	} catch (err) {
		yield put({
			type: TOGGLE_ARTICLE_CATEGORY_FAILURE,
			payload: [],
		});
	}
}

function* getCategories() {
	try {
		const response = yield call(getCategoriesService);
		if (response.status === 200) {
			yield put({
				type: ARTICLE_CATEGORY_SUCCESS,
				payload: response.data,
			});
		} else {
			yield put({
				type: ARTICLE_CATEGORY_FAILURE,
				payload: [],
			});
		}
	} catch (err) {
		yield put({
			type: ARTICLE_CATEGORY_FAILURE,
			payload: [],
		});
	}
}

function* getTags() {
	try {
		const response = yield call(getTagsService);
		if (response.status === 200) {
			yield put({
				type: ARTICLE_TAG_SUCCESS,
				payload: response.data,
			});
		} else {
			yield put({
				type: ARTICLE_TAG_FAILURE,
				payload: [],
			});
		}
	} catch (err) {
		yield put({
			type: ARTICLE_TAG_FAILURE,
			payload: [],
		});
	}
}

function* saga() {
	yield takeEvery(CREATE_ARTICLE_REQUEST, createArticle);
	yield takeEvery(UPDATE_ARTICLE_REQUEST, updateArticle);
	yield takeEvery(REMOVE_ARTICLE_REQUEST, removeArticle);
	yield takeEvery(TOGGLE_ARTICLE_REQUEST, toggleArticle);
	yield takeEvery(FEATURE_ARTICLE_REQUEST, featureArticle);

	yield takeEvery(CREATE_ARTICLE_TAG_REQUEST, createTag);
	yield takeEvery(UPDATE_ARTICLE_TAG_REQUEST, updateTag);
	yield takeEvery(REMOVE_ARTICLE_TAG_REQUEST, removeTag);
	yield takeEvery(TOGGLE_ARTICLE_TAG_REQUEST, toggleTag);

	yield takeEvery(ARTICLE_TAG_REQUEST, getTags);
	yield takeEvery(ARTICLE_CATEGORY_REQUEST, getCategories);

	yield takeEvery(CREATE_ARTICLE_CATEGORY_REQUEST, createCategory);
	yield takeEvery(UPDATE_ARTICLE_CATEGORY_REQUEST, updateCategory);
	yield takeEvery(REMOVE_ARTICLE_CATEGORY_REQUEST, removeCategory);
	yield takeEvery(TOGGLE_ARTICLE_CATEGORY_REQUEST, toggleCategory);
}

export default saga;
