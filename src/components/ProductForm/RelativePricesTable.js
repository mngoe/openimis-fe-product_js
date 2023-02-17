import React, { useMemo } from "react";
import clsx from "clsx";
import { makeStyles } from "@material-ui/styles";
import { Table, TableRow, TableCell, TableBody, TableHead } from "@material-ui/core";

import { useTranslations, useModulesManager, NumberInput } from "@openimis/fe-core";

const useStyles = makeStyles(() => ({
  cell: {},
  tableTitle: {
    fontWeight: 500,
    color: "#006273",
    backgroundColor: "#b7d4d8",
  },
  careTypeColumn: {
    fontWeight: 500,
    color: "#006273",
    backgroundColor: "#b7d4d8",
    minWidth: 100,
  },
}));

const RelativePricesTable = (props) => {
  const { className, relativePrices, onChange, readOnly } = props;
  const classes = useStyles();
  const modulesManager = useModulesManager();
  const { formatMessage, formatMessageWithValues } = useTranslations("product.RelativePricesTable", modulesManager);
  const nCols = useMemo(() => Math.max(...relativePrices.map((row) => row.periods.length)), [relativePrices]);

  const handleCellChange = (x, y, value) => {
    relativePrices[x].periods[y] = value;
    onChange([...relativePrices]);
  };

  return (
    <Table size="small" className={clsx(className)}>
      <caption>The sum of all the periods of a care type must be equal to 100%</caption>
      <TableHead>
        <TableRow className={classes.tableTitle}>
          <TableCell align="left" className={classes.careTypeColumn}>
            {formatMessage("careType")}
          </TableCell>
          {Array.from(Array(nCols)).map((_, idx) => (
            <TableCell key={idx}>{formatMessageWithValues("period", { count: idx + 1 })}</TableCell>
          ))}
        </TableRow>
      </TableHead>
      <TableBody>
        {relativePrices.map((row, careTypeIndex) => (
          <TableRow key={row.careType}>
            <TableCell className={clsx(classes.cell, classes.tableTitle)}>
              {formatMessage(`careType.${row.careType}`)}
            </TableCell>
            {row.periods.map((period, idx) => (
              <TableCell key={idx} className={classes.cell}>
                <NumberInput
                  min={0}
                  required
                  readOnly={readOnly}
                  max={100}
                  value={period}
                  onChange={(value) => handleCellChange(careTypeIndex, idx, value)}
                />
              </TableCell>
            ))}
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
};

export default RelativePricesTable;
