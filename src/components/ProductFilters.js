import React from "react";
import moment from "moment";
import {
  combine,
  ControlledField,
  PublishedComponent,
  decodeId,
  TextInput,
  useTranslations,
  withModulesManager,
  useDebounceCb,
} from "@openimis/fe-core";
import { FormControlLabel, Grid, Checkbox } from "@material-ui/core";
import { withTheme, withStyles } from "@material-ui/core/styles";

const styles = (theme) => ({
  form: {
    padding: "0 0 10px 0",
    width: "100%",
  },
  item: {
    padding: theme.spacing(1),
  },
});

const ProductFilters = (props) => {
  const { classes, filters, onChangeFilters, modulesManager } = props;
  const { formatMessage } = useTranslations("product", modulesManager);

  const onValueChange = (id, value) => {
    onChangeFilters([{ id, value }]);
  };

  const onChangeDebounce = useDebounceCb(onValueChange, modulesManager.getConf("fe-admin", "debounceTime", 500));

  return (
    <section className={classes.form}>
      <Grid container>
        <ControlledField
          module="product"
          id="code"
          field={
            <Grid item xs={3} className={classes.item}>
              <TextInput
                module="product"
                name="code"
                label="code"
                value={filters?.code?.value}
                onChange={(value) => onChangeDebounce("code", value)}
              />
            </Grid>
          }
        />
        <ControlledField
          module="product"
          id="name"
          field={
            <Grid item xs={3} className={classes.item}>
              <TextInput
                module="product"
                name="name"
                label="name"
                value={filters?.name?.value}
                onChange={(value) => onChangeDebounce("name", value)}
              />
            </Grid>
          }
        />
        <ControlledField
          module="product"
          id="region"
          field={
            <Grid item xs={3} className={classes.item}>
              <PublishedComponent
                pubRef="location.RegionPicker"
                value={filters.location?.value?.parent ?? filters.location?.value}
                withNull={true}
                onChange={(value) =>
                  onChangeFilters([{ id: "location", value: value, filter: value ? decodeId(value.id) : null }])
                }
              />
            </Grid>
          }
        />
        <ControlledField
          module="product"
          id="district"
          field={
            <Grid item xs={3} className={classes.item}>
              <PublishedComponent
                pubRef="location.DistrictPicker"
                value={filters.location?.value?.parent ? filters.location?.value : null}
                region={filters.location?.value?.parent ? filters.location?.value?.parent : filters.location?.value}
                key={filters.location?.value?.parent}
                withNull={true}
                onChange={(value) => {
                  if (!value) {
                    value = filters.location?.value?.parent;
                  }
                  onChangeFilters([{ id: "location", value: value, filter: value ? decodeId(value.id) : null }]);
                }}
              />
            </Grid>
          }
        />
        <ControlledField
          module="product"
          id="product.dateFrom"
          field={
            <Grid item xs={3} className={classes.item}>
              <PublishedComponent
                pubRef="core.DatePicker"
                value={filters.date?.value}
                module="product"
                label="product.dateFrom"
                onChange={(d) =>
                  onChangeFilters([
                    {
                      id: "dateFrom",
                      value: d,
                      filter: d ? moment(d).format() : null,
                    },
                  ])
                }
              />
            </Grid>
          }
        />
        <ControlledField
          module="product"
          id="product.dateTo"
          field={
            <Grid item xs={3} className={classes.item}>
              <PublishedComponent
                pubRef="core.DatePicker"
                value={filters.date?.value}
                module="product"
                label="product.dateTo"
                onChange={(d) =>
                  onChangeFilters([
                    {
                      id: "dateTo",
                      value: d,
                      filter: d ? moment(d).format() : null,
                    },
                  ])
                }
              />
            </Grid>
          }
        />
        <ControlledField
          module="product"
          id="showHistory"
          field={
            <Grid item xs={12} className={classes.item}>
              <FormControlLabel
                control={
                  <Checkbox
                    color="primary"
                    checked={filters?.showHistory?.value}
                    onChange={() =>
                      onChangeFilters([
                        {
                          id: "showHistory",
                          value: !filters?.showHistory?.value,
                        },
                      ])
                    }
                  />
                }
                label={formatMessage("product.ProductFilters.showHistory")}
              />
            </Grid>
          }
        />
      </Grid>
    </section>
  );
};

const enhance = combine(withTheme, withStyles(styles), withModulesManager);

export default enhance(ProductFilters);
