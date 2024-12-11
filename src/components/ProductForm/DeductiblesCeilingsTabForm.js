import React, { useState, useEffect } from "react";
import _ from "lodash";
import { useSelector } from "react-redux";
import { useTranslations, useModulesManager, NumberInput, ConstantBasedPicker } from "@openimis/fe-core";
import {
  Grid,
  Table,
  Typography,
  FormControlLabel,
  Checkbox,
  TableHead,
  TableBody,
  TableRow,
  TableCell,
} from "@material-ui/core";
import { makeStyles } from "@material-ui/styles";

import {
  CEILING_DISCRIMINATION,
  CEILING_TYPES,
  HEALTH_FACILITY_TYPE,
  CLAIM_TYPE
} from "../../constants";
import SectionTitle from "../SectionTitle";

const useStyles = makeStyles((theme) => ({
  item: theme.paper.item,
  tableHead: theme.table.header,
  tableTitle: theme.table.title,
  tableRow: theme.table.row,
}));

const isInitialSplit = (product) =>
  ["deductibleIp", "deductibleOp", "ceilingIp", "ceilingOp"].some((x) => product[x] > 0);

const DeductiblesCeilingsTabForm = (props) => {
  const { edited, onEditedChanged, className, readOnly } = props;
  const product = useSelector((state) => state.product.product ?? {});
  const modulesManager = useModulesManager();
  const { formatMessage } = useTranslations("product", modulesManager);
  const [isSplit, _setSplit] = useState(isInitialSplit(edited));
  const classes = useStyles();
  const setSplit = (event) => {
    const isChecked = event.target.checked;
    onEditedChanged({
      ...edited,
      deductible: 0,
      deductibleIp: 0,
      deductibleOp: 0,
      ceilingIp: undefined,
      ceilingOp: undefined,
      ceiling: undefined,
      maxPolicyExtraMemberIp: undefined,
      maxPolicyExtraMemberOp: undefined,
      maxPolicyExtraMember: undefined,
      maxCeilingPolicyIp: undefined,
      maxCeilingPolicyOp: undefined,
      maxCeilingPolicy: undefined,
    });
    _setSplit(isChecked);
  };
  const handleInputChange = (fieldName) => (value) => {
    onEditedChanged({ ...edited, [fieldName]: value });
  };

  useEffect(() => {
    if (!edited.ceilingType) {
      onEditedChanged({ ...edited, ceilingType: product?.ceilingType || "INSUREE" });
    }
  }, []);

  useEffect(() => { }, [isSplit]);
  return (
    <Grid container className={className}>
      <Grid item xs={6} className={classes.item}>
        <ConstantBasedPicker
          required
          withNull
          module="product"
          readOnly={readOnly}
          value={edited.ceilingInterpretation}
          onChange={(ceilingInterpretation) => onEditedChanged({ ...edited, ceilingInterpretation })}
          constants={CEILING_DISCRIMINATION}
          label="ceilingDiscrimination"
        />
      </Grid>
      <Grid item xs={12} className={classes.item}>
        <Typography>{formatMessage("DeductiblesCeilingsTabForm.ceilingDiscriminationExplanation")}</Typography>
      </Grid>
      <Grid item xs={4} className={classes.item}>
        <ConstantBasedPicker
          withNull={false}
          module="product"
          readOnly={readOnly}
          value={edited?.ceilingType}
          onChange={(ceilingType) => onEditedChanged({ ...edited, ceilingType })}
          constants={CEILING_TYPES}
          label="ceilingType"
        />
      </Grid>
      <Grid item xs={4} className={classes.item}>
        <FormControlLabel
          label={formatMessage("DeductiblesCeilingsTabForm.splitCeilings")}
          control={<Checkbox checked={isSplit} onChange={setSplit} disabled={readOnly} />}
        />
      </Grid>
      <Grid item xs={6}>
        <SectionTitle label={"Deductibles"} />
      </Grid>
      <Grid item xs={6} className={classes.item} />
      <Grid item xs={6} className={classes.item}>
        <Table size="small">
          <TableHead className={classes.tableHead}>
            <TableRow className={classes.tableTitle}>
              <TableCell width="200" />
              {!isSplit && <TableCell>{formatMessage("DeductiblesCeilingsTabForm.all")}</TableCell>}
              {isSplit && edited.ceilingInterpretation === HEALTH_FACILITY_TYPE && (
                <>
                  <TableCell>{formatMessage("DeductiblesCeilingsTabForm.hospitals")}</TableCell>
                  <TableCell>{formatMessage("DeductiblesCeilingsTabForm.nonHospitals")}</TableCell>
                </>
              )}
              {isSplit && edited.ceilingInterpretation === CLAIM_TYPE && (
                <>
                  <TableCell>{formatMessage("DeductiblesCeilingsTabForm.inPatient")}</TableCell>
                  <TableCell>{formatMessage("DeductiblesCeilingsTabForm.outPatient")}</TableCell>
                </>
              )}
            </TableRow>
          </TableHead>
          <TableBody>
            <TableRow className={classes.tableRow}>
              <TableCell className={classes.tableTitle}>{formatMessage(`ceilingType.${edited.ceilingType}`)}</TableCell>
              {isSplit ? (
                <>
                  <TableCell>
                    <NumberInput
                      min={0}
                      module="product"
                      readOnly={readOnly}
                      value={edited?.deductibleIp ?? 0}
                      onChange={handleInputChange("deductibleIp")}
                    />
                  </TableCell>
                  <TableCell>
                    <NumberInput
                      min={0}
                      module="product"
                      readOnly={readOnly}
                      value={edited?.deductibleOp ?? 0}
                      onChange={handleInputChange("deductibleOp")}
                    />
                  </TableCell>
                </>
              ) : (
                <TableCell>
                  <NumberInput
                    min={0}
                    module="product"
                    readOnly={readOnly}
                    value={edited?.deductible ?? 0}
                    onChange={handleInputChange("deductible")}
                  />
                </TableCell>
              )}
            </TableRow>
          </TableBody>
        </Table>
      </Grid>
      <Grid item xs={12}>
        <SectionTitle label={"Ceilings"} />
      </Grid>
      <Grid item xs={6} className={classes.item}>
        <Table size="small">
          <TableHead className={classes.tableHead}>
            <TableRow className={classes.tableTitle}>
              <TableCell width="200" />
              {!isSplit && <TableCell>{formatMessage("DeductiblesCeilingsTabForm.all")}</TableCell>}
              {isSplit && edited.ceilingInterpretation === HEALTH_FACILITY_TYPE && (
                <>
                  <TableCell>{formatMessage("DeductiblesCeilingsTabForm.hospitals")}</TableCell>
                  <TableCell>{formatMessage("DeductiblesCeilingsTabForm.nonHospitals")}</TableCell>
                </>
              )}
              {isSplit && edited.ceilingInterpretation === CLAIM_TYPE && (
                <>
                  <TableCell>{formatMessage("DeductiblesCeilingsTabForm.inPatient")}</TableCell>
                  <TableCell>{formatMessage("DeductiblesCeilingsTabForm.outPatient")}</TableCell>
                </>
              )}
            </TableRow>
          </TableHead>
          <TableBody>
            <TableRow className={classes.tableRow}>
              <TableCell className={classes.tableTitle}>{formatMessage(`ceilingType.${edited.ceilingType}`)}</TableCell>
              {isSplit ? (
                <>
                  <TableCell>
                    <NumberInput
                      min={0}
                      module="product"
                      readOnly={readOnly}
                      value={edited?.ceilingIp}
                      onChange={handleInputChange("ceilingIp")}
                      onBlur={(event) => handleCeilingBlur("ceilingIp", event)}
                      displayNa
                      displayZero
                    />
                  </TableCell>
                  <TableCell>
                    <NumberInput
                      min={0}
                      module="product"
                      readOnly={readOnly}
                      value={edited?.ceilingOp}
                      onChange={handleInputChange("ceilingOp")}
                      onBlur={(event) => handleCeilingBlur("ceilingOp", event)}
                      displayNa
                      displayZero
                    />
                  </TableCell>
                </>
              ) : (
                <TableCell>
                  <NumberInput
                    min={0}
                    module="product"
                    readOnly={readOnly}
                    value={edited?.ceiling}
                    onChange={handleInputChange("ceiling")}
                    onBlur={(event) => handleCeilingBlur("ceiling", event)}
                    displayNa
                    displayZero
                  />
                </TableCell>
              )}
            </TableRow>
            <TableRow className={classes.tableRow}>
              <TableCell className={classes.tableTitle}>
                {formatMessage("DeductiblesCeilingsTabForm.extraMemberCeiling")}
              </TableCell>
              {isSplit ? (
                <>
                  <TableCell>
                    <NumberInput
                      min={0}
                      module="product"
                      readOnly={readOnly}
                      value={edited?.maxPolicyExtraMemberIp}
                      onChange={handleInputChange("maxPolicyExtraMemberIp")}
                      onBlur={(event) => handleCeilingBlur("maxPolicyExtraMemberIp", event)}
                      displayNa
                      displayZero
                    />
                  </TableCell>
                  <TableCell>
                    <NumberInput
                      min={0}
                      module="product"
                      readOnly={readOnly}
                      value={edited?.maxPolicyExtraMemberOp}
                      onChange={handleInputChange("maxPolicyExtraMemberOp")}
                      onBlur={(event) => handleCeilingBlur("maxPolicyExtraMemberOp", event)}
                      displayNa
                      displayZero
                    />
                  </TableCell>
                </>
              ) : (
                <TableCell>
                  <NumberInput
                    min={0}
                    module="product"
                    readOnly={readOnly}
                    value={edited?.maxPolicyExtraMember}
                    onChange={handleInputChange("maxPolicyExtraMember")}
                    onBlur={(event) => handleCeilingBlur("maxPolicyExtraMember", event)}
                    displayNa
                    displayZero
                  />
                </TableCell>
              )}
            </TableRow>
            <TableRow className={classes.tableRow}>
              <TableCell className={classes.tableTitle}>
                {formatMessage("DeductiblesCeilingsTabForm.maximumCeiling")}
              </TableCell>
              {isSplit ? (
                <>
                  <TableCell>
                    <NumberInput
                      min={0}
                      module="product"
                      readOnly={readOnly}
                      value={edited?.maxCeilingPolicyIp}
                      onChange={handleInputChange("maxCeilingPolicyIp")}
                      onBlur={(event) => handleCeilingBlur("maxCeilingPolicyIp", event)}
                      displayNa
                      displayZero
                    />
                  </TableCell>
                  <TableCell>
                    <NumberInput
                      min={0}
                      module="product"
                      readOnly={readOnly}
                      value={edited?.maxCeilingPolicyOp}
                      onChange={handleInputChange("maxCeilingPolicyOp")}
                      onBlur={(event) => handleCeilingBlur("maxCeilingPolicyOp", event)}
                      displayNa
                      displayZero
                    />
                  </TableCell>
                </>
              ) : (
                <TableCell>
                  <NumberInput
                    min={0}
                    module="product"
                    readOnly={readOnly}
                    value={edited?.maxCeilingPolicy}
                    onChange={handleInputChange("maxCeilingPolicy")}
                    onBlur={(event) => handleCeilingBlur("maxCeilingPolicy", event)}
                    displayNa
                    displayZero
                  />
                </TableCell>
              )}
            </TableRow>
          </TableBody>
        </Table>
      </Grid>
      <Grid item xs={6} className={classes.item}>
        <Table size="small">
          <TableHead className={classes.tableHead}>
            <TableRow className={classes.tableTitle}>
              <TableCell width="180"></TableCell>
              <TableCell>{formatMessage("DeductiblesCeilingsTabForm.MaxTable.number")}</TableCell>
              <TableCell>{formatMessage("DeductiblesCeilingsTabForm.MaxTable.ceiling")}</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            <TableRow>
              <TableCell className={classes.tableTitle}>
                {formatMessage("DeductiblesCeilingsTabForm.MaxTable.consultations")}
              </TableCell>
              <TableCell>
                <NumberInput
                  min={0}
                  module="product"
                  readOnly={readOnly}
                  value={edited?.maxNoConsultation ?? 0}
                  onChange={handleInputChange("maxNoConsultation")}
                />
              </TableCell>
              <TableCell>
                <NumberInput
                  min={0}
                  module="product"
                  readOnly={readOnly}
                  value={edited?.maxAmountConsultation}
                  onChange={handleInputChange("maxAmountConsultation")}
                  onBlur={(event) => handleCeilingBlur("maxAmountConsultation", event)}
                  displayNa
                  displayZero
                />
              </TableCell>
            </TableRow>
            <TableRow>
              <TableCell className={classes.tableTitle}>
                {formatMessage("DeductiblesCeilingsTabForm.MaxTable.surgeries")}
              </TableCell>
              <TableCell>
                <NumberInput
                  min={0}
                  module="product"
                  readOnly={readOnly}
                  value={edited?.maxNoSurgery ?? 0}
                  onChange={handleInputChange("maxNoSurgery")}
                />
              </TableCell>
              <TableCell>
                <NumberInput
                  min={0}
                  module="product"
                  readOnly={readOnly}
                  value={edited?.maxAmountSurgery}
                  onChange={handleInputChange("maxAmountSurgery")}
                  onBlur={(event) => handleCeilingBlur("maxAmountSurgery", event)}
                  displayNa
                  displayZero
                />
              </TableCell>
            </TableRow>
            <TableRow>
              <TableCell className={classes.tableTitle}>
                {formatMessage("DeductiblesCeilingsTabForm.MaxTable.deliveries")}
              </TableCell>
              <TableCell>
                <NumberInput
                  min={0}
                  module="product"
                  readOnly={readOnly}
                  value={edited?.maxNoDelivery ?? 0}
                  onChange={handleInputChange("maxNoDelivery")}
                />
              </TableCell>
              <TableCell>
                <NumberInput
                  min={0}
                  module="product"
                  readOnly={readOnly}
                  value={edited?.maxAmountDelivery}
                  onChange={handleInputChange("maxAmountDelivery")}
                  onBlur={(event) => handleCeilingBlur("maxAmountDelivery", event)}
                  displayNa
                  displayZero
                />
              </TableCell>
            </TableRow>
            <TableRow>
              <TableCell className={classes.tableTitle}>
                {formatMessage("DeductiblesCeilingsTabForm.MaxTable.hopitalizations")}
              </TableCell>
              <TableCell>
                <NumberInput
                  min={0}
                  module="product"
                  readOnly={readOnly}
                  value={edited?.maxNoHospitalization ?? 0}
                  onChange={handleInputChange("maxNoHospitalization")}
                />
              </TableCell>
              <TableCell>
                <NumberInput
                  min={0}
                  module="product"
                  readOnly={readOnly}
                  value={edited?.maxAmountHospitalization}
                  onChange={handleInputChange("maxAmountHospitalization")}
                  onBlur={(event) => handleCeilingBlur("maxAmountHospitalization", event)}
                  displayNa
                  displayZero
                />
              </TableCell>
            </TableRow>
            <TableRow>
              <TableCell className={classes.tableTitle}>
                {formatMessage("DeductiblesCeilingsTabForm.MaxTable.antenatal")}
              </TableCell>
              <TableCell>
                <NumberInput
                  min={0}
                  module="product"
                  readOnly={readOnly}
                  value={edited?.maxNoAntenatal ?? 0}
                  onChange={handleInputChange("maxNoAntenatal")}
                />
              </TableCell>
              <TableCell>
                <NumberInput
                  min={0}
                  module="product"
                  readOnly={readOnly}
                  value={edited?.maxAmountAntenatal}
                  onChange={handleInputChange("maxAmountAntenatal")}
                  onBlur={(event) => handleCeilingBlur("maxAmountAntenatal", event)}
                  displayNa
                  displayZero
                />
              </TableCell>
            </TableRow>
            <TableRow>
              <TableCell className={classes.tableTitle}>
                {formatMessage("DeductiblesCeilingsTabForm.MaxTable.visits")}
              </TableCell>
              <TableCell>
                <NumberInput
                  min={0}
                  module="product"
                  readOnly={readOnly}
                  value={edited.maxNoVisits}
                  onChange={handleInputChange("maxNoVisits")}
                />
              </TableCell>
            </TableRow>
          </TableBody>
        </Table>
      </Grid>
    </Grid>
  );
};

export default DeductiblesCeilingsTabForm;
