import React, { useState } from 'react';
import { Dropdown, PrimaryButton } from '@fluentui/react';
import { teamsLightTheme, FluentProvider } from '@fluentui/react-components';

const MenuBar = ({selectedTask}) => {
    const [isMenuBarVisible, setIsMenuBarVisible] = useState(false);

  const handleProgressChange = (ev, item) => {
    console.log('Progress selected:', item.key);
    // Handle progress change logic here
  };

  const handlePriorityChange = (ev, item) => {
    console.log('Priority selected:', item.key);
    // Handle priority change logic here
  };

  const handleDelete = () => {
    console.log('Delete clicked');
    // Handle delete logic here
  };

  const progressOptions = [
    { key: 'NotStarted', text: 'Not Started' },
    { key: 'InProgress', text: 'In Progress' },
    { key: 'Completed', text: 'Completed' },
  ];

  const priorityOptions = [
    { key: 'Urgent', text: 'Urgent' },
    { key: 'Important', text: 'Important' },
    { key: 'Medium', text: 'Medium' },
    { key: 'Low', text: 'Low' },
  ];

  return (
    <FluentProvider theme={teamsLightTheme}>
      <div style={{ display: isMenuBarVisible ? 'flex' : 'none', justifyContent: 'space-between', padding: '10px' }}>
        <Dropdown
          label="Progress"
          options={progressOptions}
          onChange={handleProgressChange}
          styles={{ dropdown: { width: 150 } }}
        />
        <Dropdown
          label="Priority"
          options={priorityOptions}
          onChange={handlePriorityChange}
          styles={{ dropdown: { width: 150 } }}
        />
        <PrimaryButton text="Delete" onClick={handleDelete} />
      </div>
    </FluentProvider>
  );
};

export default MenuBar;
