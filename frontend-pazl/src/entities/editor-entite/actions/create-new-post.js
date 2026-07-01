import { request } from "../../../shared/utils/request";
import { addingNewPost, setPublicationsUser } from "../../publications-entite/actions";
import { setEditingPost } from "./set-editing-post";


export const createNewPost = () => async (dispatch) => {
	try {
		const newPost = {
			title: 'Новый пост'
		};
		const data = await request('/api/publications', 'POST', newPost);

		dispatch(setEditingPost(data.res));
		dispatch(addingNewPost(data.res))

	} catch (e) {
		dispatch(setPublicationsUser(null, e.message))
	}
};
