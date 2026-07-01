import { ACTION_TYPE } from '../action-type';
import { request } from '../../../shared/utils/request';

export const setFriendsData = (data) => ({
	type: ACTION_TYPE.SET_FRIENDS_DATA,
	payload: data,
});

export const setFriendsLoading = (loading) => ({
	type: ACTION_TYPE.SET_FRIENDS_LOADING,
	payload: loading,
});

export const addDeletedUserId = (userId) => ({
	type: ACTION_TYPE.ADD_DELETED_USER_ID,
	payload: userId,
});

export const clearDeletedUsers = () => ({
	type: ACTION_TYPE.CLEAR_DELETED_USERS,
});

export const setFriendsError = (error) => ({
	type: ACTION_TYPE.SET_FRIENDS_ERROR,
	payload: error,
});

export const fetchFriendsData = () => async (dispatch) => {
	dispatch(setFriendsLoading(true));
	try {
		const [friends, following, requests, sent] = await Promise.all([
			request('/api/friends/friends?limit=10000', 'GET'),
			request('/api/friends/following?limit=10000', 'GET'),
			request('/api/friends/requests?limit=10000', 'GET'),
			request('/api/friends/sent?limit=10000', 'GET'),
		]);
		dispatch(
			setFriendsData({
				friends: friends.res?.items || [],
				following: following.res?.items || [],
				requests: requests.res?.items || [],
				sent: sent.res?.items || [],
			}),
		);
	} catch (error) {
		dispatch(setFriendsError(error.message));
	} finally {
		dispatch(setFriendsLoading(false));
	}
};

export const toggleFollow = (targetId) => async (dispatch) => {
	try {
		const result = await request(`/api/friends/follow/${targetId}`, 'POST');
		if (result.res) {
			await dispatch(fetchFriendsData());
		}
	} catch (error) {
		console.error('Ошибка подписки:', error);
	}
};

export const sendFriendRequest = (targetId) => async (dispatch) => {
	try {
		const result = await request(`/api/friends/request/${targetId}`, 'POST');
		if (result.res) {
			await dispatch(fetchFriendsData());
		}
	} catch (error) {
		console.error('Ошибка отправки заявки:', error);
	}
};

export const cancelFriendRequest = (targetId) => async (dispatch) => {
	try {
		const result = await request(`/api/friends/request/cancel/${targetId}`, 'DELETE');
		if (result.res) {
			await dispatch(fetchFriendsData());
		}
	} catch (error) {
		console.error('Ошибка отмены заявки:', error);
	}
};

export const acceptFriendRequest = (requesterId) => async (dispatch) => {
	try {
		const result = await request(
			`/api/friends/request/${requesterId}/accept`,
			'POST',
		);
		if (result.res) {
			await dispatch(fetchFriendsData());
		}
	} catch (error) {
		console.error('Ошибка принятия заявки:', error);
	}
};

export const rejectFriendRequest = (requesterId) => async (dispatch) => {
	try {
		const result = await request(`/api/friends/request/${requesterId}`, 'DELETE');
		if (result.res) {
			await dispatch(fetchFriendsData());
		}
	} catch (error) {
		console.error('Ошибка отклонения заявки:', error);
	}
};

export const removeFriend = (friendId) => async (dispatch) => {
	try {
		const result = await request(`/api/friends/${friendId}`, 'DELETE');
		if (result.res) {
			await dispatch(fetchFriendsData());
		}
	} catch (error) {
		console.error('Ошибка удаления друга:', error);
	}
};
