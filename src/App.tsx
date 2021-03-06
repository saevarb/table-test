import React, { useMemo, useCallback, useEffect } from "react";
import logo from "./logo.svg";
import "./App.css";
import payload from "./payload.json";
import { ContractOverview, Contract, Order } from "./types";
import {
  useTable,
  Column,
  useExpanded,
  Row,
  useFilters,
  useGlobalFilter,
  useGroupBy,
  ColumnInstance,
  Cell,
  useRowSelect,
  useColumnOrder,
  useSortBy
} from "react-table";

const rawPayload: ContractOverview[] = payload as any;

const numFormatter = new Intl.NumberFormat("da-DK", {
  style: "currency",
  currency: "DKK"
});

type RowType = ContractOverview & Contract;

let testPayload: RowType[] = [];

const first = rawPayload[0];
for (let i = 0; i < 5; i++) {
  for (const contract of first.contracts) {
    const blah = { ...first, customerRpi: first.customerRpi + i };
    testPayload.push({
      ...blah,
      ...{ ...contract, contractRpi: contract.contractRpi + i }
    });
  }
}

console.log(testPayload);

const displaySingleAggregator = (
  columnValues: any[],
  rows: Row<RowType>[],
  isAggregated: boolean
) => {
  const unique = new Set(columnValues);
  if (unique.size === 1) {
    return { single: `${columnValues[0]}` };
  }
  return { many: unique.size };
};

const renderSingleAgg = ({
  value: { many, single }
}: {
  value: { many: any; single: any };
}) => {
  if (many) {
    return <span className="fade">{`${many} different values`}</span>;
  } else {
    return single;
  }
};

const currencyRenderer = ({ value }: { value: number }) => {
  return numFormatter.format(value);
};

// "customerRpi": "2781",
// "companyCodeName": "itelligence DK",
// "companyCodeNumber": "1200",
const overviewColDefs: Column<RowType>[] = [
  {
    Header: "Customer/contract",
    id: "customerContract",
    // accessor: row => `${row.customerName}-${row.contractRpi}`,
    accessor: row => row.customerName,
    // aggregateValue: (val: any) => console.log(val),
    Cell: (table: any) => {
      // console.log("cell:", table.value, table.cell);
      // const [companyName, cRpi] = table.cell.value.split("-");
      console.log(table.row.values);
      if (table.cell.isAggregated) {
        // return "aggregated";
        return table.value;
      }
      if (table.cell.isPlaceholder) {
        return table.row.values.contractRpi;
      }
      if (table.cell.isGrouped) {
        return table.value;
      }
      return table.value;
    }
  },
  {
    Header: "Contract RPI",
    accessor: "contractRpi"
  },
  {
    Header: "Code name",
    accessor: "companyCodeName",
    aggregate: displaySingleAggregator,
    Aggregated: renderSingleAgg
  },
  {
    Header: "Code number",
    accessor: "companyCodeNumber",
    aggregate: displaySingleAggregator,
    Aggregated: renderSingleAgg
  },
  {
    Header: "Sales rep",
    accessor: "salesResponsible",
    aggregate: displaySingleAggregator,
    Aggregated: renderSingleAgg
  },
  {
    Header: "Revenue",
    disableGroupBy: true,
    aggregate: "sum",
    Aggregated: currencyRenderer,
    Cell: currencyRenderer,
    accessor: "totalRevenueBigDecimal"
  },
  {
    Header: "Cost",
    disableGroupBy: true,
    aggregate: "sum",
    Aggregated: currencyRenderer,
    Cell: currencyRenderer,
    accessor: "totalCostBigDecimal"
  },
  {
    Header: "Type",
    accessor: "contractTypeCode",
    aggregate: displaySingleAggregator,
    Aggregated: renderSingleAgg
  },
  {
    Header: "Product Type",
    accessor: "productType",
    aggregate: displaySingleAggregator,
    Aggregated: renderSingleAgg
  },
  {
    Header: "Invoice cycle",
    accessor: "invoicingCycle",
    aggregate: displaySingleAggregator,
    Aggregated: renderSingleAgg
  }
];

const renderGrouper = (col: ColumnInstance<RowType>) => {
  if (col.canGroupBy) {
    return (
      <span {...col.getGroupByToggleProps()}>{col.isGrouped ? "-" : "+"}</span>
    );
  }
  return null;
};

const renderGroupedCell = (cell: Cell<RowType>, row: Row<RowType>) => {
  return (
    <>
      {row.isExpanded ? "↓" : "→"} {cell.render("Cell")}{" "}
      {`(${row.subRows.length})`}
    </>
  );
};

const renderAggCell = (cell: Cell<RowType>, row: Row<RowType>) => {
  return cell.render("Aggregated");
};

const renderCell = (cell: Cell<RowType>, row: Row<RowType>) => {
  const foo = cell.column.isGrouped ? "boundary" : "";
  return (
    <td className={`cell-${cell.column.id} ${foo}`} {...cell.getCellProps()}>
      {cell.column.id === "customerContract"
        ? cell.render("Cell")
        : cell.isGrouped
        ? renderGroupedCell(cell, row)
        : cell.isAggregated
        ? renderAggCell(cell, row)
        : cell.isPlaceholder
        ? null
        : cell.render("Cell")}
    </td>
  );
};

const renderSorter = (col: ColumnInstance<RowType>) => {
  if (!col.canSort) return null;
  let char;
  if (col.isSortedDesc === undefined) {
    char = "-";
  }
  char = char ?? (col.isSortedDesc ? "↑" : "↓");
  return <span {...col.getSortByToggleProps()}>{char}</span>;
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
    visibleColumns,
    state,
    setColumnOrder,
    allColumns
  } = useTable<RowType>(
    {
      columns: cols,
      data: data,
      initialState: {
        groupBy: ["customerContract"],
        hiddenColumns: ["contractRpi"],
        columnOrder: []
      }
    },
    useFilters,
    useGlobalFilter,
    useGroupBy,
    useSortBy,
    useExpanded,
    useColumnOrder,
    useRowSelect
  );

  // useEffect(() => {
  //   console.log("groupby changed");
  //   for (const col of allColumns) {
  //     console.log(col);
  //   }
  // }, [state.groupBy]);

  // const handleDragEnter = (event: Han)
  const handleDragOver = (data: DataTransfer) => {
    console.log(data.getData("text/plain"));
  };

  const handleDragEnter = (data: DataTransfer) => {
    console.log(data.getData("text/plain"));
  };

  const handleDragStart = (data: DataTransfer, id: string) => {
    console.log(id);
    data.setData("text/plain", id);
    data.dropEffect = "move";
  };

  const handleDrop = (data: DataTransfer) => {
    console.log("dropping");
    console.log(data.getData("text/plain"));
  };

  return (
    <>
      <table {...getTableProps()}>
        <thead>
          {headerGroups.map(hg => (
            <tr {...hg.getHeaderGroupProps()}>
              {hg.headers.map(col => (
                <th
                  draggable
                  onDragEnter={ev => handleDragEnter(ev.dataTransfer)}
                  onDragStart={ev => handleDragStart(ev.dataTransfer, col.id)}
                  onDragOver={ev => {
                    ev.preventDefault();
                    return handleDragOver(ev.dataTransfer);
                  }}
                  onDrop={ev => {
                    ev.preventDefault();
                    return handleDrop(ev.dataTransfer);
                  }}
                  {...col.getHeaderProps()}
                >
                  {renderGrouper(col)} {col.render("Header")}{" "}
                  {renderSorter(col)}
                </th>
              ))}
            </tr>
          ))}
        </thead>
        <tbody {...getTableBodyProps()}>
          {rows.map(row => {
            prepareRow(row);
            // console.log(row);
            return (
              <>
                <tr
                  className={row.isGrouped ? "grouped" : "not-grouped"}
                  {...row.getRowProps()}
                  {...row.getToggleRowExpandedProps()}
                >
                  {row.cells.map(cell => renderCell(cell, row))}
                </tr>
                {row.isExpanded && row.subRows.length === 0 ? (
                  <tr>
                    <td className="subtable" colSpan={visibleColumns.length}>
                      <h3>Orders</h3>
                      <OrderTable orders={row.original.orders} />
                    </td>
                  </tr>
                ) : null}
              </>
            );
          })}
        </tbody>
      </table>
      <pre>{JSON.stringify(state, null, 2)}</pre>
    </>
  );
};

function App() {
  return (
    <div className="table-wrapper">
      <OverviewTable></OverviewTable>
    </div>
  );
}

interface ContractTableProps {
  orders: Order[];
}

const contractColDefs: Column<Order>[] = [
  { Header: "Signature", accessor: "customerSignatureDate" },
  { Header: "Start", accessor: "orderStartDate" },
  { Header: "End", accessor: "orderEndDate" },
  { Header: "WBS", accessor: "wbsNumber" }

  // { Header: "RPI", accessor: "contractRpi" },
  // { Header: "Sales rep.", accessor: "salesResponsible" },
  // { Header: "Type", accessor: "contractTypeCode" },
  // { Header: "Invoice cycle", accessor: "invoicingCycle" },
  // { Header: "Revenue", accessor: "totalRevenue" },
  // { Header: "Cost", accessor: "totalCost" },
  // { Header: "Product Type", accessor: "productType" }
];

const OrderTable = (props: ContractTableProps) => {
  console.log(props.orders);
  const data = useMemo(() => props.orders, [props]);
  const cols = useMemo(() => contractColDefs, []);

  const {
    headerGroups,
    prepareRow,
    getTableProps,
    getTableBodyProps,
    rows
  } = useTable<Order>({
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
            <tr {...row.getRowProps()}>
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

export default App;
