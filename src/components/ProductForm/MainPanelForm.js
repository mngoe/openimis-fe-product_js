import React from "react";
import { withTheme, withStyles } from "@material-ui/core/styles";
import { Grid } from "@material-ui/core";
import {
  useModulesManager,
  useTranslations,
  TextInput,
  NumberInput,
  PublishedComponent,
  combine,
} from "@openimis/fe-core";
import SectionTitle from "../SectionTitle";

const styles = (theme) => ({
  item: theme.paper.item,
});

const MainPanelForm = (props) => {
  const { classes, edited, onEditedChanged, readOnly } = props;
  const modulesManager = useModulesManager();
  const { formatMessage } = useTranslations("product.FormMainPanel", modulesManager);

  return (
    <Grid container direction="row">
      <Grid item xs={3} className={classes.item}>
        <TextInput
          module="product"
          required
          label="code"
          readOnly={Boolean(edited?.id) || readOnly}
          value={edited?.code ?? ""}
          onChange={(code) => onEditedChanged({ ...edited, code })}
        />
      </Grid>

      <Grid item xs={3} className={classes.item}>
        <TextInput
          module="product"
          required
          label="name"
          readOnly={readOnly}
          value={edited?.name ?? ""}
          onChange={(name) => onEditedChanged({ ...edited, name })}
        />
      </Grid>
      <Grid item xs={3} className={classes.item}>
        <PublishedComponent
          pubRef="location.RegionPicker"
          value={edited.location?.parent ?? edited.location}
          readOnly={readOnly}
          withNull
          onChange={(location) => onEditedChanged({ ...edited, location })}
        />
      </Grid>
      <Grid item xs={3} className={classes.item}>
        <PublishedComponent
          region={edited.location?.parent || edited.location}
          value={edited.location?.parent ? edited.location : null}
          pubRef="location.DistrictPicker"
          withNull={true}
          readOnly={readOnly}
          onChange={(location) => onEditedChanged({ ...edited, location: location || edited.location?.parent })}
        />
      </Grid>
      <Grid item xs={3} className={classes.item}>
        <NumberInput
          module="product"
          required
          min={0}
          label="maxMembers"
          readOnly={readOnly}
          value={edited?.maxMembers ?? ""}
          onChange={(maxMembers) => onEditedChanged({ ...edited, maxMembers })}
        />
      </Grid>
      <Grid item xs={3} className={classes.item}>
        <NumberInput
          module="product"
          min={0}
          displayZero
          label="memberTreshold"
          readOnly={readOnly}
          value={edited?.threshold ?? ""}
          onChange={(threshold) => onEditedChanged({ ...edited, threshold })}
        />
      </Grid>
      <Grid item xs={3} className={classes.item}>
        <NumberInput
          min={0}
          module="product"
          required
          label="insurancePeriod"
          readOnly={readOnly}
          value={edited?.insurancePeriod ?? ""}
          onChange={(insurancePeriod) => onEditedChanged({ ...edited, insurancePeriod })}
        />
      </Grid>
      <Grid item xs={3} className={classes.item}>
        <NumberInput
          min={0}
          module="product"
          label="administrationPeriod"
          readOnly={readOnly}
          value={edited?.administrationPeriod ?? ""}
          onChange={(administrationPeriod) => onEditedChanged({ ...edited, administrationPeriod })}
        />
      </Grid>
      <Grid item xs={3} className={classes.item}>
        <NumberInput
          min={0}
          module="product"
          label="recurrence"
          readOnly={readOnly}
          value={edited?.recurrence ?? ""}
          onChange={(recurrence) => onEditedChanged({ ...edited, recurrence })}
        />
      </Grid>
      <Grid item xs={3} className={classes.item}>
        <PublishedComponent
          pubRef="program.ProgramPicker"
          value={edited?.program ? edited.program: null}
          withNull={true}
          readOnly={readOnly}
          onChange={(program) => onEditedChanged({ ...edited, program })}
          required={true}
        />
      </Grid>
      <Grid item xs={12}>
        <SectionTitle label={formatMessage("validitySectionTitle")} />
      </Grid>
      <Grid item xs={4} className={classes.item}>
        <PublishedComponent
          pubRef="core.DatePicker"
          value={edited?.dateFrom}
          required
          module="product"
          label="dateFrom"
          readOnly={readOnly}
          onChange={(dateFrom) => onEditedChanged({ ...edited, dateFrom })}
        />
      </Grid>
      <Grid item xs={4} className={classes.item}>
        <PublishedComponent
          pubRef="core.DatePicker"
          value={edited?.dateTo}
          required
          module="product"
          label="dateTo"
          readOnly={readOnly}
          onChange={(dateTo) => onEditedChanged({ ...edited, dateTo })}
        />
      </Grid>
      <Grid item xs={4} className={classes.item}>
        <PublishedComponent
          pubRef="product.ProductPicker"
          value={edited?.conversionProduct}
          filter={(items) => items?.filter((i) => i.id !== edited?.id)}
          readOnly={readOnly}
          onChange={(conversionProduct) => onEditedChanged({ ...edited, conversionProduct })}
        />
      </Grid>
      <Grid item xs={12}>
        <SectionTitle label={formatMessage("accountingSectionTitle")} />
      </Grid>
      <Grid item xs={3} className={classes.item}>
        <TextInput
          module="product"
          label="remunerationCode"
          readOnly={readOnly}
          value={edited?.accCodeRemuneration ?? ""}
          onChange={(accCodeRemuneration) => onEditedChanged({ ...edited, accCodeRemuneration })}
        />
      </Grid>
      <Grid item xs={3} className={classes.item}>
        <TextInput
          module="product"
          label="contributionCode"
          readOnly={readOnly}
          value={edited?.accCodePremiums ?? ""}
          onChange={(accCodePremiums) => onEditedChanged({ ...edited, accCodePremiums })}
        />
      </Grid>
    </Grid>
  );
};

const enhance = combine(withTheme, withStyles(styles));

export default enhance(MainPanelForm);
