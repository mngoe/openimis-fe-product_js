import React from "react";
import clsx from "clsx";
import { withTheme, withStyles } from "@material-ui/styles";
import { Box, Typography, Divider } from "@material-ui/core";

const SectionTitle = (props) => {
  const { classes, className, label } = props;
  return (
    <Box className={clsx(classes.wrapper, className)}>
      <Typography className={classes.title}>{label}</Typography>
      <Divider variant="fullWidth" />
    </Box>
  );
};

const styles = (theme) => ({
  wrapper: {
    ...theme.paper.item,
    paddingBottom: 0,
  },
  title: theme.typography.title,
});

export default withTheme(withStyles(styles)(SectionTitle));
