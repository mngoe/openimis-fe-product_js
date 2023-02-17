import React, { useState, useEffect } from "react";
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
import _ from "lodash";
import { CEILING_DISCRIMINATION, CEILING_TYPES } from "../../constants";
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
      ceilingIp: 0,
      ceilingOp: 0,
      ceiling: 0,
      maxPolicyExtraMemberIp: 0,
      maxPolicyExtraMemberOp: 0,
      maxPolicyExtraMember: 0,
      maxCeilingPolicyIp: 0,
      maxCeilingPolicyOp: 0,
      maxCeilingPolicy: 0,
    });
    _setSplit(isChecked);
  };

  const handleInputChange = (fieldName) => (value) => {
    onEditedChanged({ ...edited, [fieldName]: value });
  };

  useEffect(() => {
    if (!edited.ceilingType) {
      onEditedChanged({ ...edited, ceilingType: "INSUREE" });
    }
  }, []);

  useEffect(() => {}, [isSplit]);
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
          withNull
          module="product"
          readOnly={readOnly}
          value={edited.ceilingType}
          constants={CEILING_TYPES}
          label="ceilingType"
          onChange={(ceilingType) => onEditedChanged({ ...edited, ceilingType })}
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
              {isSplit && (
                <>
                  <TableCell>{formatMessage("DeductiblesCeilingsTabForm.hospitals")}</TableCell>
                  <TableCell>{formatMessage("DeductiblesCeilingsTabForm.non_hospitals")}</TableCell>
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
                      value={edited.deductibleIp}
                      displayZero
                      onChange={handleInputChange("deductibleIp")}
                    />
                  </TableCell>
                  <TableCell>
                    <NumberInput
                      min={0}
                      module="product"
                      readOnly={readOnly}
                      value={edited.deductibleOp}
                      displayZero
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
                    value={edited.deductible}
                    displayZero
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
              {isSplit && (
                <>
                  <TableCell>{formatMessage("DeductiblesCeilingsTabForm.hospitals")}</TableCell>
                  <TableCell>{formatMessage("DeductiblesCeilingsTabForm.non_hospitals")}</TableCell>
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
                      value={edited.ceilingIp}
                      displayZero
                      onChange={handleInputChange("ceilingIp")}
                    />
                  </TableCell>
                  <TableCell>
                    <NumberInput
                      min={0}
                      module="product"
                      readOnly={readOnly}
                      value={edited.ceilingOp}
                      displayZero
                      onChange={handleInputChange("ceilingOp")}
                    />
                  </TableCell>
                </>
              ) : (
                <TableCell>
                  <NumberInput
                    min={0}
                    module="product"
                    readOnly={readOnly}
                    value={edited.ceiling}
                    displayZero
                    onChange={handleInputChange("ceiling")}
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
                      value={edited.maxPolicyExtraMemberIp}
                      displayZero
                      onChange={handleInputChange("maxPolicyExtraMemberIp")}
                    />
                  </TableCell>
                  <TableCell>
                    <NumberInput
                      min={0}
                      module="product"
                      readOnly={readOnly}
                      value={edited.maxPolicyExtraMemberOp}
                      displayZero
                      onChange={handleInputChange("maxPolicyExtraMemberOp")}
                    />
                  </TableCell>
                </>
              ) : (
                <TableCell>
                  <NumberInput
                    min={0}
                    module="product"
                    readOnly={readOnly}
                    value={edited.maxPolicyExtraMember}
                    displayZero
                    onChange={handleInputChange("maxPolicyExtraMember")}
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
                      value={edited.maxCeilingPolicyIp}
                      displayZero
                      onChange={handleInputChange("maxCeilingPolicyIp")}
                    />
                  </TableCell>
                  <TableCell>
                    <NumberInput
                      min={0}
                      module="product"
                      readOnly={readOnly}
                      value={edited.maxCeilingPolicyOp}
                      displayZero
                      onChange={handleInputChange("maxCeilingPolicyOp")}
                    />
                  </TableCell>
                </>
              ) : (
                <TableCell>
                  <NumberInput
                    min={0}
                    module="product"
                    readOnly={readOnly}
                    value={edited.maxCeilingPolicy}
                    displayZero
                    onChange={handleInputChange("maxCeilingPolicy")}
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
                  value={edited.maxNoConsultation}
                  displayZero
                  onChange={handleInputChange("maxNoConsultation")}
                />
              </TableCell>
              <TableCell>
                <NumberInput
                  min={0}
                  module="product"
                  readOnly={readOnly}
                  value={edited.maxAmountConsultation}
                  displayZero
                  onChange={handleInputChange("maxAmountConsultation")}
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
                  value={edited.maxNoSurgery}
                  displayZero
                  onChange={handleInputChange("maxNoSurgery")}
                />
              </TableCell>
              <TableCell>
                <NumberInput
                  min={0}
                  module="product"
                  readOnly={readOnly}
                  value={edited.maxAmountSurgery}
                  displayZero
                  onChange={handleInputChange("maxAmountSurgery")}
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
                  value={edited.maxNoDelivery}
                  displayZero
                  onChange={handleInputChange("maxNoDelivery")}
                />
              </TableCell>
              <TableCell>
                <NumberInput
                  min={0}
                  module="product"
                  readOnly={readOnly}
                  value={edited.maxAmountDelivery}
                  displayZero
                  onChange={handleInputChange("maxAmountDelivery")}
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
                  value={edited.maxNoHospitalization}
                  displayZero
                  onChange={handleInputChange("maxNoHospitalization")}
                />
              </TableCell>
              <TableCell>
                <NumberInput
                  min={0}
                  module="product"
                  readOnly={readOnly}
                  value={edited.maxAmountHospitalization}
                  displayZero
                  onChange={handleInputChange("maxAmountHospitalization")}
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
                  value={edited.maxNoAntenatal}
                  displayZero
                  onChange={handleInputChange("maxNoAntenatal")}
                />
              </TableCell>
              <TableCell>
                <NumberInput
                  min={0}
                  module="product"
                  value={edited.maxAmountAntenatal}
                  displayZero
                  onChange={handleInputChange("maxAmountAntenatal")}
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
                  displayZero
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
