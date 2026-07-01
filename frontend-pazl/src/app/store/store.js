import { createStore, applyMiddleware, combineReducers, compose } from 'redux';
import { thunk } from 'redux-thunk';
import { userReducer } from '../../entities/user-entite/reducer';
import { publicationsUserReducer } from '../../entities/publications-entite/reducer';
import { appReducer } from '../../entities/app-entite/reducer';
import { editorReducer } from '../../entities/editor-entite/reducer';
import { likesReducer } from '../../entities/likes-entite/reducer';
import { likedPostsReducer } from '../../entities/liked-posts-entite/reducer/liked-posts-reducer';
import { friendsReducer } from '../../entities/friends-entite/friends-reducer';

const appReducers = combineReducers({
	user: userReducer,
	publicationsUser: publicationsUserReducer,
	app: appReducer,
	editor: editorReducer,
	likes: likesReducer,
	likedPosts: likedPostsReducer,
	friends: friendsReducer,
});

const composeEnhancers = window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__ || compose;

export const store = createStore(appReducers, composeEnhancers(applyMiddleware(thunk)));
