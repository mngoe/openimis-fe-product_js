import React from "react";
import { Typography, Slider, Grid } from "@material-ui/core";
import { withTheme, withStyles } from "@material-ui/styles";
import { combine, NumberInput } from "@openimis/fe-core";

const InputSlider = (props) => {
  const { value, classes, label, required, className, onChange, readOnly } = props;

  const handleSlideChange = (event, newValue) => onChange(newValue);
  const handleInputChange = (newValue) => {
    onChange(newValue || 0);
  };

  const handleBlur = () => {
    if (value < 0) onChange(0);
    else if (value > 100) onChange(100);
  };

  return (
    <div className={className}>
      {label && (
        <Typography gutterBottom>
          {label}
          {required && "*"}
        </Typography>
      )}
      <Grid container alignItems="center" spacing={2} className={classes.root}>
        <Grid item xs>
          <Slider disabled={readOnly} value={value ?? 0} onChange={handleSlideChange} />
        </Grid>
        <Grid item>
          <NumberInput
            required={required}
            readOnly={readOnly}
            className={classes.input}
            value={value ?? 0}
            max={100}
            onBlur={handleBlur}
            min={0}
            displayZero
            onChange={handleInputChange}
          />
        </Grid>
      </Grid>
    </div>
  );
};

const styles = (theme) => ({
  root: {
    ...theme.paper.item,
    paddingBlock: 0,
  },
  input: {
    width: 50,
  },
});

const enhance = combine(withTheme, withStyles(styles));
export default enhance(InputSlider);
