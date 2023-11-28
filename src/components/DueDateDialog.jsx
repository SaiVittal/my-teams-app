import * as React from "react";
import { DatePicker } from "@fluentui/react-datepicker-compat";
import { Dialog, DialogBody, DialogContent, DialogActions, DialogTitle, DialogTrigger, Button, makeStyles } from "@fluentui/react-components";
import { Calendar24Regular } from "@fluentui/react-icons";

const useStyles = makeStyles({
  control: {
    maxWidth: "300px",
  },
});

const DueDateDialog = ({ isOpen, onDismiss }) => {
  const styles = useStyles();

  return (
    <Dialog isOpen={isOpen} onDismiss={onDismiss} modalType="normal" minwidth="400" width="40%">
      <DialogTrigger>
        <Button appearance="transparent" icon={<Calendar24Regular />}>
          Due Date
        </Button>
      </DialogTrigger>
      <DialogTitle>Due Date</DialogTitle>
      <DialogContent>
        <DatePicker
          showWeekNumbers={true}
          firstWeekOfYear={1}
          showMonthPickerAsOverlay={true}
          placeholder="Select a date..."
          className={styles.control}
        />
      </DialogContent>
      <DialogActions>
        <Button onClick={onDismiss} appearance="primary">
          Save
        </Button>
        <Button onClick={onDismiss} appearance="secondary">
          Cancel
        </Button>
      </DialogActions>  
    </Dialog>
  );
};

export default DueDateDialog;
