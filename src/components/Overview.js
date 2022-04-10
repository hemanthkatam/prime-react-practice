import "primeicons/primeicons.css";
import "primereact/resources/themes/lara-light-indigo/theme.css";
import "primereact/resources/primereact.css";
import "primeflex/primeflex.css";

import React, { useState, useRef } from "react";
import { DataTable } from "primereact/datatable";
import { Column } from "primereact/column";
import { Dialog } from "primereact/dialog";
import { Ripple } from "primereact/ripple";
import { Dropdown } from "primereact/dropdown";
import { InputText } from "primereact/inputtext";
import { classNames } from "primereact/utils";
import { Toast } from "primereact/toast";

import { useRequestContext } from "../context/RequestContext";
import { AssignGroup } from "./assign-groups";

export const Overview = () => {
  const [rows1, setRows1] = useState(10);
  const [first1, setFirst1] = useState(0);
  const [currentPage, setCurrentPage] = useState(1);
  const [showGroup, setShowGroup] = useState(false);
  const [selectedRequest, setSelectedRequest] = useState(null);
  const [pageInputTooltip, setPageInputTooltip] = useState(
    "Press 'Enter' key to go to this page."
  );
  const toast = useRef(null);
  const { requests } = useRequestContext();

  const onCustomPage1 = (event) => {
    setFirst1(event.first);
    setRows1(event.rows);
    setCurrentPage(event.page + 1);
  };
  const template1 = {
    layout:
      "PrevPageLink PageLinks NextPageLink RowsPerPageDropdown CurrentPageReport",
    PrevPageLink: (options) => {
      return (
        <button
          type="button"
          className={options.className}
          onClick={options.onClick}
          disabled={options.disabled}
        >
          <span className="p-3">Previous</span>
          <Ripple />
        </button>
      );
    },
    NextPageLink: (options) => {
      return (
        <button
          type="button"
          className={options.className}
          onClick={options.onClick}
          disabled={options.disabled}
        >
          <span className="p-3">Next</span>
          <Ripple />
        </button>
      );
    },
    PageLinks: (options) => {
      if (
        (options.view.startPage === options.page &&
          options.view.startPage !== 0) ||
        (options.view.endPage === options.page &&
          options.page + 1 !== options.totalPages)
      ) {
        const className = classNames(options.className, { "p-disabled": true });

        return (
          <span className={className} style={{ userSelect: "none" }}>
            ...
          </span>
        );
      }

      return (
        <button
          type="button"
          className={options.className}
          onClick={options.onClick}
        >
          {options.page + 1}
          <Ripple />
        </button>
      );
    },
    RowsPerPageDropdown: (options) => {
      const dropdownOptions = [
        { label: 5, value: 5 },
        { label: 10, value: 10 },
        { label: 25, value: 25 },
      ];

      return (
        <Dropdown
          value={options.value}
          options={dropdownOptions}
          onChange={options.onChange}
        />
      );
    },
    CurrentPageReport: (options) => {
      return (
        <span
          className="mx-3"
          style={{ color: "var(--text-color)", userSelect: "none" }}
        >
          Go to{" "}
          <InputText
            size="2"
            className="ml-1"
            value={currentPage}
            tooltip={pageInputTooltip}
            onKeyDown={(e) => onPageInputKeyDown(e, options)}
            onChange={onPageInputChange}
          />
        </span>
      );
    },
  };

  const onPageInputKeyDown = (event, options) => {
    if (event.key === "Enter") {
      const page = parseInt(currentPage);
      if (page < 0 || page > options.totalPages) {
        setPageInputTooltip(
          `Value must be between 1 and ${options.totalPages}.`
        );
      } else {
        const first = currentPage ? options.rows * (page - 1) : 0;
        setFirst1(first);
        setPageInputTooltip("Press 'Enter' key to go to this page.");
      }
    }
  };

  const onPageInputChange = (event) => {
    setCurrentPage(event.target.value);
  };

  const onRequestClick = (e) => {
    setSelectedRequest(e.data);
    setShowGroup(true);
  };

  const hideModel = (id = false) => {
    if (id) {
      showSuccess(id);
    }
    setShowGroup(false);
  };
  const showSuccess = (id) => {
    toast.current.show({
      severity: "success",
      detail: `The request was assigned to Innovation & Technology ${id}`,
      life: 3000,
    });
  };

  return (
    <div>
      <Toast ref={toast} position="top-center" />
      <Dialog
        visible={showGroup}
        style={{ width: "50vw", height: "40vw" }}
        // footer={renderFooter("displayBasic")}
        header={<div className="autocomplete-header">Assign to group</div>}
        onHide={hideModel}
      >
        <AssignGroup selectedRequest={selectedRequest} hideModel={hideModel} />
      </Dialog>
      <DataTable
        value={requests}
        paginator
        paginatorTemplate={template1}
        first={first1}
        rows={rows1}
        onPage={onCustomPage1}
        responsiveLayout="scroll"
        onRowClick={onRequestClick}
      >
        <Column
          field="requestNumber"
          header="Request #"
          sortable
          frozen
        ></Column>
        <Column field="requestTypeName" header="Type" sortable frozen></Column>
        <Column
          field="receivedDateTime"
          header="Date/Time"
          sortable
          dataType="date"
        ></Column>
        <Column field="priorityCode" header="Priority" sortable></Column>
        <Column field="address" header="Location" sortable></Column>
        <Column field="groupName" header="Group" sortable></Column>
        <Column field="statusCode" header="Status" sortable></Column>
        <Column field="title" header="Title" sortable></Column>
        <Column field="citizenName" header="Citizen" sortable></Column>
        <Column field="parcelId" header="Tax parcel" sortable></Column>
        <Column
          field="dueDateTime"
          header="Due Date/Time"
          sortable
          dataType="date"
        ></Column>
      </DataTable>
    </div>
  );
};
