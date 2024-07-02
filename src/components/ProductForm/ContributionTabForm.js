import React from "react";
import { Grid } from "@material-ui/core";
import { withTheme, withStyles } from "@material-ui/styles";
import { combine, useTranslations, NumberInput, useModulesManager } from "@openimis/fe-core";
import SectionTitle from "../SectionTitle";

const ContributionTabForm = (props) => {
  const { edited, onEditedChanged, readOnly, classes } = props;
  const modulesManager = useModulesManager();
  const { formatMessage } = useTranslations("product.ContributionTabForm", modulesManager);
  return (
    <Grid container>
      <Grid item xs={3} className={classes.item}>
        <NumberInput
          module="product"
          min={0}
          label="lumpSum"
          readOnly={readOnly}
          value={edited?.lumpSum ?? ""}
          onChange={(lumpSum) => onEditedChanged({ ...edited, lumpSum })}
        />
      </Grid>
      <Grid item xs={3} className={classes.item}>
        <NumberInput
          module="product"
          min={0}
          label="premiumAdult"
          readOnly={readOnly}
          value={edited?.premiumAdult ?? ""}
          onChange={(premiumAdult) => onEditedChanged({ ...edited, premiumAdult })}
        />
      </Grid>
      <Grid item xs={3} className={classes.item}>
        <NumberInput
          module="product"
          min={0}
          label="premiumChild"
          readOnly={readOnly}
          value={edited?.premiumChild ?? ""}
          onChange={(premiumChild) => onEditedChanged({ ...edited, premiumChild })}
        />
      </Grid>
      <Grid item xs={3} className={classes.item}>
        <NumberInput
          module="product"
          label="maxInstallments"
          readOnly={readOnly}
          displayZero
          value={edited?.maxInstallments}
          onChange={(maxInstallments) => onEditedChanged({ ...edited, maxInstallments })}
        />
      </Grid>
      <Grid item xs={3} className={classes.item}>
        <NumberInput
          module="product"
          min={0}
          label="registrationLumpSum"
          readOnly={readOnly}
          value={edited?.registrationLumpSum ?? ""}
          onChange={(registrationLumpSum) => onEditedChanged({ ...edited, registrationLumpSum })}
        />
      </Grid>
      <Grid item xs={3} className={classes.item}>
        <NumberInput
          module="product"
          min={0}
          label="registrationFee"
          readOnly={readOnly}
          value={edited?.registrationFee ?? ""}
          onChange={(registrationFee) => onEditedChanged({ ...edited, registrationFee })}
        />
      </Grid>
      <Grid item xs={3} className={classes.item}>
        <NumberInput
          module="product"
          min={0}
          label="generalAssemblyLumpSum"
          readOnly={readOnly}
          value={edited?.generalAssemblyLumpSum ?? ""}
          onChange={(generalAssemblyLumpSum) => onEditedChanged({ ...edited, generalAssemblyLumpSum })}
        />
      </Grid>
      <Grid item xs={3} className={classes.item}>
        <NumberInput
          module="product"
          min={0}
          label="generalAssemblyFee"
          readOnly={readOnly}
          value={edited?.generalAssemblyFee ?? ""}
          onChange={(generalAssemblyFee) => onEditedChanged({ ...edited, generalAssemblyFee })}
        />
      </Grid>
      <Grid item xs={12}>
        <SectionTitle label={formatMessage("discountsSectionTitle")} />
      </Grid>
      <Grid item xs={12}>
        <Grid container>
          <Grid item xs={3} className={classes.item}>
            <NumberInput
              module="product"
              min={0}
              label="renewalDiscountPeriod"
              readOnly={readOnly}
              value={edited?.renewalDiscountPeriod ?? ""}
              onChange={(renewalDiscountPeriod) => onEditedChanged({ ...edited, renewalDiscountPeriod })}
            />
          </Grid>
          <Grid item xs={3} className={classes.item}>
            <NumberInput
              module="product"
              min={0}
              label="renewalDiscountPerc"
              readOnly={readOnly}
              value={edited?.renewalDiscountPerc ?? ""}
              onChange={(renewalDiscountPerc) => onEditedChanged({ ...edited, renewalDiscountPerc })}
            />
          </Grid>
        </Grid>
      </Grid>
      <Grid item xs={12}>
        <Grid container>
          <Grid item xs={3} className={classes.item}>
            <NumberInput
              module="product"
              min={0}
              label="enrolmentDiscountPeriod"
              readOnly={readOnly}
              value={edited?.enrolmentDiscountPeriod ?? ""}
              onChange={(enrolmentDiscountPeriod) => onEditedChanged({ ...edited, enrolmentDiscountPeriod })}
            />
          </Grid>
          <Grid item xs={3} className={classes.item}>
            <NumberInput
              module="product"
              min={0}
              label="enrolmentDiscountPerc"
              readOnly={readOnly}
              value={edited?.enrolmentDiscountPerc ?? ""}
              onChange={(enrolmentDiscountPerc) => onEditedChanged({ ...edited, enrolmentDiscountPerc })}
            />
          </Grid>
        </Grid>
      </Grid>
      <Grid item xs={12}>
        <SectionTitle label={formatMessage("graceSectionTitle")} />
      </Grid>
      <Grid item xs={3} className={classes.item}>
        <NumberInput
          module="product"
          min={0}
          label="gracePeriodEnrolment"
          readOnly={readOnly}
          value={edited?.gracePeriodEnrolment ?? 0}
          onChange={(gracePeriodEnrolment) => onEditedChanged({ ...edited, gracePeriodEnrolment: Number(gracePeriodEnrolment) })}
          displayZero={true}
        />
      </Grid>
      <Grid item xs={3} className={classes.item}>
        <NumberInput
          module="product"
          min={0}
          label="gracePeriodRenewal"
          readOnly={readOnly}
          value={edited?.gracePeriodRenewal ?? 0}
          onChange={(gracePeriodRenewal) => onEditedChanged({ ...edited, gracePeriodRenewal: Number(gracePeriodRenewal) })}
          displayZero={true}
        />
      </Grid>
      <Grid item xs={3} className={classes.item}>
        <NumberInput
          module="product"
          min={0}
          required
          label="gracePeriodPayment"
          readOnly={readOnly}
          value={edited?.gracePeriodPayment}
          onChange={(gracePeriodPayment) => onEditedChanged({ ...edited, gracePeriodPayment })}
          displayZero={true}
        />
      </Grid>
    </Grid>
  );
};

const styles = (theme) => ({
  item: theme.paper.item,
});

const enhance = combine(withTheme, withStyles(styles));

export default enhance(ContributionTabForm);
