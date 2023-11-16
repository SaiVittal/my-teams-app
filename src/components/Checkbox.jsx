import React, { useState } from "react";
import { Checkbox } from "@fluentui/react-components";

export const CheckboxFunctionality = ({onCheckboxChange}) => {
  const [checked, setChecked] = useState(true);

  return (
    <Checkbox
      checked={checked}
      onChange={(ev, data) => onCheckboxChange(data.checked)}
      label= {checked}
      shape="circular"
    />
  );
};