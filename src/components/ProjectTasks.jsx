import React, { useState, useEffect } from 'react';
import { Client } from '@microsoft/microsoft-graph-client';
import { TeamsUserCredential } from '@microsoft/teamsfx';
import config from './sample/lib/config';
import { CheckboxFunctionality } from './Checkbox';
import { CheckboxVisibility } from '@fluentui/react';
import { MenuButton } from '@fluentui/react-components';
import { Notepad16Regular } from '@fluentui/react-icons';
import { Calendar24Regular } from '@fluentui/react-icons';
import { Menu } from '@fluentui/react-components';
import { MenuItem } from '@fluentui/react-components';
import { MenuPopover, MenuList } from '@fluentui/react-components';
import { MenuTrigger } from '@fluentui/react-components';
import { Checkmark24Regular } from '@fluentui/react-icons';
import { Important20Filled } from '@fluentui/react-icons';
import { ArrowSortDown24Filled } from '@fluentui/react-icons';
import { CircleSmall24Filled } from '@fluentui/react-icons';
import { Delete16Regular } from '@fluentui/react-icons';
import { Add20Regular } from '@fluentui/react-icons';
import { AlertUrgent24Filled } from '@fluentui/react-icons';
import { CheckmarkCircle12Regular } from '@fluentui/react-icons';
import MenuBar from './MenuBar';
import { DataGrid } from '@fluentui/react-components';
import './MenuBar.css'
import {
  Checkbox,
  FluentProvider,
  teamsLightTheme,
} from "@fluentui/react-components";
import { UserAgentApplication } from 'msal';
import { useGraphWithCredential } from '@microsoft/teamsfx-react';
import { useTeamsUserCredential } from '@microsoft/teamsfx-react';
import { Button } from '@fluentui/react-components';
import {
  Selection,
  SelectionMode,
  PrimaryButton,
  Dialog,
  DefaultButton,
  Dropdown,
  TextField,
  Stack,
  DatePicker,
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

const PlannerTasksTable = () => {
  const [item, setItem] = useState(/* initial value */);
  const [tasks, setTasks] = useState([]);
  const [error, setError] = useState(null);
  const [filterStatus, setFilterStatus] = useState('All Active');
  const [isChecked, setIsChecked] = useState(false);

  const [formData, setFormData] = useState({
    taskTitle: '',
    assignedTo: '',
    status: '',
  });

  const [planName, setPlanName] = useState('');
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
  const [bucketOptions] = useState([
    { key: 'To Do', text: 'To Do' },
    { key: 'In Progress', text: 'In Progress' },
    { key: 'Completed', text: 'Completed' },
  ]);
  const [selectedBucket, setSelectedBucket] = useState('');
  const [progressOptions] = useState([
    { key: 'Not started', text: 'Not started' },
    { key: 'In Progress', text: 'In Progress' },
    { key: 'Completed', text: 'Completed' },
  ]);
  const [selectedProgress, setSelectedProgress] = useState('');
  const [priorityOptions] = useState([
    { key: 'Low', text: 'Low' },
    { key: 'Medium', text: 'Medium' },
    { key: 'High', text: 'High' },
  ]);
  const [selectedPriority, setSelectedPriority] = useState('');
  const [notes, setNotes] = useState('');
  const [comments, setComments] = useState('');
  const handleItemSelection = (item) => {
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


  const handleAssignToChange = (event, item) => {
    setAssignedTo(item.text);
  };

  const handleBucketChange = (event, item) => {
    setSelectedBucket(item.text);
  };

  const handleProgressChange = (event, item) => {
    setSelectedProgress(item.text);
  };

  const handlePriorityChange = (event, item) => {
    setSelectedPriority(item.text);
  };

  const handleStartDateChange = (date) => {
    setStartDate(date || null);
  };
  
  const handleDueDateChange = (date) => {
    setDueDate(date || null);
  };

  const handleEditSave = async () => {
    try {
      // Construct updatedTask object (as shown in step 1)
      const updatedTask = {
        title: taskTitle,
        id:taskId,
        //id: id,
        // assignments: [
        //   {
        //     assignedTo: assignedTo, // Use the selected user
        //   },
        // ],
       //bucketId: selectedBucket,
       //percentComplete: progressOptions.find(option => option.key === selectedProgress).text,
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

  const columns = [
    {
      key: 'column0',
      name: '',
      fieldName: 'checkbox',
      minWidth: 20,
      maxWidth: 50,
    },
    {
      key: 'column1',
      name: 'Task Title',
      fieldName: 'taskTitle',
      minWidth: 300,
      maxWidth: 400,
    },
    {
      key: 'column2',
      name: '',
      fieldName: 'checkListCount',
      minWidth: 50,
      maxWidth: 90,
      fontSize:10
    },
    // {
    //   key: 'column2',
    //   name: 'Source',
    //   fieldName: 'planId',
    //   minWidth: 400,
    //   maxWidth: 500,
    // },
    {
      key: 'column3',
      name: 'Status',
      fieldName: 'status',
      minWidth: 90,
      maxWidth: 100,
    },
    {
      key: 'column4',
      name: 'Priority',
      fieldName: 'priority',
      minWidth: 50,
      maxWidth: 100,
    },
    {
      key: 'column5',
      name: 'Due Date',
      fieldName: 'dueDate',
      minWidth: 50,
      maxWidth: 100,
    },
  ];


  const statusOptions = [
    { key: 'All Active', text: 'All Active' },
    { key: 'Completed', text: 'Completed' }
  ];

  const toggleCheckbox = (item) => {
    setChecked(item);
    console.log(item);
    // Update task title style and status based on checkbox state
    setTaskTitle((prevTitle) => {
      if (item) {
        return (
          <span style={{ textDecoration: 'line-through' }}>
            {prevTitle}
          </span>
        );
      } else {
        return <span>{prevTitle}</span>;
      }
    });
  };

  const openDialog = () => {
    setFormData(initialFormData);
    setShowDialog(true);
  };

  const closeDialog = () => {
    setShowDialog(false);
    setShowEditDialog(false);
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
    // Perform any validation on taskTitle if needed
    console.log('Entered Task Title:', formData.taskTitle);

    const enteredTaskTitle = formData.taskTitle;
    const planId = 'TcOeczL-tUOeXqjtl9MoNGUAAwdI';
    const assignments = {};

    try {
      // Call the createTask function passed as a prop
      await createTask(enteredTaskTitle, planId);

      // Reset the task title and close the dialog
      setFormData({ ...formData, taskTitle: '' });
      closeDialog();
    } catch (error) {
      // Handle errors appropriately
      console.error('Error adding task:', error);}};

  const openEditDialog = (item) => {
    setSelectedTask(item);
    setTaskTitle(item.taskTitle);
    setChecked(item.checked);
    setTaskId(item.taskId);
    setBucket(item.bucket || ''); // Check if the field exists in your data
    setSelectedPriority(item.selectedPriority || ''); // Check if the field exists in your data
    setNotes(item.notes || '');
    setShowEditDialog(true);
  };




  useEffect(() => {
    const fetchPlannerTasks = async () => {
      try {
        //const teamsUserCredential = new TeamsUserCredential(config);
        //const accessToken = await teamsUserCredential.getToken(""); // Get SSO token
        const accessToken = 'eyJ0eXAiOiJKV1QiLCJub25jZSI6InNtNVFySkNGa0dybmdvZm9WSkhRdWZMUC1BYWlZaEQ0am0ycnlENTlyYjgiLCJhbGciOiJSUzI1NiIsIng1dCI6IjlHbW55RlBraGMzaE91UjIybXZTdmduTG83WSIsImtpZCI6IjlHbW55RlBraGMzaE91UjIybXZTdmduTG83WSJ9.eyJhdWQiOiIwMDAwMDAwMy0wMDAwLTAwMDAtYzAwMC0wMDAwMDAwMDAwMDAiLCJpc3MiOiJodHRwczovL3N0cy53aW5kb3dzLm5ldC9jODVlOTY4Zi03MjlhLTRiNjUtYWIzOS04NTRjYWFiMzhlNTUvIiwiaWF0IjoxNzAwMTIxMTA2LCJuYmYiOjE3MDAxMjExMDYsImV4cCI6MTcwMDIwNzgwNiwiYWNjdCI6MCwiYWNyIjoiMSIsImFpbyI6IkFWUUFxLzhWQUFBQVI0c2pqSzNXNlBJRTZsRE03d1F4Wms1TnJNRU1XVnZWVzRhekdLQXgzV2tHdWcyRjJZWTg5VitudDZpVXVEZWFpV2hTTkt0cTJDakptaHBoM29lNFZLS25Bd1FYRzNDa0VpRnRkby9Ub3Z3PSIsImFtciI6WyJwd2QiLCJtZmEiXSwiYXBwX2Rpc3BsYXluYW1lIjoiR3JhcGggRXhwbG9yZXIiLCJhcHBpZCI6ImRlOGJjOGI1LWQ5ZjktNDhiMS1hOGFkLWI3NDhkYTcyNTA2NCIsImFwcGlkYWNyIjoiMCIsImZhbWlseV9uYW1lIjoidml0dGFsIiwiZ2l2ZW5fbmFtZSI6IlNhaSIsImlkdHlwIjoidXNlciIsImlwYWRkciI6IjE4My44Mi4xMTUuMTk5IiwibmFtZSI6IlNhaSB2aXR0YWwiLCJvaWQiOiI3YmE5YTg0Yy0yOGU4LTQ4YWEtYjJmZi03Njc0MDhhMWQxOTUiLCJwbGF0ZiI6IjMiLCJwdWlkIjoiMTAwMzIwMDJCQUUzNjZGRSIsInJoIjoiMC5BYmNBajVaZXlKcHlaVXVyT1lWTXFyT09WUU1BQUFBQUFBQUF3QUFBQUFBQUFBQzNBS00uIiwic2NwIjoiR3JvdXAuUmVhZC5BbGwgR3JvdXAuUmVhZFdyaXRlLkFsbCBvcGVuaWQgcHJvZmlsZSBUYXNrcy5SZWFkIFRhc2tzLlJlYWRXcml0ZSBVc2VyLlJlYWQgZW1haWwiLCJzaWduaW5fc3RhdGUiOlsia21zaSJdLCJzdWIiOiJ3Qm5fLWEtaTBQbGZwS1VGU3lYNzRHZ0RrQnZKLWRvMVRNX19xbWdpSXBFIiwidGVuYW50X3JlZ2lvbl9zY29wZSI6Ik5BIiwidGlkIjoiYzg1ZTk2OGYtNzI5YS00YjY1LWFiMzktODU0Y2FhYjM4ZTU1IiwidW5pcXVlX25hbWUiOiJQcmVwYXJvckAyeDN0cGIub25taWNyb3NvZnQuY29tIiwidXBuIjoiUHJlcGFyb3JAMngzdHBiLm9ubWljcm9zb2Z0LmNvbSIsInV0aSI6IjMxMXpkcHFWLWs2NmQ1UE8xbXNiQUEiLCJ2ZXIiOiIxLjAiLCJ3aWRzIjpbIjYyZTkwMzk0LTY5ZjUtNDIzNy05MTkwLTAxMjE3NzE0NWUxMCIsImI3OWZiZjRkLTNlZjktNDY4OS04MTQzLTc2YjE5NGU4NTUwOSJdLCJ4bXNfY2MiOlsiQ1AxIl0sInhtc19zc20iOiIxIiwieG1zX3N0Ijp7InN1YiI6IjJ2TnpFZFV0M1NRa05tOFFXcGs2QmJlWXRKcXVrLUpJY05KbDNtQk5sbzQifSwieG1zX3RjZHQiOjE2ODgzNDg4MDN9.i799zUzOVX2H8DYOBpg5oVaS6TotGf1EVzuqUOynPqsOSrCXfoC7jJ9TbHXnUtnQ4d9jCkEpB_OUG9HHV_YY33FRfcvy5P7QAB8ZnQ0cy8BXeGOiEhPYTeraWuXoUGHj2Dhjhqv8VIXXJ9Weg-ZYgWb49IQzRxkfJUiaM7KDWXwg_ruQQJW0CMtPeIT-NFTSbD1Fh8u81mh_X5OHhQyKXWXIZvehJ-P1qKRBJzNvOFikcAAN465Qq7LKAd-mCKG9i91PPaG7AQBfVQClt2Erti2KRMoTD06SVAQIVsvAL0V4nb1brwya8T9d3OXM6puLefew6QtItA5zzroGIbkUXg';

        //  const usersdataprovided = await teamsUserCredential.getUserInfo();
        //  const accessToken = await teamsUserCredential.getToken("");
        //  console.log(usersdataprovided);
        //  console.log(accessToken);
        //  console.log(accessToken1.token);         

        //  Assuming you have an access token for authentication

        const client = Client.init({
          authProvider: (done) => {
            done(null, accessToken);
          },
        });
        //console.log(client);

        const tasksResponse = await client.api('/me/planner/tasks').version('v1.0').get();
        console.log(tasksResponse);
        setTasks(tasksResponse.value);
      } catch (error) {
        console.error('Error fetching planner tasks:', error.message);
        // Handle authentication errors
        if (error.statusCode === 401) {
            setError('Authentication error. Please ensure your access token is valid.');
          } else {
            setError('An error occurred while fetching planner tasks.');
          }
      }
    };

    fetchPlannerTasks();
  }, []);

  const renderCheckbox = (item) => (
    <CheckboxFunctionality
      checked={item.checked}
      onCheckboxChange={() => toggleCheckbox(item.checked)}
      shape="circular"
      backgroundColor = {item.checked? 'black': 'white'}
    />
  );

  const renderTaskTitle = (item) => <div>{item.title} { 
  <a href="#" className='task2' 
  style={{textDecoration:item.checked?'line-through':'none', 
  onMouseOver:'#0F0',
  onMouseOut:'#00F'}} 
  onClick={() => openEditDialog(item)}>{item.taskTitle}</a>}</div>;

  //const renderSource = (item) => ({item.planId});


  const handleFilterChange= (status) => {
    setFilterStatus(status);
  };

  
  const itemsWithCheckbox = tasks.map((item) => {
    let priorityText;


  switch (item.priority) {
    case 1:
      priorityText = <AlertUrgent24Filled primaryFill='darkred' />;
      break;
    case 3:
      priorityText = <Important20Filled primaryFill='darkred'/>;
      break;
    case 5:
      priorityText = <CircleSmall24Filled primaryFill='green'/>;
      break;
    case 9:
      priorityText = <ArrowSortDown24Filled primaryFill='blue'/>;
      break;
    default:
      priorityText = 'Unknown Priority';
      break;
  }

  const today = new Date();
  const isDueDateCrossingToday = item.dueDateTime ? new Date(item.dueDateTime) > today : false;

  return {
    key: item.id,
    taskTitle:item.title,
    taskId:item.id,
    //overallChecklist: `(${activeChecklistCount}/${checklistCount})`,
    //assignedTo: item.assignments ? item.assignments[0].assignedTo.displayName : 'N/A',
    status: item.percentComplete === 100 ? 'Completed' : 'In Progress',
    checked: !checked,
    priority: priorityText,
    // dueDate: item.dueDateTime ? new Date(item.dueDateTime).toLocaleDateString('en-GB', { day: '2-digit', month: '2-digit' }) : '',
    dueDate: item.dueDateTime ? (
      item.percentComplete === 0 && !isDueDateCrossingToday ? (
        <div className='dateDiv' style={{ backgroundColor: 'red', display: 'inline-flex', borderRadius:'4px',alignItems: 'center', padding:'3px' }}>
          <Calendar24Regular style={{ marginRight: '4px', color: 'white', padding:'3px' }} />
          <span style={{ color: 'white' }}> {new Date(item.dueDateTime).toLocaleDateString('en-GB', { day: '2-digit', month: '2-digit' })}</span>
        </div>
      ) : (
        <span style={{color: 'black', fontSize: '12px'}}>
          {new Date(item.dueDateTime).toLocaleDateString('en-GB', { day: '2-digit', month: '2-digit' })}
        </span>
      )
    ) : '',
    planId: item.planId,
    // checkListCount: item.activeChecklistItemCount === 0 ? '': "("+item.activeChecklistItemCount.toString()+"/"+item.checklistItemCount.toString()+")"
    checkListCount: item.activeChecklistItemCount === 0
  ? <Notepad16Regular style={{ marginLeft: '50px'}}/>
  : (
      <span>
        <CheckmarkCircle12Regular /> 
        {`(${item.activeChecklistItemCount.toString()}/${item.checklistItemCount.toString()})`}
        <Notepad16Regular style={{ marginLeft: '10px'}}/>
      </span>
    )
    //overallChecklist: checkListCountSpl
  }});



  const createTask = async (title, planId) => {
    const accessToken = 'eyJ0eXAiOiJKV1QiLCJub25jZSI6InNtNVFySkNGa0dybmdvZm9WSkhRdWZMUC1BYWlZaEQ0am0ycnlENTlyYjgiLCJhbGciOiJSUzI1NiIsIng1dCI6IjlHbW55RlBraGMzaE91UjIybXZTdmduTG83WSIsImtpZCI6IjlHbW55RlBraGMzaE91UjIybXZTdmduTG83WSJ9.eyJhdWQiOiIwMDAwMDAwMy0wMDAwLTAwMDAtYzAwMC0wMDAwMDAwMDAwMDAiLCJpc3MiOiJodHRwczovL3N0cy53aW5kb3dzLm5ldC9jODVlOTY4Zi03MjlhLTRiNjUtYWIzOS04NTRjYWFiMzhlNTUvIiwiaWF0IjoxNzAwMTIxMTA2LCJuYmYiOjE3MDAxMjExMDYsImV4cCI6MTcwMDIwNzgwNiwiYWNjdCI6MCwiYWNyIjoiMSIsImFpbyI6IkFWUUFxLzhWQUFBQVI0c2pqSzNXNlBJRTZsRE03d1F4Wms1TnJNRU1XVnZWVzRhekdLQXgzV2tHdWcyRjJZWTg5VitudDZpVXVEZWFpV2hTTkt0cTJDakptaHBoM29lNFZLS25Bd1FYRzNDa0VpRnRkby9Ub3Z3PSIsImFtciI6WyJwd2QiLCJtZmEiXSwiYXBwX2Rpc3BsYXluYW1lIjoiR3JhcGggRXhwbG9yZXIiLCJhcHBpZCI6ImRlOGJjOGI1LWQ5ZjktNDhiMS1hOGFkLWI3NDhkYTcyNTA2NCIsImFwcGlkYWNyIjoiMCIsImZhbWlseV9uYW1lIjoidml0dGFsIiwiZ2l2ZW5fbmFtZSI6IlNhaSIsImlkdHlwIjoidXNlciIsImlwYWRkciI6IjE4My44Mi4xMTUuMTk5IiwibmFtZSI6IlNhaSB2aXR0YWwiLCJvaWQiOiI3YmE5YTg0Yy0yOGU4LTQ4YWEtYjJmZi03Njc0MDhhMWQxOTUiLCJwbGF0ZiI6IjMiLCJwdWlkIjoiMTAwMzIwMDJCQUUzNjZGRSIsInJoIjoiMC5BYmNBajVaZXlKcHlaVXVyT1lWTXFyT09WUU1BQUFBQUFBQUF3QUFBQUFBQUFBQzNBS00uIiwic2NwIjoiR3JvdXAuUmVhZC5BbGwgR3JvdXAuUmVhZFdyaXRlLkFsbCBvcGVuaWQgcHJvZmlsZSBUYXNrcy5SZWFkIFRhc2tzLlJlYWRXcml0ZSBVc2VyLlJlYWQgZW1haWwiLCJzaWduaW5fc3RhdGUiOlsia21zaSJdLCJzdWIiOiJ3Qm5fLWEtaTBQbGZwS1VGU3lYNzRHZ0RrQnZKLWRvMVRNX19xbWdpSXBFIiwidGVuYW50X3JlZ2lvbl9zY29wZSI6Ik5BIiwidGlkIjoiYzg1ZTk2OGYtNzI5YS00YjY1LWFiMzktODU0Y2FhYjM4ZTU1IiwidW5pcXVlX25hbWUiOiJQcmVwYXJvckAyeDN0cGIub25taWNyb3NvZnQuY29tIiwidXBuIjoiUHJlcGFyb3JAMngzdHBiLm9ubWljcm9zb2Z0LmNvbSIsInV0aSI6IjMxMXpkcHFWLWs2NmQ1UE8xbXNiQUEiLCJ2ZXIiOiIxLjAiLCJ3aWRzIjpbIjYyZTkwMzk0LTY5ZjUtNDIzNy05MTkwLTAxMjE3NzE0NWUxMCIsImI3OWZiZjRkLTNlZjktNDY4OS04MTQzLTc2YjE5NGU4NTUwOSJdLCJ4bXNfY2MiOlsiQ1AxIl0sInhtc19zc20iOiIxIiwieG1zX3N0Ijp7InN1YiI6IjJ2TnpFZFV0M1NRa05tOFFXcGs2QmJlWXRKcXVrLUpJY05KbDNtQk5sbzQifSwieG1zX3RjZHQiOjE2ODgzNDg4MDN9.i799zUzOVX2H8DYOBpg5oVaS6TotGf1EVzuqUOynPqsOSrCXfoC7jJ9TbHXnUtnQ4d9jCkEpB_OUG9HHV_YY33FRfcvy5P7QAB8ZnQ0cy8BXeGOiEhPYTeraWuXoUGHj2Dhjhqv8VIXXJ9Weg-ZYgWb49IQzRxkfJUiaM7KDWXwg_ruQQJW0CMtPeIT-NFTSbD1Fh8u81mh_X5OHhQyKXWXIZvehJ-P1qKRBJzNvOFikcAAN465Qq7LKAd-mCKG9i91PPaG7AQBfVQClt2Erti2KRMoTD06SVAQIVsvAL0V4nb1brwya8T9d3OXM6puLefew6QtItA5zzroGIbkUXg'; // Replace with your actual access token
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
      console.error('Error creating task:', error.response.data || error.statusCode);
      throw error;
    }
  };

  const updateTask = async (taskId, updatedTask) => {
    try {
      //const teamsUserCredential = new TeamsUserCredential(config);
      const accessToken = 'eyJ0eXAiOiJKV1QiLCJub25jZSI6InNtNVFySkNGa0dybmdvZm9WSkhRdWZMUC1BYWlZaEQ0am0ycnlENTlyYjgiLCJhbGciOiJSUzI1NiIsIng1dCI6IjlHbW55RlBraGMzaE91UjIybXZTdmduTG83WSIsImtpZCI6IjlHbW55RlBraGMzaE91UjIybXZTdmduTG83WSJ9.eyJhdWQiOiIwMDAwMDAwMy0wMDAwLTAwMDAtYzAwMC0wMDAwMDAwMDAwMDAiLCJpc3MiOiJodHRwczovL3N0cy53aW5kb3dzLm5ldC9jODVlOTY4Zi03MjlhLTRiNjUtYWIzOS04NTRjYWFiMzhlNTUvIiwiaWF0IjoxNzAwMTIxMTA2LCJuYmYiOjE3MDAxMjExMDYsImV4cCI6MTcwMDIwNzgwNiwiYWNjdCI6MCwiYWNyIjoiMSIsImFpbyI6IkFWUUFxLzhWQUFBQVI0c2pqSzNXNlBJRTZsRE03d1F4Wms1TnJNRU1XVnZWVzRhekdLQXgzV2tHdWcyRjJZWTg5VitudDZpVXVEZWFpV2hTTkt0cTJDakptaHBoM29lNFZLS25Bd1FYRzNDa0VpRnRkby9Ub3Z3PSIsImFtciI6WyJwd2QiLCJtZmEiXSwiYXBwX2Rpc3BsYXluYW1lIjoiR3JhcGggRXhwbG9yZXIiLCJhcHBpZCI6ImRlOGJjOGI1LWQ5ZjktNDhiMS1hOGFkLWI3NDhkYTcyNTA2NCIsImFwcGlkYWNyIjoiMCIsImZhbWlseV9uYW1lIjoidml0dGFsIiwiZ2l2ZW5fbmFtZSI6IlNhaSIsImlkdHlwIjoidXNlciIsImlwYWRkciI6IjE4My44Mi4xMTUuMTk5IiwibmFtZSI6IlNhaSB2aXR0YWwiLCJvaWQiOiI3YmE5YTg0Yy0yOGU4LTQ4YWEtYjJmZi03Njc0MDhhMWQxOTUiLCJwbGF0ZiI6IjMiLCJwdWlkIjoiMTAwMzIwMDJCQUUzNjZGRSIsInJoIjoiMC5BYmNBajVaZXlKcHlaVXVyT1lWTXFyT09WUU1BQUFBQUFBQUF3QUFBQUFBQUFBQzNBS00uIiwic2NwIjoiR3JvdXAuUmVhZC5BbGwgR3JvdXAuUmVhZFdyaXRlLkFsbCBvcGVuaWQgcHJvZmlsZSBUYXNrcy5SZWFkIFRhc2tzLlJlYWRXcml0ZSBVc2VyLlJlYWQgZW1haWwiLCJzaWduaW5fc3RhdGUiOlsia21zaSJdLCJzdWIiOiJ3Qm5fLWEtaTBQbGZwS1VGU3lYNzRHZ0RrQnZKLWRvMVRNX19xbWdpSXBFIiwidGVuYW50X3JlZ2lvbl9zY29wZSI6Ik5BIiwidGlkIjoiYzg1ZTk2OGYtNzI5YS00YjY1LWFiMzktODU0Y2FhYjM4ZTU1IiwidW5pcXVlX25hbWUiOiJQcmVwYXJvckAyeDN0cGIub25taWNyb3NvZnQuY29tIiwidXBuIjoiUHJlcGFyb3JAMngzdHBiLm9ubWljcm9zb2Z0LmNvbSIsInV0aSI6IjMxMXpkcHFWLWs2NmQ1UE8xbXNiQUEiLCJ2ZXIiOiIxLjAiLCJ3aWRzIjpbIjYyZTkwMzk0LTY5ZjUtNDIzNy05MTkwLTAxMjE3NzE0NWUxMCIsImI3OWZiZjRkLTNlZjktNDY4OS04MTQzLTc2YjE5NGU4NTUwOSJdLCJ4bXNfY2MiOlsiQ1AxIl0sInhtc19zc20iOiIxIiwieG1zX3N0Ijp7InN1YiI6IjJ2TnpFZFV0M1NRa05tOFFXcGs2QmJlWXRKcXVrLUpJY05KbDNtQk5sbzQifSwieG1zX3RjZHQiOjE2ODgzNDg4MDN9.i799zUzOVX2H8DYOBpg5oVaS6TotGf1EVzuqUOynPqsOSrCXfoC7jJ9TbHXnUtnQ4d9jCkEpB_OUG9HHV_YY33FRfcvy5P7QAB8ZnQ0cy8BXeGOiEhPYTeraWuXoUGHj2Dhjhqv8VIXXJ9Weg-ZYgWb49IQzRxkfJUiaM7KDWXwg_ruQQJW0CMtPeIT-NFTSbD1Fh8u81mh_X5OHhQyKXWXIZvehJ-P1qKRBJzNvOFikcAAN465Qq7LKAd-mCKG9i91PPaG7AQBfVQClt2Erti2KRMoTD06SVAQIVsvAL0V4nb1brwya8T9d3OXM6puLefew6QtItA5zzroGIbkUXg';
      
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
      console.log(response.json());
    } catch (error) {
      console.error('Error updating task:', error);
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


const filteredData =
  filterStatus === 'All Active'
    ? itemsWithCheckbox.filter(
        (item) => item.status.toLowerCase() === 'in progress' || item.status.toLowerCase() === 'not started'
      )
    : itemsWithCheckbox.filter((item) => item.status.toLowerCase() === 'completed');
        
      
      const token= 'eyJ0eXAiOiJKV1QiLCJub25jZSI6ImlSLWVuTFN1ZW1HVGZtYWNtWFp6YVlPTFhPNGVSank3Z2xZUnR5TldGZG8iLCJhbGciOiJSUzI1NiIsIng1dCI6IjlHbW55RlBraGMzaE91UjIybXZTdmduTG83WSIsImtpZCI6IjlHbW55RlBraGMzaE91UjIybXZTdmduTG83WSJ9.eyJhdWQiOiIwMDAwMDAwMy0wMDAwLTAwMDAtYzAwMC0wMDAwMDAwMDAwMDAiLCJpc3MiOiJodHRwczovL3N0cy53aW5kb3dzLm5ldC9jODVlOTY4Zi03MjlhLTRiNjUtYWIzOS04NTRjYWFiMzhlNTUvIiwiaWF0IjoxNzAwMDMyNzMwLCJuYmYiOjE3MDAwMzI3MzAsImV4cCI6MTcwMDExOTQzMSwiYWNjdCI6MCwiYWNyIjoiMSIsImFpbyI6IkFWUUFxLzhWQUFBQTczUEVzTGJrWm10QUhHdVhlRDBnTWU3ZkV1YS94WWVGRUVrSWZLVFg0aDhsWGQzS2JpRmpMNWplUG1FWG1uSm5VVlJrak5laTU5RGQ1Zm1rQWd0cDZtbExpMjkzbWExZTlhM2ZUMHZyOVFNPSIsImFtciI6WyJwd2QiLCJtZmEiXSwiYXBwX2Rpc3BsYXluYW1lIjoiR3JhcGggRXhwbG9yZXIiLCJhcHBpZCI6ImRlOGJjOGI1LWQ5ZjktNDhiMS1hOGFkLWI3NDhkYTcyNTA2NCIsImFwcGlkYWNyIjoiMCIsImZhbWlseV9uYW1lIjoidml0dGFsIiwiZ2l2ZW5fbmFtZSI6IlNhaSIsImlkdHlwIjoidXNlciIsImlwYWRkciI6IjE4My44Mi4xMTUuMTk5IiwibmFtZSI6IlNhaSB2aXR0YWwiLCJvaWQiOiI3YmE5YTg0Yy0yOGU4LTQ4YWEtYjJmZi03Njc0MDhhMWQxOTUiLCJwbGF0ZiI6IjMiLCJwdWlkIjoiMTAwMzIwMDJCQUUzNjZGRSIsInJoIjoiMC5BYmNBajVaZXlKcHlaVXVyT1lWTXFyT09WUU1BQUFBQUFBQUF3QUFBQUFBQUFBQzNBS00uIiwic2NwIjoiR3JvdXAuUmVhZC5BbGwgR3JvdXAuUmVhZFdyaXRlLkFsbCBvcGVuaWQgcHJvZmlsZSBUYXNrcy5SZWFkIFRhc2tzLlJlYWRXcml0ZSBVc2VyLlJlYWQgZW1haWwiLCJzaWduaW5fc3RhdGUiOlsia21zaSJdLCJzdWIiOiJ3Qm5fLWEtaTBQbGZwS1VGU3lYNzRHZ0RrQnZKLWRvMVRNX19xbWdpSXBFIiwidGVuYW50X3JlZ2lvbl9zY29wZSI6Ik5BIiwidGlkIjoiYzg1ZTk2OGYtNzI5YS00YjY1LWFiMzktODU0Y2FhYjM4ZTU1IiwidW5pcXVlX25hbWUiOiJQcmVwYXJvckAyeDN0cGIub25taWNyb3NvZnQuY29tIiwidXBuIjoiUHJlcGFyb3JAMngzdHBiLm9ubWljcm9zb2Z0LmNvbSIsInV0aSI6ImJaZHRuWnl0MDBDeE5XR0phQUxLQUEiLCJ2ZXIiOiIxLjAiLCJ3aWRzIjpbIjYyZTkwMzk0LTY5ZjUtNDIzNy05MTkwLTAxMjE3NzE0NWUxMCIsImI3OWZiZjRkLTNlZjktNDY4OS04MTQzLTc2YjE5NGU4NTUwOSJdLCJ4bXNfY2MiOlsiQ1AxIl0sInhtc19zc20iOiIxIiwieG1zX3N0Ijp7InN1YiI6IjJ2TnpFZFV0M1NRa05tOFFXcGs2QmJlWXRKcXVrLUpJY05KbDNtQk5sbzQifSwieG1zX3RjZHQiOjE2ODgzNDg4MDN9.S5zxPiRde1pr2ivBuOtk8PMIOYkGFQy3bMnu0xi0x1fNKDMxA8VO8bmzK4iZELJeqCpmDvneb6okRN6Zf1xg9XE1y6RdIVgPtU0VXciTFvzICfi8braglwhjIXBpjkNQuWX6QJyi51wt5LXCj1BE7Vq0kNVgo4aOnikmIzrHX6jZ1EgWCM1w6HmmQdna9ovkiqSXj3upLn0Ifo1iuQjv9evBPfjMhUa2t6kBL7fo42wJsO5VK8rUAtpr_9bHE0xx5D7EvaXdHgvNIlyW58WjFag-nhVflN8YHi_W06abpJD5yQ4NiGWFfUQHNGsZe8ZIx2oJmHb3s595zOw5hMAL-Q';
        const clientConnection = Client.init({
          authProvider: (done) => {
            done(null, token);
          },
        });


    
      // Call getPlans when the component mounts or when item changes

    

  return (

<FluentProvider theme={teamsLightTheme}>
  <div className='empty-block'>

  </div>
  <div className="plainText" style={{ display: 'flex', gap: '10px' }}>

<div style={{ display: 'flex', width: '100%', flex: '1'  }}>
{isItemSelected  && <div className={`red-background ${isDivVisible ? 'visible' : 'hidden'}`} style={{  display: 'flex', gap: '10px', marginTop: '0', padding: '10px', width:'70%' }}>
      <Menu>
        <MenuTrigger disableButtonEnhancement>
          <MenuButton appearance="transparent" icon={<Checkmark24Regular />}>
            Progress
          </MenuButton>
        </MenuTrigger>

        <MenuPopover>
          <MenuList>
            <MenuItem>Not Started</MenuItem>
            <MenuItem>In Progress</MenuItem>
            <MenuItem>Completed</MenuItem>
          </MenuList>
        </MenuPopover>
      </Menu>
      <Menu>
        <MenuTrigger disableButtonEnhancement>
          <MenuButton appearance="transparent" icon={<Important20Filled />}>
            Priority
          </MenuButton>
        </MenuTrigger>

        <MenuPopover>
          <MenuList>
            <MenuItem>Urgent</MenuItem>
            <MenuItem>Important</MenuItem>
            <MenuItem>Medium</MenuItem>
            <MenuItem>Low</MenuItem>
          </MenuList>
        </MenuPopover>
      </Menu>
      <Button appearance="transparent" icon={<Delete16Regular />}>
        Delete
      </Button>

  </div>}
      <div style={{ marginLeft: '10px', width:'30%', flex: '1' }}>
      <Button appearance="transparent" icon={<Add20Regular rotate={180} />} onClick={handleSelectedButtonClick}>
        Selected
      </Button>
  
      <Menu>
        <MenuTrigger disableButtonEnhancement>
          <MenuButton appearance="transparent" icon={<Checkmark24Regular />}>
            Apply Filter
          </MenuButton>
        </MenuTrigger>

        <MenuPopover>
          <MenuList onChange={(ev, item) => setFilterStatus(item.key)}>
            <MenuItem onSelect={() => handleFilterChange('All Active')}>All Active</MenuItem>
            <MenuItem onSelect={() => handleFilterChange('Completed')}>Completed</MenuItem>
          </MenuList>
        </MenuPopover>
      </Menu>
  </div>
  </div>
  </div>
<PrimaryButton text="New Task" onClick={openDialog} style={{ background: 'rgb(98, 100, 167)', color: 'white', borderBlockColor: 'rgb(98, 100, 167)' }} />



<Dropdown
    label=""
    selectedKey={filterStatus}
    options={statusOptions}
    onChange={(ev, item) => setFilterStatus(item.key)}
    styles={{ dropdown: { width: 200 } }}
  />


    <DataGrid 
    items={filteredData}
    columns={[
      {
        key:"column0",
        header:"Checkbox",
        field:"checked"
      },
      {
        key:"column1",
        header:"Task Title",
        field:"taskTitle"
      },
      ...columns.slice(2)
    ]} 
        // Add other properties as neede

    />
      <div>
      <div>Plan Name: {planName}</div>

    </div>
       
      
<Dialog
        hidden={!showDialog}
        onDismiss={closeDialog}
        styles={{backgroundColor: 'rgb(98, 100, 167)', minWidth:'80%' } }
        dialogContentProps={{
          title: 'New Task',
          backgroundColor:'rgb(98, 100, 167)',
        }}
          modalProps={{
    isBlocking: false, 
  }}
      >
    <Stack styles={{ root: { width: '100%', padding: '20px', objectFit:'center' } }}
    tokens={{ childrenGap: 40 }}
    >
    <Stack horizontal verticalAlign="center" tokens={{ childrenGap: 10 }}>
      <CheckboxFunctionality
        checked={selectedTask?.checked}
        onChange={(ev, checked) => handleCheckboxChange(checked)}
      />
      <TextField variant="xLarge">{selectedTask?.taskTitle}</TextField>
    </Stack>
          <TextField
            label="Task Title"
            value={formData.taskTitle}
            onChange={(e, newValue) =>
              handleInputChange('taskTitle', newValue)
            }
          />
          <TextField
            label="Assigned To"
            value={formData.assignedTo}
            onChange={(e, newValue) =>
              handleInputChange('assignedTo', newValue)
            }
          />
          <TextField
            label="Status"
            value={formData.status}
            onChange={(e, newValue) => handleInputChange('status', newValue)}
          />
          <PrimaryButton text="Add Task" onClick={handleAddTask} style={{ background: 'rgb(98, 100, 167)', color: 'white' }} />
          <DefaultButton text="Close" onClick={closeDialog} style={{ background: 'rgb(98, 100, 167)', color: 'white' }} />
        </Stack>
      </Dialog>

      <Dialog
  hidden={!showEditDialog}
  onDismiss={closeDialog}
  dialogContentProps={{
  title: 'Edit Task',
  //subText: 'Make changes to the task details below.',
  maxWidth:'100%',
  }}
  modalProps={{
    isBlocking: false, 
    styles: { main: { maxWidth: '80%', maxHeight: '80%' } },
  }}
  
>
<Stack styles={{ root: { width: '80%', padding: '20px' } }}
    tokens={{ childrenGap: 20 }}>
        <Stack horizontal verticalAlign="center" tokens={{ childrenGap: 10 }}>
        <Checkbox
        checked={selectedTask?.checked}
        onChange={(ev, checked) => toggleCheckbox(checked)}
        shape='circular'
      />
            <TextField
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
                <span className={mergeStyles({ fontSize: 16, paddingRight: 8 })}>Assigned To:</span>
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
        {/* <Stack.Item>
          <Stack horizontal tokens={{ childrenGap: 20 }}>
            <Stack.Item>
              <DatePicker
                label="Start Date"
                placeholder="Select a date..."
                value={startDate}
                onSelectDate={handleStartDateChange}
              />
            </Stack.Item>
            <Stack.Item>
              <DatePicker
                label="Due Date"
                placeholder="Select a date..."
                value={dueDate}
                onSelectDate={handleDueDateChange}
              />
            </Stack.Item>
          </Stack>
        </Stack.Item> */}
        <Stack.Item>
          <Stack horizontal tokens={{ childrenGap: 20 }}>
            <Stack.Item>
              <Dropdown
                label="Bucket"
                selectedKey={selectedBucket}
                defaultValue={selectedBucket}
                placeholder="Select a bucket"
                options={bucketOptions}
                onChange={handleBucketChange}
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
          <TextField label="Notes" multiline autoAdjustHeight value={notes} onChange={(ev, val) => setNotes(val)} />
        </Stack.Item>
        <Stack.Item>
          <TextField label="Comments" multiline autoAdjustHeight value={comments} onChange={(ev, val) => setComments(val)} />
        </Stack.Item>
        <Stack.Item align="end">
          <DefaultButton text="Save" onClick={handleEditSave} styles={{ root: { background: 'rgb(98, 100, 167)', color: 'white' } }} />
          <DefaultButton text="Close" onClick={closeDialog} styles={{ root: { background: 'rgb(98, 100, 167)', color: 'white', marginLeft: '8px' } }} />
        </Stack.Item>
      </Stack>
</Dialog>

    </FluentProvider>
    /* <div className="section-margin">
    <table>
        <thead>
          <tr>
            <th>Task Title</th>
            <th>Due Date</th>
           
          </tr>
        </thead>
        <tbody>
          {tasks.map((task) => (
            <tr key={task.id}>
              <td>{task.title}</td>
              <td>{task.dueDateTime ? new Date(task.dueDateTime).toLocaleDateString() : 'N/A'}</td>
            </tr>
          ))}
        </tbody>
      </table>
      </div> */
      /* <h1>Planner Tasks</h1>
      {error && <p>{error}</p>}
      <table>
        <thead>
          <tr>
            <th>Task Title</th>
            <th>Due Date</th>
           
          </tr>
        </thead>
        <tbody>
          {tasks.map((task) => (
            <tr key={task.id}>
              <td>{task.title}</td>
              <td>{task.dueDateTime ? new Date(task.dueDateTime).toLocaleDateString() : 'N/A'}</td>
              
            </tr>
          ))}
        </tbody>
      </table> */
  );
};

export default PlannerTasksTable;