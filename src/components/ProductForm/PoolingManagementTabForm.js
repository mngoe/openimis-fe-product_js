import React, { useState, useEffect } from "react";
import { Grid, Typography, Box } from "@material-ui/core";
import { withTheme, withStyles } from "@material-ui/styles";
import {
  combine,
  useTranslations,
  useModulesManager,
  FormattedMessage,
  NumberInput,
  ConstantBasedPicker,
} from "@openimis/fe-core";
import SectionTitle from "../SectionTitle";
import RelativePricesTable from "./RelativePricesTable";

const parseCycle = (cycle) => {
  const [date, month] = cycle?.split("-") ?? [];
  return { date: parseInt(date, 10), month: parseInt(month, 10), untouched: true };
};

const CycleInput = React.memo((props) => {
  const { className, module, label, value, required, readOnly, onChange } = props;
  const [currentValue, setCurrentValue] = useState(parseCycle(value));

  useEffect(() => {
    setCurrentValue(parseCycle(value));
  }, [value]);

  useEffect(() => {
    if (currentValue.untouched) return;
    if (currentValue.date && currentValue.month) {
      onChange(
        `${Number(currentValue.date).toString().padStart(2, "0")}-${Number(currentValue.month)
          .toString()
          .padStart(2, "0")}`,
      );
    } else if (!currentValue.date && value) {
      onChange(null);
    }
  }, [currentValue]);

  const { date } = currentValue;
  return (
    <Box className={className}>
      <Typography>
        <FormattedMessage module={module} id={label} />
      </Typography>
      <Grid container direction="row" spacing={1}>
        <Grid item xs>
          <NumberInput
            min={1}
            max={31}
            module="product"
            label="CycleInput.date"
            value={date ?? undefined}
            required={required}
            readOnly={readOnly}
            onChange={(date) => setCurrentValue({ date })}
          />
        </Grid>
        <Grid item xs>
          <NumberInput
            module="product"
            label="CycleInput.month"
            min={1}
            max={12}
            value={currentValue.month}
            required={required || Boolean(currentValue.date)}
            readOnly={readOnly}
            onChange={(month) => setCurrentValue({ ...currentValue, month })}
          />
        </Grid>
      </Grid>
    </Box>
  );
});

const DISTRIBUTION_TYPES = ["disabled", "enabled", "split"];
const DISTRIBUTION_PERIODS = [12, 4, 1];

const createPeriods = (nPeriods) => Array.from(Array(nPeriods)).map(() => 0);

const PoolingManagementTabForm = (props) => {
  const { edited, onEditedChanged, readOnly, classes } = props;
  const modulesManager = useModulesManager();
  const { formatMessage } = useTranslations("product.PoolingManagementTabForm", modulesManager);

  const [distributionType, setDistributionType] = useState();
  const [distributionPeriods, setDistributionPeriods] = useState();

  const relativePrices = edited.relativePrices || [];

  const handleTypeChange = (value) => {
    const nPeriods = distributionPeriods || 12;
    setDistributionType(value);
    setDistributionPeriods(nPeriods);
    switch (value) {
      case "disabled":
        onEditedChanged({ ...edited, relativePrices: [] });
        break;
      case "enabled":
        onEditedChanged({
          ...edited,
          relativePrices: [{ careType: "BOTH", periods: createPeriods(nPeriods) }],
        });
        break;
      case "split":
        onEditedChanged({
          ...edited,
          relativePrices: [
            { careType: "IN_PATIENT", periods: createPeriods(nPeriods) },
            { careType: "OUT_PATIENT", periods: createPeriods(nPeriods) },
          ],
        });
        break;
    }
  };

  const handlePeriodsChange = (value) => {
    const newRelativePrices = relativePrices.map((rp) => ({ careType: rp.careType, periods: createPeriods(value) }));
    onEditedChanged({ ...edited, relativePrices: newRelativePrices });
    setDistributionPeriods(value);
  };

  useEffect(() => {
    // If the relative pricing distribution is different for the In-patient, Out-patient or Both, let's keep it like that
    const isLegacy =
      relativePrices?.length > 0 && !relativePrices.every((x) => x.periods.length === relativePrices[0].periods.length);

    if (isLegacy) return;

    if (relativePrices?.length === 1 && relativePrices?.some((x) => x.careType === "BOTH")) {
      setDistributionType("enabled");
    } else if (relativePrices?.length === 2) {
      setDistributionType("split");
    } else if (!relativePrices?.length) {
      setDistributionType("disabled");
    }

    if (relativePrices.length > 0) {
      setDistributionPeriods(relativePrices[0].periods.length || 12);
    } else {
      setDistributionPeriods(12);
    }
  }, []);

  return (
    <Grid container>
      <Grid item xs={12}>
        <SectionTitle label={formatMessage("startCyclesSectionTitle")} />
      </Grid>
      <Grid container item xs={12}>
        <Grid item xs={2} className={classes.item}>
          <CycleInput
            readOnly={readOnly}
            module="product"
            label="startCycle1"
            value={edited.startCycle1}
            onChange={(startCycle1) => onEditedChanged({ ...edited, startCycle1 })}
          />
        </Grid>
        <Grid item xs={2} className={classes.item}>
          <CycleInput
            readOnly={readOnly}
            module="product"
            label="startCycle2"
            value={edited.startCycle2}
            onChange={(startCycle2) => onEditedChanged({ ...edited, startCycle2 })}
          />
        </Grid>
        <Grid item xs={2} className={classes.item}>
          <CycleInput
            readOnly={readOnly}
            module="product"
            label="startCycle3"
            value={edited.startCycle3}
            onChange={(startCycle3) => onEditedChanged({ ...edited, startCycle3 })}
          />
        </Grid>
        <Grid item xs={2} className={classes.item}>
          <CycleInput
            readOnly={readOnly}
            module="product"
            label="startCycle4"
            value={edited.startCycle4}
            onChange={(startCycle4) => onEditedChanged({ ...edited, startCycle4 })}
          />
        </Grid>
      </Grid>

      <Grid item xs={12}>
        <SectionTitle label={formatMessage("relativePricingSectionTitle")} />
      </Grid>
      <>
        <Grid item xs={3} className={classes.item}>
          <ConstantBasedPicker
            module="product"
            readOnly={readOnly}
            constants={DISTRIBUTION_TYPES}
            label="relativePricingTypePicker"
            onChange={handleTypeChange}
            withNull={false}
            value={distributionType}
          />
        </Grid>
        {distributionType && distributionType !== "disabled" && (
          <Grid item xs={3} className={classes.item}>
            <ConstantBasedPicker
              module="product"
              constants={DISTRIBUTION_PERIODS}
              label="relativePricingPeriodsPicker"
              onChange={handlePeriodsChange}
              withNull={false}
              value={distributionPeriods}
            />
          </Grid>
        )}
      </>
      {distributionType !== "disabled" && relativePrices?.length > 0 && (
        <Grid item xs={12} className={classes.item}>
          <RelativePricesTable
            readOnly={readOnly}
            relativePrices={relativePrices}
            onChange={(relativePrices) => onEditedChanged({ ...edited, relativePrices })}
          />
        </Grid>
      )}
    </Grid>
  );
};

const styles = (theme) => ({
  item: theme.paper.item,
  sectionHeader: {
    ...theme.paper.item,
    paddingBottom: 0,
  },
  sectionTitle: theme.typography.title,
  table: {
    tableLayout: "fixed",
  },
  tableTitle: theme.table.title,
  tableHeader: theme.table.header,
});

const enhance = combine(withTheme, withStyles(styles));

export default enhance(PoolingManagementTabForm);
