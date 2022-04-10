import React, { useState } from "react";
import { useForm, Controller } from "react-hook-form";
import { AutoComplete } from "primereact/autocomplete";
import { Button } from "primereact/button";

import { useRequestContext } from "../context/RequestContext";

export const AssignGroup = ({
  selectedRequest: { id, assignedGroupId },
  hideModel,
}) => {
  const { groups, updateRequestGroup } = useRequestContext();
  const [filteredGroups, setFilteredGroups] = useState(groups);

  const defaultGroup = groups.find(
    (group) => group.assignedGroupId === assignedGroupId
  );

  const { control, handleSubmit, reset } = useForm({
    groupName: defaultGroup,
  });
  const itemTemplate = (item) => {
    return (
      <div>
        <div>{item.groupName}</div>
      </div>
    );
  };
  const searchGroups = (event) => {
    setTimeout(() => {
      let filteredGroups;
      if (!event.query.trim().length) {
        filteredGroups = [...groups];
      } else {
        filteredGroups = groups.filter((group) => {
          return group.groupName
            .toLowerCase()
            .startsWith(event.query.toLowerCase());
        });
      }

      setFilteredGroups(filteredGroups);
    }, 250);
  };
  const onSubmit = (data) => {
    updateRequestGroup({ ...data.group, id });
    hideModel(id);
    reset();
  };

  return (
    <div className="model-container">
      <form onSubmit={handleSubmit(onSubmit)} className="p-fluid">
        <Controller
          name="group"
          control={control}
          rules={{ required: "groupName is required." }}
          render={({ field, fieldState }) => (
            <AutoComplete
              value={field.value}
              suggestions={filteredGroups}
              completeMethod={searchGroups}
              field="groupName"
              dropdown
              forceSelection
              itemTemplate={itemTemplate}
              onChange={(e) => field.onChange(e.value)}
            />
          )}
        />
        <div className="footer-buttons">
          <Button
            label="Cancel"
            className="mt-1 footer-button"
            onClick={() => hideModel()}
          />
          <Button type="submit" label="Save" className="mt-1 footer-button" />
        </div>
      </form>
    </div>
  );
};
