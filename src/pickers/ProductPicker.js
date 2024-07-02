import React, { useState } from "react";
import moment from "moment";

import { TextField, Tooltip } from "@material-ui/core";

import { Autocomplete, useModulesManager, useTranslations } from "@openimis/fe-core";
import { DATE_FORMAT, EMPTY_STRING, PRODUCT_QUANTITY_LIMIT } from "../constants";
import { useProductsQuery } from "../hooks";

const ProductPicker = (props) => {
  const {
    multiple,
    required,
    label,
    nullLabel,
    withLabel = false,
    placeholder,
    withPlaceholder = false,
    readOnly,
    value,
    onChange,
    filter,
    filterSelectedOptions,
    locationId,
    enrollmentDate,
  } = props;

  const modulesManager = useModulesManager();
  const [filters, setFilters] = useState({
    location: locationId,
  });
  const [currentString, setCurrentString] = useState(EMPTY_STRING);
  const { formatMessage, formatMessageWithValues } = useTranslations("product", modulesManager);
  const {
    isLoading,
    error,
    data: { products },
  } = useProductsQuery({ filters }, { skip: true });
  const shouldShowTooltip = products.length >= PRODUCT_QUANTITY_LIMIT && !value && !currentString;

  return (
    <Autocomplete
      multiple={multiple}
      required={required}
      error={error}
      readOnly={readOnly}
      options={products ?? []}
      isLoading={isLoading}
      value={value}
      getOptionLabel={(option) => `${option.code} ${option.name}`}
      onChange={(value) => onChange(value, value ? `${value.code} ${value.name}` : null)}
      setCurrentString={setCurrentString}
      filterOptions={filter}
      filterSelectedOptions={filterSelectedOptions}
      onInputChange={(search) =>
        setFilters(() => ({
          first: PRODUCT_QUANTITY_LIMIT,
          search,
          location: locationId,
          dateFrom: moment(enrollmentDate).format(DATE_FORMAT),
          dateTo: moment(enrollmentDate).format(DATE_FORMAT),
        }))
      }
      renderInput={(inputProps) => (
        <Tooltip
          title={
            shouldShowTooltip
              ? formatMessageWithValues("ProductPicker.aboveLimit", { limit: PRODUCT_QUANTITY_LIMIT })
              : EMPTY_STRING
          }
        >
          <TextField
            {...inputProps}
            required={required}
            label={(withLabel && (label || nullLabel)) || formatMessage("Product")}
            placeholder={(withPlaceholder && placeholder) || formatMessage("ProductPicker.placeholder")}
          />
        </Tooltip>
      )}
    />
  );
};

export default ProductPicker;
