// shared/ui-kit/icon/iconMap.js
import {
	LayoutGrid, // fa-th-large
	SquarePen, // fa-pencil-square-o
	Library, // fa-book
	Clock, // fa-clock-o
	Settings, // fa-cog
	ThumbsUp, // fa-thumbs-up
	ThumbsDown, // fa-thumbs-down
	MessageCircle, // fa-comment
	UserPlus, // fa-user-plus
	UserX, // fa-user-times
	Trash2, // fa-trash
	Save,
	Search,// fa-floppy-o
	UserRound,
	UsersRound
} from 'lucide-react';

export const iconMap = {
	'fa-th-large': LayoutGrid,
	'fa-pencil-square-o': SquarePen,
	'fa-book': Library,
	'fa-clock-o': Clock,
	'fa-users': UsersRound,
	'fa-user-circle': UserRound, // подходящий аналог
	'fa-user-circle-o': UserRound,
	'fa-cog': Settings,
	'fa-thumbs-up': ThumbsUp,
	'fa-thumbs-down': ThumbsDown,
	'fa-comment': MessageCircle,
	'fa-user-plus': UserPlus,
	'fa-user-times': UserX,
	'fa-trash': Trash2,
	'fa-floppy-o': Save,
	'fa-search': Search,
};
