import React, { useMemo, useCallback, useEffect } from "react";
import logo from "./logo.svg";
import "./App.css";
import payload from "./payload.json";
import { ContractOverview, Contract } from "./types";
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
  useColumnOrder
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
    Header: "Customer",
    id: "customer_header",
    columns: [
      {
        Header: "Name",
        accessor: "customerName",
        aggregate: displaySingleAggregator,
        Aggregated: renderSingleAgg
      },
      {
        Header: "RPI",
        accessor: "customerRpi",
        aggregate: displaySingleAggregator,
        Aggregated: renderSingleAgg
      }
    ]
  },
  {
    Header: "Company",
    id: "company_header",
    columns: [
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
      }
    ]
  },
  {
    Header: "Contract",
    columns: [
      {
        Header: "Contract RPI",
        accessor: "contractRpi",
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
    ]
  }
];

const renderGrouper = (col: ColumnInstance<RowType>) => {
  if (col.canGroupBy) {
    return col.isGrouped ? "-" : "+";
  }
  return null;
};

const renderGroupedCell = (cell: Cell<RowType>, row: Row<RowType>) => {
  return (
    <>
      {row.isExpanded ? "→" : "↓"} {cell.render("Cell")}{" "}
      {`(${row.subRows.length})`}
    </>
  );
};

const renderAggCell = (cell: Cell<RowType>, row: Row<RowType>) => {
  return cell.render("Aggregated");
};

const renderCell = (cell: Cell<RowType>, row: Row<RowType>) => {
  return (
    <td {...cell.getCellProps()}>
      {cell.isGrouped
        ? renderGroupedCell(cell, row)
        : cell.isAggregated
        ? renderAggCell(cell, row)
        : cell.isPlaceholder
        ? null
        : cell.render("Cell")}
    </td>
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
    visibleColumns,
    state,
    setColumnOrder,
    allColumns
  } = useTable<RowType>(
    {
      columns: cols,
      data: data,
      initialState: {
        groupBy: ["customerRpi"],
        hiddenColumns: [],
        columnOrder: []
      }
    },
    useFilters,
    useGlobalFilter,
    useGroupBy,
    useExpanded,
    useColumnOrder,
    useRowSelect
  );

  useEffect(() => {
    console.log("groupby changed");
    for (const col of allColumns) {
      console.log(col);
    }
  }, [state.groupBy]);

  return (
    <>
      <table {...getTableProps()}>
        <thead>
          {headerGroups.map(hg => (
            <tr {...hg.getHeaderGroupProps()}>
              {hg.headers.map(col => (
                <th {...col.getHeaderProps()} {...col.getGroupByToggleProps()}>
                  <div>
                    {renderGrouper(col)} {col.render("Header")}
                  </div>
                </th>
              ))}
            </tr>
          ))}
        </thead>
        <tbody {...getTableBodyProps()}>
          {rows.map(row => {
            prepareRow(row);
            return (
              <tr {...row.getRowProps()} {...row.getToggleRowExpandedProps()}>
                {row.cells.map(cell => renderCell(cell, row))}
              </tr>
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

export default App;
