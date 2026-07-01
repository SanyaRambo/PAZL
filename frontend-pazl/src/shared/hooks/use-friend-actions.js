import { useState } from 'react';
import { useDispatch } from 'react-redux';
import {
	toggleFollow,
	sendFriendRequest,
	cancelFriendRequest,
	acceptFriendRequest,
	rejectFriendRequest,
	removeFriend,
} from '../../entities/friends-entite/actions';

export const useFriendActions = (targetUserId, onSuccess) => {
	const dispatch = useDispatch();

	const [states, setStates] = useState({
		follow: { loading: false, success: false },
		unfollow: { loading: false, success: false },
		sendRequest: { loading: false, success: false },
		cancelRequest: { loading: false, success: false },
		acceptRequest: { loading: false, success: false },
		rejectRequest: { loading: false, success: false },
		removeFriend: { loading: false, success: false },
	});

	const execute = async (action, actionName) => {
		setStates((prev) => ({
			...prev,
			[actionName]: { loading: true, success: false },
		}));

		try {
			await action();
			setStates((prev) => ({
				...prev,
				[actionName]: { loading: false, success: true },
			}));
			if (onSuccess) onSuccess();
			setTimeout(() => {
				setStates((prev) => ({
					...prev,
					[actionName]: { loading: false, success: false },
				}));
			}, 1000);
		} catch (e) {
			console.error(e);
			setStates((prev) => ({
				...prev,
				[actionName]: { loading: false, success: false },
			}));
		}
	};

	return {
		follow: {
			loading: states.follow.loading,
			success: states.follow.success,
			execute: () => execute(() => dispatch(toggleFollow(targetUserId)), 'follow'),
		},
		unfollow: {
			loading: states.unfollow.loading,
			success: states.unfollow.success,
			execute: () =>
				execute(() => dispatch(toggleFollow(targetUserId)), 'unfollow'),
		},
		sendRequest: {
			loading: states.sendRequest.loading,
			success: states.sendRequest.success,
			execute: () =>
				execute(() => dispatch(sendFriendRequest(targetUserId)), 'sendRequest'),
		},
		cancelRequest: {
			loading: states.cancelRequest.loading,
			success: states.cancelRequest.success,
			execute: () =>
				execute(
					() => dispatch(cancelFriendRequest(targetUserId)),
					'cancelRequest',
				),
		},
		acceptRequest: {
			loading: states.acceptRequest.loading,
			success: states.acceptRequest.success,
			execute: () =>
				execute(
					() => dispatch(acceptFriendRequest(targetUserId)),
					'acceptRequest',
				),
		},
		rejectRequest: {
			loading: states.rejectRequest.loading,
			success: states.rejectRequest.success,
			execute: () =>
				execute(
					() => dispatch(rejectFriendRequest(targetUserId)),
					'rejectRequest',
				),
		},
		removeFriend: {
			loading: states.removeFriend.loading,
			success: states.removeFriend.success,
			execute: () =>
				execute(() => dispatch(removeFriend(targetUserId)), 'removeFriend'),
		},
	};
};
