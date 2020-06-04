import React, { useMemo, useCallback } from "react";
import logo from "./logo.svg";
import "./App.css";
import payload from "./payload.json";
import { ContractOverview, Contract, Joined } from "./types";
import { useTable, Column, useExpanded, Row } from "react-table";

const rawPayload: ContractOverview[] = payload as any;

type RowType = ContractOverview;

let testPayload: RowType[] = [];

for (let i = 0; i < 10; i++) {
  testPayload.push(rawPayload[0]);
}

console.log(testPayload);

// "customerRpi": "2781",
// "companyCodeName": "itelligence DK",
// "companyCodeNumber": "1200",
const overviewColDefs: Column<RowType>[] = [
  {
    Header: "Customer",
    id: "customer_header",
    columns: [
      { Header: "Name", accessor: "customerName" },
      { Header: "RPI", accessor: "customerRpi" }
    ]
  },
  {
    Header: "Company",
    id: "company_header",
    columns: [
      { Header: "Code name", accessor: "companyCodeName" },
      { Header: "Code number", accessor: "companyCodeNumber" }
    ]
  }
];

const contractColDefs: Column<Contract>[] = [
  { Header: "RPI", accessor: "contractRpi" },
  { Header: "Sales rep.", accessor: "salesResponsible" },
  { Header: "Type", accessor: "contractTypeCode" },
  { Header: "Invoice cycle", accessor: "invoicingCycle" },
  { Header: "Revenue", accessor: "totalRevenue" },
  { Header: "Cost", accessor: "totalCost" },
  { Header: "Product Type", accessor: "productType" }
];

interface ContractTableProps {
  contracts: Contract[];
}

const ContractTable = (props: ContractTableProps) => {
  console.log(props.contracts);
  const data = useMemo(() => props.contracts, [props]);
  const cols = useMemo(() => contractColDefs, []);

  const {
    headerGroups,
    prepareRow,
    getTableProps,
    getTableBodyProps,
    rows
  } = useTable<Contract>({
    columns: cols,
    data: data
  });

  return (
    <table {...getTableProps()}>
      <thead>
        {headerGroups.map(hg => (
          <tr {...hg.getHeaderGroupProps()}>
            {hg.headers.map(col => (
              <th {...col.getHeaderProps()}>
                <div>{col.render("Header")}</div>
              </th>
            ))}
          </tr>
        ))}
      </thead>
      <tbody {...getTableBodyProps()}>
        {rows.map(row => {
          prepareRow(row);
          return (
            <tr
              className={
                row.original.contractStatus === "Active"
                  ? "contract-active"
                  : "contract-inactive"
              }
              {...row.getRowProps()}
            >
              {row.cells.map(cell => (
                <td {...cell.getCellProps()}>{cell.render("Cell")}</td>
              ))}
            </tr>
          );
        })}
      </tbody>
    </table>
  );
};

const OverviewTable = () => {
  const cols = useMemo(() => overviewColDefs, []);
  const data = useMemo(() => testPayload, []);

  const {
    headerGroups,
    prepareRow,
    getTableProps,
    getTableBodyProps,
    rows,
    visibleColumns
  } = useTable<RowType>(
    {
      columns: cols,
      data: data,
      initialState: {
        expanded: {
          "0": true
        },
        hiddenColumns: [
          // "contract_header",
          // "order_header",
          // "product_header",
          // "contractRpi",
          // "salesResponsible"
        ]
      }
    },
    useExpanded
  );

  const renderSub = useCallback((row: Row<RowType>) => {
    return <ContractTable contracts={row.original.contracts}></ContractTable>;
  }, []);
  // state.hiddenColumns

  return (
    <table {...getTableProps()}>
      <thead>
        {headerGroups.map(hg => (
          <tr {...hg.getHeaderGroupProps()}>
            {hg.headers.map(col => (
              <th {...col.getHeaderProps()}>
                <div>{col.render("Header")}</div>
              </th>
            ))}
          </tr>
        ))}
      </thead>
      <tbody {...getTableBodyProps()}>
        {rows.map(row => {
          prepareRow(row);
          return (
            <>
              <tr
                {...{
                  ...row.getRowProps(),
                  ...row.getToggleRowExpandedProps()
                }}
              >
                <>
                  {row.cells.map(cell => (
                    <td {...cell.getCellProps()}>{cell.render("Cell")}</td>
                  ))}
                </>
              </tr>
              {row.isExpanded ? (
                <tr>
                  <td colSpan={visibleColumns.length}>{renderSub(row)}</td>
                </tr>
              ) : null}
            </>
          );
        })}
      </tbody>
    </table>
  );
};

function App() {
  return (
    <div>
      <OverviewTable></OverviewTable>
    </div>
  );
}

export default App;
