import React, { useState, useEffect } from 'react';
import { Client } from '@microsoft/microsoft-graph-client';
import { CheckboxFunctionality } from './Checkbox';
import { Input, Field, Divider } from '@fluentui/react-components';
import { useCallback } from 'react';
import {
	Delete24Regular,
	MoreHorizontal24Regular,
	Circle16Regular,
	CircleHalfFill16Regular,
	WeatherSunny24Regular,
	Checkmark16Regular,
	AlertUrgent16Regular,
	Important16Regular,
	Important24Regular,
} from '@fluentui/react-icons';
import { Textarea } from '@fluentui/react-components';
import { Label } from '@fluentui/react-components';
import { v4 as uuidv4 } from 'uuid';
import { Tag, TagGroup } from '@fluentui/react-components';
import { RectangleLandscape20Regular } from '@fluentui/react-icons';
import { DatePicker } from '@fluentui/react-datepicker-compat';
import { Persona } from '@fluentui/react-components';
import {
	Dialog,
	DialogTrigger,
	DialogSurface,
	DialogTitle,
	DialogBody,
	DialogActions,
	DialogContent,
	Dropdown,
} from '@fluentui/react-components';

import {
	Accordion,
	AccordionHeader,
	AccordionItem,
	AccordionPanel,
} from '@fluentui/react-components';

import {
	PresenceBadgeStatus,
	Avatar,
	DataGridBody,
	DataGridRow,
	DataGrid,
	DataGridHeader,
	DataGridHeaderCell,
	DataGridCell,
	TableCellLayout,
	TableColumnDefinition,
	createTableColumn,
} from '@fluentui/react-components';
import { MenuButton } from '@fluentui/react-components';
import { Notepad16Regular } from '@fluentui/react-icons';
import { ChevronDown16Regular } from '@fluentui/react-icons';
import { Calendar24Regular } from '@fluentui/react-icons';
import { Menu } from '@fluentui/react-components';
import { MenuItem } from '@fluentui/react-components';
import { MenuPopover, MenuList, makeStyles } from '@fluentui/react-components';
import { MenuTrigger } from '@fluentui/react-components';
import { Checkmark24Regular } from '@fluentui/react-icons';
import { Important20Filled } from '@fluentui/react-icons';
import { ArrowSortDown24Filled } from '@fluentui/react-icons';
import { ArrowSortDown16Filled } from '@fluentui/react-icons';
import { CircleSmall24Filled } from '@fluentui/react-icons';
import { Delete16Regular } from '@fluentui/react-icons';
import { Add20Regular } from '@fluentui/react-icons';
import { AlertUrgent24Filled } from '@fluentui/react-icons';
import { Calendar16Regular } from '@fluentui/react-icons';
import { CheckmarkCircle12Regular } from '@fluentui/react-icons';
import { AlertUrgent16Filled, Important16Filled } from '@fluentui/react-icons';
import { Option } from '@fluentui/react-components';
import './MenuBar.css';
import { Checkbox } from '@fluentui/react-components';
import { FluentProvider, teamsLightTheme } from '@fluentui/react-components';
import { UserAgentApplication } from 'msal';
import { useGraphWithCredential } from '@microsoft/teamsfx-react';
import { useTeamsUserCredential } from '@microsoft/teamsfx-react';
import { Button } from '@fluentui/react-components';
import DueDateDialog from './DueDateDialog';
import config from './sample/lib/config';
import { TeamsUserCredential } from '@microsoft/teamsfx';
import {
	Selection,
	SelectionMode,
	DefaultButton,
	Stack,
	mergeStyles,
	initializeIcons,
	MessageBar,
	MessageBarType,
} from '@fluentui/react';

initializeIcons();
const initialFormData = {
	taskTitle: '',
	assignedTo: '',
	status: '',
};

const accessToken =
	'eyJ0eXAiOiJKV1QiLCJub25jZSI6IkNTc25INmVsUVJMX05EVFZDdV9MYVNKOVU3NmlLVUhWbkR2MnZBU18tVlUiLCJhbGciOiJSUzI1NiIsIng1dCI6IjVCM25SeHRRN2ppOGVORGMzRnkwNUtmOTdaRSIsImtpZCI6IjVCM25SeHRRN2ppOGVORGMzRnkwNUtmOTdaRSJ9.eyJhdWQiOiIwMDAwMDAwMy0wMDAwLTAwMDAtYzAwMC0wMDAwMDAwMDAwMDAiLCJpc3MiOiJodHRwczovL3N0cy53aW5kb3dzLm5ldC9jODVlOTY4Zi03MjlhLTRiNjUtYWIzOS04NTRjYWFiMzhlNTUvIiwiaWF0IjoxNzA1NDk2NDA1LCJuYmYiOjE3MDU0OTY0MDUsImV4cCI6MTcwNTU4MzEwNSwiYWNjdCI6MCwiYWNyIjoiMSIsImFpbyI6IkFWUUFxLzhWQUFBQWJvMkJvOVJ2bnRwTWlkbVlNOXVvYlpRWDRvamF5czFwTVRrQXZoVXJLVnJITEVFRlQ1VnYveVRSSFUxYktPMkQxQTlRdWJBNkZTWGhqZ3MyejFNYWFxMURjMjc1WHROY3V4QVlBcG9UOHJNPSIsImFtciI6WyJwd2QiLCJtZmEiXSwiYXBwX2Rpc3BsYXluYW1lIjoiR3JhcGggRXhwbG9yZXIiLCJhcHBpZCI6ImRlOGJjOGI1LWQ5ZjktNDhiMS1hOGFkLWI3NDhkYTcyNTA2NCIsImFwcGlkYWNyIjoiMCIsImZhbWlseV9uYW1lIjoidml0dGFsIiwiZ2l2ZW5fbmFtZSI6IlNhaSIsImlkdHlwIjoidXNlciIsImlwYWRkciI6IjE4My44Mi4xMTUuMTk5IiwibmFtZSI6IlNhaSB2aXR0YWwiLCJvaWQiOiI3YmE5YTg0Yy0yOGU4LTQ4YWEtYjJmZi03Njc0MDhhMWQxOTUiLCJwbGF0ZiI6IjMiLCJwdWlkIjoiMTAwMzIwMDJCQUUzNjZGRSIsInJoIjoiMC5BYmNBajVaZXlKcHlaVXVyT1lWTXFyT09WUU1BQUFBQUFBQUF3QUFBQUFBQUFBQzNBS00uIiwic2NwIjoiQVBJQ29ubmVjdG9ycy5SZWFkLkFsbCBBUElDb25uZWN0b3JzLlJlYWRXcml0ZS5BbGwgRGV2aWNlTWFuYWdlbWVudEFwcHMuUmVhZC5BbGwgRGV2aWNlTWFuYWdlbWVudEFwcHMuUmVhZFdyaXRlLkFsbCBEZXZpY2VNYW5hZ2VtZW50Q29uZmlndXJhdGlvbi5SZWFkLkFsbCBEZXZpY2VNYW5hZ2VtZW50Q29uZmlndXJhdGlvbi5SZWFkV3JpdGUuQWxsIERldmljZU1hbmFnZW1lbnRNYW5hZ2VkRGV2aWNlcy5SZWFkLkFsbCBEZXZpY2VNYW5hZ2VtZW50U2VydmljZUNvbmZpZy5SZWFkV3JpdGUuQWxsIERpcmVjdG9yeS5SZWFkLkFsbCBEaXJlY3RvcnkuUmVhZFdyaXRlLkFsbCBHcm91cC5SZWFkLkFsbCBHcm91cC5SZWFkV3JpdGUuQWxsIG9wZW5pZCBwcm9maWxlIFRhc2tzLlJlYWQgVGFza3MuUmVhZFdyaXRlIFVzZXIuUmVhZCBVc2VyLlJlYWQuQWxsIFVzZXIuUmVhZEJhc2ljLkFsbCBVc2VyLlJlYWRXcml0ZS5BbGwgZW1haWwiLCJzdWIiOiJ3Qm5fLWEtaTBQbGZwS1VGU3lYNzRHZ0RrQnZKLWRvMVRNX19xbWdpSXBFIiwidGVuYW50X3JlZ2lvbl9zY29wZSI6Ik5BIiwidGlkIjoiYzg1ZTk2OGYtNzI5YS00YjY1LWFiMzktODU0Y2FhYjM4ZTU1IiwidW5pcXVlX25hbWUiOiJQcmVwYXJvckAyeDN0cGIub25taWNyb3NvZnQuY29tIiwidXBuIjoiUHJlcGFyb3JAMngzdHBiLm9ubWljcm9zb2Z0LmNvbSIsInV0aSI6IlFBY1dyR01WblVDU2tDbEpkeDR0QUEiLCJ2ZXIiOiIxLjAiLCJ3aWRzIjpbIjYyZTkwMzk0LTY5ZjUtNDIzNy05MTkwLTAxMjE3NzE0NWUxMCIsImI3OWZiZjRkLTNlZjktNDY4OS04MTQzLTc2YjE5NGU4NTUwOSJdLCJ4bXNfY2MiOlsiQ1AxIl0sInhtc19zc20iOiIxIiwieG1zX3N0Ijp7InN1YiI6IjJ2TnpFZFV0M1NRa05tOFFXcGs2QmJlWXRKcXVrLUpJY05KbDNtQk5sbzQifSwieG1zX3RjZHQiOjE2ODgzNDg4MDN9.ZZHV3gDi1bhyozixivcb8nuwJv2LOQzQADOaDkefDBLYGmdT4_-XmWL2gOPIHWwwR1kBzg1_7CawpJIkDkjyE-G6n60_cdi1smDbj8kuU77PtAZxsqKPg09QnycM16FOS1jHCeujLtRLhQn7T6nvYbpD1Me92O5xOkZGaBvHPtMpujwQ2eXJtSx28yor1vVTOdrM66RQ4XYNr5Ih77K8YXxyp8r_bADG4qju_TH7NUw_uqJqSNcA_Cah28fuziHIDt9VJHvg_GrWSQ5-JZEPq16WDa6T6N1IbXF_anhV06wUVwPj2AMgB8V6Mjd_HC5qkqyZfWAOwvlXkf_4tVGvrA';
const client = Client.init({
	authProvider: (done) => {
		done(null, accessToken);
	},
});

// const authConfig: TeamsUserCredentialAuthConfig = {
// 	  clientId: process.env.REACT_APP_CLIENT_ID,
// 	    initiateLoginEndpoint: process.env.REACT_APP_START_LOGIN_PAGE_URL};
const credential = new TeamsUserCredential(config);
const user1 = await credential.getUserInfo();

const useStyles = makeStyles({
	control: {
		maxWidth: '300px',
		height: '20px',
	},
});

const PlannerTasksTable = () => {
	const [item, setItem] = useState(/* initial value */);
	const [tasks, setTasks] = useState([]);
	const [error, setError] = useState(null);
	const [filterStatus, setFilterStatus] = useState('All Active');
	const [isChecked, setIsChecked] = useState(false);
	const [isRowSelection, setIsRowSelection] = useState(false);
	const [currentSelectedItem, setCurrentSelectedItem] = useState('');
	const [isHovered, setisHovered] = useState(false);
	const [bucketSelected, setBucketOption] = useState('');
	const [checklistItemInput, setChecklistItemInput] = useState('');
	const [iChecked, setIChecked] = useState(false);
	const [myGuid, setmyGuid] = useState('');
	const [filteredItems, setFilteredItems] = useState([]);
	const [items, setItems] = useState([]);
	const [columns, setColumns] = useState([]);
	const [newTaskTitle, setNewTaskTitle] = useState('');
	const [labels, setLabels] = useState([]);
	const styles = useStyles();
	const [dueDateDialogOpen, setDueDateDialogOpen] = React.useState(false);
	const [selectedDueDate, setSelectedDueDate] = useState(null);
	const [gotChecked, setGotChecked] = useState(false);

	const handleDueDateClick = () => {
		setDueDateDialogOpen(true);
	};

	const handleDueDateDialogDismiss = () => {
		setDueDateDialogOpen(false);
	};

	const handleFilterChange = (status) => {
		console.log('status', status);
		setFilterStatus(status);
	};
	const [formData, setFormData] = useState({
		taskTitle: '',
		assignedTo: '',
		status: '',
	});

	const [planName, setPlanName] = useState('');
	const [plans, setPlans] = useState([]);
	const [showDetailsDialog, setShowDetailsDialog] = useState(false);
	const [editDialogVisibility, seteditDialogVisibility] = useState(false);
	const [selectedItemData, setSelectedItemData] = useState(null);
	const [selectedRows, setSelectedRows] = useState([]);
	const [showDialog, setShowDialog] = useState(false);
	const [showEditDialog, setShowEditDialog] = useState(false);
	const [selectedTask, setSelectedTask] = useState(null);
	const [hoveredTask, setHoveredTask] = useState(null);
	const [isItemSelected, setIsItemSelected] = useState(false);
	const [selectedTasks, setselectedTasks] = useState([]);
	const [isMenuBarVisible, setIsMenuBarVisible] = useState(false);
	const [assignedTo, setAssignedTo] = useState('');
	const [checkListCountSpl, setcheckListCountSpl] = useState('');
	const [planId, setPlanId] = useState('');
	const [startDate, setStartDate] = useState(null);
	const [dueDate, setDueDate] = useState(null);
	//const [overallChecklist, setoverallChecklist] = useState('');
	const [taskTitle, setTaskTitle] = useState('');
	const [taskId, setTaskId] = useState('');
	const [checked, setChecked] = useState(false);
	const [bucket, setBucket] = useState('');
	//const [notes, setNotes] = useState('');
	const [bucketOptions, setBucketOptions] = useState([]);
	const [selectedBucket, setSelectedBucket] = useState('');
	const [progressOptions] = useState([
		{ key: 'Not started', text: 'Not started' },
		{ key: 'In Progress', text: 'In Progress' },
		{ key: 'Completed', text: 'Completed' },
	]);
	const [selectedBucketId, setSelectedBucketId] = useState(null);
	const [selectedBucketName, setSelectedBucketName] = useState(null);
	const [selectedProgress, setSelectedProgress] = useState('');
	const [priorityOptions] = useState([
		{ key: 'Low', text: 'Low' },
		{ key: 'Medium', text: 'Medium' },
		{ key: 'High', text: 'High' },
		{ key: 'Important', text: 'Important' },
		{ key: 'Urgent', text: 'Urgent' },
	]);

	const [checklistItems, setChecklistItems] = useState([]);
	const [selectedPriority, setSelectedPriority] = useState('');
	const [notes, setNotes] = useState('');
	const [comments, setComments] = useState('');
	const [selectedDate, setSelectedDate] = useState(null);
	const [selectedPriorityFilter, setSelectedPriorityFilter] = useState(null);
	const [selectedPriorityFilters, setSelectedPriorityFilters] = useState([]);
	const [selectedDueDateFilters, setSelectedDueDateFilters] = useState([]);
	const [searchTerm, setSearchTerm] = useState('');

	const handleDateUpdate = (event) => {
		event.preventDefault();

		const localOffset = selectedDate
			? selectedDate.getTimezoneOffset() * 60000
			: 0;
		const adjustedDate = selectedDate
			? new Date(selectedDate.getTime() - localOffset)
			: null;

		// Format the adjusted date as "2023-11-10T10:00:00.000Z"
		const formattedDate = adjustedDate ? adjustedDate.toISOString() : null;
		console.log('Formatted Date:', formattedDate);
		const taskId = currentSelectedItem.taskId.label;

		const updatedTask = {
			dueDateTime: formattedDate,
		};

		updateTask(taskId, updatedTask);
	};

	const generateDueDateItems = () => {
		return [
			'Late',
			'Today',
			'Tomorrow',
			'This Week',
			'Next Week',
			'Future',
			'No date',
			'With due date',
		];
	};

	const handleFilterDueDateChange = (dueDate) => {
		console.log('It got clicked', dueDate);
		const updatedFilters = [...selectedDueDateFilters];
		if (updatedFilters.includes(dueDate)) {
			updatedFilters.splice(updatedFilters.indexOf(dueDate), 1);
		} else {
			updatedFilters.push(dueDate);
		}
		setSelectedDueDateFilters(updatedFilters);
	};

	console.log(selectedDueDateFilters, 'selected dates');

	const handleFilterPriorityChange = (priority) => {
		console.log(priority, 'My Priority');

		setSelectedPriorityFilter(priority);

		const updatedFilters = [...selectedPriorityFilters];
		if (updatedFilters.includes(priority)) {
			updatedFilters.splice(updatedFilters.indexOf(priority), 1);
		} else {
			updatedFilters.push(priority);
		}
		setSelectedPriorityFilters(updatedFilters);
	};

	const isPrioritySelected = (priority) =>
		selectedPriorityFilters.includes(priority);

	const selectedPriorityCount = selectedPriorityFilters.length;

	const isDueDateSelected = (dueDate) => {
		return selectedDueDateFilters.includes(dueDate);
	};

	const clearPriorityFilters = () => {
		setSelectedPriorityFilters([]);
		setSelectedDueDateFilters([]);
	};

	const handleItemSelection = (item) => {
		setSelectedLabels(item.labels);
		setIsItemSelected(true);
	};
	useEffect(() => {
		if (selectedTask) {
			setAssignedTo(selectedTask.assignedTo || '');
			setStartDate(selectedTask.startDate || null);
			setDueDate(selectedTask.dueDate || null);
			setSelectedBucket(selectedTask.bucket || '');
			setSelectedProgress(selectedTask.progress || '');
			setSelectedPriority(selectedTask.priority || '');
			setNotes(selectedTask.notes || '');
			setComments(selectedTask.comments || '');
			setTaskTitle(selectedTask.taskTitle);
			setTaskId(selectedTask.taskId);
			setPlanId(selectedTask.planId);
			setChecked(selectedTask.checked);
			setBucket(selectedTask.bucket || '');
		}
	}, [selectedTask]);

	useEffect(() => {
		// Set the default selected bucket based on your logic
		if (bucketOptions.length > 0) {
			setSelectedBucketName(bucketOptions[0].name);
			setSelectedBucketId(bucketOptions[0].id);
		}
	}, [bucketOptions]);

	const fetchPlannerTasks = async () => {
		try {
			const tasksResponse = await client
				.api('/me/planner/tasks')
				.version('v1.0')
				.get();
			setTasks(tasksResponse.value);
		} catch (error) {
			console.error('Error fetching planner tasks:', error.message);
			// Handle authentication errors
			if (error.statusCode === 401) {
				setError(
					'Authentication error. Please ensure your access token is valid.'
				);
			} else {
				setError('An error occurred while fetching planner tasks.');
			}
		}
	};

	useEffect(() => {
		const fetchPlans = async () => {
			try {
				const graphUrl =
					'https://graph.microsoft.com/v1.0/groups/7c3d46cb-0209-4db5-9eb6-8d1d5ddb9cb8/planner/plans/';

				const plansResponse = await client.api(graphUrl).version('v1.0').get();
				setPlans(plansResponse.value);
				console.log(plans, 'these are my planner plans');
			} catch (error) {
				console.error('Error fetching planner plans:', error.message);
				// Handle authentication errors
				if (error.statusCode === 401) {
					setError(
						'Authentication error. Please ensure your access token is valid.'
					);
				} else {
					setError('An error occurred while fetching planner plans.');
				}
			}
		};

		fetchPlans();
	}, []);

	useEffect(() => {
		const getUTCNow = () => {
			// Get the current UTC time
			const utcNow = new Date().toUTCString();

			// Log the UTC time to the console
			console.log('UTC Now:', utcNow);
		};
		getUTCNow();
	}, []);

	console.log(bucketSelected, 'Bucket that is selected');
	//setmyGuid(uuidv4());
	//console.log(myGuid, "this is my guid...........");

	const DetailsDialog = () => {
		return (
			<Dialog
				hidden={!showDetailsDialog}
				onDismiss={() => setShowDetailsDialog(false)}>
				{selectedItemData && (
					<div>
						<h2>Item Details</h2>
						<pre>{JSON.stringify(selectedItemData, null, 2)}</pre>
					</div>
				)}
			</Dialog>
		);
	};

	const handleAssignToChange = (event, item) => {
		setAssignedTo(item.text);
	};

	const handleProgressChange = (progress) => {
		console.log('Progress selected', progress);
		setSelectedProgress(progress);
		if (progress === 'Completed') {
			progress = 100;
		} else {
			progress = 0;
		}

		const updatedTask = {
			percentComplete: progress,
		};

		const taskId = currentSelectedItem.taskId.label;
		console.log(taskId);

		updateTask(taskId, updatedTask);
	};

	const handlePriorityChange = (priority) => {
		console.log('hey its my data', currentSelectedItem);
		console.log(`Priority changed to ${priority} for selected row`);
		setSelectedPriority(priority);
		const taskId = currentSelectedItem.taskId.label;
		let priorityValue;
		switch (priority) {
			case 'Urgent':
				priorityValue = 1;
				break;
			case 'Important':
				priorityValue = 3;
				break;
			case 'Medium':
				priorityValue = 5;
				break;
			case 'Low':
				priorityValue = 9;
				break;
			default:
				return 0;
		}
		const updatedTask = {
			priority: priorityValue,
		};
		updateTaskProgress(taskId, updatedTask);
	};

	const handleStartDateChange = (date) => {
		setStartDate(date || null);
	};

	const handleDueDateChange = (date) => {
		setDueDate(date || null);
	};

	const handleEditSave = async () => {
		try {
			const updatedTask = {
				title: taskTitle,
				id: taskId,
				status: selectedProgress === 100 ? 'Completed' : 'In Progress',
				priority: selectedPriority,
				notes: notes,
				comments: comments,
			};
			console.log(updatedTask.title);
			console.log(updatedTask.id);
			console.log(updatedTask.status);

			await updateTask(selectedTask.taskId, updatedTask);

			// Update local state
			const updatedData = tasks.map((item) => {
				if (item.taskId === selectedTask.taskId) {
					return {
						...item,
						...updatedTask,
					};
				}
				return item;
			});

			setTasks(updatedData);
			closeDialog();
		} catch (error) {
			console.error('Error handling save:', error);
		}
	};

	const selection = new Selection({
		onSelectionChanged: () => {
			setselectedTasks(selection.getSelection());
		},
	});

	const statusOptions = [
		{ key: 'All Active', text: 'All Active' },
		{ key: 'Completed', text: 'Completed' },
	];

	const toggleCheckbox = (item) => {
		setChecked(item);
		console.log(item);
		// Update task title style and status based on checkbox state
		setTaskTitle((prevTitle) => {
			if (item) {
				return (
					<span style={{ textDecoration: 'line-through' }}>{prevTitle}</span>
				);
			} else {
				return <span>{prevTitle}</span>;
			}
		});
	};

	const openDialog = (item) => {
		console.log(item.taskId);
		setFormData(initialFormData);
		setShowDialog(true);
	};

	const closeDialog = () => {
		setShowDialog(false);
		setShowEditDialog(false);
		seteditDialogVisibility(false);
	};

	const handleCheckboxChange = (checked) => {
		setIsChecked(checked);
	};

	const handleInputChange = (key, value) => {
		console.log('Form Data Before:', formData);
		const updatedFormData = { ...formData, [key]: value };
		setFormData(updatedFormData);
		console.log('Form Data After:', updatedFormData);
	};

	const handleAddTask = async () => {
		console.log('Entered Task Title:', formData.taskTitle);

		const enteredTaskTitle = formData.taskTitle;
		const planId1 = 'TcOeczL-tUOeXqjtl9MoNGUAAwdI';
		const assignments = {};

		try {
			// Call the createTask function passed as a prop
			await createTask(enteredTaskTitle, planId1);

			// Reset the task title and close the dialog
			setFormData({ ...formData, taskTitle: '' });
			closeDialog();
		} catch (error) {
			console.error('Error adding task:', error);
		}
	};

	const openEditDialog = (item) => {
		setSelectedTask(item);
		setTaskTitle(item.taskTitle);
		setChecked(item.checked);
		setTaskId(item.taskId);
		setBucket(item.bucket || '');
		setSelectedPriority(item.selectedPriority || '');
		setNotes(item.notes || '');
		setShowEditDialog(true);
	};

	const fetchChecklist = async (taskId) => {
		try {
			console.log('Fetching checklist for taskId:', taskId);
	
			const tasksDetails = await client
				.api(`/planner/tasks/${taskId}/details`)
				.version('v1.0')
				.get();
			const data = tasksDetails.checklist;
			console.log('Checklist data:', data);
	
			const titlesArray = Object.entries(data).map(([id, item]) => ({
				id,
				title: item.title,
				isChecked: item.isChecked,
				taskId: taskId,
			}));
	
			console.log('Checklist Items:', titlesArray);
	
			setChecklistItems(titlesArray);
		} catch (error) {
			console.log('Error occurred while retrieving checklist', error);
		}
	};
	
	useEffect(() => {
		if (currentSelectedItem) {
			console.log('Current Selected Item:', currentSelectedItem);
			fetchChecklist(currentSelectedItem.taskId.label);
		}
	}, [currentSelectedItem]);
	
	

	const renderCheckbox = (item) => (
		<CheckboxFunctionality
			checked={item.checked}
			onCheckboxChange={() => toggleCheckbox(item.checked)}
			shape="circular"
			backgroundColor={item.checked ? 'black' : 'white'}
		/>
	);

	const formatPriority = (priority) => {
		switch (priority) {
			case 1:
				return <AlertUrgent24Filled primaryFill="darkred" />;
			case 3:
				return <Important20Filled primaryFill="darkred" />;
			case 5:
				return <CircleSmall24Filled primaryFill="green" />;
			case 9:
				return <ArrowSortDown24Filled primaryFill="blue" />;
			default:
				return 'Unknown Priority';
		}
	};

	const handleSubmit = async (e) => {
		console.log('Submitted');

		console.log('Selected Bucket Idf:', selectedBucketId);

		e.preventDefault();

		// Log the values of checklist items
		const taskId = currentSelectedItem.taskId.label;
		console.log('Checklist Items111111:', checklistItems);
		console.log('task ID', taskId);
		// console.log(item);
		const myNotes = notes;
		const optionBcket = bucketSelected;

		console.log('myBucket', optionBcket);

		const updatedTask = {
			description: myNotes,
			bucketId: selectedBucketId,
		};

		const updatedTask1 = {
			bucketId: bucketSelected,
		};

		updateTask(taskId, updatedTask);
		const myTaskID = currentSelectedItem.taskId.label;
		console.log(
			myGuid,
			iChecked,
			checklistItemInput,
			myTaskID,
			'these are the parameterss'
		);
		updateNewCheckListItem(myTaskID, myGuid, checklistItemInput, iChecked);
		updatecheckListsDeletion(checklistItems);

		const updatedChecklist = checklistItems.map((item) => ({
			id: item.id,
			title: item.title,
			isChecked: item.isChecked,
		}));

		console.log(myNotes, 'notes');
		console.log(currentSelectedItem.taskId.label, 'taskId');
		console.log(myTaskID, 'sdfgds');
		//updateTaskDetails(taskId, updatedTask);
	};

	const updateCheckListItemspart = async (taskId, updatedChecklist) => {
		// Implement the logic to update checklist items (e.g., make a Microsoft Planner API call)
		console.log(
			`Updating checklist items for task ID ${taskId}:`,
			updatedChecklist
		);
	};

	const updatecheckListsDeletion = async (checklistItems) => {
		try {
			// Get the current task details to obtain the ETag
			const currentTask = await client
				.api(`/planner/tasks/${taskId}/details`)
				.version('v1.0')
				.get();

			// Extract the ETag from the current task
			const etag = currentTask['@odata.etag'];
			const updatedTaskDetails = {
				checklist: {
					[myGuid]: {
						'@odata.type': 'microsoft.graph.plannerChecklistItem',
						title: checklistItemInput,
						isChecked: iChecked,
					},
				},
			};

			const response = await client
				.api(`/planner/tasks/${taskId}/details`)
				.version('v1.0')
				.header('If-Match', etag)
				.update(updatedTaskDetails);

			console.log('Checklist items and title updated successfully!');
		} catch (error) {
			console.error('Error updating task:', error);
			throw error;
		}
	};

	const updateNewCheckListItem = async (
		taskId,
		myGuid,
		checklistItemInput,
		iChecked
	) => {
		try {
			// Get the current task details to obtain the ETag
			const currentTask = await client
				.api(`/planner/tasks/${taskId}/details`)
				.version('v1.0')
				.get();

			// Extract the ETag from the current task
			const etag = currentTask['@odata.etag'];

			const newChecklistItem = {
				76789: {
					'@odata.type': '#microsoft.graph.plannerChecklistItem',
					isChecked: iChecked,
					title: checklistItemInput,
				},
			};

			// Combine the existing checklist items with the new one
			const updatedChecklist = {
				...currentTask.checklist,
				...newChecklistItem,
			};

			// Create the updated task details object with the updated checklist
			const updatedTaskDetails = {
				checklist: {
					[myGuid]: {
						'@odata.type': 'microsoft.graph.plannerChecklistItem',
						title: checklistItemInput,
						isChecked: iChecked,
					},
				},
			};

			const response = await client
				.api(`/planner/tasks/${taskId}/details`)
				.version('v1.0')
				.header('If-Match', etag)
				.update(updatedTaskDetails);

			console.log('Checklist items and title updated successfully!');
			// console.log(response.json());
		} catch (error) {
			console.error('Error updating task:', error);
			throw error;
		}
	};

	
	const [currentSelectedTask, setCurrentSelectedTask] = useState('');

	useEffect(() => {
	  const getTask = async () => {
		try {
		  const selectedTask = await client
			.api(`/planner/tasks/${taskId}/`)
			.version('v1.0')
			.get();
	
		  setCurrentSelectedTask(selectedTask.data);
		  console.log(selectedTask.data, "My Data1233");
		} catch (error) {
		  console.error('Error fetching task:', error);
		}
	  };
	
	  getTask();
	}, [taskId]); // Add taskId as a dependency if it's from props or state
	

	const updateCheckListItems = async (taskId, checklistItems) => {
		try {
			// Get the current task details to obtain the ETag
			const currentTask = await client
				.api(`/planner/tasks/${taskId}/details`)
				.version('v1.0')
				.get();

			// Extract the ETag from the current task
			const etag = currentTask['@odata.etag'];

			// Create the updated task details object with only the checklist and title properties
			const updatedTaskDetails = {
				checklist: convertToGraphChecklistFormat(checklistItems),
				// You may need to include other properties if needed
			};

			const response = await client
				.api(`/planner/tasks/${taskId}/details`)
				.version('v1.0')
				.header('If-Match', etag)
				.update(updatedTaskDetails);

			console.log('Checklist items and title updated successfully!');
			// console.log(response.json());
		} catch (error) {
			console.error('Error updating task:', error);
			throw error;
		}
	};

	const convertToGraphChecklistFormat = (checklistItems) => {
		return checklistItems.map((item) => ({
			'@odata.type': '#microsoft.graph.plannerChecklistItem',
			title: item,
		}));
	};

	const updateTaskDetails = async (taskId, updatedTask) => {
		try {
			const currentTask = await client
				.api(`/planner/tasks/${taskId}/details`)
				.version('v1.0')
				.get();

			// Extract the ETag from the current task
			const etag = currentTask['@odata.etag'];

			// Include the If-Match header with the ETag in the update request
			const response = await client
				.api(`/planner/tasks/${taskId}/details/`)
				.version('v1.0')
				.header('If-Match', etag)
				.update(updatedTask);

			//const tasksResponse = await client.api('/me/planner/tasks').version('v1.0').get();
			//const response= await client.api(`/planner/tasks/${taskId}/`).version('v1.0').update(updatedTask);
			console.log('Task details updated successfully!!');
			//console.log(response.json());
		} catch (error) {
			console.error('Error updating task:', error);
			throw error;
		}
	};

	const formatDueDate = (item) => {
		if (!item.dueDateTime) {
			return '';
		}

		const today = new Date();
		const isDueDateCrossingToday = item.dueDateTime
			? new Date(item.dueDateTime) > today
			: false;

		return item.dueDateTime ? (
			item.percentComplete === 0 && !isDueDateCrossingToday ? (
				<div
					className="dateDiv"
					style={{
						backgroundColor: 'rgb(196,49,75)',
						display: 'inline-flex',
						borderRadius: '4px',
						alignItems: 'center',
						padding: '3px',
					}}>
					<Calendar24Regular
						style={{ marginRight: '4px', color: 'white', padding: '3px' }}
					/>
					<span style={{ color: 'white' }}>
						{' '}
						{new Date(item.dueDateTime).toLocaleDateString('en-GB', {
							day: '2-digit',
							month: '2-digit',
						})}
					</span>
				</div>
			) : (
				<span style={{ color: 'black', fontSize: '12px' }}>
					{new Date(item.dueDateTime).toLocaleDateString('en-GB', {
						day: '2-digit',
						month: '2-digit',
					})}
				</span>
			)
		) : (
			''
		);
	};

	const itemsWithCheckbox = tasks.map((item) => {
		let priorityText;

		switch (item.priority) {
			case 1:
				priorityText = <AlertUrgent24Filled primaryFill="rgb(196,49,75)" />;
				break;
			case 3:
				priorityText = <Important20Filled primaryFill="rgb(196,49,75)" />;
				break;
			case 5:
				priorityText = <CircleSmall24Filled primaryFill="green" />;
				break;
			case 9:
				priorityText = <ArrowSortDown24Filled primaryFill="blue" />;
				break;
			default:
				priorityText = 'Unknown Priority';
				break;
		}

		const today = new Date();
		const isDueDateCrossingToday = item.dueDateTime
			? new Date(item.dueDateTime) > today
			: false;

		return {
			key: item.id,
			taskTitle: item.title,
			taskId: item.id,
			//overallChecklist: `(${activeChecklistCount}/${checklistCount})`,
			//assignedTo: item.assignments ? item.assignments[0].assignedTo.displayName : 'N/A',
			status: item.percentComplete === 100 ? 'Completed' : 'In Progress',
			checked: !checked,
			priority: priorityText,
			// dueDate: item.dueDateTime ? new Date(item.dueDateTime).toLocaleDateString('en-GB', { day: '2-digit', month: '2-digit' }) : '',
			dueDate: item.dueDateTime ? (
				item.percentComplete === 0 && !isDueDateCrossingToday ? (
					<div
						className="dateDiv"
						style={{
							backgroundColor: 'red',
							display: 'inline-flex',
							borderRadius: '4px',
							alignItems: 'center',
							padding: '3px',
						}}>
						<Calendar24Regular
							style={{ marginRight: '4px', color: 'white', padding: '3px' }}
						/>
						<span style={{ color: 'white' }}>
							{' '}
							{new Date(item.dueDateTime).toLocaleDateString('en-GB', {
								day: '2-digit',
								month: '2-digit',
							})}
						</span>
					</div>
				) : (
					<span style={{ color: 'black', fontSize: '12px' }}>
						{new Date(item.dueDateTime).toLocaleDateString('en-GB', {
							day: '2-digit',
							month: '2-digit',
						})}
					</span>
				)
			) : (
				''
			),
			planId: item.planId,
			// checkListCount: item.activeChecklistItemCount === 0 ? '': "("+item.activeChecklistItemCount.toString()+"/"+item.checklistItemCount.toString()+")"
			checkListCount:
				item.checklistItemCount > 0 ? (
					<span>
						{item.activeChecklistItemCount === 0 ? (
							<Notepad16Regular style={{ marginLeft: '50px' }} />
						) : (
							<span>
								<CheckmarkCircle12Regular />
								{`(${item.checklistItemCount - item.activeChecklistItemCount}/${
									item.checklistItemCount
								})`}
								<Notepad16Regular style={{ marginLeft: '10px' }} />
							</span>
						)}
					</span>
				) : null,
			//overallChecklist: checkListCountSpl
		};
	});

	const handleDetailsButtonClick = (item) => {
		setIsRowSelection(false);
		console.log(isRowSelection);

		if (!isRowSelection) {
			console.log('hey....');
		}
	};

	const handleMouseEnter = () => {
		setisHovered(true);
		console.log('data');
		console.log('selected', isHovered);
	};

	const handleMouseLeave = () => {
		setisHovered(false);
		console.log('data12');
		console.log('selected', isHovered);
	};

	const handleEditDialog = () => {
		console.log('hi', currentSelectedItem);
		seteditDialogVisibility(true);
		console.log('showEditDialog', editDialogVisibility);
	};

	const handleTaskTitleClick = (item) => {
		console.log(`Task Title Clicked: ${item.taskTitle.label}`);
		// Add your logic to open the edit dialog here
	};

	const [checkedItems, setCheckedItems] = useState([]);

	const handleMyCheckboxChange = (item) => {
		// Toggle the checked state for the corresponding index

		const updatedChecklistItems = [...checklistItems];
		updatedChecklistItems[item] = {
			...updatedChecklistItems[item],
			isChecked: !updatedChecklistItems[item].isChecked,
		};
		setChecklistItems(updatedChecklistItems);

		console.log('hiiiiiiiii ');
		setCheckedItems((prevCheckedItems) =>
			prevCheckedItems.includes(item)
				? prevCheckedItems.filter((item) => item !== item)
				: [...prevCheckedItems, item]
		);

		console.log('Updated Checklist Items:', updatedChecklistItems);
	};

	useEffect(() => {
		const fetchNotes = async () => {
			try {
				const taskId = currentSelectedItem.taskId.label;
				const tasksDetails = await client
					.api(`/planner/tasks/${taskId}/details`)
					.version('v1.0')
					.get();
				console.log(tasksDetails.description, 'taskDetails');
				setNotes(tasksDetails.description);
				console.log(notes);
			} catch (error) {
				console.log('Error occurred while retrieving notes', error);
			}
		};
		fetchNotes();
	}, []);
	//console.log("userName", user1.displayName);

	const handleDeleteChecklistItem = async (taskId, checklistItemId) => {
		console.log('THis is my Checklist Item Id', taskId, checklistItemId);

		try {
			const currentTask = await client
				.api(`/planner/tasks/${taskId}/details/`)
				.version('v1.0')
				.get();

			console.log(currentTask, 'currrent');

			// Extract the ETag from the current task
			const etag = currentTask['@odata.etag'];

			const updatedTask = {
				checklist: {
					[checklistItemId]: null,
				},
			};

			//console.log(checklistItems);

			const response = await client
				.api(`/planner/tasks/${taskId}/details/`)
				.version('v1.0')
				.header('If-Match', etag)
				.update(updatedTask);

			console.log('Checklist item deleted successfully!');
			//setChecklistItems(updatedChecklistItems);
			console.log(checklistItems, 'these are after deletion......');
			// console.log(response.json());
		} catch (error) {
			console.error('Error updating task:', error);
			throw error;
		}
	};

	const handleCheckboxChecklist = (taskId, id) => {
		console.log('CheckList Item with the TaskID that is selected', taskId, id);
	};

	useEffect(() => {
		const generateRandom = async () => {
			const randomValue = Math.floor(Math.random() * 90000) + 10000;
			setmyGuid(randomValue.toString());
			console.log(myGuid);
		};
		generateRandom();
	}, []);

	const [selectedLabels, setSelectedLabels] = useState([]);
	console.log('FilterStatus', filterStatus);

	console.log(checklistItemInput, iChecked, myGuid, 'my-new-item');

	const generateItemsAndColumns = (jsonData) => {
		const items = jsonData.map((task) => ({
			taskId: { label: task.id },
			taskTitle: { label: task.title },
			progress: {
				label: task.percentComplete === 100 ? 'Completed' : 'In Progress',
			},
			priority: { label: formatPriority(task.priority) },
			priorityNumbers: { label: task.priority },
			dueDate: { label: formatDueDate(task) },
			filteringDueDate: { label: task.dueDateTime },
			completedDateTime: {
				label: /*task.completedDateTime*/ new Date(
					task.completedDateTime
				).toLocaleDateString('en-GB', {
					day: '2-digit',
					month: '2-digit',
				}),
			},
			textDueDate: {
				label: new Date(task.dueDateTime).toLocaleDateString('en-US'),
			},
			bucketId: { label: task.bucketId },
			planId: { label: task.planId },
			checkListCount: {
				label:
					task.activeChecklistItemCount === 0
						? ''
						: `(${task.checklistItemCount}/${task.checklistItemCount})`,
				icon:
					task.checklistItemCount === 0 ? (
						''
					) : (
						<span>
							<CheckmarkCircle12Regular />
							{`(${task.checklistItemCount - task.activeChecklistItemCount}/${
								task.checklistItemCount
							})`}
							<Notepad16Regular style={{ marginLeft: '10px' }} />
						</span>
					),
			},
		}));

		const updatedColumns = [
			createTableColumn({
				columnId: 'taskTitle',
				renderHeaderCell: () => 'Task Title',
				renderCell: (item) => (
					<TableCellLayout style={{ width: '300px' }}>
						<span
							style={{
								display: 'flex',
								alignItems: 'center',
								justifyContent: 'space-between',
								textDecoration: isHovered ? 'underline' : 'none',
								cursor: 'pointer',
							}}
							onMouseEnter={() => handleMouseEnter()}
							onMouseLeave={() => handleMouseLeave()}
							onClick={() => handleEditDialog(currentSelectedItem)}>
							<span style={{ marginRight: '8px' }}>
								{item.taskTitle.label} &nbsp; &nbsp; &nbsp;{' '}
							</span>
						</span>
					</TableCellLayout>
				),
			}),
			createTableColumn({
				columnId: 'progress',
				renderHeaderCell: () => '',
				renderCell: (item) => (
					<TableCellLayout>
						&nbsp; &nbsp; &nbsp;&nbsp;&nbsp;{item.checkListCount.icon}
					</TableCellLayout>
				),
			}),

			createTableColumn({
				columnId: 'progress',
				renderHeaderCell: () => 'Progress',
				renderCell: (item) => (
					<TableCellLayout>{item.progress.label}</TableCellLayout>
				),
			}),
			createTableColumn({
				columnId: 'priority',
				renderHeaderCell: () => 'Priority',
				renderCell: (item) => item.priority.label,
			}),
			createTableColumn({
				columnId: 'dueDate',
				renderHeaderCell: () =>
					filterStatus === 'All Active' ? 'Due Date' : 'Completed Date',
				renderCell: (item) => (
					<TableCellLayout>
						{filterStatus === 'All Active'
							? item.dueDate.label
							: item.completedDateTime.label}
					</TableCellLayout>
				),
			}),
			createTableColumn({
				columnId: 'detailsButton',
				renderHeaderCell: () => 'Details',
				renderCell: (item) => (
					<Dialog modalType="alert" width="2500">
						<DialogTrigger disableButtonEnhancement>
							<Button>Details</Button>
						</DialogTrigger>
						<DialogSurface>
							<form onSubmit={handleSubmit}>
								<DialogBody>
									<DialogTitle
										style={{ color: 'rgb(98, 100, 167)', fontSize: '13px' }}>
										Tasks
									</DialogTitle>
									<DialogContent>
										<div
											style={{
												marginBottom: 20,
												alignContent: 'center',
												display: 'flex',
												flexDirection: 'row',
											}}>
											<Checkbox
												shape="circular"
												checked={gotChecked}
												onChange={(ev, data) => setGotChecked(data.gotChecked)}
											/>
											<Input
												id="task-title"
												appearance="underline"
												defaultValue={item.taskTitle.label}
												style={{
													fontWeight: 'bold',
													fontSize: '20px',
													width: '80%',
													textDecoration: gotChecked ? 'line-through' : 'none',
												}}
											/>
										</div>
										<div>
											<TagGroup aria-label="Dismiss example">
												{labels.map((label, index) => (
													<Tag style={{ marginRight: 8 }} key={index}>
														{label}
													</Tag>
												))}
											</TagGroup>
										</div>
										<div style={{ display: 'flex', marginTop: '20px' }}>
											<div style={{ marginBottom: '20px', width: '30%' }}>
												<Label htmlFor="bucket" style={{ padding: '10px' }}>
													Bucket
												</Label>
												<Dropdown
													label="Bucket"
													defaultValue={selectedBucketName}
													style={{
														backgroundColor: 'rgb(243, 242, 241)',
														width: '100%',
														maxHeight: '300px',
													}}
													onOptionSelect={(event, item) =>
														handleBucketChange(event, item)
													}>
													{bucketOptions.map((option) => (
														<Option key={option.id}>{option.name}</Option>
													))}
												</Dropdown>
											</div>

											<div
												style={{
													marginLeft: '20px',
													marginBottom: '20px',
													width: '30%',
												}}>
												<Label htmlFor="priority" style={{ padding: '10px' }}>
													Priority
												</Label>
												<Dropdown
													label="Priority"
													options={priorityOptions}
													defaultValue={item.priority.label}
													style={{
														backgroundColor: 'rgb(243, 242, 241)',
														width: '100%',
														maxHeight: '300px',
													}}
													onChange={(e, item) => setSelectedPriority(item.key)}>
													<Option>Urgent</Option>
													<Option>Important</Option>
													<Option>Medium</Option>
													<Option>Low</Option>
												</Dropdown>
											</div>

											<div style={{ marginLeft: '20px', width: '30%' }}>
												<Label htmlFor="progress" style={{ padding: '10px' }}>
													Progress
												</Label>
												<Dropdown
													label="Progress"
													options={progressOptions}
													defaultValue={item.progress.label}
													style={{
														backgroundColor: 'rgb(243, 242, 241)',
														width: '100%',
														maxHeight: '300px',
													}}
													onChange={(e, item) => setSelectedProgress(item.key)}>
													<Option>Not Started</Option>
													<Option>In Progress</Option>
													<Option>Completed</Option>
												</Dropdown>
											</div>
										</div>

										<div style={{ display: 'flex', marginBottom: 20 }}>
											<div style={{ width: '50%', marginRight: '20px' }}>
												<Field label="Start Date">
													<DatePicker
														firstWeekOfYear={1}
														showMonthPickerAsOverlay={true}
														placeholder="Start anything"
														label="Start Date"
														style={{ backgroundColor: 'rgb(243,242,241)' }}
														className={styles.control}
														formatDate={formatDate}
														onSelectDate={handleDateChange}
														value={selectedDate}
													/>
												</Field>
											</div>
											<div style={{ marginLeft: '20px', width: '50%' }}>
												<Field label="Due Date">
													<DatePicker
														firstWeekOfYear={1}
														showMonthPickerAsOverlay={true}
														placeholder="Due Date"
														className={styles.control}
														style={{ backgroundColor: 'rgb(243,242,241)' }}
														formatDate={formatDate}
														onSelectDate={handleDateChange}
														defaultValue={item.textDueDate}
														value={selectedDate}
													/>
												</Field>
											</div>
										</div>

										<div style={{ marginBottom: 20, marginTop: 20 }}>
											<Field label="Notes">
												<Textarea
													label="Notes"
													placeholder="Type a description or add notes here"
													defaultValue={notes}
													size="large"
													onChange={(e, newValue) => setNotes(newValue)}
													style={{
														height: '100px',
														marginBottom: '10px',
														backgroundColor: 'rgb(243,242,241)',
													}}
												/>
											</Field>
										</div>

										<div style={{ marginBottom: 20 }}>
											<Label>CheckList</Label>
											{checklistItems.map((checklistItem, index) => {
												console.log('checklistItem', checklistItem); // Log the checklistItem
												return (
													<div key={index}>
														<Checkbox
															id={`checkbox-${index}`}
															shape="circular"
															checked={checklistItem.isChecked}
															onChange={() =>
																handleMyCheckboxChange(checklistItem)
															}
														/>
														<Input
															htmlFor={`checkbox-${index}`}
															defaultValue={checklistItem.title}
															style={{
																textDecoration: checklistItem.isChecked
																	? 'line-through'
																	: 'none',
															}}
															appearance="underline"
														/>
														<Delete24Regular
															style={{ cursor: 'pointer' }}
															onClick={() =>
																handleDeleteChecklistItem(
																	checklistItem.taskId,
																	checklistItem.id
																)
															}
														/>
													</div>
												);
											})}
											<div style={{ display: 'flex' }}>
												<Checkbox shape="circular" disabled />
												<Input
													placeholder="Add an item"
													appearance="underline"
													style={{ backgroundColor: 'rgb(243,242,241)' }}
													onChange={(e) =>
														setChecklistItemInput(e.target.value)
													}
												/>
											</div>
										</div>

										<div className="Attachments" style={{ marginBottom: 20 }}>
											<Field label="Attachments">
												<span>
													<Button>Add Attachment</Button>
												</span>
											</Field>
										</div>

										<div>
											<Field label="Comments">
												<Textarea
													placeholder="Type your message here"
													style={{
														height: '100px',
														marginBottom: '10px',
														backgroundColor: 'rgb(243,242,241)',
													}}
													size="large"
												/>
											</Field>

											<div
												style={{
													display: 'flex',
													justifyContent: 'space-between',
													marginBottom: 20,
												}}>
												<Button>Send</Button>
											</div>
										</div>

										<div>
											<Persona textPosition="after" name={user1.displayName} />
										</div>
									</DialogContent>

									<DialogActions>
										<DialogTrigger disableButtonEnhancement>
											<Button appearance="secondary">Close</Button>
										</DialogTrigger>
										<Button type="submit" appearance="primary">
											Save
										</Button>
									</DialogActions>
								</DialogBody>
							</form>
						</DialogSurface>
					</Dialog>
				),
			}),
			createTableColumn({
				columnId: 'moreOptionsButton',
				renderHeaderCell: () => '',
				renderCell: (item) => (
					<Menu>
						<MenuTrigger disableButtonEnhancement>
							<MenuButton
								appearance="transparent"
								icon={<MoreHorizontal24Regular />}
							/>
						</MenuTrigger>

						<MenuPopover>
							<MenuList>
								<MenuItem icon={<WeatherSunny24Regular />}>
									Add to my Day
								</MenuItem>
								<Menu>
									<MenuTrigger disableButtonEnhancement>
										<MenuItem icon={<Checkmark24Regular />}>Progress</MenuItem>
									</MenuTrigger>
									<MenuPopover>
										<MenuList>
											<MenuItem
												onClick={() => handleProgressChange('Not Started')}
												icon={<Circle16Regular />}>
												Not Started
											</MenuItem>
											<MenuItem
												onClick={() => handleProgressChange('In Progress')}
												icon={<CircleHalfFill16Regular />}>
												In Progress
											</MenuItem>
											<MenuItem
												onClick={() => handleProgressChange('Completed')}
												icon={<Checkmark16Regular />}>
												Completed
											</MenuItem>
										</MenuList>
									</MenuPopover>
								</Menu>
								<Menu>
									<MenuTrigger disableButtonEnhancement>
										<MenuItem icon={<Important24Regular />}>Priority</MenuItem>
									</MenuTrigger>
									<MenuPopover>
										<MenuList>
											<MenuItem
												onClick={() => handlePriorityChange('Urgent')}
												icon={
													<AlertUrgent16Filled primaryFill="rgb(196,49,75)" />
												}>
												Urgent
											</MenuItem>
											<MenuItem
												onClick={() => handlePriorityChange('Important')}
												icon={
													<Important16Filled primaryFill="rgb(196,49,75)" />
												}>
												Important
											</MenuItem>
											<MenuItem
												onClick={() => handlePriorityChange('Medium')}
												icon={
													<CircleSmall24Filled primaryFill="rgb(65,128,64)" />
												}>
												Medium
											</MenuItem>
											<MenuItem
												onClick={() => handlePriorityChange('Low')}
												icon={
													<ArrowSortDown16Filled primaryFill="rgb(50,126,170)" />
												}>
												Low
											</MenuItem>
										</MenuList>
									</MenuPopover>
								</Menu>
								<Dialog modalType="alert" minwidth="600" width="80%">
									<DialogTrigger
										disableButtonEnhancement
										onDismiss={handleDialogDismiss}>
										<Button appearance="transparent">
											<Calendar16Regular
												style={{ marginRight: '4px', marginLeft: '0px' }}
											/>
											Due Date
										</Button>
									</DialogTrigger>
									<DialogSurface>
										<form onSubmit={handleDateUpdate}>
											<DialogBody>
												<DialogTitle>Due Date</DialogTitle>
												<DialogContent>
													<DatePicker
														firstWeekOfYear={1}
														showMonthPickerAsOverlay={true}
														placeholder="Due on"
														className={styles.control}
														formatDate={formatDate}
														onSelectDate={handleDateChange}
														value={selectedDate}
													/>
												</DialogContent>
												<DialogActions>
													<DialogTrigger
														onDismiss={handleDialogDismiss}
														disableButtonEnhancement>
														<Button appearance="secondary">Close</Button>
													</DialogTrigger>
													<Button type="submit" appearance="primary">
														Save
													</Button>
												</DialogActions>
											</DialogBody>
										</form>
									</DialogSurface>
								</Dialog>
								<Divider />
								<MenuList>
									<MenuItem
										onClick={handleDeleteTasked}
										icon={<Delete24Regular />}>
										Delete
									</MenuItem>
								</MenuList>
							</MenuList>
						</MenuPopover>
					</Menu>
				),
			}),
		];

		return { items, columns: updatedColumns };
	};

	useEffect(() => {
		// Fetch your data (jsonData) here or pass it as a prop
		const jsonData = tasks;
		const { columns: updatedColumns } = generateItemsAndColumns(jsonData);

		setColumns(updatedColumns);
	}, [filterStatus]);

	const TaskCreation = async () => {
		console.log(newTaskTitle.value);

		const newTaskData = {
			planId: '8qszyFmGzEengqR4wPP5v2UABzOG',
			title: newTaskTitle.value,
			assignments: {
				'7ba9a84c-28e8-48aa-b2ff-767408a1d195': {
					'@odata.type': '#microsoft.graph.plannerAssignment',
					orderHint: ' !',
				},
			},
		};

		try {
			const response = await client
				.api('/planner/tasks')
				.version('v1.0')
				.post(newTaskData);
			console.log('Task created successfully!');
		} catch (error) {
			console.error('Error creating a task:', error);
			throw error;
		}
	};

	console.log(priorityOptions);
	console.log(
		priorityOptions.map((option) => ({ key: option.key, text: option.text }))
	);

	const createTask = async (title, planId) => {
		//const apiUrl = 'https://graph.microsoft.com/v1.0/me/planner/tasks';
		const client = Client.init({
			authProvider: (done) => {
				done(null, accessToken);
			},
		});
		console.log(client);
		console.log('Received Task Title:', title);

		const taskPayload = {
			planId: planId, // Replace with your actual Plan ID
			title: title,
		};
		console.log(taskPayload);

		try {
			const response = await client
				.api('/planner/tasks/')
				.version('v1.0')
				.post(taskPayload);

			// You can handle the response as needed
			console.log('Task created successfully:', response.data);
		} catch (error) {
			// Handle errors appropriately
			console.error(
				'Error creating task:',
				error.response.data || error.statusCode
			);
			throw error;
		}
	};
	useEffect(() => {
		fetchPlannerTasks();
	}, []);

	const updateTask = async (taskId, updatedTask) => {
		try {
			//const teamsUserCredential = new TeamsUserCredential(config);

			const client = Client.init({
				authProvider: (done) => {
					done(null, accessToken);
				},
			});
			console.log(client);
			const currentTask = await client
				.api(`/planner/tasks/${taskId}`)
				.version('v1.0')
				.get();

			// Extract the ETag from the current task
			const etag = currentTask['@odata.etag'];

			// Include the If-Match header with the ETag in the update request
			const response = await client
				.api(`/planner/tasks/${taskId}/`)
				.version('v1.0')
				.header('If-Match', etag)
				.update(updatedTask);

			//const tasksResponse = await client.api('/me/planner/tasks').version('v1.0').get();
			//const response= await client.api(`/planner/tasks/${taskId}/`).version('v1.0').update(updatedTask);
			console.log('Task updated successfully!');
			fetchPlannerTasks();
		} catch (error) {
			console.error('Error updating task:', error);
			throw error;
		}
	};

	const deleteTask = async (taskId) => {
		try {
			const client = Client.init({
				authProvider: (done) => {
					done(null, accessToken);
				},
			});

			const currentTask = await client
				.api(`/planner/tasks/${taskId}`)
				.version('v1.0')
				.get();

			// Extract the ETag from the current task
			const etag = currentTask['@odata.etag'];

			// Include the If-Match header with the ETag in the delete request
			const response = await client
				.api(`/planner/tasks/${taskId}/`)
				.version('v1.0')
				.header('If-Match', etag)
				.delete();

			console.log('Task deleted successfully!');
			fetchPlannerTasks();
			console.log(response);
		} catch (error) {
			console.error('Error deleting task:', error);
			throw error;
		}
	};

	const [isDivVisible, setIsDivVisible] = useState(true);

	// Function to handle the "Selected" button click
	const handleSelectedButtonClick = () => {
		// Toggle the visibility of the red-background div
		setIsItemSelected(!isItemSelected);
		setIsDivVisible(!isDivVisible);
	};

	const updateProgressUsingGraphApi = (item) => {
		console.log(item);
		const responseData = item;
		const selectedItemsArray = Array.from(responseData.selectedItems);

		//const selectedItemsArray = item.selectedItemsArray;
		const updatedTask = {
			percentComplete: 100,
		};

		console.log(selectedItemsArray[0]);
		selectedItemsArray.forEach(async (taskId) => {
			await updateTaskProgress(taskId, updatedTask);
		});
	};

	const updateTaskProgress = async (taskId, updatedTask) => {
		try {
			const currentTask = await client
				.api(`/planner/tasks/${taskId}`)
				.version('v1.0')
				.get();
			// Extract the ETag from the current task
			const etag = currentTask['@odata.etag'];
			// Include the If-Match header with the ETag in the update request
			const response = await client
				.api(`/planner/tasks/${taskId}/`)
				.version('v1.0')
				.header('If-Match', etag)
				.update(updatedTask);
			//const tasksResponse = await client.api('/me/planner/tasks').version('v1.0').get();
			//const response= await client.api(`/planner/tasks/${taskId}/`).version('v1.0').update(updatedTask);
			console.log('Task updated successfully!');
			fetchPlannerTasks();
		} catch (error) {
			console.error('Error updating task:', error);
			throw error;
		}
	};

	const fetchPlannerLabels = async (item) => {
		console.log('Heyyyy', item.planId.label);
		const myFetchedPlanId = item.planId.label;
		try {
			const graphUrl = `https://graph.microsoft.com/beta/planner/plans/${myFetchedPlanId}/?$expand=details`;

			const labelResponse = await client.api(graphUrl).version('v1.0').get();
			const categoryDescriptions = labelResponse.details.categoryDescriptions;
			const nonNullCategories = Object.values(categoryDescriptions).filter(
				(value) => value !== null
			);
			console.log(nonNullCategories, 'myy data');

			setLabels(nonNullCategories);
			console.log(labels, 'these are my planner Labels');
		} catch (error) {
			console.error('Error fetching planner Labels:', error.message);
			// Handle authentication errors
			if (error.statusCode === 401) {
				setError(
					'Authentication error. Please ensure your access token is valid.'
				);
			} else {
				setError('An error occurred while fetching planner Labels.');
			}
		}
	};

	const handleSelectionChange = (e, item) => {
		// Update the selectedRows state based on the data parameter
		console.log('sdsjdj', item);

		updateProgressUsingGraphApi(item);
	};

	const fetchBucketDetails = async (item) => {
		try {
			console.log('hi', item);
			const planId = item.planId.label;
			console.log(planId, 'PlanId');

			const bucketDetails = await client
				.api(`/planner/plans/${planId}/buckets`)
				.version('v1.0')
				.get();
			console.log('buckets', bucketDetails);
			const bucketValues = bucketDetails.value.map((bucket) => ({
				id: bucket.id,
				name: bucket.name,
			}));
			setBucketOptions(bucketValues);
			console.log(bucketValues, 'alll the buckets....');

			const defaultBucketId = item.bucketId.label;
			const defaultBucket = bucketValues.find(
				(bucket) => bucket.id === defaultBucketId
			);
			if (defaultBucket) {
				setSelectedBucket(defaultBucket);
			}
		} catch (error) {
			console.error('Error fetching bucket details:', error);
		}

		// const data = bucketDetails.name;
		// console.log(data);
	};

	const handleBucketChange = (event, item) => {
		const mybucketSelectionId = bucketOptions.find(
			(option) => option.name === item.optionText
		)?.id;
		console.log('Dropdown Called:', mybucketSelectionId);
		setSelectedBucketId(mybucketSelectionId);
	};

	const handleDateChange = (date) => {
		setSelectedDate(date);
	};

	const formatDate = (date) => {
		return date ? date.toLocaleDateString('en-US') : '';
	};

	const filteredData =
		filterStatus === 'All Active'
			? items.filter((item) => {
					const dueDate = new Date(item.filteringDueDate.label);
					const today = new Date();
					console.log(dueDate, ' ', today);
					const titleContainsSearchTerm = item.taskTitle.label
						.toLowerCase()
						.includes(searchTerm.toLowerCase());
					return (
						titleContainsSearchTerm &&
						item.progress.label.toLowerCase() !== 'completed' &&
						(selectedPriorityFilters.length === 0 ||
							selectedPriorityFilters.includes(item.priorityNumbers.label)) &&
						(selectedDueDateFilters.length === 0 ||
							selectedDueDateFilters.some((filter) => {
								switch (filter) {
									case 'Late':
										return dueDate < today;
									case 'Today':
										return dueDate.toDateString() === today.toDateString();
									case 'Tomorrow':
										const tomorrow = new Date(today);
										tomorrow.setDate(today.getDate() + 1);
										return dueDate.toDateString() === tomorrow.toDateString();
									case 'This Week':
										const startOfWeek = new Date(today);
										const endOfWeek = new Date(today);
										startOfWeek.setDate(today.getDate() - today.getDay());
										endOfWeek.setDate(today.getDate() + (6 - today.getDay()));
										return dueDate >= startOfWeek && dueDate <= endOfWeek;
									case 'Next Week':
										const startOfNextWeek = new Date(today);
										const endOfNextWeek = new Date(today);
										startOfNextWeek.setDate(
											today.getDate() + (8 - today.getDay())
										);
										endOfNextWeek.setDate(
											today.getDate() + (14 - today.getDay())
										);
										return (
											dueDate >= startOfNextWeek && dueDate <= endOfNextWeek
										);
									case 'Future':
										return dueDate > today;
									case 'No Date':
										return !dueDate;
									case 'With Due Date':
										return !!dueDate;
									default:
										return false;
								}
							}))
					);
			  })
			: items.filter(
					(item) =>
						item.progress.label.toLowerCase() === 'completed' &&
						(selectedPriorityFilters.length === 0 ||
							selectedPriorityFilters.includes(item.priorityNumbers.label)) &&
						(selectedDueDateFilters.length === 0 ||
							selectedDueDateFilters.includes(item.filteringDueDate.label))
			  );

	console.log(filteredData, 'myFilteredData');

	const handleRowClick = async (e, item) => {
		const checkboxClicked =
		  e.target.tagName === 'INPUT' && e.target.type === 'checkbox';
	  
		console.log('data123', item);
		console.log('myDate', item.textDueDate.label);
	  
		fetchPlannerLabels(item);
	  
		console.log('jhsd', selectedPriority);
		setIsItemSelected(true);
		console.log(isItemSelected);
		setIsRowSelection(true);
		console.log(isRowSelection);
		fetchChecklist(item);
		fetchBucketDetails(item);
	  
		if (checkboxClicked) {
		  e.stopPropagation();
		  console.log('Checkbox Selected');
		} else if (isRowSelection) {
		  console.log('Row Selected');
		  console.log(currentSelectedItem);
		  // Handle row selection logic here
		  // Update the selectedRows state or perform any other action
		  // without changing the checkbox state
		}
	  
		// try {
		//   const selectedTask = await client
		// 	.api(`/planner/tasks/${item.taskId}/details`)
		// 	.version('v1.0')
		// 	.get();
	  
		//   setCurrentSelectedTask(selectedTask.data);
		//   console.log(selectedTask, "Selected Task Data");
		// } catch (error) {
		//   console.error('Error fetching task:12', error);
		// }
	  
		setCurrentSelectedItem(item);
	  };
	  
	  // Assuming the rest of your component structure remains the same
	  

	useEffect(() => {
		const fetchData = async () => {
			// Fetch your data (e.g., tasks) and generate items and columns
			const { items, columns } = generateItemsAndColumns(tasks);

			// Set the initial items and columns
			setItems(items);
			setColumns(columns);
		};

		fetchData();
	}, [tasks]);

	const handleDeleteTasked = () => {
		console.log('jijji');
		console.log('data', currentSelectedItem);
		const taskId = currentSelectedItem.taskId.label;
		deleteTask(taskId);
	};

	const handleDialogDismiss = () => {
		setSelectedDate(null);
	};

	return (
		<FluentProvider theme={teamsLightTheme}>
			<div className="empty-block"></div>
			<div
				className="plainText"
				style={{
					display: 'flex',
					gap: '10px',
					border: '1px solid rgb(211,211,211)',
				}}>
				<div style={{ display: 'flex', width: '100%', flex: '1' }}>
					{isItemSelected && (
						<div
							className={`red-background ${
								isDivVisible ? 'visible' : 'hidden'
							}`}
							style={{
								display: 'flex',
								gap: '10px',
								marginTop: '0',
								padding: '10px',
								width: '65%',
							}}>
							<Menu>
								<MenuTrigger disableButtonEnhancement>
									<MenuButton
										appearance="transparent"
										icon={<Checkmark24Regular />}>
										Progress
									</MenuButton>
								</MenuTrigger>

								<MenuPopover>
									<MenuList>
										<MenuItem
											onClick={() => handleProgressChange('Not Started')}
											icon={<Circle16Regular />}>
											Not Started
										</MenuItem>
										<MenuItem
											onClick={() => handleProgressChange('In Progress')}
											icon={<CircleHalfFill16Regular />}>
											In Progress
										</MenuItem>
										<MenuItem
											onClick={() => handleProgressChange('Completed')}
											icon={<Checkmark16Regular />}>
											Completed
										</MenuItem>
									</MenuList>
								</MenuPopover>
							</Menu>
							<Menu>
								<MenuTrigger disableButtonEnhancement>
									<MenuButton
										appearance="transparent"
										icon={<Important20Filled />}>
										Priority
									</MenuButton>
								</MenuTrigger>

								<MenuPopover>
									<MenuList>
										<MenuItem
											onClick={() => handlePriorityChange('Urgent')}
											icon={
												<AlertUrgent16Filled primaryFill="rgb(196,49,75)" />
											}>
											Urgent
										</MenuItem>
										<MenuItem
											onClick={() => handlePriorityChange('Important')}
											icon={<Important16Filled primaryFill="rgb(196,49,75)" />}>
											Important
										</MenuItem>
										<MenuItem
											onClick={() => handlePriorityChange('Medium')}
											icon={
												<CircleSmall24Filled primaryFill="rgb(65,128,64)" />
											}>
											Medium
										</MenuItem>
										<MenuItem
											onClick={() => handlePriorityChange('Low')}
											icon={
												<ArrowSortDown16Filled primaryFill="rgb(50,126,170)" />
											}>
											Low
										</MenuItem>
									</MenuList>
								</MenuPopover>
							</Menu>

							<Dialog modalType="alert" minwidth="600" width="80%">
								<DialogTrigger
									disableButtonEnhancement
									onDismiss={handleDialogDismiss}>
									<Button appearance="transparent" iconPosition="after">
										<Calendar16Regular style={{ marginRight: '4px' }} />
										Due Date
										<ChevronDown16Regular />
									</Button>
								</DialogTrigger>
								<DialogSurface>
									<form onSubmit={handleDateUpdate}>
										<DialogBody>
											<DialogTitle>Due Date</DialogTitle>
											<DialogContent>
												<DatePicker
													firstWeekOfYear={1}
													showMonthPickerAsOverlay={true}
													placeholder="Due on"
													className={styles.control}
													formatDate={formatDate}
													onSelectDate={handleDateChange}
													value={selectedDate}
												/>
											</DialogContent>
											<DialogActions>
												<DialogTrigger
													onDismiss={handleDialogDismiss}
													disableButtonEnhancement>
													<Button appearance="secondary">Close</Button>
												</DialogTrigger>
												<Button type="submit" appearance="primary">
													Save
												</Button>
											</DialogActions>
										</DialogBody>
									</form>
								</DialogSurface>
							</Dialog>

							<Menu>
								<MenuTrigger disableButtonEnhancement>
									<MenuButton
										appearance="transparent"
										icon={<MoreHorizontal24Regular />}
									/>
								</MenuTrigger>
								<MenuPopover>
									<MenuList>
										<MenuItem
											onClick={handleDeleteTasked}
											icon={<Delete24Regular />}>
											Delete
										</MenuItem>
									</MenuList>
								</MenuPopover>
							</Menu>
							{/* <Button appearance="transparent" onClick={handleDeleteTask(currentSelectedItem)} icon={<Delete16Regular />}>
        Delete
      </Button> */}
						</div>
					)}
					<div
						style={{
							marginLeft: '10px',
							width: '40%',
							flex: '1',
							display: 'flex',
							gap: '10px',
							marginTop: '0',
							padding: '10px',
						}}>
						{isItemSelected && (
							<div>
								<Button
									appearance="transparent"
									icon={<Add20Regular style={{ transform: 'rotate(45deg)' }} />}
									onClick={handleSelectedButtonClick}>
									Selected
								</Button>
							</div>
						)}

						<div
							className="static buttons"
							style={{
								display: 'flex',
								flexDirection: 'row',
								justifyContent: 'space-between',
								width: '100%',
							}}>
							<div style={{ display: 'flex', alignItems: 'center' }}>
								<Menu>
									<MenuTrigger disableButtonEnhancement>
										<MenuButton appearance="transparent">
											{filterStatus}
										</MenuButton>
									</MenuTrigger>

									<MenuPopover>
										<MenuList>
											<MenuItem
												onClick={() => handleFilterChange('All Active')}>
												All Active
											</MenuItem>
											<MenuItem onClick={() => handleFilterChange('Completed')}>
												Completed
											</MenuItem>
										</MenuList>
									</MenuPopover>
								</Menu>

								<Menu>
									<MenuTrigger disableButtonEnhancement>
										<MenuButton appearance="transparent">
											{selectedPriorityCount === 0 &&
											selectedDueDateFilters.length === 0
												? 'Filter'
												: `Filter (${
														selectedPriorityCount +
														selectedDueDateFilters.length
												  })`}
										</MenuButton>
									</MenuTrigger>
									<MenuPopover style={{ width: '200px', maxHeight: '400px' }}>
										<MenuList
											onChange={(ev, item) => setFilterStatus(item.key)}>
											<div
												style={{
													display: 'flex',
													justifyContent: 'space-between',
													alignItems: 'center',
												}}>
												<Label>Filter</Label>
												<Button
													appearance="transparent"
													onClick={clearPriorityFilters}
													style={{ color: 'rgb(98, 100, 167)' }}>
													Clear
												</Button>
											</div>
											<Input
												placeholder="Filter by keyword"
												style={{ backgroundColor: 'rgb(237,235,233)' }}
												onChange={(e) => setSearchTerm(e.target.value)}
											/>
											<Accordion multiple>
												<AccordionItem value="faq1">
													<AccordionHeader
														as="h2"
														style={{ fontWeight: '600', fontSize: '16px' }}>
														Due ({selectedDueDateFilters.length})
													</AccordionHeader>
													<AccordionPanel>
														{generateDueDateItems().map((dueDate) => (
															<MenuItem
																key={dueDate}
																onClick={() =>
																	handleFilterDueDateChange(dueDate)
																}
																style={{ fontWeight: 'bold' }}>
																{dueDate}
																{isDueDateSelected(dueDate) && (
																	<Checkmark16Regular
																		style={{ marginLeft: '5px' }}
																	/>
																)}
															</MenuItem>
														))}
													</AccordionPanel>
												</AccordionItem>
												<AccordionItem value="faq2">
													<AccordionHeader as="h2">
														Priority ({selectedPriorityCount})
													</AccordionHeader>
													<AccordionPanel>
														<MenuItem
															onClick={() => handleFilterPriorityChange(1)}
															style={{ fontWeight: 'bold' }}>
															<div
																style={{
																	display: 'flex',
																	alignItems: 'center',
																	justifyContent: 'space-between',
																	width: '100%',
																}}>
																<div>
																	<AlertUrgent16Filled primaryFill="rgb(196,49,75)" />
																	<span style={{ marginLeft: '5px' }}>
																		Urgent
																	</span>
																</div>
																{isPrioritySelected(1) && (
																	<Checkmark16Regular
																		style={{ marginLeft: '5px' }}
																	/>
																)}
															</div>
														</MenuItem>
														<MenuItem
															onClick={() => handleFilterPriorityChange(3)}
															style={{ fontWeight: 'bold' }}>
															<div
																style={{
																	display: 'flex',
																	alignItems: 'center',
																	alignContent: 'space-between',
																	width: '100%',
																}}>
																<div>
																	<Important16Filled primaryFill="rgb(196,49,75)" />
																	<span style={{ marginLeft: '5px' }}>
																		Important
																	</span>
																</div>
																{isPrioritySelected(3) && (
																	<Checkmark16Regular
																		style={{ marginLeft: '5px' }}
																	/>
																)}
															</div>
														</MenuItem>
														<MenuItem
															onClick={() => handleFilterPriorityChange(5)}
															style={{ fontWeight: 'bold' }}>
															<div
																style={{
																	display: 'flex',
																	alignItems: 'center',
																}}>
																<CircleSmall24Filled primaryFill="rgb(65,128,64)" />
																<span style={{ marginLeft: '5px' }}>
																	Medium
																</span>
																{isPrioritySelected(5) && (
																	<Checkmark16Regular
																		style={{ marginLeft: '5px' }}
																	/>
																)}
															</div>
														</MenuItem>
														<MenuItem
															onClick={() => handleFilterPriorityChange(9)}
															style={{ fontWeight: 'bold' }}>
															<div
																style={{
																	display: 'flex',
																	alignItems: 'center',
																}}>
																<ArrowSortDown16Filled primaryFill="rgb(50,126,170)" />
																<span style={{ marginLeft: '5px' }}>Low</span>
																{isPrioritySelected(9) && (
																	<Checkmark16Regular
																		style={{ marginLeft: '5px' }}
																	/>
																)}
															</div>
														</MenuItem>
													</AccordionPanel>
												</AccordionItem>
											</Accordion>
										</MenuList>
									</MenuPopover>
								</Menu>
							</div>
						</div>
					</div>
				</div>
			</div>

			<Dialog modalType="alert" minwidth="600" width="80%">
				<DialogTrigger disableButtonEnhancement>
					<Button style={{ background: 'rgb(98, 100, 167)', color: 'white' }}>
						New Task
					</Button>
				</DialogTrigger>
				<DialogSurface>
					<form>
						<DialogBody>
							<DialogTitle>New Task</DialogTitle>
							<DialogContent>
								<div style={{ marginBottom: 20 }}>
									<Label htmlFor="task-title" style={{ padding: '10' }}>
										Task Title
									</Label>
									<Input
										id="task-title"
										onChange={(e, newValue) => setNewTaskTitle(newValue)}
									/>
								</div>
								<div style={{ marginBottom: 20 }}>
									<Label htmlFor="plans" style={{ padding: '10' }}>
										Plans
									</Label>
									<Dropdown
										label="Bucket"
										//selectedOptions={bucketOptions.filter((option) => option.id === selectedBucketId)}
									>
										{plans.map((plan) => (
											<Option key={plan.id}>{plan.title}</Option>
										))}
									</Dropdown>
								</div>
								{/* <div style={{ marginBottom: 20 }}>
                  <Label htmlFor="buckets" style={{ padding: '10' }}>
                    Buckets
                  </Label>
                  <Dropdown
                    label="Bucket"
                    placeholder="Select a Bucket"
                   
                    options={[
                      { key: 'bucket1', text: 'Bucket 1' },
                      { key: 'bucket2', text: 'Bucket 2' },
                      { key: 'bucket3', text: 'Bucket 3' },
                      
                    ]}
                  />
                </div> */}
							</DialogContent>
							<DialogActions>
								<DialogTrigger disableButtonEnhancement>
									<Button appearance="secondary">Close</Button>
								</DialogTrigger>
								<Button
									type="submit"
									appearance="primary"
									onClick={TaskCreation}>
									Save
								</Button>
							</DialogActions>
						</DialogBody>
					</form>
				</DialogSurface>
			</Dialog>

			<DataGrid
				items={filteredData}
				columns={columns}
				sortable
				getRowId={(item) => item.taskId.label}
				selectionMode="multiselect"
				//onSelectionChange={(e, item) => handleSelectionChange(e, item)}
				focusMode="composite">
				<DataGridHeader>
					<DataGridRow>
						{({ renderHeaderCell }) => (
							<DataGridHeaderCell>{renderHeaderCell()}</DataGridHeaderCell>
						)}
					</DataGridRow>
				</DataGridHeader>
				<DataGridBody>
					{({ item, rowId }) => (
						<DataGridRow
							key={rowId}
							selectionCell={{ 'aria-label': 'Select row' }}
							onClick={(e) => handleRowClick(e, item)}>
							{({ renderCell }) => (
								<DataGridCell>
									{selectedRows.includes(rowId) ? (
										<span style={{ textDecoration: 'line-through' }}>
											{renderCell(item)}
										</span>
									) : (
										<span>{renderCell(item)}</span>
									)}
								</DataGridCell>
							)}
						</DataGridRow>
					)}
				</DataGridBody>
			</DataGrid>

			<DetailsDialog />

			<Dialog
				hidden={!showEditDialog}
				onDismiss={closeDialog}
				dialogContentProps={{
					title: 'Edit Task',
					//subText: 'Make changes to the task details below.',
					maxWidth: '100%',
				}}
				modalProps={{
					isBlocking: false,
					styles: { main: { maxWidth: '80%', maxHeight: '80%' } },
				}}>
				<Stack
					styles={{ root: { width: '80%', padding: '20px' } }}
					tokens={{ childrenGap: 20 }}>
					<Stack horizontal verticalAlign="center" tokens={{ childrenGap: 10 }}>
						<Checkbox
							checked={selectedTask?.checked}
							onChange={(ev, checked) => toggleCheckbox(checked)}
							shape="circular"
						/>
						<Input
							label="Task Title"
							value={taskTitle}
							onChange={(e, newValue) => setTaskTitle(newValue)}
							styles={{ fieldGroup: { width: '100%' } }}
						/>
					</Stack>
					<Stack.Item>
						<Stack horizontal tokens={{ childrenGap: 20 }}>
							<Stack.Item>
								<Stack horizontal verticalAlign="center">
									<span
										className={mergeStyles({ fontSize: 16, paddingRight: 8 })}>
										Assigned To:
									</span>
									{/* Add user icon here */}
									<Dropdown
										selectedKey={assignedTo}
										SelectedKey={assignedTo}
										SelectedKeys={assignedTo}
										placeholder="Select an option"
										options={[
											{ key: 'John Doe', text: 'John Doe' },
											{ key: 'Jane Smith', text: 'Jane Smith' },
											// Add more users as needed
										]}
										onChange={handleAssignToChange}
									/>
								</Stack>
							</Stack.Item>
						</Stack>
					</Stack.Item>
					<Stack.Item>
						<Stack horizontal tokens={{ childrenGap: 20 }}>
							<Stack.Item>
								<Dropdown
									label="Bucket"
									selectedKey={selectedBucket}
									defaultValue={selectedBucket}
									placeholder="Select a bucket"
									options={bucketOptions}
								/>
							</Stack.Item>
							<Stack.Item>
								<Dropdown
									label="Progress"
									selectedKey={selectedProgress}
									placeholder="Select progress"
									options={progressOptions}
									onChange={handleProgressChange}
								/>
							</Stack.Item>
							<Stack.Item>
								<Dropdown
									label="Priority"
									selectedKey={selectedPriority}
									placeholder="Select priority"
									options={priorityOptions}
									onChange={handlePriorityChange}
								/>
							</Stack.Item>
						</Stack>
					</Stack.Item>
					<Stack.Item>
						<Input
							label="Notes"
							multiline
							autoAdjustHeight
							value={notes}
							onChange={(ev, val) => setNotes(val)}
						/>
					</Stack.Item>
					<Stack.Item>
						<Textarea
							label="Comments"
							multiline
							autoAdjustHeight
							value={comments}
							onChange={(ev, val) => setComments(val)}
						/>
					</Stack.Item>
					<Stack.Item align="end">
						<DefaultButton
							text="Save"
							onClick={handleEditSave}
							styles={{
								root: { background: 'rgb(98, 100, 167)', color: 'white' },
							}}
						/>
						<DefaultButton
							text="Close"
							onClick={closeDialog}
							styles={{
								root: {
									background: 'rgb(98, 100, 167)',
									color: 'white',
									marginLeft: '8px',
								},
							}}
						/>
					</Stack.Item>
				</Stack>
			</Dialog>
		</FluentProvider>
	);
};

export default PlannerTasksTable;
