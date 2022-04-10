import React, { createContext, useEffect, useState } from "react";
import RequestsService from "../services/request-services";
import { uniqBy } from "loadsh";

const service = new RequestsService();
export const RequestContext = createContext({
  requests: [],
  groups: [],
  updateRequestGroup: () => {},
});

export const RequestDataProvider = ({ children }) => {
  const [requests, setRequests] = useState([]);
  const [groups, setGroups] = useState([]);

  const updateRequestGroup = ({ id, assignedGroupId, groupName }) => {
    const groupIndex = requests.findIndex((request) => request.id === id);
    if (groupIndex > -1) {
      requests[groupIndex] = {
        ...requests[groupIndex],
        assignedGroupId,
        groupName,
      };
      setRequests(requests.slice());
    }
  };
  const fetchRequests = async () => {
    service.getRequestsDate().then((data) => {
      const groupData = data.map(({ groupName, assignedGroupId }) => ({
        groupName,
        assignedGroupId,
      }));
      const groupDetails = uniqBy(groupData, "assignedGroupId");
      setGroups(groupDetails);
      const reqData = data.map((request) => ({
        ...request,
        dueDateTime: new Date(request.dueDateTime).toLocaleString(),
        receivedDateTime: new Date(request.receivedDateTime).toLocaleString(),
      }));
      setRequests(reqData);
    });
  };
  useEffect(() => {
    fetchRequests();
  }, []);
  return (
    <RequestContext.Provider value={{ requests, groups, updateRequestGroup }}>
      {children}
    </RequestContext.Provider>
  );
};
